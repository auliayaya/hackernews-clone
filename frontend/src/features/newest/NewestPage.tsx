import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { useEffect } from 'react'
import Layout from '../../components/Layout'
import { ArticleList } from '../../components/ArticleList'
import { fetchNewest, hideNewestItem, unvote, upvote } from './newestSlices'

export default function NewestPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const dispatch = useAppDispatch()

  const { newest, loading, pagination, votes } = useAppSelector(
    (state) => state.newest
  )


  const rawPage = searchParams.get('p')
  let page = parseInt(rawPage || '1', 30)
  if (isNaN(page) || page < 1) page = 1

  useEffect(() => {
    dispatch(fetchNewest(page))
  }, [page, dispatch])

  const goToPage = (newPage: number) => {
    setSearchParams({ p: newPage.toString() })
  }

  return (
    <Layout>
      <ArticleList
        page={page}
        gotoPage={goToPage}
        news={newest}
        pagination={pagination}
        loading={loading}
        onHide={(id) => dispatch(hideNewestItem(id))}
        onVote={(id) => dispatch(upvote(id))}
        onUnvote={(id) => dispatch(unvote(id))}
        votes={votes}
      />
    </Layout>
  )
}
