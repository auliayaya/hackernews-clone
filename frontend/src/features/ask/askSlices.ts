import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { AskState, News, Pagination } from '../../types'
import {  fetchStories } from '../../utils/api'
import { STORY_TYPES } from '../../constant/storyTypes'


const initialState: AskState = {
  ask: [],
  loading: false,
  error: null,
  pagination: null,
  hiddenIds: [],
  votes: {}
}

export const fetchAsk = createAsyncThunk<
  { data: News[]; pagination: Pagination },
  number
>('ask/fetchAsk', (page) => fetchStories( page, STORY_TYPES.ask))

const askSlice = createSlice({
  name: 'ask',
  initialState,
  reducers: {
    hideAskItem: (state, action: PayloadAction<number>) => {
      state.hiddenIds.push(action.payload)
      state.ask = state.ask.filter((item) => item.Id !== action.payload)
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
      .addCase(fetchAsk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchAsk.fulfilled,
        (
          state,
          action: PayloadAction<{ data: News[]; pagination: Pagination }>
        ) => {
          state.loading = false
          state.ask = action.payload.data
          state.pagination = action.payload.pagination
        }
      )
      .addCase(fetchAsk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })
  },
})

export default askSlice.reducer
export const selectAsk = (state: RootState) => state.news
export const { hideAskItem, upvote, unvote } = askSlice.actions
