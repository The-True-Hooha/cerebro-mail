package main

import (
	// "context"
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/The-True-Hooha/cerebro-mail/cmd/server"
	"github.com/The-True-Hooha/cerebro-mail/internal/config"
	"github.com/The-True-Hooha/cerebro-mail/internal/logger"

	"github.com/joho/godotenv"
)

func main() {

	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "dev"
	}
	envFile := fmt.Sprintf(".env.%s", env)
	err := godotenv.Load(envFile)
	if err != nil {
		log.Fatalf("Error loading %s file: %v", envFile, err)
	}

	log := logger.New(logger.Config{
		Stage:      os.Getenv("STAGE"),
		LogLevel:   "INFO",
		LogPath:    "/var/log/cerebro-mail.log",
		MaxSize:    30,
		MaxBackups: 3,
		MaxAge:     7,
		Compress:   true,
	}, "api")

	// Create root context
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	ctx = logger.ToContext(ctx, log)

	// Load config
	cfg := config.Load()

	srv := server.SetupServer(server.Config{
		Address:      cfg.Server.Addr,
		ReadTimeOut:  cfg.Server.ReadTimeout,
		WriteTimeOut: cfg.Server.WriteTimeout,
		IdleTimeOut:  cfg.Server.IdleTimeout,
	}, log)

	// Register routes and start server
	srv.RegisterAppRoutes()
	srv.StartServer()

	// Wait for termination signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit
	log.Info("Received signal", logger.String("signal", sig.String()))

	// Graceful shutdown
	srv.Stop()
	log.Info("Shutdown complete")

}
