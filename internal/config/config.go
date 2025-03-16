// internal/config/config.go
package config

import (
	"time"
	
	"github.com/spf13/viper"
)

type Config struct {
	Server ServerConfig
	Database DatabaseConfig
	// ...other configs
}

type ServerConfig struct {
	Addr string
	ReadTimeout time.Duration
	WriteTimeout time.Duration
	IdleTimeout time.Duration
}

type DatabaseConfig struct {
	Host string
	Port int
	User string
	Password string
	Database string
	SSLMode string
}

func Load() *Config {
	v := viper.New()
	
	// Set defaults
	v.SetDefault("server.addr", ":8080")
	v.SetDefault("server.readTimeout", 10*time.Second)
	v.SetDefault("server.writeTimeout", 10*time.Second)
	v.SetDefault("server.idleTimeout", 120*time.Second)
	
	// Environment variables
	v.AutomaticEnv()
	v.SetEnvPrefix("CEREBRO")
	
	// Read config files
	v.SetConfigName("config")
	v.SetConfigType("yaml")
	v.AddConfigPath(".")
	v.AddConfigPath("./config")
	
	if err := v.ReadInConfig(); err != nil {
		// Continue even if config file not found
	}
	
	config := &Config{}
	v.Unmarshal(config)
	
	return config
}