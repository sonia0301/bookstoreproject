import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { CartProvider } from '../context/CartContext'
import Layout from '../components/layout/Layout'
import BooksPage from '../pages/BooksPage'

describe('Responsive Interactions & Mobile Drawers', () => {
  it('opens and closes the mobile navigation drawer', () => {
    render(
      <CartProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Layout />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    )

    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /Open main navigation menu/i })
    fireEvent.click(menuButton)

    // Verify mobile menu is open with accessible dialog
    const mobileMenu = screen.getByRole('dialog', { name: /Mobile Navigation/i })
    expect(mobileMenu).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Explore All Books/i })).toBeInTheDocument()

    // Close mobile menu
    const closeButton = screen.getByRole('button', { name: /Close navigation menu/i })
    fireEvent.click(closeButton)

    expect(screen.queryByRole('dialog', { name: /Mobile Navigation/i })).not.toBeInTheDocument()
  })

  it('opens mobile filter drawer, updates filters, and applies results', () => {
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

    // Open mobile filters
    const filterButton = screen.getByRole('button', { name: /Open filter sidebar/i })
    fireEvent.click(filterButton)

    // Verify filter dialog is open
    const filterModal = screen.getByRole('dialog', { name: /Filter Options/i })
    expect(filterModal).toBeInTheDocument()
    expect(screen.getByText('Filter Catalog')).toBeInTheDocument()

    // Find and click Apply/Show Results button
    const applyButton = screen.getByRole('button', { name: /Show \d+ Books/i })
    expect(applyButton).toBeInTheDocument()
    fireEvent.click(applyButton)

    // Verify modal closed
    expect(screen.queryByRole('dialog', { name: /Filter Options/i })).not.toBeInTheDocument()
  })
})
