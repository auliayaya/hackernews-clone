import { useEffect, useState } from 'react'
import {  useSearchParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import Layout from '../../components/Layout'
import { timeAgo } from '../../utils/helper'

type Comment = {
  id: number
  by: string
  text: string
  time: number
  kids?: Comment[]
  parent: number
}

type Article = {
  Title: string
  Url: string
  Points: number
  Score: number
  Type: string
  Time: number
  By: string
  Descendants: number
  Id: number
  Kids: number[]
  Text: string
}

type ApiResponse = {
  status: boolean
  message: string
  data: {
    articles: Article
    comments: Comment[]
  }
}

export default function ArticleDetail() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const [article, setArticle] = useState<Article | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:8231/api/v1/articles/${id}`)
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        setArticle(data.data.articles)
        setComments(data.data.comments)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>
  if (!article)
    return <div className="p-4 text-red-500">Article not found.</div>

  return (
    <Layout>
      <div className="mt-4 text-base">
        <div className="text-white">
          ▲ {article.Title} (
          <a className="text-sm text-white" href={article.Url}>
            link
          </a>
          )
        </div>
        <div
          className="text-white text-sm"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(article.Text || ''),
          }}
        />
        <div className="text-[#828282] text-xs mt-1">
          {article.Score} points by {article.By} | {timeAgo(article.Time)} |{' '}
          {article.Descendants} comments
        </div>

        <div className="text-xs mt-3">
          If you haven't already, would you mind reading about HN's{' '}
          <a href="#" className="underline text-white">
            approach to comments
          </a>{' '}
          and{' '}
          <a href="#" className="underline text-white">
            site guidelines
          </a>
          ?
        </div>
      </div>

      <div className="mt-6">
        {comments != null &&
          comments.length > 0 &&
          comments.map((comment) => CommentNode({ comment, depth: 0 }))}
      </div>
    </Layout>
  )
}

function CommentNode({ comment, depth }: { comment: Comment; depth: number }) {
  const marginLeft = depth * 20

  return (
    <div className="border-l border-gray-200 pl-4" style={{ marginLeft }}>
      <div className="text-xs text-gray-500 mb-1">
        <span className="font-light text-green-400">{comment.by} {"  "}<span className='text-gray-400'>{timeAgo(comment.time)}</span></span>
      </div>
      <div
        className="text-white text-sm"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(comment.text || ''),
        }}
      />
      {comment.kids && comment.kids.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.kids.map((kid) => (
            <CommentNode key={kid.id} comment={kid} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
