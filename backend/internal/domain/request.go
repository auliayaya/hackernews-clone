package domain

import (
	"fmt"
	"strconv"
	"time"
)

type Request struct {
	Page      int        `json:"page"`
	Limit     int        `json:"limit"`
	Search    string     `json:"search"`
	Type      string     `json:"type"`
	StartDate *time.Time `json:"startDate"`
	EndDate   *time.Time `json:"endDate"`
}

func (r *Request) SetStartDate(str string) {
	if str != "" {
		if t, err := time.Parse("2006-01-02", str); err == nil {
			start := t.Truncate(24 * time.Hour)
			r.StartDate = &start
		}
	}
}

func (r *Request) SetEndDate(str string) {
	if str != "" {
		if t, err := time.Parse("2006-01-02", str); err == nil {
			end := t.Add(24*time.Hour - time.Nanosecond)
			r.EndDate = &end
		}
	}
}

func NewRequest(page, limit, search, storyType string) Request {
	request := Request{
		Search: search,
		Type:   storyType,
	}
	return request.setPage(page).setLimit(limit)
}
func (r *Request) setPage(page string) *Request {
	pageC, err := strconv.Atoi(page)
	if err != nil {
		fmt.Println("Err ", err)
	}
	r.Page = pageC
	return r
}
func (r *Request) setLimit(limit string) Request {
	limitC, err := strconv.Atoi(limit)
	if err != nil {
		fmt.Println("Err ", err)
	}
	r.Limit = limitC
	return *r
}
