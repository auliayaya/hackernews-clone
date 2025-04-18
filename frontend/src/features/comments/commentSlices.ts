import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { CommentState, News, Pagination } from '../../types'
import { fetchCommentApi } from '../../utils/api'


const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
  pagination: null,
  hiddenIds: [],
}

export const fetchComment = createAsyncThunk<
  { data: News[]; pagination: Pagination },
  number
>('news/fetchComment',(page)=> fetchCommentApi(page))

const fetchSlice = createSlice({
  name: 'ask',
  initialState,
  reducers: {
    hideAskItem: (state, action: PayloadAction<number>) => {
      state.hiddenIds.push(action.payload)
      state.comments = state.comments.filter((item) => item.Id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchComment.fulfilled,
        (
          state,
          action: PayloadAction<{ data: News[]; pagination: Pagination }>
        ) => {
          state.loading = false
          state.comments = action.payload.data
          state.pagination = action.payload.pagination
        }
      )
      .addCase(fetchComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })
  },
})

export default fetchSlice.reducer
export const selectComment= (state: RootState) => state.comments
