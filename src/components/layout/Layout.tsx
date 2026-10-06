import { Outlet } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { itemCount } = useCart()

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 text-espresso-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-amber-700 text-white rounded-md shadow-lg font-medium outline-none ring-2 ring-amber-500"
      >
        Skip to main content
      </a>

      {/* Main Navigation */}
      <Navbar cartCount={itemCount} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 focus:outline-none" tabIndex={-1}>
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  )
}
