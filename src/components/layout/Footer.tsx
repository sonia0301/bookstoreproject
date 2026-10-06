import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Mail, ArrowRight, Heart, CheckCircle2 } from 'lucide-react'

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      setIsSubscribed(true)
      setNewsletterEmail('')
    }
  }

  return (
    <footer className="bg-espresso-900 text-warm-100 mt-20 border-t border-espresso-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-warm-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded p-1"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight">BookNest</span>
            </Link>
            <p className="text-espresso-300 text-sm leading-relaxed max-w-sm">
              A refined online sanctuary for book lovers, thinkers, and collectors. Offering hand-curated fiction, insightful non-fiction, and timeless literature.
            </p>
            <div className="pt-2 text-xs text-espresso-400">
              Built with React, Vite & Tailwind CSS for the IBM Applied AI Capstone.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold tracking-wider text-warm-200 uppercase">
              Explore
            </h2>
            <ul className="space-y-2 text-sm text-espresso-300">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors focus-visible:ring-1 focus-visible:ring-amber-400 rounded">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-amber-400 transition-colors focus-visible:ring-1 focus-visible:ring-amber-400 rounded">
                  All Books
                </Link>
              </li>
              <li>
                <Link to="/books?category=Fiction" className="hover:text-amber-400 transition-colors focus-visible:ring-1 focus-visible:ring-amber-400 rounded">
                  Featured Fiction
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-amber-400 transition-colors focus-visible:ring-1 focus-visible:ring-amber-400 rounded">
                  View Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold tracking-wider text-warm-200 uppercase">
              Genres
            </h2>
            <ul className="space-y-2 text-sm text-espresso-300">
              <li>
                <Link to="/books?category=Fiction" className="hover:text-amber-400 transition-colors focus-visible:ring-1 focus-visible:ring-amber-400 rounded">
                  Fiction
                </Link>
              </li>
              <li>
                <Link to="/books?category=Non-Fiction" className="hover:text-amber-400 transition-colors focus-visible:ring-1 focus-visible:ring-amber-400 rounded">
                  Non-Fiction
                </Link>
              </li>
              <li>
                <Link to="/books?category=Mystery+%26+Thriller" className="hover:text-amber-400 transition-colors focus-visible:ring-1 focus-visible:ring-amber-400 rounded">
                  Mystery & Thriller
                </Link>
              </li>
              <li>
                <Link to="/books?category=Philosophy" className="hover:text-amber-400 transition-colors focus-visible:ring-1 focus-visible:ring-amber-400 rounded">
                  Philosophy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold tracking-wider text-warm-200 uppercase">
              Literary Dispatch
            </h2>
            <p className="text-espresso-300 text-xs leading-relaxed">
              Subscribe to receive weekly curated book reviews, author interviews, and exclusive discounts.
            </p>

            {isSubscribed ? (
              <div className="p-3 bg-espresso-800 border border-emerald-600/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Thank you for subscribing to our dispatch!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-espresso-800 border border-espresso-700 text-warm-100 placeholder:text-espresso-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <Mail className="w-4 h-4 absolute right-3.5 top-3.5 text-espresso-400 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-espresso-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-espresso-400">
          <p>&copy; {new Date().getFullYear()} BookNest Bookstore. All rights reserved.</p>
          <div className="flex items-center gap-1 text-espresso-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 inline fill-amber-500" />
            <span>for literary enthusiasts</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
