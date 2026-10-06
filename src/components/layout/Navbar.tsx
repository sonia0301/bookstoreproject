import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, ShoppingBag, Search, Menu } from 'lucide-react'
import MobileNav from './MobileNav'

interface NavbarProps {
  cartCount?: number
}

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-warm-50/95 backdrop-blur-md border-b border-warm-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-espresso-900 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center shadow-sm group-hover:bg-amber-800 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl tracking-tight text-espresso-900 group-hover:text-amber-800 transition-colors">
                BookNest
              </span>
              <span className="text-[10px] uppercase tracking-widest text-espresso-500 font-semibold -mt-1">
                Curated Books
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <label htmlFor="desktop-search" className="sr-only">Search books by title, author, or genre</label>
              <input
                id="desktop-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, author, or category..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-warm-300 bg-white/80 text-sm text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all shadow-xs"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-espresso-400" aria-hidden="true" />
            </form>
          </div>

          {/* Desktop Navigation Links & Cart */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 rounded-md py-1.5 px-2.5 ${
                  isActive ? 'text-amber-800 font-semibold' : 'text-espresso-700'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/books"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 rounded-md py-1.5 px-2.5 ${
                  isActive ? 'text-amber-800 font-semibold' : 'text-espresso-700'
                }`
              }
            >
              Browse Catalog
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full border border-warm-300 bg-warm-100 hover:bg-warm-200 text-espresso-800 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 ${
                  isActive ? 'border-amber-700 text-amber-900 bg-amber-50' : ''
                }`
              }
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-700" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span
                  className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-amber-700 rounded-full"
                  aria-live="polite"
                >
                  {cartCount}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Mobile / Tablet Actions: Cart Icon & Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/cart"
              className="relative p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-espresso-700 hover:text-amber-700 hover:bg-warm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-espresso-700 hover:text-espresso-900 hover:bg-warm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Open main navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-out Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartCount={cartCount}
      />
    </header>
  )
}
