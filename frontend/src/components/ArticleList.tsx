import { News, Pagination } from '../types'
import { Loader2 } from 'lucide-react'
import { getDomain, timeAgo } from '../utils/helper'
import { CustomPagination } from './Pagination'
import { Link } from 'react-router-dom'

export const ArticleList = ({
  page,
  gotoPage,
  news,
  pagination,
  loading,
  onHide,
  onUnvote,
  onVote,
  votes,
}: {
  page: number
  gotoPage: (page: number) => void
  news: News[]
  pagination: Pagination | null
  loading: boolean
  onHide?: (id: number) => void
  onVote?: (id: number) => void
  onUnvote?: (id: number) => void
  votes?: { [id: number]: boolean }
}) => {
  return (
    <div>
      {loading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin text-white" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {news?.map((story, i) => {
            const isVoted = votes?.[story.Id] ?? false

            return (
              <div
                key={`${story.Id}-${i}`}
                className="flex items-start gap-1 mb-4"
              >
                <span className="text-white w-1 text-right mr-1">
                  {(page - 1) * 30 + i + 1}.
                </span>

                {votes && !isVoted ? (
                  <button
                    className="votearrow w-6 h-4"
                    onClick={() => onVote?.(story.Id)}
                    title="upvote"
                  />
                ) : (
                  <div className="w-6 h-4" />
                )}

                <div className="flex-1 min-w-0">
                  <div>
                    <a
                      href={story.Url}
                      className="text-white hover:underline font-medium break-words"
                      rel="noopener noreferrer"
                    >
                      {story.Title}
                    </a>
                    {story.Url && (
                      <span className="text-gray-500 text-xs ml-1">
                        ({getDomain(story.Url)})
                      </span>
                    )}
                  </div>

                  <div className="text-gray-500 text-xs mt-0.5">
                    {story.Score} points by{' '}
                    <span className="text-white">{story.By}</span>{' '}
                    {story.Time ? `| ${timeAgo(story.Time)}` : ''}
                    {/* Unvote */}
                    {votes && isVoted && (
                      <>
                        {' | '}
                        <button
                          onClick={() => onUnvote?.(story.Id)}
                          className="text-white hover:text-white text-xs"
                        >
                          unvote
                        </button>
                      </>
                    )}
                    {/* Hide */}
                    {onHide && (
                      <>
                        {' | '}
                        <button
                          onClick={() => onHide?.(story.Id)}
                          className="text-white hover:text-white text-xs"
                        >
                          [ hide ]
                        </button>
                      </>
                    )}
                    {' | '}
                    <Link to={'/item?id=' + story.Id}>
                      {story.Descendants || 0} comments
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}

          <CustomPagination
            page={page}
            onPageChange={gotoPage}
            totalPages={pagination?.total_page || 1}
          />
        </>
      )}
    </div>
  )
}
