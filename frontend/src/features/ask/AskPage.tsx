import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { useEffect } from 'react'
import Layout from '../../components/Layout'
import { fetchAsk, unvote, upvote } from './askSlices'
import { ArticleList } from '../../components/ArticleList'
import { hideJobItem } from '../jobs/jobsSlices'

export default function AskPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { ask, loading, pagination,votes } = useAppSelector((state) => state.ask)

  const rawPage = searchParams.get('p')
  let page = parseInt(rawPage || '1', 30)
  if (isNaN(page) || page < 1) page = 1

  useEffect(() => {
    dispatch(fetchAsk(page))
  }, [page, dispatch])

  const goToPage = (newPage: number) => {
    setSearchParams({ p: newPage.toString() })
  }

  return (
    <Layout>
      <ArticleList
        page={page}
        gotoPage={goToPage}
        news={ask}
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
