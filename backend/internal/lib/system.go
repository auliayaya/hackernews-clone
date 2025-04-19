package lib

import (
	"context"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"golang.org/x/sync/errgroup"
	"net/http"
)

type System struct {
	cfg    AppConfig
	mux    *gin.Engine
	cache  *redis.Client
	waiter Waiter
}

func NewSystem(cfg AppConfig) (*System, error) {
	s := &System{cfg: cfg}
	s.initWaiter()
	// if err := s.initRedis(); err != nil {
	// 	return nil, err
	// }
	s.initGin()
	return s, nil
}

func (s *System) initRedis() error {
	s.cache = redis.NewClient(&redis.Options{
		Username: s.cfg.Redis.Username,
		Password: s.cfg.Redis.Password,
		Addr:     s.cfg.Redis.Host,
		DB:       0,
	})

	if _, err := s.cache.Ping(context.Background()).Result(); err != nil {
		return err
	}
	return nil
}

func (s *System) Config() AppConfig {
	return s.cfg
}

func (s *System) initWaiter() {
	s.waiter = NewWaiter(CatchSignals())
}
func (s *System) initGin() {
	if s.cfg.Environment == "development" {
		gin.SetMode(gin.DebugMode)
	} else if s.cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}
	s.mux = gin.New()
	if s.cfg.Environment == "development" {
		s.mux.Use(gin.Logger())
	}
}

func (s *System) Gin() *gin.Engine {
	return s.mux
}
func (s *System) Cache() *redis.Client {
	return s.cache
}

func (s *System) Waiter() Waiter {
	return s.waiter
}

func (s *System) WaitForWeb(ctx context.Context) error {
	
	webServer := &http.Server{
		Addr:    "localhost:" + s.cfg.GetPORT(),
		Handler: s.mux,
	}

	group, gCtx := errgroup.WithContext(ctx)
	group.Go(func() error {
		fmt.Printf("web server started; \nlistening at http://localhost:%s\n", s.cfg.GetPORT())
		defer fmt.Println("web server shutdown")
		if err := webServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			return err
		}
		return nil
	})
	group.Go(func() error {
		<-gCtx.Done()
		fmt.Println("web server to be shutdown")
		ctx, cancel := context.WithTimeout(context.Background(), s.cfg.ShutdownTimeout)
		defer cancel()
		if err := webServer.Shutdown(ctx); err != nil {
			return err
		}
		return nil
	})

	return group.Wait()
}
