import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { CartProvider, useCart } from '../context/CartContext'
import CartPage from '../pages/CartPage'
import { Book } from '../types'

const book1: Book = {
  id: 'b1',
  title: 'Book One',
  author: 'Author A',
  category: 'Fiction',
  price: 20.00,
  rating: 4.8,
  reviewCount: 50,
  description: 'First test book',
  coverImage: '',
  popularity: 80,
  stock: 5,
  publishedYear: 2021,
  pages: 200,
  isbn: '111',
  language: 'English',
  publisher: 'Press 1',
}

const book2: Book = {
  id: 'b2',
  title: 'Book Two',
  author: 'Author B',
  category: 'Non-Fiction',
  price: 15.00,
  rating: 4.6,
  reviewCount: 40,
  description: 'Second test book',
  coverImage: '',
  popularity: 70,
  stock: 10,
  publishedYear: 2022,
  pages: 300,
  isbn: '222',
  language: 'English',
  publisher: 'Press 2',
}

// Helper test component to interact with CartContext directly
function CartTestConsumer() {
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart()

  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="subtotal">{subtotal.toFixed(2)}</div>
      <div data-testid="shipping">{shipping.toFixed(2)}</div>
      <div data-testid="tax">{tax.toFixed(2)}</div>
      <div data-testid="total">{total.toFixed(2)}</div>
      <div data-testid="items-length">{items.length}</div>

      <button onClick={() => addToCart(book1, 1)}>Add Book 1</button>
      <button onClick={() => addToCart(book2, 2)}>Add 2 of Book 2</button>
      <button onClick={() => updateQuantity('b1', 4)}>Set Book 1 Qty to 4</button>
      <button onClick={() => updateQuantity('b1', 0)}>Set Book 1 Qty to 0 (Clamped to 1)</button>
      <button onClick={() => removeFromCart('b1')}>Remove Book 1</button>
      <button onClick={() => clearCart()}>Clear All</button>
    </div>
  )
}

describe('Shopping Cart Context & Flow', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('adds one book and calculates correct subtotal, shipping, tax, and total', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add Book 1'))

    expect(screen.getByTestId('item-count')).toHaveTextContent('1')
    expect(screen.getByTestId('subtotal')).toHaveTextContent('20.00')
    // Under $35, shipping is $4.99
    expect(screen.getByTestId('shipping')).toHaveTextContent('4.99')
    // Tax is 8% of $20 = $1.60
    expect(screen.getByTestId('tax')).toHaveTextContent('1.60')
    // Total is $20 + $4.99 + $1.60 = $26.59
    expect(screen.getByTestId('total')).toHaveTextContent('26.59')
  })

  it('adds multiple distinct books and unlocks free shipping when subtotal >= $35', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    )

    // Add Book 1 ($20) + 2 copies of Book 2 ($15 each = $30) -> Subtotal = $50
    fireEvent.click(screen.getByText('Add Book 1'))
    fireEvent.click(screen.getByText('Add 2 of Book 2'))

    expect(screen.getByTestId('items-length')).toHaveTextContent('2')
    expect(screen.getByTestId('item-count')).toHaveTextContent('3')
    expect(screen.getByTestId('subtotal')).toHaveTextContent('50.00')
    // Over $35 threshold -> Shipping should be Free ($0.00)
    expect(screen.getByTestId('shipping')).toHaveTextContent('0.00')
    // Tax is 8% of $50 = $4.00
    expect(screen.getByTestId('tax')).toHaveTextContent('4.00')
    // Total is $50 + $0 + $4 = $54.00
    expect(screen.getByTestId('total')).toHaveTextContent('54.00')
  })

  it('adds the same book multiple times by incrementing quantity', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add Book 1'))
    fireEvent.click(screen.getByText('Add Book 1'))

    expect(screen.getByTestId('items-length')).toHaveTextContent('1')
    expect(screen.getByTestId('item-count')).toHaveTextContent('2')
    expect(screen.getByTestId('subtotal')).toHaveTextContent('40.00')
  })

  it('updates quantity and respects minimum bound of 1', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add Book 1'))
    fireEvent.click(screen.getByText('Set Book 1 Qty to 4'))
    expect(screen.getByTestId('item-count')).toHaveTextContent('4')

    // Decrement below 1 should clamp to 1
    fireEvent.click(screen.getByText('Set Book 1 Qty to 0 (Clamped to 1)'))
    expect(screen.getByTestId('item-count')).toHaveTextContent('1')
  })

  it('removes item from cart and cleans up totals', () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add Book 1'))
    fireEvent.click(screen.getByText('Add 2 of Book 2'))
    expect(screen.getByTestId('items-length')).toHaveTextContent('2')

    fireEvent.click(screen.getByText('Remove Book 1'))
    expect(screen.getByTestId('items-length')).toHaveTextContent('1')
    expect(screen.getByTestId('subtotal')).toHaveTextContent('30.00')
  })

  it('clears all items from cart and shows empty cart state in CartPage', () => {
    render(
      <CartProvider>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </CartProvider>
    )

    expect(screen.getByText('Your Shopping Cart is Empty')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Explore All Books/i })).toBeInTheDocument()
  })
})
