package lib

import (
	"github.com/kelseyhightower/envconfig"
	"github.com/stackus/dotenv"
	"os"
	"time"
)

type (
	AppConfig struct {
		Environment     string
		LogLevel        string        `envconfig:"LOG_LEVEL" default:"DEBUG"`
		ShutdownTimeout time.Duration `envconfig:"SHUTDOWN_TIMEOUT" default:"30s"`
		Redis           RedisConfig
		CDNUrl          string
		PORT            string
	}
	RedisConfig struct {
		Host     string `required:"true"`
		Username string `required:"true"`
		Password string `required:"true"`
	}
)

func InitConfig() (cfg AppConfig, err error) {
	if err = dotenv.Load(dotenv.EnvironmentFiles(os.Getenv("ENVIRONMENT"))); err != nil {
		return
	}
	err = envconfig.Process("", &cfg)
	return
}
