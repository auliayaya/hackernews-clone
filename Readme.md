# 📰 Hacker News Clone – Full Stack Documentation  
**Backend:** Go + Gin  
**Frontend:** React + Vite + TailwindCSS + Redux  
**Deployment Target:** Render

---

## 🧭 Table of Contents

1. [Project Overview](#project-overview)  
2. [API Documentation](#api-documentation)  
3. [Frontend UI Structure](#frontend-ui-structure)  
4. [Project Structure](#project-structure)  
5. [Environment Configuration](#environment-configuration)  
6. [Best Practices & Standards](#best-practices--standards)  
7. [Deployment Notes](#deployment-notes)  
8. [Assessment Criteria Checklist](#assessment-criteria-checklist)

---

## 📌 Project Overview

This application is a full-stack Hacker News clone. It features:

- Periodic background refresh of HN stories and comments.
- Virtual pagination with filters for date range and story type.
- Optimized backend caching (stale-while-revalidate pattern) with goroutine and mutex.
- Interactive UI with support for hiding articles and vote and unvote.
- Metrics endpoint for observability.

---

## 📡 API Documentation

### 🔍 Get Articles List

**GET** `/api/v1/articles`

#### Query Params:
| Param       | Type    | Description |
|-------------|---------|-------------|
| `page`      | integer | Page number (default: 1) |
| `limit`     | integer | Number of articles per page (default: 30) |
| `type`      | string  | One of: `newstories`, `topstories`, `beststories`, `jobstories`, `showstories`, `askstories`, or `past` |
| `startDate` | string  | Required when type is `past` (format: `YYYY-MM-DD`) |
| `endDate`   | string  | Required when type is `past` (format: `YYYY-MM-DD`) |

#### Example:
```
GET http://localhost:8231/api/v1/articles?page=1&limit=30&type=topstories
GET http://localhost:8231/api/v1/articles?page=1&limit=30&type=past&startDate=2025-01-01&endDate=2025-04-18
```

#### Response:
```json
{
  "articles": [...],
  "pagination": {
    "page": 1,
    "limit": 30,
    "total": 100,
    "total_page": 4,
  },
}
```

---

### 🧵 Get Article by ID

**GET** `/api/v1/articles/:storyId`

#### Example:
```
GET http://localhost:8231/api/v1/articles/43719447
```

#### Response:
```json
{
  "id": 43719447,
  "title": "Detailed Article",
  "text": "Full description or content",
  "comments": [...]
}
```

---

### 💬 Get Latest Comments

**GET** `/api/v1/comments`

#### Query Params:
| Param   | Type    | Description |
|---------|---------|-------------|
| `page`  | integer | Page number |
| `limit` | integer | Items per page (default: 100) |

#### Example:
```
GET http://localhost:8231/api/v1/comments?page=1&limit=100
```
#### Response:
```json
{
  "comments": [...],
  "pagination": {
    "page": 1,
    "limit": 30,
    "total": 100,
    "total_page": 4,
  },
}
```
---

### 📊 App Metrics

**GET** `/metrics`

Returns internal metrics for background processes.

#### Example:
```
GET http://localhost:8231/metrics
```

---

## 🖥️ Frontend UI Structure

Built using **React + Redux + TailwindCSS** with features like:

- Responsive layout
- Filtering by story type
- Virtual pagination
- “Past” page with calendar filtering
- Hide story, upvote and downvote functionality (persisted in Redux)

Pages:
- `/top`
- `/newest`
- `/best`
- `/ask`
- `/show`
- `/jobs`
- `/past`
- `/comments`
- `/item?id=`

---

## 🗂️ Project Structure

```
/hackernews-clone
├── /frontend       # React Vite App
│   ├── /src
│   │   ├── /components
│   │   ├── /pages
│   │   ├── /store
│   │   └── /hooks
│   │   └── /types
│   │   └── /utils
│   │   └── /constant
├── /backend        # Go Gin App
│   ├── /internal
│   │   ├── /adapter/rest (driver adapter)
│   │   ├── /adapter/repository (driven adapter )
│   │   ├── /domain (where business logic comes)
│   │   ├── /constant (constant)
│   │   └── /lib
├── .env
├── dockerfile(s)
└── README.md
```

---

## ⚙️ Environment Configuration

**.env**
```
PORT=8231
ENVIRONMENT=development
```

---

## ✅ Best Practices & Standards

- ✅ Clean code: modular Hexagonal Architecture, readable, short functions
- ✅ Interface abstraction (`domain.HackerNews`)
- ✅ Graceful shutdown using `context.Context`
- ✅ Proper locking (`sync.Mutex`, `sync.Once`)
- ✅ Caching with expiration and background refresh
- ✅ Retry and jitter strategy for refreshers
- ✅ Structured logs with detailed tracing
- ✅ Metrics exposed via `/metrics`

---

## 🚀 Deployment Notes

For **Render**:
- One service for backend (Go)
- One static site for frontend (React build)
- Setup build commands:
  - Frontend: `npm run build`
  - Backend: `go build -o app cmd/main.go && ./app`
- Set `.env` on both services

---

## 📋 Assessment Criteria Checklist

| Criteria                        | Status |
|---------------------------------|--------|
| 1. Application result works     | ✅     |
| 2. Documentation                | ✅     |
| 3. Clean Code Standards         | ✅     |
| 4. Project Structure            | ✅     |
| 5. App Optimization             | ✅     |
| 6. Reusability                  | ✅     |
| 7. Security                     | ✅     |
| 8. Error Handling               | ✅     |




---

## 🛠️ Running the Application Locally

This project uses a **monorepo** structure.

### ⚙️ Requirements

- Go 1.21+
- Node.js 18+
- Redis (running locally or remote)
- Optional: [Air](https://github.com/cosmtrek/air) for hot-reloading Go

### 📄 .env File

In the root:

```env
# .env
PORT=8231
ENVIRONMENT=development
```

### 🧪 Backend Dev

```bash
cd backend
go run cmd/main.go
air
```

Server: `http://localhost:8231`

### 🎨 Frontend Dev

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`

---

## Contact
- [Email](mailto:aulia.illahi.ai@gmail.com)
- [WA](https://wa.me/+6285806743885)
