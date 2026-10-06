import { Book } from '../types'
import { getStorageItem, setStorageItem, removeStorageItem } from './storage'

export const RECENTLY_VIEWED_KEY = 'booknest_recently_viewed_v1'
export const MAX_RECENTLY_VIEWED = 4

/**
 * Safely retrieves stored book IDs from localStorage
 */
export function getRecentlyViewedIds(): string[] {
  const ids = getStorageItem<unknown>(RECENTLY_VIEWED_KEY, [])
  if (!Array.isArray(ids)) return []
  return ids.filter((id): id is string => typeof id === 'string')
}

/**
 * Records a viewed book ID:
 * - Removes duplicates
 * - Puts most recent at index 0
 * - Limits to maximum 4 entries
 */
export function recordRecentlyViewedId(bookId: string): string[] {
  if (!bookId || typeof bookId !== 'string') return getRecentlyViewedIds()

  const currentIds = getRecentlyViewedIds()
  const filtered = currentIds.filter((id) => id !== bookId)
  const updated = [bookId, ...filtered].slice(0, MAX_RECENTLY_VIEWED)

  setStorageItem(RECENTLY_VIEWED_KEY, updated)
  return updated
}

/**
 * Resolves stored book IDs to full Book objects from a catalog dataset
 */
export function resolveRecentlyViewedBooks(books: Book[], ids: string[] = getRecentlyViewedIds()): Book[] {
  if (!Array.isArray(books) || !Array.isArray(ids)) return []

  const bookMap = new Map<string, Book>()
  books.forEach((b) => bookMap.set(b.id, b))

  return ids
    .map((id) => bookMap.get(id))
    .filter((b): b is Book => b !== undefined)
}

/**
 * Clears recently viewed history from storage
 */
export function clearRecentlyViewedHistory(): void {
  removeStorageItem(RECENTLY_VIEWED_KEY)
}
