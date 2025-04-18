package rest

import (
	"github.com/gin-gonic/gin"
	"hackernews-clone-be/internal/application"
	"hackernews-clone-be/internal/domain"
	"net/http"
	"strconv"
)

type HackerNewsHttpHandler struct {
	api application.App
}

func NewHackerNewsHttpHandler(api application.App) HackerNewsHttpHandler {
	return HackerNewsHttpHandler{api: api}
}

func (r HackerNewsHttpHandler) FetchAll(c *gin.Context) {
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "30")
	search := c.DefaultQuery("search", "")
	storyType := c.DefaultQuery("type", "topstories")
	endDate := c.DefaultQuery("endDate", "")
	startDate := c.DefaultQuery("startDate", "")
	req := domain.NewRequest(page, limit, search, storyType)
	req.SetStartDate(startDate)
	req.SetEndDate(endDate)
	res, err := r.api.FetchAll(c.Request.Context(), req)
	if err != nil {
		res.ReturnGin(c, http.StatusInternalServerError)
		return
	}
	res.ReturnGin(c, http.StatusOK)
}
func (r HackerNewsHttpHandler) GetStoryByID(c *gin.Context) {
	storyId := c.Param("storyId")
	cStoryId, err := strconv.Atoi(storyId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	res, err := r.api.GetByID(c.Request.Context(), int64(cStoryId))
	if err != nil {
		res.ReturnGin(c, http.StatusInternalServerError)
		return
	}
	res.ReturnGin(c, http.StatusOK)
}

func (r HackerNewsHttpHandler) FetchLatestComment(c *gin.Context) {
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "30")
	search := c.DefaultQuery("search", "")
	storyType := c.DefaultQuery("type", "topstories")

	res, err := r.api.FetchLatestComment(c.Request.Context(), domain.NewRequest(page, limit, search, storyType))
	if err != nil {
		res.ReturnGin(c, http.StatusInternalServerError)
		return
	}
	res.ReturnGin(c, http.StatusOK)
}
func (r HackerNewsHttpHandler) Metrics(c *gin.Context) {

}
