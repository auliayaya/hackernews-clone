import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { News, Pagination, ShowState } from '../../types'
import { fetchStories } from '../../utils/api'
import { STORY_TYPES } from '../../constant/storyTypes'

const initialState: ShowState = {
  show: [],
  loading: false,
  error: null,
  pagination: null,
  hiddenIds: [],
  votes: {}
}

export const fetchAShow = createAsyncThunk<
  { data: News[]; pagination: Pagination },
  number
>('news/fetchShow', (page) =>fetchStories(page, STORY_TYPES.show))

const showSlice = createSlice({
  name: 'show',
  initialState,
  reducers: {
    hideShowItem: (state, action: PayloadAction<number>) => {
      state.hiddenIds.push(action.payload)
      state.show = state.show.filter((item) => item.Id !== action.payload)
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
      .addCase(fetchAShow.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchAShow.fulfilled,
        (
          state,
          action: PayloadAction<{ data: News[]; pagination: Pagination }>
        ) => {
          state.loading = false
          state.show = action.payload.data
          state.pagination = action.payload.pagination
        }
      )
      .addCase(fetchAShow.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })
  },
})

export default showSlice.reducer
export const selectAShow = (state: RootState) => state.show
export const { hideShowItem , upvote, unvote} = showSlice.actions
