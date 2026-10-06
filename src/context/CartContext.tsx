import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Book, CartItem } from '../types'
import { getStorageItem, setStorageItem } from '../utils/storage'

const CART_STORAGE_KEY = 'booknest_cart_v1'
const FREE_SHIPPING_THRESHOLD = 35.0
const STANDARD_SHIPPING_FEE = 4.99
const ESTIMATED_TAX_RATE = 0.08

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { book: Book; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { bookId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { bookId: string; quantity: number } }
  | { type: 'CLEAR_CART' }

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  shipping: number
  tax: number
  total: number
  freeShippingThreshold: number
  freeShippingRemaining: number
  hasFreeShipping: boolean
  addToCart: (book: Book, quantity?: number) => void
  removeFromCart: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { book, quantity = 1 } = action.payload
      if (book.stock <= 0) return state

      const existingIndex = state.items.findIndex((item) => item.book.id === book.id)

      if (existingIndex > -1) {
        const existingItem = state.items[existingIndex]
        const newQty = Math.min(existingItem.quantity + quantity, book.stock)

        const updatedItems = [...state.items]
        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: newQty,
        }
        return { items: updatedItems }
      }

      const initialQty = Math.min(Math.max(1, quantity), book.stock)
      return {
        items: [...state.items, { book, quantity: initialQty }],
      }
    }

    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter((item) => item.book.id !== action.payload.bookId),
      }
    }

    case 'UPDATE_QUANTITY': {
      const { bookId, quantity } = action.payload

      const updatedItems = state.items
        .map((item) => {
          if (item.book.id === bookId) {
            const clampedQty = Math.min(Math.max(1, quantity), item.book.stock)
            return { ...item, quantity: clampedQty }
          }
          return item
        })
        .filter((item) => item.quantity > 0)

      return { items: updatedItems }
    }

    case 'CLEAR_CART': {
      return { items: [] }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    return {
      items: getStorageItem<CartItem[]>(CART_STORAGE_KEY, []),
    }
  })

  // Synchronize cart state with localStorage
  useEffect(() => {
    setStorageItem(CART_STORAGE_KEY, state.items)
  }, [state.items])

  // Derived financial metrics
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = state.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0)
  const hasFreeShipping = state.items.length > 0 && subtotal >= FREE_SHIPPING_THRESHOLD
  const shipping = state.items.length === 0 || hasFreeShipping ? 0 : STANDARD_SHIPPING_FEE
  const tax = subtotal * ESTIMATED_TAX_RATE
  const total = subtotal + shipping + tax
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  const addToCart = (book: Book, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { book, quantity } })
  }

  const removeFromCart = (bookId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { bookId } })
  }

  const updateQuantity = (bookId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { bookId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const value: CartContextValue = {
    items: state.items,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    freeShippingRemaining,
    hasFreeShipping,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
