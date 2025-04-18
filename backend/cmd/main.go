package main

import (
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"hackernews-clone-be/internal/adapter/repository"
	"hackernews-clone-be/internal/adapter/rest"
	"hackernews-clone-be/internal/application"
	"hackernews-clone-be/internal/constant"
	"hackernews-clone-be/internal/lib"
	"net/http"
	"os"
	"time"
)

func Root(ctx context.Context, svc lib.Service) (err error) {
	hackerNews := repository.NewHackerNewsAPI(30)
	app := application.New(hackerNews)

	hackerNews.StartTypeRefresher(ctx, constant.TopStories, 15*time.Minute)
	hackerNews.StartTypeRefresher(ctx, constant.NewsStories, 5*time.Minute)
	hackerNews.StartTypeRefresher(ctx, constant.BestStories, 30*time.Minute)
	hackerNews.StartTypeRefresher(ctx, constant.AskStories, 20*time.Minute)
	hackerNews.StartTypeRefresher(ctx, constant.ShowStories, 20*time.Minute)
	hackerNews.StartTypeRefresher(ctx, constant.JobStories, 60*time.Minute)

	hackerNews.StartBackgroundCommentRefresher(ctx, 15*time.Minute)
	hackerNews.StartBackgroundCommentRefresher(ctx, time.Minute*40)

	api := rest.NewHackerNewsHttpHandler(*app)
	svc.Gin().GET("metrics", func(c *gin.Context) {
		c.JSON(http.StatusOK, hackerNews.GetMetrics())
	})
	routes := rest.NewRoutes(svc.Gin(), api)
	routes.Setup()

	return nil
}

func run() (err error) {
	var cfg lib.AppConfig
	cfg, err = lib.InitConfig()
	if err != nil {
		return err
	}
	s, err := lib.NewSystem(cfg)
	if err != nil {
		return err
	}
	if err = Root(s.Waiter().Context(), s); err != nil {
		return err
	}
	fmt.Println("started service")
	defer fmt.Println("stopped service")
	s.Waiter().Add(
		s.WaitForWeb,
	)
	return s.Waiter().Wait()
}

func main() {
	if err := run(); err != nil {
		fmt.Printf("service hasfully exited abnormally:%s\n", err)
		os.Exit(1)
	}
}
