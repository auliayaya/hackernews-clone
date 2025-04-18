import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { useEffect } from 'react'

import Layout from '../../components/Layout'
import { fetchAJob, hideJobItem, unvote, upvote } from './jobsSlices'
import { ArticleList } from '../../components/ArticleList'

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  //  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { jobs, loading, pagination, votes } = useAppSelector(
    (state) => state.jobs
  )

  const rawPage = searchParams.get('p')
  let page = parseInt(rawPage || '1', 30)
  if (isNaN(page) || page < 1) page = 1

  useEffect(() => {
    dispatch(fetchAJob(page))
  }, [page, dispatch])

  const goToPage = (newPage: number) => {
    setSearchParams({ p: newPage.toString() })
  }

  return (
    <Layout>
      <ArticleList
        page={page}
        gotoPage={goToPage}
        news={jobs}
        pagination={pagination}
        loading={loading}
        onHide={(id) => dispatch(hideJobItem(id))}
        onVote={(id) => dispatch(upvote(id))}
        onUnvote={(id) => dispatch(unvote(id))}
        votes={votes}
      />
    </Layout>
  )
}
