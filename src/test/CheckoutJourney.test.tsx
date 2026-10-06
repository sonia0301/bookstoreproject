import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CartProvider } from '../context/CartContext'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import BooksPage from '../pages/BooksPage'
import BookDetailsPage from '../pages/BookDetailsPage'
import CartPage from '../pages/CartPage'

describe('End-to-End Checkout Journey Integration', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useRealTimers()
  })

  it('completes a full discovery to checkout flow with promo code discount', async () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="books" element={<BooksPage />} />
              <Route path="books/:bookId" element={<BookDetailsPage />} />
              <Route path="cart" element={<CartPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    // 1. Discover books from homepage
    expect(screen.getByRole('heading', { level: 1, name: /Stories that resonate. Ideas that endure./i })).toBeInTheDocument()

    // 2. Add a featured book to cart from home
    const quickAddButtons = screen.getAllByRole('button', { name: /Add .* to cart/i })
    fireEvent.click(quickAddButtons[0])

    // Verify navbar cart badge updates
    expect(screen.getAllByLabelText(/Shopping cart with 1 items/i).length).toBeGreaterThan(0)

    // 3. Navigate to Cart page by clicking the cart link
    const cartLink = screen.getAllByLabelText(/Shopping cart with 1 items/i)[0]
    fireEvent.click(cartLink)

    // 4. Verify on Cart page and check order summary
    expect(screen.getByRole('heading', { level: 1, name: /Your Shopping Cart/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Order Summary/i })).toBeInTheDocument()

    // 5. Apply valid promo code
    const promoInput = screen.getByPlaceholderText(/Promo code/i)
    fireEvent.change(promoInput, { target: { value: 'BOOKNEST10' } })
    fireEvent.click(screen.getByRole('button', { name: /Apply/i }))

    expect(screen.getByText(/Promo code applied successfully!/i)).toBeInTheDocument()
    expect(screen.getByText(/Special Curator Discount \(10%\)/i)).toBeInTheDocument()

    // 6. Complete checkout
    vi.useFakeTimers()
    const checkoutBtn = screen.getByRole('button', { name: /Proceed to Checkout/i })
    fireEvent.click(checkoutBtn)

    expect(screen.getByText(/Securing Transaction.../i)).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.getByText(/Order Placed Successfully!/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Continue Browsing/i })).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('dynamically calculates free shipping threshold when items cross $35 limit', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/books']}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="books" element={<BooksPage />} />
              <Route path="cart" element={<CartPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    // Find and add a single book priced under $35
    const addButtons = screen.getAllByRole('button', { name: /Add .* to cart/i })
    fireEvent.click(addButtons[0])

    // Go to Cart
    const cartLink = screen.getAllByLabelText(/Shopping cart with 1 items/i)[0]
    fireEvent.click(cartLink)

    // Verify subtotal under $35 includes shipping fee and remaining amount text
    expect(screen.getByText(/Estimated Shipping/i)).toBeInTheDocument()
    expect(screen.getByText(/for free shipping/i)).toBeInTheDocument()

    // Increase quantity using the plus button to exceed $35
    const increaseBtn = screen.getByRole('button', { name: /Increase quantity/i })
    fireEvent.click(increaseBtn)
    fireEvent.click(increaseBtn) // 3 copies will exceed $35

    // Verify free shipping unlocked
    expect(screen.getByText(/Free Standard Shipping Unlocked!/i)).toBeInTheDocument()
  })
})
