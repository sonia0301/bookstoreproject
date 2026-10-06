import { useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { X, BookOpen, ShoppingBag, Home, Search, Compass } from 'lucide-react'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  cartCount: number
}

export default function MobileNav({ isOpen, onClose, cartCount }: MobileNavProps) {
  const navigate = useNavigate()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Focus trap and keyboard navigation management
  useEffect(() => {
    if (!isOpen) return

    // Set initial focus to close button
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 50)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('q') as string
    if (query?.trim()) {
      navigate(`/books?search=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  return (
    <div id="mobile-menu" className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div ref={drawerRef} className="fixed inset-y-0 right-0 w-full max-w-xs bg-warm-50 shadow-2xl p-6 flex flex-col justify-between border-l border-warm-200 animate-in slide-in-from-right duration-200">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-warm-200">
            <div className="flex items-center gap-2 text-amber-800 font-serif font-bold text-xl">
              <BookOpen className="w-5 h-5" />
              <span>BookNest</span>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-espresso-600 hover:text-espresso-900 hover:bg-warm-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <label htmlFor="mobile-search" className="sr-only">Search books</label>
            <input
              id="mobile-search"
              name="q"
              type="search"
              placeholder="Search title, author, genre..."
              className="w-full pl-9 pr-4 py-3 min-h-[44px] rounded-xl border border-warm-300 bg-white text-sm text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-espresso-400" aria-hidden="true" />
          </form>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2" aria-label="Mobile Menu Links">
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-espresso-700 hover:bg-warm-100 hover:text-espresso-900'
                }`
              }
            >
              <Home className="w-4 h-4" />
              Home
            </NavLink>

            <NavLink
              to="/books"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-espresso-700 hover:bg-warm-100 hover:text-espresso-900'
                }`
              }
            >
              <Compass className="w-4 h-4" />
              Explore All Books
            </NavLink>

            <NavLink
              to="/cart"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-espresso-700 hover:bg-warm-100 hover:text-espresso-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                Shopping Cart
              </div>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-700 text-white">
                  {cartCount}
                </span>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-warm-200 text-xs text-espresso-500">
          <p className="font-serif font-semibold text-espresso-700">BookNest Bookstore</p>
          <p className="mt-1">Handpicked literature delivered to your door.</p>
        </div>
      </div>
    </div>
  )
}
