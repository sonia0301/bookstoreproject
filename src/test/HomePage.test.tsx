import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { CartProvider } from '../context/CartContext'
import HomePage from '../pages/HomePage'

describe('HomePage Component', () => {
  it('renders all required homepage sections', () => {
    render(
      <CartProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </CartProvider>
    )

    // Hero Section
    expect(screen.getByRole('heading', { level: 1, name: /Stories that resonate. Ideas that endure./i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Explore Full Catalog/i })).toBeInTheDocument()

    // Featured Section
    expect(screen.getByRole('heading', { level: 2, name: /Featured Books/i })).toBeInTheDocument()

    // Categories Section
    expect(screen.getByRole('heading', { level: 2, name: /Browse by Category/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Fiction' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Non-Fiction' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Mystery & Thriller' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Sci-Fi & Fantasy' })).toBeInTheDocument()

    // Best Sellers Section
    expect(screen.getByRole('heading', { level: 2, name: /Bestselling Titles/i })).toBeInTheDocument()

    // Promotional Section
    expect(screen.getByRole('heading', { level: 2, name: /Curator’s Seasonal Selection: Up to 25% Off/i })).toBeInTheDocument()

    // Newsletter Section
    expect(screen.getByRole('heading', { level: 2, name: /Subscribe to The BookNest Dispatch/i })).toBeInTheDocument()
  })
})
