import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
  showCount?: boolean
}

export default function StarRating({
  rating,
  reviewCount,
  size = 'sm',
  showCount = true,
}: StarRatingProps) {
  const iconClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.4 && rating % 1 <= 0.8
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0))

  return (
    <div
      className="inline-flex items-center gap-1.5"
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5 stars ${reviewCount !== undefined ? `based on ${reviewCount} reviews` : ''}`}
    >
      <div className="flex items-center text-amber-500" aria-hidden="true">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`${iconClass} fill-amber-500`} />
        ))}
        {hasHalfStar && <StarHalf className={`${iconClass} fill-amber-500`} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${iconClass} text-warm-300 stroke-1`} />
        ))}
      </div>

      <span className="text-xs font-semibold text-espresso-800" aria-hidden="true">
        {rating.toFixed(1)}
      </span>

      {showCount && reviewCount !== undefined && (
        <span className="text-[11px] text-espresso-500 font-medium" aria-hidden="true">
          ({reviewCount})
        </span>
      )}
    </div>
  )
}
