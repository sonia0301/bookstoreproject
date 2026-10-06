# AGENTS.md — BookNest Engineering & AI-Assisted Development Guidelines

## 1. Project Purpose & Objective
**BookNest** is a professional, modern, responsive eCommerce bookstore frontend built as part of the **IBM Applied AI Specialist Capstone Project**.
The objective is to demonstrate high-standard frontend engineering, accessibility, responsive design, and an effective AI-assisted development partnership with **IBM Bob**.

---

## 2. Technology Stack & Tooling
- **Framework**: React 19 (SPA with TypeScript & Vite 6)
- **Styling**: Tailwind CSS v3 with custom warm editorial design tokens
- **Routing**: React Router DOM v7 (`react-router-dom`)
- **Icons**: Lucide React (`lucide-react`)
- **State Management**: React Context (`CartContext`) + custom hooks (`useRecentlyViewed`) + `localStorage`
- **Testing**: Vitest + React Testing Library + JSDOM
- **Build / Bundler**: Vite 6
- **Version Control**: Git + GitHub

---

## 3. Architecture & Coding Conventions
- **Component Design**: 
  - Prefer clean, reusable, focused components.
  - Keep presentation separated from business logic.
  - Do not create unnecessary micro-abstractions; balance reusability with clarity.
- **State Management**:
  - Global Cart state resides in `CartContext` using `useReducer`.
  - Filter, search, and sorting states are driven by URL search params (`useSearchParams`) for shareability.
  - Recently viewed books are tracked via `useRecentlyViewed` and stored in `localStorage`.
- **TypeScript**:
  - Strict type checking enabled.
  - Domain models defined in `src/types/index.ts`.
- **Styling & Aesthetics**:
  - Warm editorial aesthetic: Warm Alabaster (`bg-warm-50`), Rich Espresso (`text-espresso-900`), and Deep Amber (`amber-700`).
  - No flashy gradients or excessive animations.
  - Book covers are the primary visual focus with explicit aspect ratios (`aspect-[2/3]`).

---

## 4. Responsive Design Standards
- **Mobile-First Approach**: Build mobile views first, progressive enhancement for tablet and desktop.
- **Breakpoints**:
  - Mobile: `< 640px` (Single column, slide-over drawer filters, full-width touch targets >= 44px).
  - Tablet: `640px – 1023px` (2 to 3 column grids, responsive cart layout).
  - Desktop: `>= 1024px` (4 column book grids, sticky filter sidebar, max container `max-w-7xl mx-auto`).
- **No Horizontal Scroll**: Zero viewport overflow across all breakpoints.

---

## 5. Accessibility Requirements (WCAG 2.1 AA)
- Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`).
- Visible focus rings (`focus-visible:ring-2 focus-visible:ring-amber-700`).
- Strict heading hierarchy (`h1` $\rightarrow$ `h2` $\rightarrow$ `h3`).
- Descriptive `aria-label` attributes on icon-only interactive elements (cart, search, hamburger menu).
- Native `<button>` and `<input>` elements over clickable `<div>`s.
- `aria-live="polite"` for dynamic cart count updates.
- Meaningful `alt` text on book covers.

---

## 6. Testing Expectations
- Test user-visible behavior with `@testing-library/react` and `vitest`.
- Required test suites:
  1. Book rendering & catalog display
  2. Search, category filter, price filter, rating filter, and sorting
  3. Add to cart, quantity increments/decrements, stock constraints, price total calculations, item removal
  4. Recently viewed de-duplication, max-4 cap, and localStorage persistence
  5. Empty states (empty search results, empty cart, 404 page)

---

## 7. AI-Assisted Development Principles (IBM Bob)
- **Iterative Development**: Do not generate the entire application in one shot. Follow the 14 defined phases.
- **Human in the Loop**: The developer remains the human decision-maker. Explain architectural choices before implementing.
- **Phase Validation**: Verify builds and test suites at the conclusion of each phase.
- **No Phantom Claims**: Document only features and code that genuinely exist in the repository.

---

## 8. Phase Roadmap
- **Phase 1**: Requirements Analysis & Architecture Proposal (Completed)
- **Phase 2**: Project Scaffolding & Configuration (Completed)
- **Phase 3**: Application Shell & Navigation (Completed)
- **Phase 4**: Mock Dataset & Homepage with Reusable Book Components (Completed)
- **Phase 5**: Book Browsing, Live Search, Filter & Sorting (Completed)
- **Phase 6**: Book Details Page (Completed)
- **Phase 7**: Shopping Cart & Summary (Completed)
- **Phase 8**: Recently Viewed Integration (Completed)
- **Phase 9**: Responsive Refinements (Completed)
- **Phase 10**: Accessibility Audit & Fixes (Completed)
- **Phase 11**: Automated Unit & Integration Testing (Completed - 16 test suites, 63 tests)
- **Phase 12**: Code Review & Performance Optimization (Completed)
- **Phase 13**: README.md & AGENTS.md Documentation (Completed)
- **Phase 14**: Final Capstone Readiness Review (Completed)
