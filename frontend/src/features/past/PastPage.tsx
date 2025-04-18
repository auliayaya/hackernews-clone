import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { useEffect } from 'react'

import Layout from '../../components/Layout'
import { fetchPast, hidePastItem, unvote, upvote } from './pastSlices'
import DateFilter from '../../components/DateFilter'
import { addDays, format, parseISO, subDays } from 'date-fns'
import { ArticleList } from '../../components/ArticleList'

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  //  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { past, loading, pagination, votes } = useAppSelector(
    (state) => state.past
  )

  const rawPage = searchParams.get('p')

  let page = parseInt(rawPage || '1', 10)
  if (isNaN(page) || page < 1) page = 1

  useEffect(() => {
    const day = searchParams.get('day') || format(new Date(), 'yyyy-MM-dd')
    const start = subDays(parseISO(day), 1)

    const end = addDays(start, 1)

    dispatch(
      fetchPast({
        page,
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      })
    )
  }, [searchParams, page, dispatch])
  const goToPage = (newPage: number) => {
    setSearchParams({ p: newPage.toString() })
  }

  return (
    <Layout>
      <DateFilter />
      <ArticleList
        page={page}
        gotoPage={goToPage}
        news={past}
        pagination={pagination}
        loading={loading}
        onHide={(id) => dispatch(hidePastItem(id))}
        onVote={(id) => dispatch(upvote(id))}
        onUnvote={(id) => dispatch(unvote(id))}
        votes={votes}
      />
    </Layout>
  )
}
