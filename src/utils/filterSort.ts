import { Book, FilterState, SortOption } from '../types'

export const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: '',
  category: 'All',
  minPrice: 0,
  maxPrice: 150,
  minRating: 0,
  sortBy: 'popularity',
}

/**
 * Filters a list of books based on search query, category, price bounds, and rating
 */
export function filterBooks(books: Book[], filters: Partial<FilterState>): Book[] {
  const query = filters.searchQuery ? filters.searchQuery.trim().toLowerCase() : ''
  const category = filters.category && filters.category !== 'All' ? filters.category : null
  const minPrice = typeof filters.minPrice === 'number' ? filters.minPrice : 0
  const maxPrice = typeof filters.maxPrice === 'number' ? filters.maxPrice : Infinity
  const minRating = typeof filters.minRating === 'number' ? filters.minRating : 0

  return books.filter((book) => {
    // 1. Search Query Match (Title, Author, or Category)
    if (query) {
      const matchTitle = book.title.toLowerCase().includes(query)
      const matchAuthor = book.author.toLowerCase().includes(query)
      const matchCategory = book.category.toLowerCase().includes(query)
      if (!matchTitle && !matchAuthor && !matchCategory) {
        return false
      }
    }

    // 2. Category Match
    if (category && book.category !== category) {
      return false
    }

    // 3. Price Bounds Match
    if (book.price < minPrice || book.price > maxPrice) {
      return false
    }

    // 4. Rating Match
    if (book.rating < minRating) {
      return false
    }

    return true
  })
}

/**
 * Sorts a list of books according to the specified sort option
 */
export function sortBooks(books: Book[], sortBy: SortOption = 'popularity'): Book[] {
  const sorted = [...books]

  switch (sortBy) {
    case 'popularity':
      return sorted.sort((a, b) => b.popularity - a.popularity)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'newest':
      return sorted.sort((a, b) => b.publishedYear - a.publishedYear)
    default:
      return sorted
  }
}

/**
 * Combined filter and sort pipeline
 */
export function processBooks(books: Book[], filters: Partial<FilterState>): Book[] {
  const filtered = filterBooks(books, filters)
  return sortBooks(filtered, filters.sortBy || 'popularity')
}
