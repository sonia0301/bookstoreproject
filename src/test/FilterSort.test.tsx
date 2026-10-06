import { describe, it, expect } from 'vitest'
import { filterBooks, sortBooks, processBooks } from '../utils/filterSort'
import { Book } from '../types'

const testBooks: Book[] = [
  {
    id: 'b1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    price: 15.00,
    rating: 4.6,
    reviewCount: 300,
    description: 'A classic 1920s novel.',
    coverImage: '',
    popularity: 80,
    stock: 5,
    publishedYear: 1925,
    pages: 180,
    isbn: '111',
    language: 'English',
    publisher: 'Scribner',
  },
  {
    id: 'b2',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Non-Fiction',
    price: 22.00,
    rating: 4.9,
    reviewCount: 900,
    description: 'Cognitive psychology masterpiece.',
    coverImage: '',
    popularity: 95,
    stock: 12,
    publishedYear: 2011,
    pages: 499,
    isbn: '222',
    language: 'English',
    publisher: 'FSG',
  },
  {
    id: 'b3',
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Sci-Fi & Fantasy',
    price: 10.00,
    rating: 4.8,
    reviewCount: 1500,
    description: 'Sci-fi classic on Arrakis.',
    coverImage: '',
    popularity: 99,
    stock: 8,
    publishedYear: 1965,
    pages: 600,
    isbn: '333',
    language: 'English',
    publisher: 'Chilton',
  },
  {
    id: 'b4',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Business & Tech',
    price: 45.00,
    rating: 4.5,
    reviewCount: 400,
    description: 'Software craftsmanship handbook.',
    coverImage: '',
    popularity: 70,
    stock: 6,
    publishedYear: 2008,
    pages: 464,
    isbn: '444',
    language: 'English',
    publisher: 'Prentice Hall',
  },
]

describe('Filter and Sort Utilities', () => {
  // Search tests
  it('searches by title case-insensitively', () => {
    const results = filterBooks(testBooks, { searchQuery: 'gaTSby' })
    expect(results).toHaveLength(1)
    expect(results[0].title).toBe('The Great Gatsby')
  })

  it('searches by author case-insensitively', () => {
    const results = filterBooks(testBooks, { searchQuery: 'kahneman' })
    expect(results).toHaveLength(1)
    expect(results[0].author).toBe('Daniel Kahneman')
  })

  it('searches by category name', () => {
    const results = filterBooks(testBooks, { searchQuery: 'sci-fi' })
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('b3')
  })

  // Category filter tests
  it('filters by category accurately', () => {
    const results = filterBooks(testBooks, { category: 'Non-Fiction' })
    expect(results).toHaveLength(1)
    expect(results[0].title).toBe('Thinking, Fast and Slow')
  })

  it('returns all books when category is "All"', () => {
    const results = filterBooks(testBooks, { category: 'All' })
    expect(results).toHaveLength(4)
  })

  // Price filter tests
  it('filters by maximum price', () => {
    const results = filterBooks(testBooks, { maxPrice: 20.00 })
    expect(results).toHaveLength(2) // $15 and $10
    expect(results.map((b) => b.id)).toEqual(['b1', 'b3'])
  })

  // Rating filter tests
  it('filters by minimum rating', () => {
    const results = filterBooks(testBooks, { minRating: 4.8 })
    expect(results).toHaveLength(2) // 4.9 and 4.8
    expect(results.map((b) => b.id)).toEqual(['b2', 'b3'])
  })

  // Sorting tests
  it('sorts by popularity descending by default', () => {
    const results = sortBooks(testBooks, 'popularity')
    expect(results.map((b) => b.id)).toEqual(['b3', 'b2', 'b1', 'b4']) // 99, 95, 80, 70
  })

  it('sorts by rating descending', () => {
    const results = sortBooks(testBooks, 'rating')
    expect(results[0].id).toBe('b2') // 4.9
    expect(results[1].id).toBe('b3') // 4.8
  })

  it('sorts by price ascending', () => {
    const results = sortBooks(testBooks, 'price-asc')
    expect(results.map((b) => b.price)).toEqual([10.00, 15.00, 22.00, 45.00])
  })

  it('sorts by price descending', () => {
    const results = sortBooks(testBooks, 'price-desc')
    expect(results.map((b) => b.price)).toEqual([45.00, 22.00, 15.00, 10.00])
  })

  // Combined pipeline test
  it('processes combined search, category, price, and sorting pipeline', () => {
    const results = processBooks(testBooks, {
      searchQuery: 'a', // Matches Gatsby, Kahneman, Clean
      category: 'Non-Fiction',
      maxPrice: 30,
      minRating: 4.5,
      sortBy: 'rating',
    })

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('b2')
  })

  it('returns empty array when no books match the filters', () => {
    const results = processBooks(testBooks, {
      searchQuery: 'nonexistent-query-xyz',
    })
    expect(results).toHaveLength(0)
  })
})
