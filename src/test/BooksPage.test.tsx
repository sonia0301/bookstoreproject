import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { CartProvider } from '../context/CartContext'
import BooksPage from '../pages/BooksPage'

describe('BooksPage Catalog & Filter Interactions', () => {
  it('renders all books initially and displays result count', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books']}>
          <Routes>
            <Route path="/books" element={<BooksPage />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getByRole('heading', { level: 1, name: /All Books/i })).toBeInTheDocument()
    expect(screen.getByText(/Showing/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search title, author, category.../i)).toBeInTheDocument()
  })

  it('filters books dynamically when typing in search input', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books']}>
          <Routes>
            <Route path="/books" element={<BooksPage />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    const searchInput = screen.getByPlaceholderText(/Search title, author, category.../i)
    fireEvent.change(searchInput, { target: { value: 'Shadow of the Wind' } })

    expect(screen.getByText('The Shadow of the Wind')).toBeInTheDocument()
    expect(screen.queryByText('Thinking, Fast and Slow')).not.toBeInTheDocument()
  })

  it('displays empty state when search finds no results and allows resetting', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books?search=nonexistent-query-12345']}>
          <Routes>
            <Route path="/books" element={<BooksPage />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getByText(/No books match your criteria/i)).toBeInTheDocument()
    
    // Find the reset CTA in the empty state
    const resetButtons = screen.getAllByRole('button', { name: /Reset All Filters/i })
    expect(resetButtons.length).toBeGreaterThanOrEqual(1)
  })
})
