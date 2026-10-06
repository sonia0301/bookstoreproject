import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface SectionHeaderProps {
  badge?: string
  title: string
  subtitle?: string
  viewAllLink?: string
  viewAllText?: string
  align?: 'left' | 'center'
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'View All',
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 ${align === 'center' ? 'text-center md:text-left' : ''}`}>
      <div className="space-y-2 max-w-2xl">
        {badge && (
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold tracking-wider uppercase">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-espresso-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-espresso-600 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 rounded p-1"
        >
          <span>{viewAllText}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
