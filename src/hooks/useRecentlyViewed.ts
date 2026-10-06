import { useState, useCallback } from 'react'
import { Book } from '../types'
import { BOOKS_DATA } from '../data/books'
import {
  getRecentlyViewedIds,
  recordRecentlyViewedId,
  resolveRecentlyViewedBooks,
  clearRecentlyViewedHistory,
} from '../utils/recentlyViewed'

export function useRecentlyViewed() {
  const [viewedIds, setViewedIds] = useState<string[]>(() => getRecentlyViewedIds())

  const recordView = useCallback((bookId: string) => {
    const updated = recordRecentlyViewedId(bookId)
    setViewedIds(updated)
  }, [])

  const clearHistory = useCallback(() => {
    clearRecentlyViewedHistory()
    setViewedIds([])
  }, [])

  const recentlyViewedBooks: Book[] = resolveRecentlyViewedBooks(BOOKS_DATA, viewedIds)

  return {
    recentlyViewedBooks,
    viewedIds,
    recordView,
    clearHistory,
  }
}
