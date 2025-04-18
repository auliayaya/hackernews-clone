import { configureStore } from '@reduxjs/toolkit'
import newsReducer from '../features/news/newsSlices'
import newestReducer from '../features/newest/newestSlices'
import askReducer from "../features/ask/askSlices"
import jobReducer from "../features/jobs/jobsSlices"
import showReducer from '../features/show/showSlices'
import commentReducer from '../features/comments/commentSlices'  
    import pastReducer from '../features/past/pastSlices'
export const store = configureStore({
  reducer: {
    news: newsReducer,
    newest: newestReducer,
    ask: askReducer,
    jobs: jobReducer,
    show: showReducer,
    comments: commentReducer,
    past: pastReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
