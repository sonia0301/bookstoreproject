import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { CartProvider } from '../context/CartContext'
import BookCard from '../components/books/BookCard'
import { Book } from '../types'

const mockBook: Book = {
  id: 'test-book-1',
  title: 'Test Book Title',
  author: 'Test Author',
  category: 'Fiction',
  price: 19.99,
  originalPrice: 24.99,
  rating: 4.8,
  reviewCount: 150,
  description: 'A test book description snippet.',
  coverImage: 'https://example.com/cover.jpg',
  popularity: 90,
  stock: 10,
  isFeatured: true,
  isBestSeller: true,
  publishedYear: 2023,
  pages: 350,
  isbn: '978-1234567890',
  language: 'English',
  publisher: 'Test Press',
}

describe('BookCard Component', () => {
  it('renders book metadata properly', () => {
    render(
      <CartProvider>
        <MemoryRouter>
          <BookCard book={mockBook} />
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getByText('Test Book Title')).toBeInTheDocument()
    expect(screen.getByText(/by Test Author/i)).toBeInTheDocument()
    expect(screen.getByText('$19.99')).toBeInTheDocument()
    expect(screen.getByText('$24.99')).toBeInTheDocument()
    expect(screen.getByText('Bestseller')).toBeInTheDocument()
    expect(screen.getByText('-20%')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Cover of Test Book Title by Test Author/i })).toBeInTheDocument()
  })

  it('handles quick add to cart callback', () => {
    const handleAddToCart = vi.fn()

    render(
      <CartProvider>
        <MemoryRouter>
          <BookCard book={mockBook} onAddToCart={handleAddToCart} />
        </MemoryRouter>
      </CartProvider>
    )

    const addButton = screen.getByRole('button', { name: /Add Test Book Title to cart/i })
    fireEvent.click(addButton)

    expect(handleAddToCart).toHaveBeenCalledTimes(1)
    expect(handleAddToCart).toHaveBeenCalledWith(mockBook)
  })

  it('disables add button when book is out of stock', () => {
    const outOfStockBook: Book = { ...mockBook, stock: 0 }

    render(
      <CartProvider>
        <MemoryRouter>
          <BookCard book={outOfStockBook} onAddToCart={vi.fn()} />
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    const button = screen.getByRole('button', { name: /Test Book Title is out of stock/i })
    expect(button).toBeDisabled()
  })
})
