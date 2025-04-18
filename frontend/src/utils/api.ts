import { API_BASE_URL } from "../constant/env";
import { News, Pagination } from "../types";


export const fetchStories = async (
  page: number,
  type: string,
  params: Record<string, string> = {}
): Promise<{ data: News[]; pagination: Pagination }> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: '30',
    type,
    ...params,
  })

  const res = await fetch(`${API_BASE_URL}/articles?${query.toString()}`)
  const json = await res.json()

  return { data: json.data, pagination: json.pagination }
}

export const fetchCommentApi = async (
  page: number,

  params: Record<string, string> = {}
): Promise<{ data: News[]; pagination: Pagination }> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: '30',
    ...params,
  })

  const res = await fetch(`${API_BASE_URL}/comments?${query.toString()}`)
  const json = await res.json()

  return { data: json.data, pagination: json.pagination }
}
