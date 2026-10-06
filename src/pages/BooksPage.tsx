import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, RotateCcw, BookOpen } from 'lucide-react'
import { BOOKS_DATA } from '../data/books'
import { FilterState, SortOption } from '../types'
import { processBooks } from '../utils/filterSort'
import FilterSidebar from '../components/books/FilterSidebar'
import SortDropdown from '../components/books/SortDropdown'
import BookGrid from '../components/books/BookGrid'
import EmptyState from '../components/common/EmptyState'

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Initialize filter state from URL Search Params
  const filters: FilterState = useMemo(() => {
    return {
      searchQuery: searchParams.get('search') || '',
      category: searchParams.get('category') || 'All',
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 150,
      minRating: Number(searchParams.get('minRating')) || 0,
      sortBy: (searchParams.get('sort') as SortOption) || 'popularity',
    }
  }, [searchParams])

  // Synchronize state changes to URL
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setSearchParams((prev) => {
      const current: FilterState = {
        searchQuery: prev.get('search') || '',
        category: prev.get('category') || 'All',
        minPrice: Number(prev.get('minPrice')) || 0,
        maxPrice: Number(prev.get('maxPrice')) || 150,
        minRating: Number(prev.get('minRating')) || 0,
        sortBy: (prev.get('sort') as FilterState['sortBy']) || 'popularity',
      }
      const updated = { ...current, ...newFilters }
      const params = new URLSearchParams()

      if (updated.searchQuery.trim()) params.set('search', updated.searchQuery.trim())
      if (updated.category && updated.category !== 'All') params.set('category', updated.category)
      if (updated.maxPrice < 150) params.set('maxPrice', updated.maxPrice.toString())
      if (updated.minRating > 0) params.set('minRating', updated.minRating.toString())
      if (updated.sortBy !== 'popularity') params.set('sort', updated.sortBy)

      return params
    }, { replace: true })
  }, [setSearchParams])

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  // Calculate dynamic category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    BOOKS_DATA.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1
    })
    return counts
  }, [])

  // Process filtered and sorted books
  const processedBooks = useMemo(() => {
    return processBooks(BOOKS_DATA, filters)
  }, [filters])

  // Count active non-default filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.searchQuery) count++
    if (filters.category !== 'All') count++
    if (filters.maxPrice < 150) count++
    if (filters.minRating > 0) count++
    return count
  }, [filters])

  // Close mobile filter modal on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileFilterOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="py-6 sm:py-10 space-y-8">
      
      {/* 1. Header & Live Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-warm-200">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-espresso-900 tracking-tight">
              All Books
            </h1>
            <p className="text-sm sm:text-base text-espresso-600 mt-1">
              Explore our curated library of {BOOKS_DATA.length} extraordinary volumes across genres.
            </p>
          </div>

          {/* Catalog Search Input */}
          <div className="w-full md:w-80 relative">
            <label htmlFor="catalog-search" className="sr-only">Search by title, author, or category</label>
            <input
              id="catalog-search"
              type="search"
              value={filters.searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
              placeholder="Search title, author, category..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-warm-300 bg-white text-sm text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-amber-700 shadow-2xs"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-espresso-400" aria-hidden="true" />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => updateFilters({ searchQuery: '' })}
                className="absolute right-2.5 top-2.5 p-1 rounded-md text-espresso-400 hover:text-espresso-700"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Controls Bar (Result count, Active filters, Mobile toggle, Sort) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-warm-100/70 p-4 rounded-xl border border-warm-200/80">
          
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-warm-300 text-xs sm:text-sm font-semibold text-espresso-800 shadow-2xs hover:bg-warm-50 focus-visible:ring-2 focus-visible:ring-amber-700"
              aria-label="Open filter sidebar"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-700" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Result Count Text */}
            <p className="text-xs sm:text-sm font-medium text-espresso-700" aria-live="polite">
              Showing <span className="font-bold text-espresso-900">{processedBooks.length}</span> of {BOOKS_DATA.length} books
            </p>
          </div>

          {/* Sort Dropdown */}
          <SortDropdown
            value={filters.sortBy}
            onChange={(val) => updateFilters({ sortBy: val })}
          />
        </div>

        {/* 3. Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1" aria-label="Active filters">
            <span className="text-xs font-semibold text-espresso-500 uppercase tracking-wider mr-1">
              Active:
            </span>

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 min-h-[32px] rounded-full bg-amber-100 text-amber-900 text-xs font-medium border border-amber-200">
                <span>Search: "{filters.searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => updateFilters({ searchQuery: '' })}
                  className="p-1 hover:text-amber-950 hover:bg-amber-200/60 focus-visible:ring-1 focus-visible:ring-amber-700 rounded-full"
                  aria-label={`Remove search filter "${filters.searchQuery}"`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 min-h-[32px] rounded-full bg-amber-100 text-amber-900 text-xs font-medium border border-amber-200">
                <span>Category: {filters.category}</span>
                <button
                  type="button"
                  onClick={() => updateFilters({ category: 'All' })}
                  className="p-1 hover:text-amber-950 hover:bg-amber-200/60 focus-visible:ring-1 focus-visible:ring-amber-700 rounded-full"
                  aria-label={`Remove category filter "${filters.category}"`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.maxPrice < 150 && (
              <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 min-h-[32px] rounded-full bg-amber-100 text-amber-900 text-xs font-medium border border-amber-200">
                <span>Under ${filters.maxPrice}</span>
                <button
                  type="button"
                  onClick={() => updateFilters({ maxPrice: 150 })}
                  className="p-1 hover:text-amber-950 hover:bg-amber-200/60 focus-visible:ring-1 focus-visible:ring-amber-700 rounded-full"
                  aria-label="Remove max price filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 min-h-[32px] rounded-full bg-amber-100 text-amber-900 text-xs font-medium border border-amber-200">
                <span>★ {filters.minRating}+</span>
                <button
                  type="button"
                  onClick={() => updateFilters({ minRating: 0 })}
                  className="p-1 hover:text-amber-950 hover:bg-amber-200/60 focus-visible:ring-1 focus-visible:ring-amber-700 rounded-full"
                  aria-label="Remove minimum rating filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-amber-800 font-semibold hover:underline px-2 py-1 min-h-[32px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Main Body: Filter Sidebar + Book Grid */}
      <div className="flex gap-8 items-start">
        
        {/* Desktop Sidebar */}
        <FilterSidebar
          filters={filters}
          categoryCounts={categoryCounts}
          totalBooksCount={BOOKS_DATA.length}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
        />

        {/* Mobile Filter Modal — only mounted when open */}
        {isMobileFilterOpen && (
          <FilterSidebar
            filters={filters}
            categoryCounts={categoryCounts}
            totalBooksCount={BOOKS_DATA.length}
            matchingBooksCount={processedBooks.length}
            onFilterChange={updateFilters}
            onResetFilters={resetFilters}
            isMobileModal={true}
            onCloseMobileModal={() => setIsMobileFilterOpen(false)}
          />
        )}

        {/* Books Content Area */}
        <div className="flex-1 min-w-0">
          {processedBooks.length > 0 ? (
            <BookGrid books={processedBooks} layout="catalog" />
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No books match your criteria"
              message="Try adjusting your search terms, broadening your category filter, or resetting price limits."
              actionLabel="Reset All Filters"
              onAction={resetFilters}
            />
          )}
        </div>

      </div>

    </div>
  )
}
