import { LucideIcon, Search, RotateCcw } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
  headingLevel?: 'h2' | 'h3'
}

export default function EmptyState({
  icon: Icon = Search,
  title,
  message,
  actionLabel,
  onAction,
  headingLevel = 'h2',
}: EmptyStateProps) {
  const HeadingTag = headingLevel

  return (
    <div className="py-16 px-6 text-center bg-white rounded-2xl border border-warm-200 shadow-xs max-w-lg mx-auto my-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warm-100 text-espresso-600 mb-4">
        <Icon className="w-8 h-8 text-amber-700" aria-hidden="true" />
      </div>

      <HeadingTag className="text-xl font-serif font-bold text-espresso-900 mb-2">
        {title}
      </HeadingTag>

      <p className="text-sm text-espresso-600 max-w-sm mx-auto leading-relaxed mb-6">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}
