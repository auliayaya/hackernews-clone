import { Routes, Route } from 'react-router-dom'
import NewsPage from './features/news/NewsPage'
import AskPage from './features/ask/AskPage'
import NewestPage from './features/newest/NewestPage'
import DetailItemPage from './features/detail/DetailItemPage'
import JobsPage from './features/jobs/JobsPage'
import ShowPage from './features/show/ShowPage'
import CommentPage from './features/comments/CommentPage'
import PastPage from './features/past/PastPage'

export default function App() {
  return (
    <div className="bg-zinc-800 min-h-screen flex flex-col items-center text-sm sm:pt-2 lg:pt-2 text-gray-300 font-sans">
      <Routes>
        <Route path="/" element={<NewsPage />} />
        <Route path="/newest" element={<NewestPage />} />
        <Route path="/past" element={<PastPage />} />
        <Route path="/comments" element={<CommentPage />} />
        <Route path="/ask" element={<AskPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/item" element={<DetailItemPage />} />
        <Route path="/show" element={<ShowPage />} />
      </Routes>
    </div>
  )
}
