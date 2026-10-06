import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  quantity: number
  min?: number
  max?: number
  onChange: (quantity: number) => void
  disabled?: boolean
  size?: 'sm' | 'md'
  inputId?: string
}

export default function QuantitySelector({
  quantity,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  size = 'md',
  inputId,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min && !disabled) {
      onChange(quantity - 1)
    }
  }

  const handleIncrement = () => {
    if (quantity < max && !disabled) {
      onChange(quantity + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    if (isNaN(val)) return
    const clamped = Math.min(Math.max(val, min), max)
    onChange(clamped)
  }

  const btnClass = size === 'sm' ? 'w-9 h-9 min-h-[36px] min-w-[36px]' : 'w-11 h-11 min-h-[44px] min-w-[44px]'
  const iconClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  const inputClass = size === 'sm' ? 'w-10 text-xs' : 'w-12 text-sm'

  return (
    <div className="inline-flex items-center rounded-xl border border-warm-300 bg-white shadow-2xs overflow-hidden">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        className={`${btnClass} flex items-center justify-center text-espresso-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700`}
        aria-label="Decrease quantity"
      >
        <Minus className={iconClass} />
      </button>

      <input
        id={inputId}
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        className={`${inputClass} text-center font-bold text-espresso-900 focus:outline-none border-x border-warm-200 py-1 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        aria-label={inputId ? undefined : 'Item quantity'}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        className={`${btnClass} flex items-center justify-center text-espresso-700 hover:bg-warm-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700`}
        aria-label="Increase quantity"
      >
        <Plus className={iconClass} />
      </button>
    </div>
  )
}
