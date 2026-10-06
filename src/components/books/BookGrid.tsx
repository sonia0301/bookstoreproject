import { Book } from '../../types'
import BookCard from './BookCard'

interface BookGridProps {
  books: Book[]
  onAddToCart?: (book: Book) => void
  emptyMessage?: string
  layout?: 'catalog' | 'shelf'
}

export default function BookGrid({
  books,
  onAddToCart,
  emptyMessage = 'No books found matching your criteria.',
  layout = 'shelf',
}: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-xl border border-warm-200 p-8">
        <p className="text-espresso-600 text-sm">{emptyMessage}</p>
      </div>
    )
  }

  const gridClasses =
    layout === 'catalog'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'

  return (
    <div className={gridClasses}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}
