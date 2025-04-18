package domain

import (
	"fmt"
	"github.com/gin-gonic/gin"
)

type (
	Response struct {
		Status     bool        `json:"status"`
		Message    string      `json:"message"`
		Data       interface{} `json:"data"`
		Pagination *Pagination `json:"pagination,omitempty"`
	}
	Pagination struct {
		TotalPage int `json:"total_page"`
		Total     int `json:"total"`
		Limit     int `json:"limit"`
		Page      int `json:"page"`
	}
)

func NewResponse(status bool, desc string, data interface{}) Response {
	return Response{
		Status:  status,
		Message: desc,
		Data:    data,
	}
}
func (r Response) SetStatus(status bool) Response {
	r.Status = status
	return r
}
func (r Response) SetMessage(message string) Response {
	r.Message = message
	return r
}
func (r Response) SetData(data interface{}) Response {
	r.Data = data
	return r
}
func (r Response) SetPagination(pagination Pagination) Response {
	r.Pagination = &pagination
	return r
}
func (r Response) ToString() string {
	return fmt.Sprintf("%v,%s,%v", r.Status, r.Message, nil)
}

func (r Response) ReturnToController() Response {
	return r
}

func (r Response) ReturnGin(c *gin.Context, statusCode int) {
	c.JSON(statusCode, r.ReturnToController())
}
