import { History, Trash2 } from 'lucide-react'
import { Book } from '../../types'
import BookCard from './BookCard'

interface RecentlyViewedShelfProps {
  books: Book[]
  onClear?: () => void
  excludeBookId?: string
  title?: string
  badge?: string
}

export default function RecentlyViewedShelf({
  books,
  onClear,
  excludeBookId,
  title = 'Recently Viewed',
  badge = 'Browsing History',
}: RecentlyViewedShelfProps) {
  const displayBooks = excludeBookId
    ? books.filter((b) => b.id !== excludeBookId)
    : books

  if (displayBooks.length === 0) return null

  return (
    <section aria-labelledby="recently-viewed-heading" className="space-y-6 pt-6">
      
      {/* Section Header with Clear Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-warm-200">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warm-200 text-espresso-800 text-[10px] font-bold uppercase tracking-wider">
            <History className="w-3 h-3 text-amber-700" />
            <span>{badge}</span>
          </span>
          <h2 id="recently-viewed-heading" className="text-2xl sm:text-3xl font-serif font-bold text-espresso-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-espresso-600">
            Pick up right where you left off in your literary exploration.
          </p>
        </div>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayBooks.map((book) => (
          <BookCard key={`recent-${book.id}`} book={book} />
        ))}
      </div>

    </section>
  )
}
