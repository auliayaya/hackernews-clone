;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { fetchStories } from '../../utils/api'
import { News, Pagination, PastState } from '../../types'




const initialState: PastState = {
  past: [],
  loading: false,
  error: null,
  pagination: null,
  hiddenIds: [],
  votes: {},
}

export const fetchPast = createAsyncThunk<
  { data: News[]; pagination: Pagination },
  { page: number; startDate: string; endDate: string }
>('news/fetchPast', async ({ page, startDate, endDate }) => {
  return await fetchStories(page, 'past', { startDate, endDate })
})
const pastSlice = createSlice({
  name: 'past',
  initialState,
  reducers: {
    hidePastItem: (state, action: PayloadAction<number>) => {
      state.hiddenIds.push(action.payload)
      state.past = state.past.filter((item) => item.Id !== action.payload)
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
      .addCase(fetchPast.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchPast.fulfilled,
        (
          state,
          action: PayloadAction<{ data: News[]; pagination: Pagination }>
        ) => {
          state.loading = false
          state.past = action.payload.data
          state.pagination = action.payload.pagination
        }
      )
      .addCase(fetchPast.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })
  },
})

export default pastSlice.reducer
export const selectPast = (state: RootState) => state.past
export const { hidePastItem , upvote, unvote} = pastSlice.actions
