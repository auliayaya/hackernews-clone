package lib

import (
	"context"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

type Service interface {
	Config() AppConfig
	Gin() *gin.Engine
	Cache() *redis.Client
	Waiter() Waiter
}

type Module interface {
	Startup(context.Context, Service) error
}
