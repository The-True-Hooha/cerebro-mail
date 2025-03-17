package server

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/The-True-Hooha/cerebro-mail/cmd/routes"
	"github.com/The-True-Hooha/cerebro-mail/internal/logger"
	"github.com/The-True-Hooha/cerebro-mail/internal/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type Server struct {
	server *http.Server
	log    logger.Logger
	router *http.ServeMux
}

type Config struct {
	Address      string
	ReadTimeOut  time.Duration
	WriteTimeOut time.Duration
	IdleTimeOut  time.Duration
}

type Response struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
	Data       any    `json:"data,omitempty"`
	Error      any    `json:"error,omitempty"`
}

func SetupServer(config Config, log logger.Logger) *Server {
	if config.Address == "" {
		config.Address = ":8080"
	}
	if config.ReadTimeOut == 0 {
		config.ReadTimeOut = 10 * time.Second
	}
	if config.WriteTimeOut == 0 {
		config.WriteTimeOut = 10 * time.Second
	}
	if config.IdleTimeOut == 0 {
		config.IdleTimeOut = 120 * time.Second
	}

	router := http.NewServeMux()

	handler := middleware.LoggerMiddleware(router)

	server := &http.Server{
		Addr:         config.Address,
		Handler:      handler,
		ReadTimeout:  config.ReadTimeOut,
		WriteTimeout: config.WriteTimeOut,
		IdleTimeout:  config.IdleTimeOut,
	}

	return &Server{
		server: server,
		log:    log,
		router: router,
	}
}

func (s *Server) RegisterAppRoutes() {
	// handle base level routes

	s.router.Handle("/metrics", promhttp.Handler())
	// Health checks
	s.router.HandleFunc("/health", s.handleHealth)
	s.router.HandleFunc("/ready", s.handleReady)

	apiRouter := http.NewServeMux()
	s.router.Handle("/api/", http.StripPrefix("/api", apiRouter))

	// API routes from the /routes package
	routes.RegisterAuthRoutes(apiRouter)
	// routes.RegisterTransactionRoutes(s.router)
	// routes.RegisterCampaignRoutes(s.router)

}

func (s *Server) StartServer() {
	go func() {
		s.log.Info("Server started and currently running :::", logger.String("addr", s.server.Addr))
		if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.log.Fatal("Server failed to start", logger.Error(err))
		}
	}()
}

func (s *Server) Stop() {
	s.log.Info("shutting down the server....")
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	if err := s.server.Shutdown(ctx); err != nil {
		s.log.Error("forced shutdown", logger.Error(err))
	}
	s.log.Info("server stopped")
}

// WaitForSignal blocks until an interrupt signal is received
func (s *Server) WaitForSignal() {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit
	s.log.Info("Received signal", logger.String("signal", sig.String()))
}

// Health check handlers
func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ok"}`))
}

func (s *Server) handleReady(w http.ResponseWriter, r *http.Request) {
	// Check dependencies (DB, Redis, etc)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ready"}`))
}
