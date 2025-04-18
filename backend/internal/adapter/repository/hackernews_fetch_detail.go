package repository

import (
	"hackernews-clone-be/internal/domain"
)

func (a *HackerNewsAPI) GetStoryWithComments(storyID int64) (*domain.Article, []domain.HNComment, error) {
	story, err := a.getDetail(storyID)
	if err != nil {
		return nil, nil, err
	}
	var comments []domain.HNComment
	for _, kid := range story.Kids {
		comment, err := a.fetchCommentTree(kid)
		if err != nil {
			continue
		}
		comments = append(comments, comment)
	}

	return &story, comments, nil
}
