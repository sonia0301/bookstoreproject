import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center text-xs text-espresso-500 font-medium overflow-x-auto whitespace-nowrap py-1.5 scrollbar-none" aria-label="Breadcrumbs">
      <ol className="flex items-center gap-1.5 list-none p-0 m-0 min-w-0">
        <li className="flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-amber-800 transition-colors focus-visible:ring-1 focus-visible:ring-amber-700 rounded p-1 min-h-[32px]"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-espresso-400 shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span className="text-espresso-800 font-semibold truncate max-w-[150px] xs:max-w-[200px] sm:max-w-xs" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-amber-800 transition-colors focus-visible:ring-1 focus-visible:ring-amber-700 rounded p-1 min-h-[32px] flex items-center"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
