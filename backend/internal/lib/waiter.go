package lib

import (
	"context"
	"golang.org/x/sync/errgroup"
	"os/signal"
	"syscall"
)

type WaitFunc func(ctx context.Context) error

type CleanupFunc func()

type Waiter interface {
	Add(fns ...WaitFunc)
	CleanUp(fns ...CleanupFunc)
	Wait() error
	Context() context.Context
	CancelFunc() context.CancelFunc
}

func CatchSignals() WaiterOption {
	return func(c *waiterCfg) {
		c.catchSignals = true
	}
}

type waiter struct {
	ctx          context.Context
	waitFuncs    []WaitFunc
	cleanupFuncs []CleanupFunc
	cancelFunc   context.CancelFunc
}

type waiterCfg struct {
	parentCtx    context.Context
	catchSignals bool
}

type WaiterOption func(c *waiterCfg)

func NewWaiter(options ...WaiterOption) Waiter {
	cfg := &waiterCfg{
		parentCtx:    context.Background(),
		catchSignals: false,
	}

	for _, opt := range options {
		opt(cfg)
	}
	w := &waiter{
		waitFuncs:    []WaitFunc{},
		cleanupFuncs: []CleanupFunc{},
	}
	w.ctx, w.cancelFunc = context.WithCancel(cfg.parentCtx)
	if cfg.catchSignals {
		w.ctx, w.cancelFunc = signal.NotifyContext(w.ctx, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	}
	return w
}

func (w *waiter) Add(fns ...WaitFunc) {
	w.waitFuncs = append(w.waitFuncs, fns...)
}

func (w *waiter) CleanUp(fns ...CleanupFunc) {
	w.cleanupFuncs = append(w.cleanupFuncs, fns...)
}

func (w *waiter) Wait() (err error) {
	g, ctx := errgroup.WithContext(w.ctx)

	g.Go(func() error {
		<-ctx.Done()
		w.cancelFunc()
		return nil
	})

	for _, fn := range w.waitFuncs {
		waitFunc := fn
		g.Go(func() error { return waitFunc(ctx) })
	}

	for _, fn := range w.cleanupFuncs {
		cleanupFunc := fn
		defer cleanupFunc()
	}

	return g.Wait()
}

func (w *waiter) Context() context.Context {
	return w.ctx
}

func (w *waiter) CancelFunc() context.CancelFunc {
	return w.cancelFunc
}
