import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { JobState, News, Pagination } from '../../types'
import { fetchStories } from '../../utils/api'
import { STORY_TYPES } from '../../constant/storyTypes'

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
  pagination: null,
  hiddenIds: [],
  votes:{}
}

export const fetchAJob = createAsyncThunk<
  { data: News[]; pagination: Pagination },
  number
>('news/fetchJob', (page) => fetchStories(page, STORY_TYPES.job))

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    hideJobItem: (state, action: PayloadAction<number>) => {
      state.hiddenIds.push(action.payload)
      state.jobs = state.jobs.filter((item) => item.Id !== action.payload)
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
      .addCase(fetchAJob.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchAJob.fulfilled,
        (
          state,
          action: PayloadAction<{ data: News[]; pagination: Pagination }>
        ) => {
          state.loading = false
          state.jobs = action.payload.data
          state.pagination = action.payload.pagination
        }
      )
      .addCase(fetchAJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })
  },
})

export default jobSlice.reducer
export const selectAJob = (state: RootState) => state.news
export const { hideJobItem, upvote, unvote } = jobSlice.actions
