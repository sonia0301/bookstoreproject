export type BookCategory = 
  | 'Fiction'
  | 'Non-Fiction'
  | 'Mystery & Thriller'
  | 'Sci-Fi & Fantasy'
  | 'Biography & Memoir'
  | 'Business & Tech'
  | 'Art & Design'
  | 'Philosophy';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  longDescription?: string;
  coverImage: string;
  popularity: number;
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  publishedYear: number;
  pages: number;
  isbn: string;
  language: string;
  publisher: string;
}

export interface CategoryMeta {
  id: BookCategory;
  name: string;
  description: string;
  iconName: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export type SortOption = 'popularity' | 'rating' | 'price-asc' | 'price-desc' | 'newest';

export interface FilterState {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: SortOption;
}
