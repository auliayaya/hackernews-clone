import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { useEffect } from 'react'

import Layout from '../../components/Layout'
import { fetchAShow, hideShowItem, unvote, upvote } from './showSlices'
import { ArticleList } from '../../components/ArticleList'

export default function ShowPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  //  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { show, loading, pagination, votes } = useAppSelector((state) => state.show)

  const rawPage = searchParams.get('p')
  let page = parseInt(rawPage || '1', 30)
  if (isNaN(page) || page < 1) page = 1

  useEffect(() => {
    dispatch(fetchAShow(page))
  }, [page, dispatch])

  const goToPage = (newPage: number) => {
    setSearchParams({ p: newPage.toString() })
  }

  return (
    <Layout>
      <ArticleList
        page={page}
        gotoPage={goToPage}
        news={show}
        pagination={pagination}
        loading={loading}
        onHide={(id) => dispatch(hideShowItem(id))}
                onVote={(id) => dispatch(upvote(id))}
                onUnvote={(id) => dispatch(unvote(id))}
                votes={votes}
      />
    </Layout>
  )
}
