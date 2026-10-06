import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import EmptyState from '../components/common/EmptyState'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    freeShippingThreshold,
    freeShippingRemaining,
    hasFreeShipping,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  if (items.length === 0) {
    return (
      <div className="py-12 sm:py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          message="Your reading journey awaits! Explore our curated shelves to find your next unforgettable literary companion."
          actionLabel="Explore All Books"
          onAction={() => navigate('/books')}
        />
      </div>
    )
  }

  return (
    <div className="py-6 sm:py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-warm-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-espresso-900 tracking-tight">
            Your Shopping Cart
          </h1>
          <p className="text-sm sm:text-base text-espresso-600 mt-1">
            Review your {itemCount} {itemCount === 1 ? 'volume' : 'volumes'} and proceed to secure delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/books"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso-700 hover:text-amber-800 transition-colors px-3 py-2 min-h-[44px] rounded-xl hover:bg-warm-100 focus-visible:ring-2 focus-visible:ring-amber-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>

          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl border border-warm-300 text-espresso-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Items List (Left) + Order Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-3">
            {items.map((item) => (
              <CartItem
                key={item.book.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-espresso-500">
            <span>Prices are subject to standard state sales tax at checkout.</span>
            <Link
              to="/books"
              className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:underline"
            >
              <span>Add more books</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Order Summary Sticky Card */}
        <div className="lg:col-span-4 sticky top-28">
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            freeShippingThreshold={freeShippingThreshold}
            freeShippingRemaining={freeShippingRemaining}
            hasFreeShipping={hasFreeShipping}
          />
        </div>

      </div>

    </div>
  )
}
