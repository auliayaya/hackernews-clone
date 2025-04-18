package repository

import (
	"context"
	"hackernews-clone-be/internal/domain"
	"time"
)

func (a *HackerNewsAPI) FetchLatestComments(ctx context.Context, req domain.Request) (domain.ArticleListResponse, error) {
	a.mu.RLock()
	cached := a.commentCache.Data

	a.mu.RUnlock()

	if len(cached) == 0 {
		var coldErr error
		a.coldRefresh.Do(func() {
			coldErr = a.refreshLatestComments()
		})
		if coldErr != nil {
			return domain.ArticleListResponse{}, coldErr
		}

		a.mu.RLock()
		cached = a.commentCache.Data
		a.commentCache.ExpiresAt = time.Now().Add(5 * time.Minute)
		a.mu.RUnlock()
	}

	return paginate(cached, "comment", req.Page, req.Limit), nil
}
