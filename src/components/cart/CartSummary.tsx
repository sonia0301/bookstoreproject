import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Sparkles, Truck, ArrowRight, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

interface CartSummaryProps {
  subtotal: number
  shipping: number
  tax: number
  total: number
  freeShippingThreshold: number
  freeShippingRemaining: number
  hasFreeShipping: boolean
}

export default function CartSummary({
  subtotal,
  shipping,
  tax,
  total,
  freeShippingThreshold,
  freeShippingRemaining,
  hasFreeShipping,
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (promoCode.trim()) {
      setPromoApplied(true)
    }
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    setTimeout(() => {
      setIsCheckingOut(false)
      setOrderCompleted(true)
    }, 1200)
  }

  if (orderCompleted) {
    return (
      <div className="bg-white rounded-2xl border border-warm-200 p-6 sm:p-8 space-y-4 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-bold text-xl text-espresso-900">Order Placed Successfully!</h3>
        <p className="text-xs text-espresso-600 leading-relaxed">
          Thank you for choosing BookNest. Your literary shipment is being prepared for dispatch.
        </p>
        <Link
          to="/books"
          className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-6 shadow-2xs">
      
      <h2 className="font-serif font-bold text-xl text-espresso-900 border-b border-warm-200 pb-3">
        Order Summary
      </h2>

      {/* Free Shipping Progress Indicator */}
      <div className="space-y-2 p-3.5 rounded-xl bg-warm-50 border border-warm-200/80">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1.5 text-espresso-800">
            <Truck className="w-4 h-4 text-amber-700" />
            {hasFreeShipping ? (
              <span className="font-bold text-emerald-700">Free Standard Shipping Unlocked!</span>
            ) : (
              <span>Add <strong className="text-amber-800">{formatCurrency(freeShippingRemaining)}</strong> for free shipping</span>
            )}
          </span>
          <span className="text-[11px] font-bold text-espresso-500">{progressPercent}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-warm-200 overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              hasFreeShipping ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Financial Line Items */}
      <div className="space-y-3 text-sm border-b border-warm-200 pb-4">
        <div className="flex justify-between text-espresso-600">
          <span>Subtotal</span>
          <span className="font-semibold text-espresso-900">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-espresso-600">
          <span>Estimated Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-emerald-700 uppercase text-xs font-bold">Free</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between text-espresso-600">
          <span>Estimated Sales Tax (8%)</span>
          <span className="font-semibold text-espresso-900">{formatCurrency(tax)}</span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-emerald-700 text-xs font-semibold">
            <span>Special Curator Discount (10%)</span>
            <span>-{formatCurrency(subtotal * 0.1)}</span>
          </div>
        )}
      </div>

      {/* Grand Total */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-base font-bold text-espresso-900 block">Total</span>
          <span className="text-[11px] text-espresso-600 font-medium">Includes all taxes & delivery fees</span>
        </div>
        <span className="text-2xl sm:text-3xl font-serif font-bold text-espresso-900">
          {formatCurrency(promoApplied ? Math.max(0, total - subtotal * 0.1) : total)}
        </span>
      </div>

      {/* Promo Code Input */}
      {!promoApplied ? (
        <form onSubmit={handleApplyPromo} className="flex gap-2">
          <label htmlFor="promo-input" className="sr-only">Promo Code</label>
          <input
            id="promo-input"
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promo code (e.g. BOOKNEST10)"
            className="flex-1 px-3.5 py-2.5 min-h-[44px] rounded-xl border border-warm-300 text-xs sm:text-sm placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-amber-700 uppercase"
          />
          <button
            type="submit"
            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-warm-200 hover:bg-warm-300 text-espresso-800 text-xs sm:text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-amber-700 shrink-0"
          >
            Apply
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Promo code applied successfully!</span>
        </div>
      )}

      {/* Checkout Action Button */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isCheckingOut}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-md transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 disabled:opacity-75"
      >
        <Lock className="w-4 h-4" />
        <span>{isCheckingOut ? 'Securing Transaction...' : 'Proceed to Checkout'}</span>
      </button>

      {/* Security assurances */}
      <div className="pt-2 text-center space-y-1">
        <p className="text-[11px] text-espresso-600 font-medium flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-espresso-700" aria-hidden="true" />
          <span>256-bit encrypted SSL checkout</span>
        </p>
      </div>

    </div>
  )
}
