import { Loader2 } from 'lucide-react'
import { News, Pagination } from '../../types'
import { CustomPagination } from '../../components/Pagination'


export const CommentList = ({
  page,
  gotoPage,
  comments,
  pagination,
  loading,
}: {
  page: number
  gotoPage: (page: number) => void
  comments: News[]
  pagination: Pagination | null
  loading: boolean
}) => {
  return (
    <div className="px-4 sm:px-6 md:px-8">
      {loading ? (
        <div className="flex items-center justify-center py-6 space-x-2">
          <Loader2 className="animate-spin text-gray-400" />
          <span className="text-sm text-gray-300">Loading...</span>
        </div>
      ) : (
        <>
          {comments.map((comment) => (
            <div
              key={comment.Id}
              id={`comment-${comment.Id}`}
              className={`border-l border-gray-700 pl-3 mb-6 pb-5`}
              style={{
                marginLeft: `${comment.Score * 16}px`, // 1 level = 1rem (16px)
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-4 gap-y-1 text-xs text-gray-400 mb-2">
                <span className="break-words">{comment.By}</span>
                <span className="text-gray-500">
                  {new Date(comment.Time * 1000).toLocaleString()}
                </span>
                {comment.Parent !== 0 && (
                  <a
                    href={`#comment-${comment.Parent}`}
                    className="hover:underline text-blue-400"
                  >
                    parent
                  </a>
                )}
              </div>

              <div
                className="text-base sm:text-sm text-gray-100 leading-6 sm:leading-relaxed break-words"
                dangerouslySetInnerHTML={{ __html: comment.Text }}
              />
            </div>
          ))}

          <CustomPagination
            page={page}
            totalPages={pagination?.total_page || 1}
            onPageChange={gotoPage}
          />
        </>
      )}
    </div>
  )
}
