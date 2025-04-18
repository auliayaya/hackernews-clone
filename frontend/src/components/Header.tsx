import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className="bg-[#ff6600] text-white text-sm px-2 py-[2px] font-sans">
      <div className="max-w-5xl mx-auto flex lg:flex-wrap  items-start justify-between gap-y-1">

        <div className="flex flex-wrap items-start gap-x-2 gap-y-1">

          <div className="flex lg:flex-wrap flex-row items-center gap-2">
            <Link to="/" className="shrink-0">
              <img
                src="https://news.ycombinator.com/y18.svg"
                alt="logo"
                className="w-[18px] h-[18px] border border-white block"
              />
            </Link>
            <Link to="/" className="font-bold hover:underline">
              Hacker News
            </Link>
          </div>


          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 leading-4">
            <Link to="/newest" className="hover:underline">
              new
            </Link>
            <span>|</span>
            <Link to="/past" className="hover:underline">
              past
            </Link>
            <span>|</span>
            <Link to="/comments" className="hover:underline">
              comments
            </Link>
            <span>|</span>
            <Link to="/ask" className="hover:underline">
              ask
            </Link>
            <span>|</span>
            <Link to="/show" className="hover:underline">
              show
            </Link>
            <span>|</span>
            <Link to="/jobs" className="hover:underline">
              jobs
            </Link>
          
          </div>
        </div>


        <div className="flex items-center pt-3 lg:pt-0 md:pt-0 text-right sm:text-left text-sm">
          <span>
            <Link to="/login" className="hover:underline">
              login
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
