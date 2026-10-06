import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { CartProvider } from '../context/CartContext'
import Layout from '../components/layout/Layout'
import BooksPage from '../pages/BooksPage'
import BookDetailsPage from '../pages/BookDetailsPage'

describe('Product Details & Edge Case Integration', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('prevents purchase and disables quantity controls when book is out of stock', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books/out-of-stock-collector-edition']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="books/:bookId" element={<BookDetailsPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    // Verify out-of-stock badge
    expect(screen.getAllByText(/Out of Stock/i).length).toBeGreaterThanOrEqual(1)

    // Purchase button should be disabled
    const addToCartButton = screen.getByRole('button', { name: /Book is currently out of stock/i })
    expect(addToCartButton).toBeDisabled()

    // Quantity controls should be disabled
    const decrementBtn = screen.getByRole('button', { name: /Decrease quantity/i })
    const incrementBtn = screen.getByRole('button', { name: /Increase quantity/i })
    expect(decrementBtn).toBeDisabled()
    expect(incrementBtn).toBeDisabled()
  })

  it('respects maximum available inventory stock ceiling for books', () => {
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

    // The Shadow of the Wind is in stock
    expect(screen.getByText(/In Stock/i)).toBeInTheDocument()

    const incrementBtn = screen.getByRole('button', { name: /Increase quantity/i })

    // Increment quantity to 3
    fireEvent.click(incrementBtn)
    fireEvent.click(incrementBtn)

    // Price updates for 3 copies ($18.99 * 3 = $56.97)
    expect(screen.getByRole('button', { name: /Add 3 copies to cart/i })).toBeInTheDocument()
    expect(screen.getByText(/\$56\.97/)).toBeInTheDocument()
  })

  it('renders 404 EmptyState on non-existent product ID and allows return to catalog', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books/non-existent-volume-404']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="books" element={<BooksPage />} />
              <Route path="books/:bookId" element={<BookDetailsPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    // Verify EmptyState heading and message
    expect(screen.getByRole('heading', { level: 2, name: /Book Not Found/i })).toBeInTheDocument()
    expect(screen.getByText(/The literary volume you requested could not be located in our catalog/i)).toBeInTheDocument()

    // Action button to browse all books
    expect(screen.getByRole('button', { name: /Browse All Books/i })).toBeInTheDocument()
  })
})
