import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { CartProvider } from '../context/CartContext'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import BooksPage from '../pages/BooksPage'
import BookDetailsPage from '../pages/BookDetailsPage'
import CartPage from '../pages/CartPage'
import NotFoundPage from '../pages/NotFoundPage'

describe('Application Shell & Routing', () => {
  it('renders navbar brand and home page on root route', () => {
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

    // Brand elements in navbar and footer
    const brandElements = screen.getAllByText('BookNest')
    expect(brandElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('heading', { level: 1, name: /Stories that resonate. Ideas that endure./i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Explore Full Catalog/i })).toBeInTheDocument()
  })

  it('renders books catalog page on /books', () => {
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

    expect(screen.getByRole('heading', { level: 1, name: /All Books/i })).toBeInTheDocument()
  })

  it('renders book details page on /books/:bookId', () => {
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

    expect(screen.getByRole('heading', { level: 1, name: /The Shadow of the Wind/i })).toBeInTheDocument()
  })

  it('renders shopping cart page on /cart', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/cart']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="cart" element={<CartPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getByRole('heading', { level: 2, name: /Your Shopping Cart is Empty/i })).toBeInTheDocument()
  })

  it('renders 404 Not Found page on invalid route', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/unknown-route-xyz']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getByRole('heading', { level: 1, name: /Page Not Found/i })).toBeInTheDocument()
  })
})
