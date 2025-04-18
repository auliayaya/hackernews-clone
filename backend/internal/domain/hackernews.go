package domain

import (
	"context"
	"time"
)

type (
	HackerNews interface {
		FetchAllArticles(ctx context.Context, req Request) (ArticleListResponse, error)
		GetStoryWithComments(storyID int64) (*Article, []HNComment, error)
		FetchLatestComments(ctx context.Context, req Request) (ArticleListResponse, error)
		StartTypeRefresher(ctx context.Context, storyType string, interval time.Duration)
		StartBackgroundCommentRefresher(ctx context.Context, interval time.Duration)
		GetMetrics() map[string]interface{}
	}
	HNItem struct {
		ID          int64   `json:"id"`
		By          string  `json:"by"`
		Title       string  `json:"title,omitempty"`
		Text        string  `json:"text,omitempty"`
		Time        int64   `json:"time"`
		Kids        []int64 `json:"kids,omitempty"`
		Type        string  `json:"type"`
		Parent      int64   `json:"parent,omitempty"`
		Descendants int     `json:"descendants,omitempty"`
		URL         string  `json:"url,omitempty"`
	}

	HNComment struct {
		ID     int64       `json:"id"`
		By     string      `json:"by"`
		Text   string      `json:"text"`
		Time   int64       `json:"time"`
		Kids   []HNComment `json:"kids,omitempty"`
		Parent int64       `json:"parent"`
	}

	Article struct {
		Title       string
		Url         string
		Points      int
		Score       int
		Type        string
		Time        int64
		By          string
		Descendants int
		Id          int64
		Parts       []int64
		Kids        []int64
		Text        string
		Parent      int64

		CachedAt   time.Time     `json:"cached_at,omitempty"`
		Expiration time.Duration `json:"expiration,omitempty"`
		IsStale    bool          `json:"is_stale,omitempty"`
	}
	ArticleListResponse struct {
		Articles   []Article  `json:"articles"`
		Comments   []Article  `json:"comments,omitempty"`
		Pagination Pagination `json:"pagination"`
	}
)
