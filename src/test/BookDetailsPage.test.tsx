import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { CartProvider } from '../context/CartContext'
import BookDetailsPage from '../pages/BookDetailsPage'

describe('BookDetailsPage Component', () => {
  it('renders complete book details for a valid bookId', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books/the-shadow-of-the-wind']}>
          <Routes>
            <Route path="/books/:bookId" element={<BookDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    // Title & Author
    expect(screen.getByRole('heading', { level: 1, name: /The Shadow of the Wind/i })).toBeInTheDocument()
    expect(screen.getByText(/Carlos Ruiz Zafón/i)).toBeInTheDocument()

    // Price & Stock
    expect(screen.getByText('$18.99')).toBeInTheDocument()
    expect(screen.getByText(/In Stock/i)).toBeInTheDocument()

    // Specifications
    expect(screen.getByText('Penguin Books')).toBeInTheDocument()
    expect(screen.getByText('978-0143034902')).toBeInTheDocument()
    expect(screen.getByText('487 pages')).toBeInTheDocument()

    // Add to Cart button
    expect(screen.getByRole('button', { name: /Add 1 copies to cart/i })).toBeInTheDocument()
  })

  it('updates quantity and calculated price on button clicks', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books/the-shadow-of-the-wind']}>
          <Routes>
            <Route path="/books/:bookId" element={<BookDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    const incrementBtn = screen.getByRole('button', { name: /Increase quantity/i })
    fireEvent.click(incrementBtn)

    // Quantity increased to 2, price should be $18.99 * 2 = $37.98
    expect(screen.getByRole('button', { name: /Add 2 copies to cart/i })).toHaveTextContent('$37.98')
  })

  it('handles out-of-stock items by disabling purchase controls', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books/out-of-stock-collector-edition']}>
          <Routes>
            <Route path="/books/:bookId" element={<BookDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getAllByText(/Out of Stock/i).length).toBeGreaterThanOrEqual(1)
    const addToCartBtn = screen.getByRole('button', { name: /Book is currently out of stock/i })
    expect(addToCartBtn).toBeDisabled()
  })

  it('renders "Book Not Found" empty state on invalid book ID', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books/invalid-book-id-999']}>
          <Routes>
            <Route path="/books/:bookId" element={<BookDetailsPage />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getByRole('heading', { level: 2, name: /Book Not Found/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Browse All Books/i })).toBeInTheDocument()
  })
})
