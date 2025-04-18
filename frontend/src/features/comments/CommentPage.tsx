import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { useEffect } from 'react'

import Layout from '../../components/Layout'
import { CommentList } from './CommentList'
import { fetchComment } from './commentSlices'

export default function CommentPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  //  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { comments, loading, pagination } = useAppSelector(
    (state) => state.comments
  )

  const rawPage = searchParams.get('p')
  let page = parseInt(rawPage || '1', 30)
  if (isNaN(page) || page < 1) page = 1

  useEffect(() => {
    dispatch(fetchComment(page))
  }, [page, dispatch])

  const goToPage = (newPage: number) => {
    setSearchParams({ p: newPage.toString() })
  }

  return (
    <Layout>
      
      <CommentList
        page={page}
        gotoPage={goToPage}
        comments={comments}
        pagination={pagination}
        loading={loading}
      />
    </Layout>
  )
}
