import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, BookOpen } from 'lucide-react'
import { CartItem as CartItemType } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import QuantitySelector from '../common/QuantitySelector'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (bookId: string, quantity: number) => void
  onRemove: (bookId: string) => void
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [imageError, setImageError] = useState(false)
  const { book, quantity } = item
  const lineTotal = book.price * quantity

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-warm-200 shadow-2xs hover:border-warm-300 transition-colors">
      
      {/* Book Info (Cover + Title + Author + Price) */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link
          to={`/books/${book.id}`}
          className="relative w-16 sm:w-20 aspect-[2/3] rounded-lg overflow-hidden bg-warm-100 shrink-0 border border-warm-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          aria-label={`View ${book.title}`}
        >
          {!imageError ? (
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-warm-200 text-amber-800">
              <BookOpen className="w-6 h-6" />
            </div>
          )}
        </Link>

        <div className="space-y-1 min-w-0 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
            {book.category}
          </span>
          <h3 className="font-serif font-bold text-base text-espresso-900 truncate hover:text-amber-800">
            <Link to={`/books/${book.id}`} className="focus-visible:ring-2 focus-visible:ring-amber-700 rounded">
              {book.title}
            </Link>
          </h3>
          <p className="text-xs text-espresso-600 truncate">by {book.author}</p>
          <p className="text-xs font-semibold text-espresso-800 pt-0.5">
            {formatCurrency(book.price)} each
          </p>
        </div>
      </div>

      {/* Actions (Quantity + Line Total + Remove) */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-warm-100 shrink-0">
        
        {/* Quantity Controls */}
        <div className="flex items-center">
          <QuantitySelector
            quantity={quantity}
            min={1}
            max={book.stock}
            onChange={(newQty) => onUpdateQuantity(book.id, newQty)}
            size="sm"
          />
        </div>

        {/* Line Item Total */}
        <div className="text-right min-w-[64px] sm:min-w-[70px]">
          <span className="text-sm sm:text-base font-bold text-espresso-900 block">
            {formatCurrency(lineTotal)}
          </span>
          {quantity > 1 && (
            <span className="text-[10px] sm:text-[11px] text-espresso-600 font-medium">
              ({quantity} × {formatCurrency(book.price)})
            </span>
          )}
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(book.id)}
          className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-espresso-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          aria-label={`Remove ${book.title} from cart`}
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>

    </div>
  )
}
