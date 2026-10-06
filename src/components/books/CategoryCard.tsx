import { Link } from 'react-router-dom'
import {
  BookOpen,
  Compass,
  Sparkles,
  Globe,
  Briefcase,
  Palette,
  Feather,
  UserCheck,
  ArrowRight,
  LucideIcon
} from 'lucide-react'
import { CategoryMeta } from '../../types'

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Compass,
  Sparkles,
  Globe,
  Briefcase,
  Palette,
  Feather,
  UserCheck,
}

interface CategoryCardProps {
  category: CategoryMeta
  count?: number
}

export default function CategoryCard({ category, count }: CategoryCardProps) {
  const IconComponent = iconMap[category.iconName] || BookOpen

  return (
    <Link
      to={`/books?category=${encodeURIComponent(category.name)}`}
      aria-label={`Explore ${category.name} books (${count ?? 0} titles)`}
      className="group relative h-full flex flex-col justify-between p-6 rounded-2xl bg-white border border-warm-200 hover:border-amber-400/80 hover:shadow-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
    >
      <div className="space-y-4">
        {/* Icon & Count Badge */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-warm-100 group-hover:bg-amber-100 text-espresso-700 group-hover:text-amber-800 flex items-center justify-center transition-colors">
            <IconComponent className="w-6 h-6" />
          </div>
          {count !== undefined && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-warm-100 text-espresso-600 group-hover:bg-amber-50 group-hover:text-amber-800 transition-colors">
              {count} {count === 1 ? 'title' : 'titles'}
            </span>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="font-serif font-bold text-lg text-espresso-900 group-hover:text-amber-800 transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-espresso-600 mt-1.5 leading-relaxed line-clamp-2">
            {category.description}
          </p>
        </div>
      </div>

      {/* Footer Arrow */}
      <div className="pt-4 mt-4 border-t border-warm-100 flex items-center text-xs font-semibold text-amber-700 group-hover:text-amber-800">
        <span>Explore Category</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
