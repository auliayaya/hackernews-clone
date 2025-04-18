package repository

import (
	"encoding/json"
	"fmt"
	"hackernews-clone-be/internal/domain"
	"io/ioutil"
	"net/http"
	"sync"
	"time"
)

const (
	BaseURL    = "https://hacker-news.firebaseio.com/v0"
	DetailItem = BaseURL + "/item/"
	Stories    = BaseURL + "/"
	MaxItems   = BaseURL + "/" + "maxitem.json"
)

type HackerNewsAPI struct {
	httpClient    *http.Client
	cache         map[string]map[int64]cachedArticle
	articlesID    map[string][]int64
	mu            sync.RWMutex
	lastRefreshAt map[string]time.Time
	coldRefresh   sync.Once
	commentCache  struct {
		Data      []domain.Article
		ExpiresAt time.Time
	}
	metrics struct {
		mu                     sync.Mutex
		articlesFetchedPerType map[string]int64
		refreshesCountPerType  map[string]int64
		commentsFetched        int64
		lastRefreshTimes       map[string]time.Time
	}
	maxG int
}

func NewHackerNewsAPI(goroutineRun int) domain.HackerNews {
	a := &HackerNewsAPI{
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		cache:         make(map[string]map[int64]cachedArticle),
		articlesID:    make(map[string][]int64),
		lastRefreshAt: make(map[string]time.Time),
		coldRefresh:   sync.Once{},
		commentCache: struct {
			Data      []domain.Article
			ExpiresAt time.Time
		}{Data: make([]domain.Article, 0), ExpiresAt: time.Now().Add(5 * time.Minute)},
		maxG: goroutineRun,
	}
	a.metrics.articlesFetchedPerType = make(map[string]int64)
	a.metrics.refreshesCountPerType = make(map[string]int64)
	a.metrics.lastRefreshTimes = make(map[string]time.Time)
	return a
}

func (a *HackerNewsAPI) fetchCommentTree(id int64) (domain.HNComment, error) {
	item, err := a.getDetail(id)
	if err != nil {
		return domain.HNComment{}, err
	}

	comment := domain.HNComment{
		ID:     item.Id,
		By:     item.By,
		Text:   item.Text,
		Time:   item.Time,
		Parent: item.Parent,
		Kids:   []domain.HNComment{},
	}

	var wg sync.WaitGroup
	var mu sync.Mutex

	for _, kid := range item.Kids {
		wg.Add(1)
		go func(kidID int64) {
			defer wg.Done()
			child, err := a.fetchCommentTree(kidID)
			if err != nil {
				return
			}
			mu.Lock()
			comment.Kids = append(comment.Kids, child)
			mu.Unlock()
		}(kid)
	}

	wg.Wait()
	return comment, nil
}

func (a *HackerNewsAPI) getDetail(articleID int64) (domain.Article, error) {
	url := fmt.Sprintf("%s%d.json?print=pretty", DetailItem, articleID)
	//fmt.Println("Url ", url)
	resp, err := a.httpClient.Get(url)
	if err != nil {
		return domain.Article{}, fmt.Errorf("failed to fetch article: %w", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return domain.Article{}, fmt.Errorf("failed to read response body: %w", err)
	}

	var article domain.Article
	if err := json.Unmarshal(body, &article); err != nil {
		return domain.Article{}, fmt.Errorf("failed to parse article: %w", err)
	}

	domainArticle := domain.Article{
		Title:       article.Title,
		Url:         article.Url,
		Points:      article.Points,
		Score:       article.Score,
		Type:        article.Type,
		Time:        article.Time,
		By:          article.By,
		Descendants: article.Descendants,
		Id:          article.Id,
		Parts:       article.Parts,
		Kids:        article.Kids,
		Text:        article.Text,
	}

	return domainArticle, nil
}

func (a *HackerNewsAPI) fetchRawIDs(str string, target interface{}) error {
	//fmt.Println("Type ", str)
	resp, err := a.httpClient.Get(str)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return json.NewDecoder(resp.Body).Decode(target)
}

func paginate(data []domain.Article, typ string, page, limit int) domain.ArticleListResponse {
	total := len(data)
	totalPage := (total + limit - 1) / limit
	start := (page - 1) * limit
	end := start + limit

	if start > total {
		start = total
	}
	if end > total {
		end = total
	}
	if typ == "comment" {
		return domain.ArticleListResponse{
			Comments: data[start:end],
			Pagination: domain.Pagination{
				Total:     total,
				TotalPage: totalPage,
				Page:      page,
				Limit:     limit,
			},
		}
	}

	return domain.ArticleListResponse{
		Articles: data[start:end],
		Pagination: domain.Pagination{
			Total:     total,
			TotalPage: totalPage,
			Page:      page,
			Limit:     limit,
		},
	}
}
func (a *HackerNewsAPI) GetMetrics() map[string]interface{} {
	a.metrics.mu.Lock()
	defer a.metrics.mu.Unlock()

	return map[string]interface{}{
		"articles_fetched_per_type": a.metrics.articlesFetchedPerType,
		"refreshes_count_per_type":  a.metrics.refreshesCountPerType,
		"comments_fetched":          a.metrics.commentsFetched,
		"last_refresh_times":        a.metrics.lastRefreshTimes,
	}
}
