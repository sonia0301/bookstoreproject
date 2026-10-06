import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import QuantitySelector from '../components/common/QuantitySelector'

describe('QuantitySelector Component', () => {
  it('renders initial quantity and clamps decrement at minimum', () => {
    const handleChange = vi.fn()

    render(
      <QuantitySelector
        quantity={1}
        min={1}
        max={10}
        onChange={handleChange}
      />
    )

    const decrementBtn = screen.getByRole('button', { name: /Decrease quantity/i })
    expect(decrementBtn).toBeDisabled()

    const incrementBtn = screen.getByRole('button', { name: /Increase quantity/i })
    expect(incrementBtn).not.toBeDisabled()

    fireEvent.click(incrementBtn)
    expect(handleChange).toHaveBeenCalledWith(2)
  })

  it('clamps increment at maximum stock', () => {
    const handleChange = vi.fn()

    render(
      <QuantitySelector
        quantity={5}
        min={1}
        max={5}
        onChange={handleChange}
      />
    )

    const incrementBtn = screen.getByRole('button', { name: /Increase quantity/i })
    expect(incrementBtn).toBeDisabled()
  })

  it('disables all controls when disabled prop is true', () => {
    render(
      <QuantitySelector
        quantity={1}
        min={1}
        max={5}
        onChange={vi.fn()}
        disabled={true}
      />
    )

    expect(screen.getByRole('button', { name: /Decrease quantity/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Increase quantity/i })).toBeDisabled()
    expect(screen.getByRole('spinbutton', { name: /Item quantity/i })).toBeDisabled()
  })
})
