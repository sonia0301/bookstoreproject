import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ShoppingBag, Eye, Check } from 'lucide-react'
import { Book } from '../../types'
import { useCart } from '../../context/CartContext'
import { formatCurrency, calculateDiscount } from '../../utils/formatters'
import StarRating from '../common/StarRating'

interface BookCardProps {
  book: Book
  onAddToCart?: (book: Book) => void
}

export default function BookCard({ book, onAddToCart }: BookCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addToCart } = useCart()

  const discount = book.originalPrice ? calculateDiscount(book.originalPrice, book.price) : 0
  const isOutOfStock = book.stock <= 0

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return

    if (onAddToCart) {
      onAddToCart(book)
    } else {
      addToCart(book, 1)
    }

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1600)
  }

  return (
    <article className="group relative flex flex-col bg-white rounded-xl border border-warm-200 overflow-hidden shadow-xs hover:shadow-md hover:border-warm-300 transition-all duration-300">
      
      {/* Cover Image Container */}
      <Link
        to={`/books/${book.id}`}
        tabIndex={-1}
        className="relative block aspect-[2/3] w-full overflow-hidden bg-warm-100 focus:outline-none"
      >
        {!imageError ? (
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title} by ${book.author}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-warm-200 to-warm-100 text-espresso-700">
            <BookOpen className="w-8 h-8 text-amber-700 mb-2 opacity-80" />
            <span className="font-serif font-bold text-xs line-clamp-2">{book.title}</span>
            <span className="text-[10px] text-espresso-500 mt-1">{book.author}</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {book.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold tracking-wide uppercase shadow-xs">
              Bestseller
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-xs">
              -{discount}%
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-espresso-950/75 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="px-3 py-1 rounded-full bg-white text-espresso-900 font-bold text-xs shadow-md uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Hover Action */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-espresso-900/80 via-espresso-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/95 text-espresso-900 text-xs font-semibold shadow-sm backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </span>
        </div>
      </Link>

      {/* Book Metadata */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between">
        <div className="space-y-2">
          
          {/* Category */}
          <div className="flex items-center justify-between text-[11px] font-medium text-amber-800">
            <span>{book.category}</span>
            {book.stock > 0 && book.stock <= 5 && (
              <span className="text-amber-700 font-semibold">Only {book.stock} left</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-base text-espresso-900 group-hover:text-amber-800 transition-colors line-clamp-1 leading-snug">
            <Link
              to={`/books/${book.id}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 rounded"
            >
              {book.title}
            </Link>
          </h3>

          {/* Author */}
          <p className="text-xs text-espresso-600 font-medium line-clamp-1">
            by {book.author}
          </p>

          {/* Star Rating */}
          <div className="pt-0.5">
            <StarRating rating={book.rating} reviewCount={book.reviewCount} size="sm" />
          </div>

          {/* Description snippet */}
          <p className="text-xs text-espresso-500 line-clamp-2 leading-relaxed pt-1">
            {book.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="pt-4 mt-4 border-t border-warm-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-espresso-900">
              {formatCurrency(book.price)}
            </span>
            {book.originalPrice && (
              <span className="text-xs text-espresso-500 line-through">
                {formatCurrency(book.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[36px] sm:min-h-[40px] rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 ${
              isOutOfStock
                ? 'bg-warm-200 text-espresso-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-warm-100 hover:bg-amber-700 hover:text-white text-espresso-800 active:scale-95'
            }`}
            aria-label={isOutOfStock ? `${book.title} is out of stock` : `Add ${book.title} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Added</span>
                <span className="sr-only" role="status" aria-live="polite">
                  Added {book.title} to shopping cart
                </span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

      </div>

    </article>
  )
}
