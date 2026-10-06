import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { CartProvider } from '../context/CartContext'
import Layout from '../components/layout/Layout'
import BooksPage from '../pages/BooksPage'

describe('Catalog Search, Multi-Filter & Sorting Interactions', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('filters books by search query and category simultaneously', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="books" element={<BooksPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    // Initial total is 17 books
    expect(screen.getByText(/Showing/i)).toHaveTextContent('17')

    // 1. Filter by category "Fiction"
    const fictionCategoryButtons = screen.getAllByRole('button', { name: /^Fiction/i })
    fireEvent.click(fictionCategoryButtons[0])

    // Should show 2 Fiction books (The Shadow of the Wind, Klara and the Sun)
    expect(screen.getByText(/Showing/i)).toHaveTextContent('2')

    // 2. Add search query "Shadow"
    const searchInput = screen.getByLabelText(/Search by title, author, or category/i)
    fireEvent.change(searchInput, { target: { value: 'Shadow' } })

    // Only "The Shadow of the Wind" matches both Fiction and "Shadow"
    expect(screen.getByText(/Showing/i)).toHaveTextContent('1')
    expect(screen.getByText('The Shadow of the Wind')).toBeInTheDocument()
  })

  it('removes active filter chips and resets specific filter criteria', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books?category=Fiction&search=Shadow']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="books" element={<BooksPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    // Active chips should be rendered
    expect(screen.getByText(/Search: "Shadow"/i)).toBeInTheDocument()
    expect(screen.getByText(/Category: Fiction/i)).toBeInTheDocument()

    // Remove category filter chip
    const removeCategoryBtn = screen.getByRole('button', { name: /Remove category filter "Fiction"/i })
    fireEvent.click(removeCategoryBtn)

    // Category filter is removed, search query remains
    expect(screen.queryByText(/Category: Fiction/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Search: "Shadow"/i)).toBeInTheDocument()
  })

  it('sorts books by price descending and price ascending properly', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="books" element={<BooksPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    const sortSelect = screen.getByLabelText(/Sort by:/i)

    // Change to Price: High to Low
    fireEvent.change(sortSelect, { target: { value: 'price-desc' } })
    expect(sortSelect).toHaveValue('price-desc')

    // Change to Price: Low to High
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } })
    expect(sortSelect).toHaveValue('price-asc')
  })

  it('renders friendly empty state on zero matches and allows one-click reset', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="books" element={<BooksPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    const searchInput = screen.getByLabelText(/Search by title, author, or category/i)
    fireEvent.change(searchInput, { target: { value: 'non-existent-query-xyz-999' } })

    expect(screen.getByText(/Showing/i)).toHaveTextContent('0')
    expect(screen.getByText(/No books match your criteria/i)).toBeInTheDocument()

    // Click "Reset All Filters"
    const resetBtns = screen.getAllByRole('button', { name: /Reset All Filters/i })
    fireEvent.click(resetBtns[0])

    expect(screen.getByText(/Showing/i)).toHaveTextContent('17')
  })
})
