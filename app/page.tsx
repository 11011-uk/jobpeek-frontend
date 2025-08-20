import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-6">
            JobPeek
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Discover your next opportunity with ease
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-lg mx-auto">
            Browse through curated job postings, one at a time. 
            Fresh opportunities delivered daily.
          </p>
        </div>
        
        <div className="space-y-6">
          <Link href="/jobs" className="inline-block">
            <button className="btn-primary text-xl py-4 px-12">
              Start Browsing Jobs
            </button>
          </Link>
          
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <div className="text-center">
              <div className="text-teal-400 font-semibold">Fresh Daily</div>
              <div>New jobs every day</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-semibold">No Repeats</div>
              <div>Never see the same job twice</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-semibold">Mobile First</div>
              <div>Optimized for your phone</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}