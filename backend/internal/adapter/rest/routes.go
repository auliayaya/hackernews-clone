package rest

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"time"
)

type Routes struct {
	ginEngine *gin.Engine
	handler   HackerNewsHttpHandler
}

func NewRoutes(ginEngine *gin.Engine, h HackerNewsHttpHandler) *Routes {
	return &Routes{
		ginEngine: ginEngine,
		handler:   h,
	}
}

func (r *Routes) Setup() {
	g := r.ginEngine
	g.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		AllowCredentials:          false,
		AllowHeaders:              []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowMethods:              []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		ExposeHeaders:             []string{"Link"},
		OptionsResponseStatusCode: http.StatusNoContent,
		MaxAge:                    300,
	}))
	v1 := g.Group("/api/v1").Use(func(c *gin.Context) {
		start := time.Now()
		log.Printf("[GIN] %s %s | Status: %d | Latency: %v | Headers: %v ",
			c.Request.Method,
			c.Request.URL.Path,
			c.Writer.Status(),
			time.Since(start),
			c.Request.Header,
		)
	})
	v1.GET("/articles", r.handler.FetchAll)
	v1.GET("/comments", r.handler.FetchLatestComment)
	v1.GET("/articles/:storyId", r.handler.GetStoryByID)
}
