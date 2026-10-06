import { Link } from 'react-router-dom'
import { BookX, Home, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="py-16 text-center space-y-6 max-w-lg mx-auto">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warm-200 text-espresso-700 mx-auto">
        <BookX className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase font-semibold tracking-wider text-amber-700">404 Error</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-espresso-900">Page Not Found</h1>
        <p className="text-espresso-600 text-sm leading-relaxed">
          The literary passage or page you are looking for has been moved, misplaced, or does not exist in our library.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-amber-700"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          to="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-warm-200 hover:bg-warm-300 text-espresso-900 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-amber-700"
        >
          <Search className="w-4 h-4" />
          Search Catalog
        </Link>
      </div>
    </div>
  )
}
