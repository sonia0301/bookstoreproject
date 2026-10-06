import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getRecentlyViewedIds,
  recordRecentlyViewedId,
  resolveRecentlyViewedBooks,
  clearRecentlyViewedHistory,
  RECENTLY_VIEWED_KEY,
} from '../utils/recentlyViewed'
import RecentlyViewedShelf from '../components/books/RecentlyViewedShelf'
import { BOOKS_DATA } from '../data/books'
import { CartProvider } from '../context/CartContext'

describe('Recently Viewed Functionality & Storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('records viewed books without duplicates and keeps most recent first', () => {
    recordRecentlyViewedId('the-shadow-of-the-wind')
    recordRecentlyViewedId('thinking-fast-and-slow')
    
    // Viewing the first book again should move it to the front
    recordRecentlyViewedId('the-shadow-of-the-wind')

    const ids = getRecentlyViewedIds()
    expect(ids).toEqual(['the-shadow-of-the-wind', 'thinking-fast-and-slow'])
    expect(ids).toHaveLength(2)
  })

  it('caps the recently viewed list at a maximum of 4 items', () => {
    recordRecentlyViewedId('b1')
    recordRecentlyViewedId('b2')
    recordRecentlyViewedId('b3')
    recordRecentlyViewedId('b4')
    recordRecentlyViewedId('b5') // 5th book should displace the oldest ('b1')

    const ids = getRecentlyViewedIds()
    expect(ids).toHaveLength(4)
    expect(ids).toEqual(['b5', 'b4', 'b3', 'b2'])
  })

  it('persists data to localStorage and retrieves accurately', () => {
    recordRecentlyViewedId('dune-chronicles')
    
    const storedRaw = window.localStorage.getItem(RECENTLY_VIEWED_KEY)
    expect(storedRaw).toBe(JSON.stringify(['dune-chronicles']))

    const retrievedIds = getRecentlyViewedIds()
    expect(retrievedIds).toContain('dune-chronicles')
  })

  it('gracefully handles corrupted or malformed localStorage data', () => {
    // Malformed JSON string
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, 'invalid-json{{{')
    expect(getRecentlyViewedIds()).toEqual([])

    // Non-array object
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify({ someKey: 'someValue' }))
    expect(getRecentlyViewedIds()).toEqual([])

    // Array containing non-string primitives
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify([123, null, 'the-shadow-of-the-wind']))
    expect(getRecentlyViewedIds()).toEqual(['the-shadow-of-the-wind'])
  })

  it('resolves valid book objects from catalog and skips nonexistent book IDs', () => {
    const mixedIds = ['the-shadow-of-the-wind', 'non-existent-book-id', 'thinking-fast-and-slow']
    const resolved = resolveRecentlyViewedBooks(BOOKS_DATA, mixedIds)

    expect(resolved).toHaveLength(2)
    expect(resolved[0].id).toBe('the-shadow-of-the-wind')
    expect(resolved[1].id).toBe('thinking-fast-and-slow')
  })

  it('renders RecentlyViewedShelf component and clears history when requested', () => {
    const mockBooks = [BOOKS_DATA[0], BOOKS_DATA[1]]
    let cleared = false

    const { rerender } = render(
      <CartProvider>
        <MemoryRouter>
          <RecentlyViewedShelf
            books={mockBooks}
            onClear={() => {
              clearRecentlyViewedHistory()
              cleared = true
            }}
          />
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getByRole('heading', { level: 2, name: /Recently Viewed/i })).toBeInTheDocument()
    expect(screen.getByText('The Shadow of the Wind')).toBeInTheDocument()

    const clearBtn = screen.getByRole('button', { name: /Clear History/i })
    fireEvent.click(clearBtn)
    expect(cleared).toBe(true)

    // When empty, component returns null
    rerender(
      <CartProvider>
        <MemoryRouter>
          <RecentlyViewedShelf books={[]} />
        </MemoryRouter>
      </CartProvider>
    )
    expect(screen.queryByRole('heading', { level: 2, name: /Recently Viewed/i })).not.toBeInTheDocument()
  })
})
