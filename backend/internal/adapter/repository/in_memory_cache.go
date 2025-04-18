package repository

import (
	"context"
	"fmt"
	"hackernews-clone-be/internal/constant"
	"hackernews-clone-be/internal/domain"
	"log"
	"sync"
	"time"
)

func (a *HackerNewsAPI) StartTypeRefresher(ctx context.Context, storyType string, interval time.Duration) {
	go a.prewarmCache()
	go func() {
		ticker := time.NewTicker(interval)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				log.Printf("🔁 Refreshing story type: %s", storyType)
				a.refreshStoryType(storyType)
				a.metrics.mu.Lock()
				a.metrics.refreshesCountPerType[storyType]++
				a.metrics.lastRefreshTimes[storyType] = time.Now()
				a.metrics.mu.Unlock()
			case <-ctx.Done():
				log.Printf("🛑 Stopping refresher for: %s", storyType)
				return
			}
		}
	}()
}
func (a *HackerNewsAPI) StartBackgroundCommentRefresher(ctx context.Context, interval time.Duration) {
	go func() {
		if err := a.refreshLatestComments(); err != nil {
			log.Printf("Failed to prewarm comment cache: %v", err)
		}

		ticker := time.NewTicker(interval)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				if err := a.refreshLatestComments(); err != nil {
					log.Printf("Comment refresh error: %v", err)
				}
			case <-ctx.Done():
				log.Println("Shutting down background comment refresher...")
				return
			}
		}
	}()
}

func (a *HackerNewsAPI) prewarmCache() {
	storyTypes := []string{
		constant.TopStories,
		constant.NewsStories,
		constant.BestStories,
		constant.AskStories,
		constant.ShowStories,
		constant.JobStories,
	}

	var wg sync.WaitGroup
	for _, storyType := range storyTypes {
		wg.Add(1)
		go func(st string) {
			defer wg.Done()
			a.prewarmStoryType(st)
		}(storyType)
	}
	wg.Wait()
	log.Println("✅ Cache prewarming done.")
}

func (a *HackerNewsAPI) prewarmStoryType(storyType string) {
	var ids []int64
	err := a.fetchRawIDs(fmt.Sprintf("%s%s.json", Stories, storyType), &ids)
	if err != nil {
		log.Printf("[%s] Prewarm fetch IDs error: %v\n", storyType, err)
		return
	}

	firstBatch := ids[:min(90, len(ids))]
	a.batchFetchAndCache(firstBatch, storyType, a.maxG)

	a.mu.Lock()
	a.articlesID[storyType] = ids
	a.lastRefreshAt[storyType] = time.Now()
	a.mu.Unlock()

	log.Printf("[%s] Prewarm done with %d articles\n", storyType, len(firstBatch))
}
func (a *HackerNewsAPI) batchFetchAndCache(ids []int64, storyType string, maxConcurrent int) {
	tempCache := make(map[int64]cachedArticle)
	var mu sync.Mutex
	var wg sync.WaitGroup
	sem := make(chan struct{}, maxConcurrent)

	for _, id := range ids {
		wg.Add(1)
		sem <- struct{}{}

		go func(id int64) {
			defer wg.Done()
			defer func() { <-sem }()

			article, err := a.getDetail(id)
			if err != nil {
				log.Printf("[%s] Failed to fetch article %d: %v\n", storyType, id, err)
				return
			}

			mu.Lock()
			tempCache[id] = cachedArticle{
				Article:    article,
				CachedAt:   time.Now(),
				Expiration: 10 * time.Minute,
			}
			mu.Unlock()
		}(id)
	}

	wg.Wait()

	a.mu.Lock()
	cache := a.cache[storyType]
	if cache == nil {
		cache = make(map[int64]cachedArticle)
		a.cache[storyType] = cache
	}
	for id, article := range tempCache {
		cache[id] = article
	}
	a.mu.Unlock()
	a.metrics.mu.Lock()
	a.metrics.articlesFetchedPerType[storyType] += int64(len(tempCache))
	a.metrics.mu.Unlock()
}
func (a *HackerNewsAPI) batchRefreshWithThrottle(ids []int64, storyType string) {
	const batchSize = 30
	const throttleDelay = 2 * time.Second

	for i := 0; i < len(ids); i += batchSize {
		end := min(i+batchSize, len(ids))
		batch := ids[i:end]

		a.batchFetchAndCache(batch, storyType, a.maxG)
		log.Printf("[%s] Fetched batch %d-%d", storyType, i+1, end)

		time.Sleep(throttleDelay)
	}
}

func (a *HackerNewsAPI) refreshAllStoryTypes() {
	storyTypes := []string{
		constant.TopStories,
		constant.NewsStories,
		constant.BestStories,
		constant.AskStories,
		constant.ShowStories,
		constant.JobStories,
	}

	var wg sync.WaitGroup
	for _, storyType := range storyTypes {
		wg.Add(1)
		go func(storyType string) {
			defer wg.Done()
			a.refreshStoryType(storyType)
			a.metrics.mu.Lock()
			a.metrics.refreshesCountPerType[storyType]++
			a.metrics.mu.Unlock()
		}(storyType)
	}
	wg.Wait()

}

func (a *HackerNewsAPI) refreshStoryType(storyType string) {
	var ids []int64
	err := a.fetchRawIDs(fmt.Sprintf("%s%s.json", Stories, storyType), &ids)
	if err != nil {
		log.Printf("[%s] Fetch IDs error: %v\n", storyType, err)
		return
	}

	a.mu.Lock()
	a.articlesID[storyType] = ids
	a.lastRefreshAt[storyType] = time.Now()
	a.mu.Unlock()
	a.metrics.mu.Lock()
	a.metrics.lastRefreshTimes[storyType] = time.Now()
	a.metrics.mu.Unlock()
	// 👇 Batch fetching with throttling
	go a.batchRefreshWithThrottle(ids[30:], storyType)
}

func (a *HackerNewsAPI) refreshLatestComments() error {
	var maxItemID int
	err := a.fetchRawIDs(MaxItems, &maxItemID)
	if err != nil {
		return fmt.Errorf("failed to fetch maxitem: %w", err)
	}

	var comments []domain.Article
	for id := maxItemID; id > 0 && len(comments) < 100; id-- {
		item, err := a.getDetail(int64(id))
		if err != nil || item.Type != "comment" {
			continue
		}
		comments = append(comments, item)
	}

	a.mu.Lock()
	a.commentCache.Data = comments
	a.commentCache.ExpiresAt = time.Now().Add(5 * time.Minute)
	a.mu.Unlock()
	a.metrics.mu.Lock()
	a.metrics.commentsFetched += int64(len(comments))
	a.metrics.mu.Unlock()

	return nil
}
