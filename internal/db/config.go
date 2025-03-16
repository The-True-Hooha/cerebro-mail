package db

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Config struct {
	Host     string
	Port     int
	User     string
	Password string
	DbName   string
	Stage    string
}

func NewPool(ctx context.Context, cfg Config) (*pgxpool.Pool, error) {
	sslMode := "require"
	if cfg.Stage == "dev" {
		sslMode = "disable"
	}

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=%s",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.DbName, sslMode)

	poolConfig, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, fmt.Errorf("parsing config: %w", err)
	}

	poolConfig.MaxConns = 10
	poolConfig.MinConns = 2
	poolConfig.MaxConnLifetime = 1 * time.Hour
	poolConfig.ConnConfig.ConnectTimeout = 5 * time.Second
	poolConfig.MaxConnIdleTime = 30 * time.Minute
	poolConfig.HealthCheckPeriod = 5 * time.Minute
	poolConfig.ConnConfig.RuntimeParams = map[string]string{
		"statement_timeout":                   "10000", // 10 seconds in ms
		"idle_in_transaction_session_timeout": "30000", // 30 seconds
	}

	poolConfig.AfterConnect = func(ctx context.Context, conn *pgx.Conn) error {

		return nil
	}

	var pool *pgxpool.Pool
	maxRetries := 3
	retryDelay := 1 * time.Second

	for attempt := 0; attempt < maxRetries; attempt++ {
		pool, err = pgxpool.NewWithConfig(ctx, poolConfig)
		if err == nil {
			if err := pool.Ping(ctx); err == nil {
				return pool, nil
			}
			pool.Close()
		}

		if attempt < maxRetries-1 {
			time.Sleep(retryDelay)
			retryDelay *= 2
		}
	}

	return nil, fmt.Errorf("failed to connect after %d attempts: %w", maxRetries, err)
}

func ExecuteQueryTransaction(ctx context.Context, pool *pgxpool.Pool, fn func(pgx.Tx) error) error {
	tx, err := pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("starting transaction error occurred: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			tx.Rollback(ctx)
			panic(p)
		}
	}()
	if err := fn(tx); err != nil {
		if rollbackError := tx.Rollback(ctx); rollbackError != nil {
			return fmt.Errorf("rollback failed: %v (original error: %w)", rollbackError, err)
		}
		return err
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	return nil
}
