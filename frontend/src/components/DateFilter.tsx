import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  addDays,
  subDays,
  subMonths,
  subYears,
  format,
  parseISO,
  addMonths,
  addYears,
} from 'date-fns'

const DateFilter = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const currentDay = searchParams.get('day') || format(new Date(), 'yyyy-MM-dd')
  const currentDate = parseISO(currentDay)

  const goTo = (date: Date) => {
    navigate(`/past?day=${format(date, 'yyyy-MM-dd')}`)
  }

  return (
    <div className="text-sm text-gray-300 mb-4">
      <p className="mb-1">
        Stories from {format(currentDate, 'MMMM d, yyyy')} (UTC)
      </p>
      <p>
        Go back a{' '}
        <button
          onClick={() => goTo(subDays(currentDate, 1))}
          className="underline"
        >
          day
        </button>
        ,{' '}
        <button
          onClick={() => goTo(subMonths(currentDate, 1))}
          className="underline"
        >
          month
        </button>
        , or{' '}
        <button
          onClick={() => goTo(subYears(currentDate, 1))}
          className="underline"
        >
          year
        </button>
        . Go forward a{' '}
        <button
          onClick={() => goTo(addDays(currentDate, 1))}
          className="underline"
        >
          day
        </button>
        ,{' '}
        <button
          onClick={() => goTo(addMonths(currentDate, 1))}
          className="underline"
        >
          month
        </button>
        , or{' '}
        <button
          onClick={() => goTo(addYears(currentDate, 1))}
          className="underline"
        >
          year
        </button>
        .
      </p>
    </div>
  )
}

export default DateFilter
