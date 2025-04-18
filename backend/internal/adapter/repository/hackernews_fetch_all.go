package repository

import (
	"context"
	"fmt"
	"hackernews-clone-be/internal/constant"
	"hackernews-clone-be/internal/domain"
	"sort"
	"time"
)

type cachedArticle struct {
	Article    domain.Article
	CachedAt   time.Time
	Expiration time.Duration
}

func (a *HackerNewsAPI) FetchAllArticles(ctx context.Context, req domain.Request) (domain.ArticleListResponse, error) {
	storyType := req.Type
	if storyType == "" {
		storyType = constant.TopStories
	}

	if storyType == "past" {
		fmt.Printf("Filtering past articles from %v to %v\n", req.StartDate, req.EndDate)

		var allArticles []domain.Article

		a.mu.RLock()
		for _, cache := range a.cache {

			for _, cached := range cache {

				article := cached.Article
				article.CachedAt = cached.CachedAt
				article.Expiration = cached.Expiration
				article.IsStale = time.Since(cached.CachedAt) >= cached.Expiration
				allArticles = append(allArticles, article)
			}
		}
		fmt.Println("Total cached articles:", len(allArticles))
		a.mu.RUnlock()
		if req.StartDate != nil || req.EndDate != nil {
			var filtered []domain.Article
			for _, article := range allArticles {
				createdAt := time.Unix(article.Time, 0)
				//fmt.Printf("Checking article ID %d, time: %v\n", article.Id, createdAt)
				if (req.StartDate == nil || !createdAt.Before(*req.StartDate)) &&
					(req.EndDate == nil || !createdAt.After(*req.EndDate)) {
					filtered = append(filtered, article)
				}
			}
			allArticles = filtered
			fmt.Println("Filtered articles:", len(filtered))
		}

		for _, article := range allArticles {
			fmt.Println("Article time:", time.Unix(article.Time, 0))
			break
		}

		sort.Slice(allArticles, func(i, j int) bool {
			return allArticles[i].Time > allArticles[j].Time
		})

		return paginate(allArticles, "", req.Page, req.Limit), nil
	}

	a.mu.RLock()
	ids, idsOk := a.articlesID[storyType]
	cache, cacheOk := a.cache[storyType]
	expired := !cacheOk || len(cache) == 0
	a.mu.RUnlock()

	if !idsOk || expired {
		var fetchedIDs []int64
		err := a.fetchRawIDs(fmt.Sprintf("%s%s.json", Stories, storyType), &fetchedIDs)
		if err != nil {
			return domain.ArticleListResponse{}, fmt.Errorf("failed to cold start fetch story IDs: %w", err)
		}

		tempCache := make(map[int64]cachedArticle)
		var articles []domain.Article
		for _, id := range fetchedIDs {
			article, err := a.getDetail(id)
			if err != nil {
				continue
			}
			cached := cachedArticle{
				Article:    article,
				CachedAt:   time.Now(),
				Expiration: 10 * time.Minute,
			}
			tempCache[id] = cached
			articles = append(articles, article)
		}

		a.mu.Lock()
		a.cache[storyType] = tempCache
		a.articlesID[storyType] = fetchedIDs
		a.lastRefreshAt[storyType] = time.Now()
		a.mu.Unlock()

		return paginate(articles, "", req.Page, req.Limit), nil
	}

	var articles []domain.Article
	for _, id := range ids {
		if cached, ok := cache[id]; ok {
			isStale := time.Since(cached.CachedAt) >= cached.Expiration
			article := cached.Article
			article.CachedAt = cached.CachedAt
			article.Expiration = cached.Expiration
			article.IsStale = isStale
			articles = append(articles, article)
		}
	}

	if len(articles) == 0 {
		return domain.ArticleListResponse{}, fmt.Errorf("no articles available for story type: %s", storyType)
	}

	return paginate(articles, "", req.Page, req.Limit), nil
}
