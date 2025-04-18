import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { fetchStories } from '../../utils/api'
import { STORY_TYPES } from '../../constant/storyTypes'
import { News, NewsState, Pagination } from '../../types'


const initialState: NewsState = {
  news: [],
  loading: false,
  error: null,
  pagination: null,
  hiddenIds: [],
  votes: {},
}

export const fetchNews = createAsyncThunk<
  { data: News[]; pagination: Pagination },
  number
>('news/fetchNews', (page) => fetchStories(page, STORY_TYPES.new))

const newSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    hideNewsItem: (state, action: PayloadAction<number>) => {
      state.hiddenIds.push(action.payload)
      state.news = state.news.filter((item) => item.Id !== action.payload)
    },
    upvote: (state, action: PayloadAction<number>) => {
      state.votes[action.payload] = true
    },
    unvote: (state, action: PayloadAction<number>) => {
      state.votes[action.payload] = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchNews.fulfilled,
        (
          state,
          action: PayloadAction<{ data: News[]; pagination: Pagination }>
        ) => {
          state.loading = false
          state.news = action.payload.data
          state.pagination = action.payload.pagination
        }
      )
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })
  },
})

export default newSlice.reducer
export const selectNews = (state: RootState) => state.news
export const { hideNewsItem, unvote, upvote } = newSlice.actions
