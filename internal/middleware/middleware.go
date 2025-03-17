package middleware

import (
	"context"
	"net/http"
	"time"

	"github.com/The-True-Hooha/cerebro-mail/internal/logger"
	"github.com/google/uuid"
)

func LoggerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestID := r.Header.Get("X-Request-ID")
		if requestID == "" {
			requestID = uuid.New().String()
		}

		correlationID := r.Header.Get("X-Correlation-Id")
		if correlationID == "" {
			correlationID = uuid.New().String()
		}

		traceID := r.Header.Get("X-Trace-ID")
		if traceID == "" {
			traceID = uuid.New().String()
		}

		spanID := r.Header.Get("X-Span-ID")
		if spanID == "" {
			spanID = uuid.New().String()
		}

		w.Header().Set("X-Request-ID", requestID)
		w.Header().Set("X-Correlation-ID", correlationID)
		w.Header().Set("X-Trace-ID", traceID)
		w.Header().Set("X-Span-ID", spanID)

		ctx := r.Context()
		ctx = context.WithValue(ctx, logger.RequestIdKey, requestID)
		ctx = context.WithValue(ctx, logger.CorrelationIdKey, correlationID)
		ctx = context.WithValue(ctx, logger.TraceIdKey, traceID)
		ctx = context.WithValue(ctx, logger.SpanIdKey, spanID)

		log := logger.FromContext(ctx).WithContext(ctx)
		ctx = logger.ToContext(ctx, log)

		wrapper := newResponseWriterWrapper(w)

		start := time.Now()

		log.Info("request_started",
			logger.String("method", r.Method),
			logger.String("path", r.URL.Path),
			logger.String("remote_addr", r.RemoteAddr),
			logger.String("user_agent", r.UserAgent()),
		)

		next.ServeHTTP(wrapper, r.WithContext(ctx))

		duration := time.Since(start)

		metrics := logger.GetPrometheusMetrics()
		metrics.RecordHTTPMetrics(r.Method, r.URL.Path, wrapper.status, duration)

		// Log response
		fields := []logger.Field{
			logger.String("method", r.Method),
			logger.String("path", r.URL.Path),
			logger.Int("status", wrapper.status),
			logger.String("duration", duration.String()),
			logger.Int("size", wrapper.size),
		}

		if wrapper.status >= 500 {
			log.Error("Request completed with server error", fields...)
		} else if wrapper.status >= 400 {
			log.Warn("Request completed with client error", fields...)
		} else {
			log.Info("Request completed", fields...)
		}

	})

}

type responseWriterWrapper struct {
	http.ResponseWriter
	status int
	size   int
}

func newResponseWriterWrapper(w http.ResponseWriter) *responseWriterWrapper {
	return &responseWriterWrapper{ResponseWriter: w, status: http.StatusOK}
}

func (rw *responseWriterWrapper) WriteHeader(code int) {
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
}

func (rw *responseWriterWrapper) Write(b []byte) (int, error) {
	size, err := rw.ResponseWriter.Write(b)
	rw.size += size
	return size, err
}
