import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  BookX,
  Building2,
  Calendar,
  FileText,
  Hash,
  Languages,
  Sparkles
} from 'lucide-react'
import { BOOKS_DATA } from '../data/books'
import { useCart } from '../context/CartContext'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { formatCurrency, calculateDiscount } from '../utils/formatters'
import StarRating from '../components/common/StarRating'
import QuantitySelector from '../components/common/QuantitySelector'
import Breadcrumbs from '../components/common/Breadcrumbs'
import BookCard from '../components/books/BookCard'
import SectionHeader from '../components/common/SectionHeader'
import RecentlyViewedShelf from '../components/books/RecentlyViewedShelf'
import EmptyState from '../components/common/EmptyState'

export default function BookDetailsPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { recentlyViewedBooks, recordView, clearHistory } = useRecentlyViewed()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Find book from centralized dataset
  const book = useMemo(() => {
    return BOOKS_DATA.find((b) => b.id === bookId)
  }, [bookId])

  // Reset state and record recently viewed when bookId changes
  useEffect(() => {
    setQuantity(1)
    setIsAdded(false)
    setImageError(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (book) {
      recordView(book.id)
    }
  }, [bookId, book, recordView])

  // Related books from same category (excluding current book)
  const relatedBooks = useMemo(() => {
    if (!book) return []
    return BOOKS_DATA
      .filter((b) => b.category === book.category && b.id !== book.id)
      .slice(0, 4)
  }, [book])

  // Handle Invalid / Missing Book
  if (!book) {
    return (
      <div className="py-12 sm:py-20">
        <EmptyState
          icon={BookX}
          title="Book Not Found"
          message="The literary volume you requested could not be located in our catalog. It may have been archived or the URL may be incorrect."
          actionLabel="Browse All Books"
          onAction={() => navigate('/books')}
        />
      </div>
    )
  }

  const discount = book.originalPrice ? calculateDiscount(book.originalPrice, book.price) : 0
  const isOutOfStock = book.stock <= 0
  const isLowStock = book.stock > 0 && book.stock <= 5

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart(book, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="py-6 sm:py-10 space-y-16">
      
      {/* 1. Breadcrumbs Navigation */}
      <Breadcrumbs
        items={[
          { label: 'All Books', href: '/books' },
          { label: book.category, href: `/books?category=${encodeURIComponent(book.category)}` },
          { label: book.title },
        ]}
      />

      {/* 2. Main Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Book Cover Presentation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[2/3] w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-warm-100 border border-warm-200 shadow-xl group">
            {!imageError ? (
              <img
                src={book.coverImage}
                alt={`Cover of ${book.title} by ${book.author}`}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-warm-200 to-warm-100">
                <BookOpen className="w-16 h-16 text-amber-700 mb-4 opacity-75" />
                <h3 className="font-serif font-bold text-lg text-espresso-900">{book.title}</h3>
                <p className="text-sm text-espresso-600 mt-1">{book.author}</p>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
              {book.isBestSeller && (
                <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  Bestseller
                </span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-espresso-950/75 backdrop-blur-xs flex items-center justify-center z-20">
                <span className="px-4 py-2 rounded-xl bg-white text-espresso-900 font-bold text-sm shadow-xl uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Book Details & Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Category & Stock Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/books?category=${encodeURIComponent(book.category)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold hover:bg-amber-200 transition-colors focus-visible:ring-2 focus-visible:ring-amber-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{book.category}</span>
            </Link>

            {isOutOfStock ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-espresso-200 text-espresso-700 text-xs font-semibold">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-300">
                Low Stock — Only {book.stock} left
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
                In Stock ({book.stock} available)
              </span>
            )}
          </div>

          {/* Title & Author */}
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-espresso-900 leading-tight">
              {book.title}
            </h1>
            <p className="text-base sm:text-lg text-espresso-600 font-medium">
              by <span className="text-amber-800 font-semibold">{book.author}</span>
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 py-1">
            <StarRating rating={book.rating} reviewCount={book.reviewCount} size="md" />
            <span className="text-xs text-espresso-400">|</span>
            <span className="text-xs text-espresso-600 font-medium">{book.publishedYear} First Edition</span>
          </div>

          {/* Pricing Block */}
          <div className="p-4 sm:p-5 rounded-2xl bg-warm-100/80 border border-warm-200 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-espresso-900">
              {formatCurrency(book.price)}
            </span>
            {book.originalPrice && (
              <>
                <span className="text-base sm:text-lg text-espresso-500 line-through">
                  {formatCurrency(book.originalPrice)}
                </span>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-espresso-800">
              Overview
            </h2>
            <p className="text-sm sm:text-base text-espresso-700 leading-relaxed">
              {book.longDescription || book.description}
            </p>
          </div>

          {/* Purchase Actions (Quantity + Add to Cart) */}
          <div className="pt-4 border-t border-warm-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <label htmlFor="product-qty" className="text-xs font-bold uppercase tracking-wider text-espresso-700">
                  Qty:
                </label>
                <QuantitySelector
                  inputId="product-qty"
                  quantity={quantity}
                  min={1}
                  max={book.stock > 0 ? book.stock : 1}
                  onChange={setQuantity}
                  disabled={isOutOfStock}
                />
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 ${
                  isOutOfStock
                    ? 'bg-warm-200 text-espresso-400 cursor-not-allowed border border-warm-300'
                    : isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-700 hover:bg-amber-800 text-white hover:shadow'
                }`}
                aria-label={isOutOfStock ? 'Book is currently out of stock' : `Add ${quantity} copies to cart`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" aria-hidden="true" />
                    <span>Added {quantity} to Cart!</span>
                    <span className="sr-only" role="status" aria-live="polite">
                      Added {quantity} copies of {book.title} to shopping cart
                    </span>
                  </>
                ) : isOutOfStock ? (
                  <span>Currently Out of Stock</span>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                    <span>Add to Cart • {formatCurrency(book.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Assurance Badges */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-warm-200 text-xs text-espresso-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Free shipping on orders $35+</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
              <span>30-day reader return policy</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Guaranteed authentic edition</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Book Specifications Grid */}
      <section className="bg-white rounded-2xl border border-warm-200 p-5 sm:p-8 space-y-6 shadow-2xs">
        <h2 className="text-xl font-serif font-bold text-espresso-900 border-b border-warm-200 pb-3">
          Book Specifications
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 text-xs">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-espresso-500 font-medium">
              <Building2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Publisher</span>
            </div>
            <p className="font-semibold text-espresso-900 text-sm truncate">{book.publisher}</p>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-espresso-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Published</span>
            </div>
            <p className="font-semibold text-espresso-900 text-sm">{book.publishedYear}</p>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-espresso-500 font-medium">
              <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Pages</span>
            </div>
            <p className="font-semibold text-espresso-900 text-sm">{book.pages} pages</p>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-espresso-500 font-medium">
              <Hash className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>ISBN</span>
            </div>
            <p className="font-semibold text-espresso-900 text-xs sm:text-sm font-mono truncate">{book.isbn}</p>
          </div>

          <div className="space-y-1 min-w-0 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-espresso-500 font-medium">
              <Languages className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Language</span>
            </div>
            <p className="font-semibold text-espresso-900 text-sm">{book.language}</p>
          </div>
        </div>
      </section>

      {/* 4. Related Books Shelf */}
      {relatedBooks.length > 0 && (
        <section aria-labelledby="related-books-heading">
          <SectionHeader
            badge="Recommended Reading"
            title="More in this Category"
            subtitle={`Discover other curated titles in ${book.category}.`}
            viewAllLink={`/books?category=${encodeURIComponent(book.category)}`}
            viewAllText="View Category"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Recently Viewed Shelf */}
      <RecentlyViewedShelf
        books={recentlyViewedBooks}
        onClear={clearHistory}
        excludeBookId={book.id}
        title="Recently Viewed Volumes"
      />

    </div>
  )
}
