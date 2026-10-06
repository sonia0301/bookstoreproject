import { useEffect, useRef } from 'react'
import { Star, RotateCcw, X, SlidersHorizontal } from 'lucide-react'
import { FilterState } from '../../types'
import { CATEGORIES } from '../../data/categories'
import { formatCurrency } from '../../utils/formatters'

interface FilterSidebarProps {
  filters: FilterState
  categoryCounts: Record<string, number>
  totalBooksCount: number
  matchingBooksCount?: number
  onFilterChange: (newFilters: Partial<FilterState>) => void
  onResetFilters: () => void
  isMobileModal?: boolean
  onCloseMobileModal?: () => void
}

const RATING_OPTIONS = [
  { value: 0, label: 'All Ratings' },
  { value: 4.8, label: '4.8 & above' },
  { value: 4.5, label: '4.5 & above' },
  { value: 4.0, label: '4.0 & above' },
]

export default function FilterSidebar({
  filters,
  categoryCounts,
  totalBooksCount,
  matchingBooksCount,
  onFilterChange,
  onResetFilters,
  isMobileModal = false,
  onCloseMobileModal,
}: FilterSidebarProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Focus trap and Escape key listener for mobile filter modal
  useEffect(() => {
    if (!isMobileModal) return

    const timer = setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 50)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCloseMobileModal) {
        onCloseMobileModal()
        return
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
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
  }, [isMobileModal, onCloseMobileModal])

  const filterElements = (
    <div className="space-y-6">
      <h2 className="sr-only">Catalog Filters</h2>

      {/* 1. Category Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-espresso-700">
            Categories
          </h3>
          {filters.category !== 'All' && (
            <button
              type="button"
              onClick={() => onFilterChange({ category: 'All' })}
              className="text-xs text-amber-700 hover:underline font-medium p-1 min-h-[32px] flex items-center"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1">
          {/* "All" Option */}
          <button
            type="button"
            onClick={() => onFilterChange({ category: 'All' })}
            className={`w-full flex items-center justify-between px-3 py-2.5 min-h-[40px] rounded-xl text-xs font-medium transition-colors ${
              filters.category === 'All'
                ? 'bg-amber-100/80 text-amber-900 font-bold'
                : 'text-espresso-700 hover:bg-warm-100 hover:text-espresso-900'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[11px] text-espresso-500 font-medium">({totalBooksCount})</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.name
            const count = categoryCounts[cat.name] || 0

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange({ category: cat.name })}
                className={`w-full flex items-center justify-between px-3 py-2.5 min-h-[40px] rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-amber-100/80 text-amber-900 font-bold'
                    : 'text-espresso-700 hover:bg-warm-100 hover:text-espresso-900'
                }`}
              >
                <span className="text-left">{cat.name}</span>
                <span className="text-[11px] text-espresso-500 font-medium">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Price Range Filter */}
      <div className="space-y-3 pt-5 border-t border-warm-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-espresso-700">
            Max Price
          </h3>
          <span className="text-xs font-bold text-amber-800">
            {formatCurrency(filters.maxPrice)}
          </span>
        </div>

        <input
          type="range"
          min="10"
          max="150"
          step="5"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-amber-700 cursor-pointer h-2.5 bg-warm-200 rounded-lg"
          aria-label="Maximum price filter"
          aria-valuemin={10}
          aria-valuemax={150}
          aria-valuenow={filters.maxPrice}
          aria-valuetext={`Up to ${formatCurrency(filters.maxPrice)}`}
        />

        <div className="flex justify-between text-[11px] text-espresso-600 font-medium">
          <span>$10</span>
          <span>$75</span>
          <span>$150</span>
        </div>
      </div>

      {/* 3. Rating Filter */}
      <div className="space-y-3 pt-5 border-t border-warm-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-espresso-700">
          Minimum Rating
        </h3>

        <div className="space-y-1.5">
          {RATING_OPTIONS.map((opt) => {
            const isSelected = filters.minRating === opt.value

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange({ minRating: opt.value })}
                className={`w-full flex items-center gap-2 px-3 py-2.5 min-h-[40px] rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-amber-100/80 text-amber-900 font-bold'
                    : 'text-espresso-700 hover:bg-warm-100 hover:text-espresso-900'
                }`}
              >
                {opt.value > 0 ? (
                  <>
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    <span>{opt.label}</span>
                  </>
                ) : (
                  <span>All Ratings</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Reset Filters Action (Desktop Sidebar Only) */}
      {!isMobileModal && (
        <div className="pt-5 border-t border-warm-200">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl border border-warm-300 hover:bg-warm-100 text-espresso-800 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-espresso-500" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  )

  if (isMobileModal) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filter Options">
        <div
          className="fixed inset-0 bg-espresso-950/60 backdrop-blur-sm"
          onClick={onCloseMobileModal}
          aria-hidden="true"
        />
        <div ref={modalRef} className="fixed inset-y-0 right-0 w-full max-w-xs bg-warm-50 shadow-2xl flex flex-col justify-between border-l border-warm-200 animate-in slide-in-from-right duration-200">
          {/* Fixed Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-warm-200 bg-warm-50/90 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-espresso-900 font-serif font-bold text-lg">
              <SlidersHorizontal className="w-5 h-5 text-amber-700" />
              <span>Filter Catalog</span>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onCloseMobileModal}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-espresso-600 hover:text-espresso-900 hover:bg-warm-200 focus-visible:ring-2 focus-visible:ring-amber-700"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Filter Options */}
          <div className="flex-1 overflow-y-auto p-5">
            {filterElements}
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="p-4 border-t border-warm-200 bg-white/95 backdrop-blur-sm space-y-2">
            <button
              type="button"
              onClick={onCloseMobileModal}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
            >
              <span>
                {matchingBooksCount !== undefined
                  ? `Show ${matchingBooksCount} ${matchingBooksCount === 1 ? 'Book' : 'Books'}`
                  : 'Apply Filters'}
              </span>
            </button>

            <button
              type="button"
              onClick={onResetFilters}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 min-h-[36px] text-xs font-semibold text-espresso-600 hover:text-amber-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <aside className="w-64 shrink-0 hidden lg:block" aria-label="Book catalog filters">
      <div className="sticky top-28 bg-white p-6 rounded-2xl border border-warm-200 shadow-2xs">
        {filterElements}
      </div>
    </aside>
  )
}
