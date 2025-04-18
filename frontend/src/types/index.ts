export interface News {
  Title: string
  Url: string
  Points: number
  Score: number
  Type: string
  Time: number
  By: string
  Descendants: number
  Id: number
  Parts: number[] | null
  Parent: number
  Kids: number[]
  Text: string
}

export interface Pagination {
  total_page: number
  total: number
  limit: number
  page: number
}


interface BaseState {
  loading: boolean
  error: string | null
  pagination: Pagination | null
  hiddenIds: number[]
}


interface VotableState extends BaseState {
  votes: Record<number, boolean>
}


export interface CommentState extends BaseState {
  comments: News[]
}


export interface NewsState extends VotableState {
  news: News[]
}

export interface NewestState extends VotableState {
  newest: News[]
}

export interface AskState extends VotableState {
  ask: News[]
}

export interface JobState extends VotableState {
  jobs: News[]
}

export interface ShowState extends VotableState {
  show: News[]
}

export interface PastState extends VotableState {
  past: News[]
}
