import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { NewestState, News, Pagination } from '../../types'
import { fetchStories } from '../../utils/api'
import { STORY_TYPES } from '../../constant/storyTypes'


const initialState: NewestState = {
  newest: [],
  loading: false,
  error: null,
  pagination: null,
  hiddenIds: [],
  votes: {},
}


export const fetchNewest = createAsyncThunk<
  { data: News[]; pagination: Pagination },
  number
>('newest/fetchNewest', async(page,{rejectWithValue}) => {
  try {
    return await fetchStories(page, STORY_TYPES.best)
  } catch (err: any) {
    console.error('Fetch newest failed:', err)
    return rejectWithValue(err.message || 'Unknown error')
  }
})

const newestSlice = createSlice({
  name: 'newest',
  initialState,
  reducers: {
    hideNewestItem: (state, action: PayloadAction<number>) => {
      state.hiddenIds.push(action.payload)
      state.newest = state.newest.filter((item) => item.Id !== action.payload)
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
      .addCase(fetchNewest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchNewest.fulfilled,
        (
          state,
          action: PayloadAction<{ data: News[]; pagination: Pagination }>
        ) => {
          state.loading = false
          state.newest = action.payload.data
          state.pagination = action.payload.pagination
        }
      )
      .addCase(fetchNewest.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })
  },
})

export default newestSlice.reducer
export const selectNews = (state: RootState) => state.newest
export const { hideNewestItem, upvote, unvote } = newestSlice.actions
