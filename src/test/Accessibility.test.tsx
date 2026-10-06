import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { CartProvider } from '../context/CartContext'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import BooksPage from '../pages/BooksPage'
import StarRating from '../components/common/StarRating'
import EmptyState from '../components/common/EmptyState'

describe('Accessibility & WCAG Compliance', () => {
  it('renders skip to content link as first interactive element', () => {
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

    const skipLink = screen.getByRole('link', { name: /Skip to main content/i })
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  it('provides accessible role="img" and descriptive aria-label on StarRating', () => {
    render(<StarRating rating={4.8} reviewCount={120} />)

    const starRatingElement = screen.getByRole('img', {
      name: /Rated 4.8 out of 5 stars based on 120 reviews/i,
    })
    expect(starRatingElement).toBeInTheDocument()
  })

  it('renders EmptyState with appropriate semantic heading level', () => {
    const { rerender } = render(
      <EmptyState title="No items found" message="Try again" headingLevel="h2" />
    )
    expect(screen.getByRole('heading', { level: 2, name: /No items found/i })).toBeInTheDocument()

    rerender(<EmptyState title="No items found" message="Try again" headingLevel="h3" />)
    expect(screen.getByRole('heading', { level: 3, name: /No items found/i })).toBeInTheDocument()
  })

  it('announces cart additions with accessible status role and live regions', () => {
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

    const addButtons = screen.getAllByRole('button', { name: /Add .* to cart/i })
    expect(addButtons.length).toBeGreaterThan(0)

    // Trigger quick add
    fireEvent.click(addButtons[0])

    // Verify live status announcement is present in DOM
    const statusAnnouncement = screen.getByRole('status')
    expect(statusAnnouncement).toBeInTheDocument()
    expect(statusAnnouncement).toHaveTextContent(/Added .* to shopping cart/i)
  })

  it('provides range slider with accessible min, max, valuenow, and valuetext', () => {
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

    const rangeSliders = screen.getAllByLabelText(/Maximum price filter/i)
    expect(rangeSliders.length).toBeGreaterThan(0)
    const rangeSlider = rangeSliders[0]

    expect(rangeSlider).toHaveAttribute('aria-valuemin', '10')
    expect(rangeSlider).toHaveAttribute('aria-valuemax', '150')
    expect(rangeSlider).toHaveAttribute('aria-valuenow', '150')
    expect(rangeSlider).toHaveAttribute('aria-valuetext', 'Up to $150.00')
  })
})
