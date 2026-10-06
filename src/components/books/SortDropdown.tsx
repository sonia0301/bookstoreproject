import { ArrowUpDown } from 'lucide-react'
import { SortOption } from '../../types'

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Releases' },
]

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-books-select" className="text-xs font-semibold text-espresso-700 whitespace-nowrap flex items-center gap-1.5">
        <ArrowUpDown className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
        <span>Sort by:</span>
      </label>

      <div className="relative">
        <select
          id="sort-books-select"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="appearance-none pl-3.5 pr-8 py-2.5 min-h-[44px] rounded-xl bg-white border border-warm-300 text-xs sm:text-sm font-medium text-espresso-800 shadow-2xs hover:border-warm-400 focus:outline-none focus:ring-2 focus:ring-amber-700 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Dropdown chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-espresso-500">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
