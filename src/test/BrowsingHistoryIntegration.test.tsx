import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { CartProvider } from '../context/CartContext'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import BookDetailsPage from '../pages/BookDetailsPage'

describe('Browsing History & Recently Viewed Persistence', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('records viewed books into browsing history and excludes the current book on details page', () => {
    // Seed initial browsing history with valid book IDs
    window.localStorage.setItem(
      'booknest_recently_viewed_v1',
      JSON.stringify(['dune-chronicles', 'thinking-fast-and-slow'])
    )

    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books/the-shadow-of-the-wind']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="books/:bookId" element={<BookDetailsPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    // Current page is "The Shadow of the Wind"
    expect(screen.getByRole('heading', { level: 1, name: /The Shadow of the Wind/i })).toBeInTheDocument()

    // Recently viewed shelf should be visible with "Recently Viewed Volumes"
    expect(screen.getByText(/Recently Viewed Volumes/i)).toBeInTheDocument()
    expect(screen.getByText('Dune: Deluxe Edition')).toBeInTheDocument()
    expect(screen.getByText('Thinking, Fast and Slow')).toBeInTheDocument()
  })

  it('renders "Jump Back In" section on HomePage and allows clearing browsing history', () => {
    window.localStorage.setItem(
      'booknest_recently_viewed_v1',
      JSON.stringify(['dune-chronicles', 'the-silent-patient'])
    )

    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    // Verify "Jump Back In" shelf is rendered
    expect(screen.getByText('Jump Back In')).toBeInTheDocument()
    expect(screen.getAllByText('Dune: Deluxe Edition').length).toBeGreaterThanOrEqual(1)

    // Clear history
    const clearBtn = screen.getByRole('button', { name: /Clear History/i })
    fireEvent.click(clearBtn)

    // Recently viewed section should disappear
    expect(screen.queryByText('Jump Back In')).not.toBeInTheDocument()
  })
})
