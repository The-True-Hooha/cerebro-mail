package logger

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

type contextKey string
type Field = zap.Field

const (
	LoggerKey        contextKey = "logger"
	RequestIdKey     contextKey = "request_id"
	tenantId         contextKey = "tenant_id"
	userId           contextKey = "user_id"
	CorrelationIdKey contextKey = "correlation_id"
	TraceIdKey       contextKey = "trace_id"
	SpanIdKey        contextKey = "span_id"
)

type Logger interface {
	Debug(msg string, fields ...Field)
	Info(msg string, fields ...Field)
	Warn(msg string, field ...Field)
	Error(msg string, fields ...Field)
	Fatal(msg string, fields ...Field)
	With(fields ...Field) Logger
	WithContext(ctx context.Context) Logger
}

type Config struct {
	Stage      string
	LogLevel   string
	LogPath    string
	MaxSize    int
	MaxBackups int
	MaxAge     int
	Compress   bool
}

var (
	String = zap.String
	Int    = zap.Int
	Bool   = zap.Bool
	Error  = zap.Error
	Any    = zap.Any
)

type PrometheusMetrics struct {
	logCounter  *prometheus.CounterVec
	logDuration *prometheus.HistogramVec
	httpLatency *prometheus.HistogramVec
	httpCounter *prometheus.CounterVec
}

type zapLogger struct {
	logger  *zap.Logger
	metrics *PrometheusMetrics
	service string
}

func NewPrometheusMetrics(namespace string) *PrometheusMetrics {
	logCounter := promauto.NewCounterVec(
		prometheus.CounterOpts{
			Namespace: namespace,
			Name:      "log_messages_total",
			Help:      "Total number of log messages by level and service",
		},
		[]string{"level", "service"},
	)

	logDuration := promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: namespace,
			Name:      "log_duration_seconds",
			Help:      "Time spent logging messages",
			Buckets:   prometheus.DefBuckets,
		},
		[]string{"level", "service"},
	)

	httpLatency := promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: namespace,
			Name:      "http_request_duration_seconds",
			Help:      "HTTP request latencies",
			Buckets:   prometheus.DefBuckets,
		},
		[]string{"method", "path", "status"},
	)

	httpCounter := promauto.NewCounterVec(
		prometheus.CounterOpts{
			Namespace: namespace,
			Name:      "http_requests_total",
			Help:      "Total number of HTTP requests",
		},
		[]string{"method", "path", "status"},
	)

	return &PrometheusMetrics{
		logCounter:  logCounter,
		logDuration: logDuration,
		httpLatency: httpLatency,
		httpCounter: httpCounter,
	}
}

func (p *PrometheusMetrics) RecordHTTPMetrics(method string, path string, status int, duration time.Duration) {
	statusStr := fmt.Sprintf("%d", status)
	p.httpCounter.WithLabelValues(method, path, statusStr).Inc()
	p.httpLatency.WithLabelValues(method, path, statusStr).Observe(duration.Seconds())
}

// Debug implements Logger.
func (z *zapLogger) Debug(msg string, fields ...Field) {
	start := time.Now()
	z.logger.Debug(msg, fields...)
	if z.metrics != nil {
		z.metrics.logCounter.WithLabelValues("debug", z.service).Inc()
		z.metrics.logDuration.WithLabelValues("debug", z.service).Observe(float64(time.Since(start).Seconds()))
	}
}

// Error implements Logger.
func (z *zapLogger) Error(msg string, fields ...Field) {
	start := time.Now()
	z.logger.Error(msg, fields...)
	if z.metrics != nil {
		z.metrics.logCounter.WithLabelValues("error", z.service).Inc()
		z.metrics.logDuration.WithLabelValues("error", z.service).Observe(float64(time.Since(start).Seconds()))
	}
}

// Fatal implements Logger.
func (z *zapLogger) Fatal(msg string, fields ...Field) {
	start := time.Now()
	if z.metrics != nil {
		z.metrics.logCounter.WithLabelValues("fatal", z.service).Inc()
		z.metrics.logDuration.WithLabelValues("fatal", z.service).Observe(float64(time.Since(start).Seconds()))
	}
	z.logger.Fatal(msg, fields...)
}

// Info implements Logger.
func (z *zapLogger) Info(msg string, fields ...Field) {
	start := time.Now()
	z.logger.Info(msg, fields...)
	if z.metrics != nil {
		z.metrics.logCounter.WithLabelValues("info", z.service).Inc()
		z.metrics.logDuration.WithLabelValues("info", z.service).Observe(float64(time.Since(start).Seconds()))

	}
}

// Warn implements Logger.
func (z *zapLogger) Warn(msg string, field ...Field) {
	start := time.Now()
	z.logger.Warn(msg, field...)
	if z.metrics != nil {
		z.metrics.logCounter.WithLabelValues("warn", z.service).Inc()
		z.metrics.logDuration.WithLabelValues("warn", z.service).Observe(time.Since(start).Seconds())
	}
}

// With implements Logger.
func (z *zapLogger) With(fields ...Field) Logger {
	return &zapLogger{
		logger:  z.logger.With(fields...),
		metrics: z.metrics,
		service: z.service,
	}
}

// WithContext implements Logger.
func (z *zapLogger) WithContext(ctx context.Context) Logger {
	logger := z.logger

	if requestID, ok := ctx.Value(RequestIdKey).(string); ok && requestID != "" {
		logger = logger.With((zap.String("request_id", requestID)))
	}

	if correlationID, ok := ctx.Value(CorrelationIdKey).(string); ok && correlationID != "" {
		logger = logger.With((zap.String("correlation_id", correlationID)))
	}

	if tenantID, ok := ctx.Value(tenantId).(string); ok && tenantID != "" {
		logger = logger.With(zap.String("tenant_id", tenantID))
	}

	if userID, ok := ctx.Value(userId).(string); ok && userID != "" {
		logger = logger.With(zap.String("user_id", userID))
	}

	if traceId, ok := ctx.Value(TraceIdKey).(string); ok && traceId != "" {
		logger = logger.With(zap.String("trace_id", traceId))
	}

	if spanId, ok := ctx.Value(SpanIdKey).(string); ok && spanId != "" {
		logger = logger.With(zap.String("span_id", spanId))
	}
	return &zapLogger{logger: logger, metrics: z.metrics, service: z.service}
}

func HideSensitiveData(key string, value interface{}) Field {
	if value == nil {
		return String(key, "[REDACTED]")
	}
	switch v := value.(type) {
	case string:
		if len(v) > 0 {
			return String(key, "[REDACTED]")
		}
		return String(key, "")
	default:
		return String(key, "[REDACTED]")
	}

}

func AddCorrelationId(ctx context.Context) context.Context {
	correlationID := uuid.New().String()
	return context.WithValue(ctx, CorrelationIdKey, correlationID)
}

func AddTraceContext(ctx context.Context, traceId string, spanId string) context.Context {
	ctx = context.WithValue(ctx, TraceIdKey, traceId)
	return context.WithValue(ctx, SpanIdKey, spanId)
}

func FromContext(ctx context.Context) Logger {
	if ctx == nil {
		return &zapLogger{logger: zap.NewNop()}
	}
	if logger, ok := ctx.Value(LoggerKey).(Logger); ok {
		return logger
	}
	stage := os.Getenv("STAGE")

	config := Config{
		Stage:    stage,
		LogLevel: "info",
	}
	return New(config, "default")
}

func ToContext(ctx context.Context, log Logger) context.Context {
	return context.WithValue(ctx, LoggerKey, log)

}

// New creates a new logger with specified configuration
func New(config Config, service string) Logger {
	level := zap.InfoLevel
	if err := level.Set(config.LogLevel); err != nil {
		fmt.Fprintf(os.Stderr, "Invalid log level: %v\n", err)
	}

	// sets the default config pattern for the console
	consoleEncoder := zapcore.NewConsoleEncoder(zapcore.EncoderConfig{
		TimeKey:        "ts",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		FunctionKey:    zapcore.OmitKey,
		MessageKey:     "msg",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeLevel:    zapcore.CapitalColorLevelEncoder,
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeDuration: zapcore.StringDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder,
	})

	// JSON encoder for structured logs
	jsonEncoder := zapcore.NewJSONEncoder(zapcore.EncoderConfig{
		TimeKey:        "timestamp",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		FunctionKey:    zapcore.OmitKey,
		MessageKey:     "message",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeLevel:    zapcore.LowercaseLevelEncoder,
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeDuration: zapcore.SecondsDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder,
	})

	consoleCore := zapcore.NewCore(
		consoleEncoder,
		zapcore.Lock(os.Stdout),
		level,
	)

	var cores []zapcore.Core
	cores = append(cores, consoleCore)

	if config.LogPath != "" {
		if err := os.MkdirAll(filepath.Dir(config.LogPath), 0755); err != nil {
			fmt.Fprintf(os.Stderr, "failed to create log directory for logs : %v\n", err)
		} else {
			fileWriter := zapcore.AddSync(&lumberjack.Logger{
				Filename:   config.LogPath,
				MaxSize:    config.MaxSize,
				MaxBackups: config.MaxBackups,
				MaxAge:     config.MaxAge,
				Compress:   config.Compress,
			})

			fileCore := zapcore.NewCore(jsonEncoder, fileWriter, level)
			cores = append(cores, fileCore)
		}
	}

	core := zapcore.NewTee(cores...)

	// Initialize Prometheus metrics
	logger := zap.New(
		core,
		zap.AddCaller(),
		zap.AddCallerSkip(1),
		zap.AddStacktrace(zapcore.ErrorLevel),
	)
	metrics := NewPrometheusMetrics("cerebro")

	return &zapLogger{
		logger:  logger,
		metrics: metrics,
		service: service,
	}
}

func GetPrometheusMetrics() *PrometheusMetrics {
	return NewPrometheusMetrics("cerebro")
}
