# BookNest — Responsive eCommerce Bookstore

> **IBM Applied AI Specialist Certification — Capstone Project**  
> A full-featured, accessible, single-page bookstore application developed with **IBM Bob** as an AI pair-programming partner across a structured 14-phase engineering lifecycle.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Business Objective](#business-objective)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Application Architecture](#application-architecture)
6. [Component Architecture](#component-architecture)
7. [Folder Structure](#folder-structure)
8. [Installation](#installation)
9. [Development Commands](#development-commands)
10. [Running Tests](#running-tests)
11. [Production Build](#production-build)
12. [Responsive Design](#responsive-design)
13. [Accessibility](#accessibility)
14. [State Management](#state-management)
15. [AI-Assisted Development with IBM Bob](#ai-assisted-development-with-ibm-bob)
16. [Agentic Development Workflow](#agentic-development-workflow)
17. [Key Challenges & Resolutions](#key-challenges--resolutions)
18. [Future Enhancements](#future-enhancements)

---

## Project Overview

**BookNest** is a modern, responsive, and fully accessible single-page eCommerce bookstore built with React 19, TypeScript, Vite 6, and Tailwind CSS. It delivers an editorial browsing experience across a curated catalog of 20 titles spanning eight literary categories, featuring real-time multi-criteria filtering, a persistent shopping cart, URL-driven filter state, browsing history tracking, and comprehensive automated test coverage.

The project was built as the capstone demonstration for the **IBM Applied AI Specialist Certification**, showcasing how a professional frontend application can be engineered iteratively and responsibly through structured collaboration with an AI coding assistant.

---

## Business Objective

The objective of BookNest is to demonstrate that an AI-assisted development workflow — when properly structured and human-supervised — can produce:

- **Production-quality frontend engineering** adhering to industry conventions for component architecture, state management, and TypeScript discipline.
- **Inclusive user experiences** meeting WCAG 2.1 AA accessibility requirements across keyboard, screen reader, and touch interfaces.
- **Maintainable, tested code** with 16 test suites and 63 automated tests verifying behavior at unit, integration, and end-to-end levels.
- **A credible portfolio artifact** demonstrating real-world eCommerce UI patterns: catalog browsing, filtering, cart management, and checkout flow.

---

## Key Features

### Editorial Homepage
- Hero section with call-to-action links to the catalog and bestsellers.
- Featured book spotlight with cover imagery and visual polish.
- "Jump Back In" recently viewed shelf (appears only when browsing history exists).
- Curated featured books and bestselling titles sections.
- Browse by category grid with 8 literary genres.
- Promotional seasonal sale banner.
- Newsletter subscription form with client-side success state.

### Book Catalog & Discovery
- Real-time search across book titles, authors, and categories.
- Sidebar category filter with dynamic per-category book counts.
- Max-price range slider with accessible ARIA attributes.
- Minimum rating filter (4.0+, 4.5+, 4.8+, All).
- Five sort modes: Most Popular, Highest Rated, Price Low→High, Price High→Low, Newest Releases.
- All filter and sort state encoded in URL search params — fully shareable and bookmark-friendly.
- Active filter chips with one-click individual removal.
- One-click "Reset All Filters" action.
- Contextual empty state with reset CTA when no books match.
- Mobile slide-over filter drawer with focus trap, ESC dismissal, and "Show N Books" action button.

### Book Details Page
- Full cover image with hover zoom, fallback illustration on load error.
- Bestseller and discount percentage badge overlays.
- Live stock status indicators (In Stock / Low Stock / Out of Stock).
- Dynamic quantity selector with per-book inventory ceiling enforcement.
- Add to Cart button showing live total price (e.g. "Add to Cart • $56.97").
- Animated confirmation state ("Added 3 to Cart!") with `aria-live` announcement.
- Book specifications table: Publisher, Year, Pages, ISBN, Language.
- Related books grid (same category, up to 4 titles).
- Recently viewed shelf (excludes the current title).
- Breadcrumb navigation with `aria-current="page"` on the last crumb.

### Shopping Cart
- Persistent cart backed by `localStorage` with safe JSON serialisation and quota-error handling.
- Quantity increment/decrement per item with stock ceiling enforcement.
- Inline remove per item and "Clear Cart" header action.
- Real-time subtotal, estimated shipping, and estimated tax (8%) calculations.
- Free shipping progress bar: standard shipping ($4.99) waived on orders $35+.
- Promotional discount code field (any non-empty code applies a 10% discount).
- Simulated checkout flow with loading state and order confirmation screen.
- Empty cart state with navigation back to catalog.

### Browsing History
- Automatic recording of visited book detail pages into `localStorage`.
- FIFO cap of 4 most-recently viewed books.
- Deduplication: revisiting a book moves it to the front, not duplicates it.
- One-click clear history button on all shelf instances.
- Graceful recovery from corrupted or malformed `localStorage` data.

---

## Technology Stack

| Layer | Technology | Version |
| :--- | :--- | :--- |
| **Framework** | React + TypeScript | 19 / ~5.7 |
| **Build & Dev Server** | Vite | 6 |
| **Styling** | Tailwind CSS | 3.4 |
| **Routing** | React Router DOM | 7 |
| **Icons** | Lucide React | 0.475 |
| **Testing** | Vitest + React Testing Library + JSDOM | 3 / 16 / 26 |
| **State** | React Context + `useReducer` + `localStorage` | — |
| **Type Checking** | TypeScript strict mode, `noUnusedLocals`, `noUnusedParameters` | — |

---

## Application Architecture

BookNest follows a standard single-page application structure with a clear separation of concerns:

```
Entry Point (main.tsx)
└── App.tsx
    └── CartProvider          ← Global cart state (React Context + useReducer)
        └── BrowserRouter
            └── Layout        ← Navbar + Skip Link + <main> + Footer
                ├── /                → HomePage
                ├── /books           → BooksPage       (URL-driven filter state)
                ├── /books/:bookId   → BookDetailsPage  (useParams + local state)
                ├── /cart            → CartPage         (reads CartContext)
                └── *                → NotFoundPage
```

**Data flow decisions:**

| Concern | Mechanism | Rationale |
| :--- | :--- | :--- |
| Cart (add, remove, quantity, totals) | `CartContext` + `useReducer` | Global shared state; multiple consumers across Navbar, BookCard, CartPage |
| Catalog filters & sort | URL search params (`useSearchParams`) | Shareable, bookmarkable, browser back/forward compatible |
| Recently viewed history | `useRecentlyViewed` hook + `localStorage` | Persists across sessions; scoped to a single custom hook |
| Derived financial values | Computed inline in `CartContext` | Subtotal, shipping, tax, and total are pure calculations from cart items |
| Book data | Static in-memory array (`BOOKS_DATA`) | No backend; data is fixed for the capstone scope |

---

## Component Architecture

Components are organised by domain responsibility. Each component has a single, clear job.

```
components/
├── layout/
│   ├── Layout.tsx              Shared shell: skip link, Navbar, <main>, Footer
│   ├── Navbar.tsx              Sticky header: logo, desktop search, nav links, cart badge
│   ├── MobileNav.tsx           Slide-over drawer: search, nav links, focus trap
│   └── Footer.tsx              Site footer
│
├── books/
│   ├── BookCard.tsx            Individual book card: cover, metadata, quick-add button
│   ├── BookGrid.tsx            Responsive grid wrapper around BookCard list
│   ├── FilterSidebar.tsx       Category / price / rating filters; dual desktop+mobile modes
│   ├── SortDropdown.tsx        Accessible <select> for sort options
│   ├── CategoryCard.tsx        Category tile for homepage Browse section
│   └── RecentlyViewedShelf.tsx Recently viewed book shelf with clear action
│
├── cart/
│   ├── CartItem.tsx            Single cart row: cover, quantity selector, line total, remove
│   └── CartSummary.tsx         Order summary: totals, progress bar, promo code, checkout
│
└── common/
    ├── StarRating.tsx          Accessible star display (role="img" + aria-label)
    ├── QuantitySelector.tsx    Increment / decrement / direct input with stock bounds
    ├── Breadcrumbs.tsx         Accessible breadcrumb trail with aria-current="page"
    ├── EmptyState.tsx          Reusable empty/error state with configurable heading level
    └── SectionHeader.tsx       Consistent section title + badge + "View All" link
```

---

## Folder Structure

```
bookstoreproject/
├── public/                         # Static public assets
├── src/
│   ├── components/
│   │   ├── books/                  # Catalog and book display components
│   │   ├── cart/                   # Cart item and order summary components
│   │   ├── common/                 # Shared UI primitives
│   │   └── layout/                 # Application shell components
│   ├── context/
│   │   └── CartContext.tsx         # Cart global state: reducer, actions, derived values
│   ├── data/
│   │   ├── books.ts                # Curated 20-book dataset with full metadata
│   │   └── categories.ts           # 8 category definitions with descriptions
│   ├── hooks/
│   │   └── useRecentlyViewed.ts    # Browsing history: record, resolve, clear
│   ├── pages/
│   │   ├── HomePage.tsx            # Editorial landing page
│   │   ├── BooksPage.tsx           # Filterable / sortable catalog
│   │   ├── BookDetailsPage.tsx     # Individual product detail page
│   │   ├── CartPage.tsx            # Cart management and order summary
│   │   └── NotFoundPage.tsx        # 404 fallback page
│   ├── test/
│   │   ├── setup.ts                # Vitest + Testing Library global setup
│   │   ├── setup.test.ts           # Environment smoke test
│   │   ├── BookCard.test.tsx
│   │   ├── BooksPage.test.tsx
│   │   ├── BookDetailsPage.test.tsx
│   │   ├── HomePage.test.tsx
│   │   ├── Cart.test.tsx
│   │   ├── FilterSort.test.tsx
│   │   ├── RecentlyViewed.test.tsx
│   │   ├── QuantitySelector.test.tsx
│   │   ├── Navigation.test.tsx
│   │   ├── Accessibility.test.tsx
│   │   ├── Responsive.test.tsx
│   │   ├── CheckoutJourney.test.tsx
│   │   ├── CatalogInteractions.test.tsx
│   │   ├── ProductDetailsIntegration.test.tsx
│   │   └── BrowsingHistoryIntegration.test.tsx
│   ├── types/
│   │   └── index.ts                # Book, CartItem, FilterState, SortOption, CategoryMeta
│   ├── utils/
│   │   ├── filterSort.ts           # filterBooks(), sortBooks(), processBooks()
│   │   ├── formatters.ts           # formatCurrency(), calculateDiscount()
│   │   ├── recentlyViewed.ts       # Storage helpers for browsing history
│   │   └── storage.ts              # Safe localStorage read/write/remove wrappers
│   ├── App.tsx                     # Route tree
│   ├── main.tsx                    # Application entry point
│   ├── index.css                   # Tailwind base + global styles
│   └── vite-env.d.ts
├── AGENTS.md                       # IBM Bob collaboration rules and 14-phase roadmap
├── index.html
├── package.json
├── tailwind.config.js              # Custom warm/espresso/amber design tokens
├── tsconfig.app.json               # TypeScript strict config
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts                  # Vite + Vitest configuration
```

---

## Installation

**Prerequisites:** Node.js v18+ and npm v9+.

```bash
# 1. Clone the repository
git clone https://github.com/sonia0301/bookstoreproject.git
cd bookstoreproject

# 2. Install dependencies
npm install
```

---

## Development Commands

```bash
# Start the Vite development server (hot module replacement enabled)
npm run dev
# → http://localhost:5173
```

---

## Running Tests

```bash
# Run all 16 test suites (63 tests) once and exit
npm test
```

The test suite covers:

| Suite | Scope |
| :--- | :--- |
| `BookCard.test.tsx` | Renders metadata, discount badge, out-of-stock state, quick-add callback |
| `BooksPage.test.tsx` | Search input filtering, result count display, empty state reset |
| `BookDetailsPage.test.tsx` | Valid book lookup, quantity × price calculation, out-of-stock guard |
| `HomePage.test.tsx` | All required sections render, heading hierarchy, newsletter form |
| `Cart.test.tsx` | Add/update/remove items, free shipping threshold, totals calculation |
| `FilterSort.test.tsx` | Search matching, category filter, price bounds, rating filter, sort modes |
| `RecentlyViewed.test.tsx` | Record, deduplicate, FIFO cap, clear, corrupted storage recovery |
| `QuantitySelector.test.tsx` | Increment, decrement, clamped min/max, direct input |
| `Navigation.test.tsx` | Route rendering, 404 page, breadcrumb structure |
| `Accessibility.test.tsx` | Skip link, live regions, `role="img"` star rating, ARIA slider attributes |
| `Responsive.test.tsx` | Mobile nav drawer open/close, mobile filter modal interactions |
| `CheckoutJourney.test.tsx` | Discovery → add to cart → promo code → checkout confirmation flow |
| `CatalogInteractions.test.tsx` | Combined filters, sort, active chip removal, zero-match empty state |
| `ProductDetailsIntegration.test.tsx` | Out-of-stock guard, stock ceiling, book-not-found state |
| `BrowsingHistoryIntegration.test.tsx` | Cross-page persistence, current book exclusion, shelf clear |
| `setup.test.ts` | Vitest + JSDOM environment smoke check |

---

## Production Build

```bash
# Type-check and bundle for production (outputs to dist/)
npm run build

# Preview the production bundle locally
npm run preview
```

The production build runs `tsc -b` before bundling, ensuring zero TypeScript errors before any assets are emitted. The current bundle output:

```
dist/assets/index.css    ~37 kB  │ gzip: ~6.7 kB
dist/assets/index.js    ~378 kB  │ gzip: ~111 kB
```

---

## Responsive Design

BookNest follows a **mobile-first** strategy: base styles target the smallest viewport, with progressive enhancement through Tailwind breakpoints.

| Breakpoint | Range | Layout behaviour |
| :--- | :--- | :--- |
| Mobile | `< 640px` | Single-column grid, slide-over filter drawer, hamburger nav, full-width touch targets (≥ 44 × 44 px) |
| Tablet | `640px – 1023px` | 2–3 column book grids, responsive cart layout, inline filter bar |
| Desktop | `≥ 1024px` | 4-column book grids, sticky filter sidebar, `max-w-7xl` container, persistent horizontal nav |

**Key responsive techniques used:**
- Tailwind's `sm:`, `lg:`, `xl:` responsive variants throughout every layout component.
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` pattern for all book grids.
- The `FilterSidebar` component is dual-mode: `aside` on desktop, `role="dialog"` modal on mobile — only mounted when open.
- The `MobileNav` drawer is conditionally rendered (not just hidden) to avoid stale focus and duplicate ARIA landmarks.
- Cart layout shifts from stacked single-column on mobile to a `lg:grid-cols-12` split with a sticky summary sidebar on desktop.
- No horizontal scroll at any tested viewport width.

---

## Accessibility

BookNest targets **WCAG 2.1 Level AA** compliance. Decisions are grounded in semantic HTML first, with ARIA used only where native semantics are insufficient.

| Requirement | Implementation |
| :--- | :--- |
| Skip navigation | Visually hidden "Skip to main content" link as the first focusable element; reveals on focus |
| Landmark structure | `<header>`, `<nav>`, `<main id="main-content">`, `<aside>`, `<section>`, `<footer>` throughout |
| Heading hierarchy | Strict `h1 → h2 → h3` enforced across all pages; `EmptyState` accepts a `headingLevel` prop |
| Focus management | `focus-visible:ring-2 focus-visible:ring-amber-700` on every interactive element |
| Focus trapping | Mobile nav and filter drawers trap Tab/Shift+Tab within the overlay; ESC closes |
| Initial focus | On drawer open, focus is programmatically moved to the close button after a 50 ms delay |
| Cart announcements | `<span role="status" aria-live="polite">` announces add-to-cart confirmations to screen readers |
| Star ratings | `<div role="img" aria-label="Rated 4.8 out of 5 stars based on 342 reviews">` |
| Range slider | `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` on the price filter input |
| Form labels | Every `<input>` has an associated `<label>` (visible or `.sr-only`); `QuantitySelector` accepts an `inputId` prop to bind to external labels |
| Icon buttons | All icon-only buttons carry descriptive `aria-label` attributes |
| Touch targets | Minimum `min-h-[44px] min-w-[44px]` on all interactive controls |
| Breadcrumbs | `<nav aria-label="Breadcrumbs">` with `aria-current="page"` on the active crumb |
| Image fallbacks | All `<img>` elements have meaningful `alt` text; a styled fallback renders on `onError` |
| Backdrop overlays | Decorative backdrop `<div>`s carry `aria-hidden="true"` |

---

## State Management

BookNest uses three distinct state strategies, each chosen for its scope:

### 1. Global Cart State — `CartContext` + `useReducer`
Defined in [`src/context/CartContext.tsx`](src/context/CartContext.tsx). The reducer handles four actions:

| Action | Behaviour |
| :--- | :--- |
| `ADD_ITEM` | Increments quantity if book already in cart; clamps to stock ceiling |
| `REMOVE_ITEM` | Removes a cart line by book ID |
| `UPDATE_QUANTITY` | Clamps new quantity between 1 and `book.stock` |
| `CLEAR_CART` | Resets items to an empty array |

Derived financial values (subtotal, shipping, tax, total, `hasFreeShipping`, `freeShippingRemaining`) are computed directly in the provider on each render — no separate action needed. The cart state is persisted to and hydrated from `localStorage` via the `getStorageItem` / `setStorageItem` utility wrappers that handle JSON errors and storage quota failures silently.

### 2. Catalog Filter & Sort State — URL Search Params
Filter and sort state in `BooksPage` lives entirely in the URL via `useSearchParams` from React Router. Benefits:
- Filter combinations are shareable and bookmarkable.
- Browser back/forward navigation works without extra state management.
- The `filters` object is derived from search params via `useMemo` — the URL is the single source of truth.
- `updateFilters` is memoized with `useCallback` using the functional updater form of `setSearchParams`.

### 3. Browsing History — `useRecentlyViewed` Hook + `localStorage`
Encapsulated in [`src/hooks/useRecentlyViewed.ts`](src/hooks/useRecentlyViewed.ts) and backed by utility functions in [`src/utils/recentlyViewed.ts`](src/utils/recentlyViewed.ts). The hook stores only book IDs in `localStorage` (not full book objects) and resolves them to `Book` objects at render time via a `Map` lookup. This keeps the stored payload minimal and avoids stale data if the catalog were ever updated.

---

## AI-Assisted Development with IBM Bob

BookNest was built in deliberate, human-supervised collaboration with **IBM Bob**, IBM's AI coding assistant. Bob was engaged across every phase of the project lifecycle — not as an autonomous code generator, but as a structured pair-programming partner where the developer remained the decision-maker at every step.

### How IBM Bob Was Used

**Phase 1 — Requirements Analysis & Architecture Planning**  
Bob was prompted to analyse the project scope and propose a component hierarchy, routing structure, and state management strategy before a single line of code was written. The developer reviewed and approved the architecture, asked follow-up questions about trade-offs, and locked in the decisions that shaped the entire project.

**Phase 2 — Project Scaffolding & Configuration**  
Bob generated the initial Vite + React + TypeScript scaffold, configured Tailwind CSS with custom design tokens (warm, espresso, amber palettes), set up React Router, and wired the test environment (Vitest + React Testing Library + JSDOM). The developer verified each configuration file before proceeding.

**Phases 3–8 — Iterative Feature Implementation**  
Bob implemented each feature phase one at a time: application shell and navigation, homepage sections, book catalog with filters, book details page, shopping cart, and browsing history. Each phase ended with a build verification and the developer inspecting diffs before accepting changes.

**Phase 9 — Responsive Refinements**  
Bob was asked to audit every page against the three-breakpoint specification (mobile / tablet / desktop) and apply targeted fixes — converting the filter panel to a mobile drawer, refining grid column counts, and enforcing minimum touch target sizes.

**Phase 10 — Accessibility Audit & Fixes**  
Bob conducted a systematic ARIA audit. It identified missing `aria-label` attributes on icon buttons, an inadequate star rating implementation, absent focus traps on modals, and a missing skip link. Each issue was fixed incrementally with the developer reviewing the accessibility rationale before each change.

**Phase 11 — Automated Testing**  
Bob authored all 16 test suites using React Testing Library's user-centric query principles (prefer `getByRole`, `getByLabelText` over implementation-detail selectors). Bob explained the test strategy for each suite, and the developer verified that tests described observable user behaviour rather than internal implementation details.

**Phase 12 — Code Review & Performance Optimization**  
Bob performed a structured code review against five priority areas: functional correctness, accessibility, responsiveness, maintainability, and performance. It identified a Rules-of-Hooks violation in `BookCard` (conditional `useCart` inside a try/catch), an incorrect `hasFreeShipping` semantic when the cart is empty, `window.location.assign()` calls that broke SPA navigation, a redundant `useEffect` in `useRecentlyViewed`, and an unmemoized `updateFilters` function. All fixes were implemented and tests re-run to confirm no regressions.

**Phase 13 — Documentation**  
Bob authored this `README.md` and the `AGENTS.md` collaboration guidelines file, using only features and patterns that genuinely exist in the repository.

**Phase 14 — Final Capstone Readiness Review**  
Bob performed a final end-to-end checklist: confirmed all 63 tests pass, the production build is clean (zero TypeScript errors), responsive behaviour is correct, and accessibility attributes are present and accurate.

---

## Agentic Development Workflow

The 14-phase structure used in this project illustrates a repeatable agentic development workflow:

```
1. Define the objective and constraints in AGENTS.md
        ↓
2. Ask Bob to propose architecture (do not implement yet)
        ↓
3. Review and approve the proposal
        ↓
4. Implement one phase at a time — never the whole application at once
        ↓
5. Run the build and tests at the end of every phase
        ↓
6. If something is wrong, describe the symptom to Bob precisely
        ↓
7. Review every diff before accepting — do not blindly accept suggestions
        ↓
8. Add new decisions and conventions to AGENTS.md as they are made
        ↓
9. Use Bob for code review at the end of implementation
        ↓
10. Use Bob for accessibility review with explicit WCAG criteria
        ↓
11. Use Bob to author tests — then verify tests describe user behaviour
        ↓
12. Use Bob to document — then verify no phantom features are claimed
```

**Principles that kept the workflow healthy:**
- Bob was never given free rein to refactor working code. Every change traced to a specific requirement.
- The developer reviewed every file diff, not just the summary.
- `AGENTS.md` served as a living contract — Bob was instructed to read it at the start of every session to maintain consistency across context windows.
- When Bob made a mistake (e.g. the Rules-of-Hooks violation introduced during an early test workaround), it was discovered during the code review phase and corrected by Bob under human supervision.

---

## Key Challenges & Resolutions

### Challenge 1: Keeping Filter State in the URL Without Stale Closure Bugs
**Problem:** The `updateFilters` function in `BooksPage` captured `filters` from the render scope. When filter updates fired in quick succession (e.g. typing in the search box), the closure over stale `filters` could silently discard intermediate updates.

**Resolution:** Refactored `updateFilters` to use the functional updater form of `setSearchParams` — the callback receives the current `URLSearchParams` object directly from React Router, eliminating the stale closure. The function was also wrapped in `useCallback` with `setSearchParams` as the only dependency, stabilising its reference across renders.

---

### Challenge 2: Rules-of-Hooks Violation in BookCard
**Problem:** `BookCard` was written to call `useCart()` inside a `try/catch` block so it could render in tests that lacked a `CartProvider`. This is a direct violation of the Rules of Hooks because it conditionally invokes a hook — React cannot guarantee a consistent call order.

**Resolution:** `BookCard` is always rendered inside `CartProvider` in the real application, so the fallback was dead code introducing real risk. The try/catch was removed, `useCart()` is now called unconditionally, and the affected test files were updated to wrap `BookCard` in `CartProvider`.

---

### Challenge 3: `hasFreeShipping` True on an Empty Cart
**Problem:** The original logic was `hasFreeShipping = subtotal >= threshold || subtotal === 0`. The `subtotal === 0` branch meant that the CartSummary progress bar would display "Free Standard Shipping Unlocked!" when the cart was empty — semantically incorrect and potentially confusing if the component were ever rendered without the empty-cart early return guard.

**Resolution:** Changed to `hasFreeShipping = items.length > 0 && subtotal >= threshold`. Free shipping is only a meaningful state when there are items to ship.

---

### Challenge 4: `window.location.assign()` Breaking SPA Navigation
**Problem:** Both `BookDetailsPage` and `CartPage` used `window.location.assign('/books')` in empty state action handlers. This causes a full browser navigation and page reload, discarding all React state including the cart.

**Resolution:** Replaced with `useNavigate()` from React Router in both page components. Navigation is now a client-side route transition that preserves application state.

---

### Challenge 5: Mobile Filter Sidebar Always in the DOM
**Problem:** The mobile `FilterSidebar` (modal mode) was always rendered in the page, with its visibility controlled only by the `isMobileModal` prop being `false`. When closed, it rendered as a standard desktop `<aside>`, creating a duplicate sidebar in the DOM at mobile widths and two competing `aria-label` regions.

**Resolution:** The mobile `FilterSidebar` instance is now conditionally rendered with `{isMobileFilterOpen && <FilterSidebar isMobileModal={true} ... />}`. When not open, the component does not exist in the DOM.

---

### Challenge 6: Accessible Label Not Wired to QuantitySelector Input
**Problem:** `BookDetailsPage` renders `<label htmlFor="product-qty">`, but `QuantitySelector`'s internal `<input>` had a hardcoded `aria-label="Item quantity"` and no `id`, so the label's `for` attribute pointed to nothing.

**Resolution:** Added an `inputId` prop to `QuantitySelector`. When provided, it sets the `id` on the input and removes the internal `aria-label` (avoiding redundant dual-labelling). `BookDetailsPage` now passes `inputId="product-qty"`.

---

## Future Enhancements

The following enhancements are intentionally out of scope for this capstone but represent logical next steps for a production-grade bookstore:

- **Backend Integration:** Replace the static `BOOKS_DATA` array with a REST or GraphQL API. Add loading skeletons and error boundary components.
- **Authentication & User Accounts:** Sign-in/sign-up flow, persistent wishlists, order history, and saved addresses.
- **Checkout & Payments:** Real multi-step checkout with address, shipping method selection, and Stripe or PayPal integration.
- **Search Enhancement:** Debounced search input to reduce filter recalculation on every keystroke; fuzzy matching for tolerance of typos.
- **Pagination / Infinite Scroll:** The current catalog renders all books at once. For a larger catalog, virtualised or paginated rendering would be required.
- **Server-Side Rendering or Static Generation:** Migrate to Next.js or Remix for improved first-paint performance, SEO, and social sharing metadata.
- **Dark Mode:** Respect `prefers-color-scheme` with a Tailwind `dark:` variant implementation.
- **Internationalisation (i18n):** Multi-language support and locale-aware currency and date formatting.
- **Automated Accessibility Auditing:** Integrate axe-core or Playwright with accessibility assertions into the CI pipeline.
- **End-to-End Browser Testing:** Add Playwright or Cypress suites for cross-browser visual regression and real-interaction testing.

---

## License

This project is open-source and was created as part of the **IBM Applied AI Specialist Certification Capstone**.  
Feel free to explore, fork, and adapt the code for your own learning.
