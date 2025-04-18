export default function Footer() {
  return (
    <div className="bg-[#111] border-t border-gray-800 py-6 text-center text-sm text-white">
      <p className="mb-2">
        Join us for{' '}
        <a href="#" className="underline font-semibold">
          AI Startup School
        </a>{' '}
        this June 16-17 in San Francisco!
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        <a href="#" className="hover:underline">
          Guidelines
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          FAQ
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          Lists
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          API
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          Security
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          Legal
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          Apply to YC
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          Contact
        </a>
      </div>
      <div>
        <label htmlFor="search" className="mr-2">
          Search:
        </label>
        <input
          id="search"
          className="bg-transparent border border-gray-600 px-2 py-1 text-white rounded"
        />
      </div>
    </div>
  )
}
