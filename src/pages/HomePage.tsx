import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  Award,
  CheckCircle2,
  Mail,
  TrendingUp,
  Bookmark
} from 'lucide-react'
import { BOOKS_DATA } from '../data/books'
import { CATEGORIES } from '../data/categories'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import SectionHeader from '../components/common/SectionHeader'
import BookGrid from '../components/books/BookGrid'
import CategoryCard from '../components/books/CategoryCard'
import RecentlyViewedShelf from '../components/books/RecentlyViewedShelf'

export default function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { recentlyViewedBooks, clearHistory } = useRecentlyViewed()

  // Memoized featured and bestselling books
  const featuredBooks = useMemo(() => {
    return BOOKS_DATA.filter((b) => b.isFeatured).slice(0, 4)
  }, [])

  const bestSellingBooks = useMemo(() => {
    return BOOKS_DATA.filter((b) => b.isBestSeller).slice(0, 4)
  }, [])

  // Calculate book count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    BOOKS_DATA.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1
    })
    return counts
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      setIsSubscribed(true)
      setNewsletterEmail('')
    }
  }

  return (
    <div className="space-y-20 py-6 sm:py-10">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-warm-100 via-warm-50 to-amber-50/80 border border-warm-200 p-8 sm:p-12 lg:p-16 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold tracking-wide uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Curated Literary Sanctuary</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-espresso-900 leading-[1.15] tracking-tight">
              Stories that resonate. Ideas that endure.
            </h1>

            <p className="text-base sm:text-lg text-espresso-600 leading-relaxed max-w-xl">
              Welcome to BookNest. Explore an exceptional collection of award-winning fiction, groundbreaking non-fiction, rare memoirs, and design masterpieces.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/books"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm sm:text-base shadow-sm transition-all hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/books?sort=popularity"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-warm-100 border border-warm-300 text-espresso-800 font-medium text-sm sm:text-base shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              >
                <TrendingUp className="w-4 h-4 text-amber-700" />
                <span>View Bestsellers</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-warm-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-espresso-700">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-medium">Free shipping $35+</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-medium">Curated editions</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-medium">Secure checkout</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Collage */}
          <div className="lg:col-span-5 relative hidden sm:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Back card */}
              <div className="absolute -top-4 -left-4 w-4/5 aspect-[2/3] rounded-2xl bg-amber-200/50 -rotate-6 border border-amber-300/60 shadow-lg transform-gpu" />
              
              {/* Main feature book card */}
              <div className="relative z-10 w-4/5 mx-auto aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/80 rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
                  alt="Featured Book: The Shadow of the Wind"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-espresso-950/90 via-espresso-950/50 to-transparent text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">Book of the Month</span>
                  <p className="font-serif font-bold text-sm leading-tight mt-0.5">The Shadow of the Wind</p>
                  <p className="text-xs text-warm-200">Carlos Ruiz Zafón</p>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-6 -right-2 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-warm-200 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                    <span>★ 4.9</span>
                    <span className="text-espresso-600 font-medium">(1,250+ reviews)</span>
                  </div>
                  <p className="text-[11px] font-medium text-espresso-700">Top-rated reader selection</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. RECENTLY VIEWED SHELF (Appears on Homepage when user has browsing history) */}
      {recentlyViewedBooks.length > 0 && (
        <RecentlyViewedShelf
          books={recentlyViewedBooks}
          onClear={clearHistory}
          title="Jump Back In"
          badge="Recently Viewed"
        />
      )}

      {/* 3. FEATURED BOOKS SECTION */}
      <section aria-labelledby="featured-heading">
        <SectionHeader
          badge="Curator's Highlights"
          title="Featured Books"
          subtitle="Hand-selected by our literary editors for their enduring impact, lyrical prose, and thoughtful insights."
          viewAllLink="/books"
          viewAllText="View All Featured"
        />
        <BookGrid books={featuredBooks} />
      </section>

      {/* 4. BROWSE BY CATEGORY SECTION */}
      <section aria-labelledby="categories-heading" className="bg-warm-100/70 rounded-3xl border border-warm-200/80 p-6 sm:p-10 lg:p-12 shadow-xs">
        <SectionHeader
          badge="Literary Horizons"
          title="Browse by Category"
          subtitle="Explore our thoughtfully classified shelves spanning compelling fiction to philosophical treatises."
          viewAllLink="/books"
          viewAllText="All Categories"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              count={categoryCounts[category.name] || 0}
            />
          ))}
        </div>
      </section>

      {/* 5. BEST SELLERS SECTION */}
      <section aria-labelledby="bestsellers-heading">
        <SectionHeader
          badge="Reader Favorites"
          title="Bestselling Titles"
          subtitle="The most widely celebrated, read, and recommended volumes in our collection."
          viewAllLink="/books?sort=popularity"
          viewAllText="View All Bestsellers"
        />
        <BookGrid books={bestSellingBooks} />
      </section>

      {/* 6. EDITORIAL PROMOTIONAL BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-espresso-900 text-warm-50 p-8 sm:p-12 lg:p-16 border border-espresso-800 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-600/30 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-500/30">
              Limited Edition Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Curator’s Seasonal Selection: Up to 25% Off
            </h2>
            <p className="text-warm-200 text-sm sm:text-base leading-relaxed max-w-2xl">
              Elevate your personal library with our seasonal collection of award-winning masterworks, philosophical classics, and modern design handbooks.
            </p>
            <div className="pt-2">
              <Link
                to="/books?sort=rating"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span>Browse the Sale Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
            <div className="p-6 rounded-2xl bg-espresso-800/80 border border-espresso-700 text-center space-y-2 max-w-xs w-full">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-amber-400">25% OFF</span>
              <p className="text-xs text-warm-200">Applied automatically at checkout for all featured bundles</p>
              <div className="pt-2 text-[11px] text-warm-300">No promo code required</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER DISPATCH SECTION */}
      <section className="bg-white rounded-3xl border border-warm-200 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xs">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mb-4">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-espresso-900">
          Subscribe to The BookNest Dispatch
        </h2>
        <p className="text-espresso-600 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">
          Join 25,000+ literary enthusiasts. Receive weekly curated book reviews, author dialogues, and private member discounts.
        </p>

        {isSubscribed ? (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-center gap-2 max-w-md mx-auto">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">Welcome to the Dispatch! Your first reading guide is on its way.</span>
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <label htmlFor="home-newsletter-email" className="sr-only">Email address</label>
            <input
              id="home-newsletter-email"
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3 min-h-[48px] rounded-xl border border-warm-300 text-sm text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-amber-700 bg-warm-50/50"
            />
            <button
              type="submit"
              className="px-6 py-3 min-h-[48px] rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 shrink-0"
            >
              Join Dispatch
            </button>
          </form>
        )}

        <p className="text-[11px] text-espresso-600 mt-3">
          We respect your privacy. Unsubscribe at any time with a single click.
        </p>
      </section>

    </div>
  )
}
