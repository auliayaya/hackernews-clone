package application

import (
	"context"
	"hackernews-clone-be/internal/domain"
)

type (
	App interface {
		FetchAll(ctx context.Context, rqest domain.Request) (domain.Response, error)
		GetByID(ctx context.Context, id int64) (domain.Response, error)
		FetchLatestComment(ctx context.Context, rqest domain.Request) (domain.Response, error)
	}

	Application struct {
		repo domain.HackerNews
	}
)

func (a Application) FetchAll(ctx context.Context, register domain.Request) (res domain.Response, err error) {
	articles, err := a.repo.FetchAllArticles(ctx, register)
	if err != nil {
		return res.SetStatus(false).SetMessage("Internal Err").SetData(nil).ReturnToController(), err
	}
	return res.SetStatus(true).
		SetMessage("Inquiry data success").
		SetData(articles.Articles).
		SetPagination(articles.Pagination).
		ReturnToController(), nil

}
func (a Application) GetByID(ctx context.Context, id int64) (res domain.Response, err error) {
	articles, comments, err := a.repo.GetStoryWithComments(id)
	if err != nil {
		return res.SetStatus(false).SetMessage("Internal Err").SetData(nil).ReturnToController(), err
	}
	return res.SetStatus(true).
		SetMessage("Inquiry data success").
		SetData(map[string]interface{}{
			"comments": comments,
			"articles": articles,
		}).
		ReturnToController(), nil

}
func (a Application) FetchLatestComment(ctx context.Context, register domain.Request) (res domain.Response, err error) {
	articles, err := a.repo.FetchLatestComments(ctx, register)
	if err != nil {
		return res.SetStatus(false).SetMessage("Internal Err").SetData(nil).ReturnToController(), err
	}
	return res.SetStatus(true).
		SetMessage("Inquiry data success").
		SetData(articles.Comments).
		SetPagination(articles.Pagination).
		ReturnToController(), nil

}

var _ App = (*Application)(nil)

func New(repo domain.HackerNews) *Application {
	return &Application{
		repo: repo,
	}
}
