# Search and Filtering

## Overview

This task involves enhancing the search and filtering functionality for the Sharebrary application, including improved client-side filtering, server-side search with Firestore, and advanced filter combinations.

## Prerequisites

- [Project Setup](./01-project-setup.md) completed
- [Book Library Core](./05-book-library.md) implemented

## Detailed Tasks

### 1. Enhanced Search Bar Component

- [ ] Create a global search bar component

  ```typescript
  // libs/ui/src/lib/search/search-bar.tsx
  'use client';

  import { useState, useEffect } from 'react';
  import { useRouter, useSearchParams } from 'next/navigation';
  import { Input } from '../input/input';
  import { Button } from '../button/button';
  import { Search, X } from 'lucide-react';

  interface SearchBarProps {
    placeholder?: string;
    className?: string;
    onSearch?: (query: string) => void;
    navigateOnSearch?: boolean;
    searchPath?: string;
  }

  export function SearchBar({
    placeholder = 'Search books...',
    className = '',
    onSearch,
    navigateOnSearch = true,
    searchPath = '/library',
  }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    useEffect(() => {
      // Update the input when the URL search param changes
      setQuery(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (onSearch) {
        onSearch(query);
      }

      if (navigateOnSearch) {
        const params = new URLSearchParams();
        if (query) {
          params.set('q', query);
        }
        router.push(`${searchPath}?${params.toString()}`);
      }
    };

    const clearSearch = () => {
      setQuery('');

      if (onSearch) {
        onSearch('');
      }

      if (navigateOnSearch && searchParams.has('q')) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');
        router.push(`${searchPath}?${params.toString()}`);
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center ${className}`}
      >
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />

          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10 w-full"
          />

          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button type="submit" className="ml-2">
          Search
        </Button>
      </form>
    );
  }
  ```

### 2. Advanced Filtering System

- [ ] Create a filter state management system

  ```typescript
  // libs/features/src/lib/library/use-library-filters.tsx
  'use client';

  import { useState, useCallback, useEffect } from 'react';
  import { useRouter, usePathname, useSearchParams } from 'next/navigation';

  export interface LibraryFilters {
    query: string;
    category: string;
    subcategory: string;
    tags: string[];
    sortBy: 'newest' | 'title' | 'author' | 'popular';
    page: number;
  }

  const DEFAULT_FILTERS: LibraryFilters = {
    query: '',
    category: '',
    subcategory: '',
    tags: [],
    sortBy: 'newest',
    page: 1,
  };

  export function useLibraryFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<LibraryFilters>(() => {
      // Initialize from URL search params
      return {
        query: searchParams.get('q') || DEFAULT_FILTERS.query,
        category: searchParams.get('category') || DEFAULT_FILTERS.category,
        subcategory:
          searchParams.get('subcategory') || DEFAULT_FILTERS.subcategory,
        tags: searchParams.getAll('tag') || DEFAULT_FILTERS.tags,
        sortBy:
          (searchParams.get('sortBy') as LibraryFilters['sortBy']) ||
          DEFAULT_FILTERS.sortBy,
        page: parseInt(searchParams.get('page') || '1', 10),
      };
    });

    // Update URL when filters change
    const updateUrl = useCallback(() => {
      const params = new URLSearchParams();

      if (filters.query) params.set('q', filters.query);
      if (filters.category) params.set('category', filters.category);
      if (filters.subcategory) params.set('subcategory', filters.subcategory);
      filters.tags.forEach((tag) => params.append('tag', tag));
      if (filters.sortBy !== DEFAULT_FILTERS.sortBy)
        params.set('sortBy', filters.sortBy);
      if (filters.page > 1) params.set('page', filters.page.toString());

      router.push(`${pathname}?${params.toString()}`);
    }, [filters, pathname, router]);

    // Set individual filter value
    const setFilter = useCallback(
      <K extends keyof LibraryFilters>(key: K, value: LibraryFilters[K]) => {
        setFilters((prev) => {
          // Reset page to 1 when changing filters (except when changing page)
          const newFilters = {
            ...prev,
            [key]: value,
            ...(key !== 'page' ? { page: 1 } : {}),
          };
          return newFilters;
        });
      },
      []
    );

    // Add or remove a tag
    const toggleTag = useCallback((tag: string) => {
      setFilters((prev) => {
        const newTags = prev.tags.includes(tag)
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag];

        return {
          ...prev,
          tags: newTags,
          page: 1, // Reset page when changing tags
        };
      });
    }, []);

    // Reset all filters
    const resetFilters = useCallback(() => {
      setFilters(DEFAULT_FILTERS);
    }, []);

    // Apply the current filters to the URL
    useEffect(() => {
      updateUrl();
    }, [filters, updateUrl]);

    return {
      filters,
      setFilter,
      toggleTag,
      resetFilters,
    };
  }
  ```

- [ ] Enhance filter components with active filter pills

  ```typescript
  // libs/features/src/lib/library/active-filters.tsx
  'use client';

  import { LibraryFilters } from './use-library-filters';
  import { Badge } from '@sharebrary/ui/badge';
  import { Button } from '@sharebrary/ui/button';
  import { X } from 'lucide-react';

  interface ActiveFiltersProps {
    filters: LibraryFilters;
    onRemoveCategory: () => void;
    onRemoveSubcategory: () => void;
    onRemoveTag: (tag: string) => void;
    onRemoveQuery: () => void;
    onReset: () => void;
  }

  export function ActiveFilters({
    filters,
    onRemoveCategory,
    onRemoveSubcategory,
    onRemoveTag,
    onRemoveQuery,
    onReset,
  }: ActiveFiltersProps) {
    // Check if there are any active filters
    const hasActiveFilters =
      filters.query ||
      filters.category ||
      filters.subcategory ||
      filters.tags.length > 0;

    if (!hasActiveFilters) {
      return null;
    }

    return (
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {filters.query && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.query}
              <X className="h-3 w-3 cursor-pointer" onClick={onRemoveQuery} />
            </Badge>
          )}

          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={onRemoveCategory}
              />
            </Badge>
          )}

          {filters.subcategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Subcategory: {filters.subcategory}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={onRemoveSubcategory}
              />
            </Badge>
          )}

          {filters.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              Tag: {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>

        <Button variant="ghost" size="sm" onClick={onReset}>
          Clear all filters
        </Button>
      </div>
    );
  }
  ```

### 3. Server-side Search with Firestore

- [ ] Enhance the book service to support advanced queries

  ```typescript
  // libs/api/src/lib/firebase/book-service.ts
  // Enhance the existing getBooks function

  export interface BookSearchParams {
    page?: number;
    limit?: number;
    category?: string;
    subcategory?: string;
    tags?: string[];
    query?: string;
    sortBy?: 'newest' | 'title' | 'author' | 'popular';
    userId?: string; // For user-specific queries like favorite books
  }

  export async function getBooks(params: BookSearchParams = {}): Promise<{
    books: Book[];
    hasMore: boolean;
    lastDoc: QueryDocumentSnapshot | null;
  }> {
    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      tags,
      query,
      sortBy = 'newest',
      userId,
    } = params;

    const db = getFirestore();
    const booksRef = collection(db, 'books');

    // Start with base query
    let queryRef = query(booksRef, where('status', '==', 'completed'));

    // Apply category filter
    if (category) {
      queryRef = query(queryRef, where('category', '==', category));
    }

    // Apply subcategory filter if category is also specified
    if (category && subcategory) {
      queryRef = query(queryRef, where('subcategory', '==', subcategory));
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        queryRef = query(queryRef, orderBy('uploadedAt', 'desc'));
        break;
      case 'title':
        queryRef = query(queryRef, orderBy('title'));
        break;
      case 'author':
        queryRef = query(queryRef, orderBy('author'));
        break;
      case 'popular':
        queryRef = query(queryRef, orderBy('downloadCount', 'desc'));
        break;
    }

    // Apply pagination
    queryRef = query(queryRef, limit(params.limit || 20));

    // Execute the query
    const snapshot = await getDocs(queryRef);

    // Convert to Book objects
    let books = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];

    // Apply client-side filtering for tags
    if (tags && tags.length > 0) {
      books = books.filter((book) =>
        tags.some((tag) => book.tags.includes(tag))
      );
    }

    // Apply client-side text search
    // Note: In a production app, this would ideally be handled by a search service like Algolia
    if (query) {
      const normalizedQuery = query.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(normalizedQuery) ||
          book.author.toLowerCase().includes(normalizedQuery) ||
          book.description.toLowerCase().includes(normalizedQuery) ||
          book.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    }

    const hasMore = books.length === limit;
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return { books, hasMore, lastDoc };
  }
  ```

### 4. Search Results and Suggestions

- [ ] Implement a search results page

  ```typescript
  // app/search/page.tsx
  import { Suspense } from 'react';
  import { Metadata } from 'next';
  import { SearchResults } from '@sharebrary/features/search';

  export const metadata: Metadata = {
    title: 'Search | Sharebrary',
    description: 'Search for books in the Sharebrary library',
  };

  interface SearchPageProps {
    searchParams: {
      q?: string;
      category?: string;
      tag?: string;
      page?: string;
      sortBy?: string;
    };
  }

  export default function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || '';

    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>

        <Suspense fallback={<div>Searching...</div>}>
          <SearchResults
            query={query}
            category={searchParams.category}
            tag={searchParams.tag}
            page={searchParams.page ? parseInt(searchParams.page) : 1}
            sortBy={searchParams.sortBy as any}
          />
        </Suspense>
      </div>
    );
  }
  ```

- [ ] Create a search results component

  ```typescript
  // libs/features/src/lib/search/search-results.tsx
  import Link from 'next/link';
  import { redirect } from 'next/navigation';
  import { BookCard } from '@sharebrary/ui/book-card';
  import { MasonryGrid } from '@sharebrary/ui/masonry';
  import { Button } from '@sharebrary/ui/button';
  import { SearchBar } from '@sharebrary/ui/search';
  import { getBooks } from '@sharebrary/api/firebase';
  import { Pagination } from '@sharebrary/ui/pagination';

  interface SearchResultsProps {
    query: string;
    category?: string;
    tag?: string;
    page: number;
    sortBy?: 'newest' | 'title' | 'author' | 'popular';
  }

  export async function SearchResults({
    query,
    category,
    tag,
    page,
    sortBy = 'newest',
  }: SearchResultsProps) {
    // Redirect to library if no query
    if (!query && !category && !tag) {
      redirect('/library');
    }

    // Fetch books based on search params
    const { books, hasMore } = await getBooks({
      query,
      category,
      tags: tag ? [tag] : undefined,
      page,
      sortBy,
    });

    if (books.length === 0) {
      return (
        <div className="space-y-6">
          <SearchBar className="max-w-2xl mx-auto" />

          <div className="bg-card text-card-foreground rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any books matching "{query}"
              {category ? ` in ${category}` : ''}
              {tag ? ` with tag "${tag}"` : ''}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/library">
                <Button>Browse Library</Button>
              </Link>
              <Link href="/upload">
                <Button variant="outline">Upload a Book</Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <SearchBar className="max-w-2xl mx-auto" />

        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Found {books.length} results for "{query}"
          </p>

          {/* Sort options would go here - omitted for brevity */}
        </div>

        <MasonryGrid columnWidth={250} gap={24}>
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </MasonryGrid>

        <Pagination currentPage={page} hasMore={hasMore} />
      </div>
    );
  }
  ```

- [ ] Add search suggestions component

  ```typescript
  // libs/features/src/lib/search/search-suggestions.tsx
  'use client';

  import { useState, useEffect, useRef } from 'react';
  import Link from 'next/link';
  import { useRouter } from 'next/navigation';
  import { Input } from '@sharebrary/ui/input';
  import { Button } from '@sharebrary/ui/button';
  import { Search, Book, Clock, Tag, X } from 'lucide-react';
  import {
    getSearchSuggestions,
    getRecentSearches,
    saveRecentSearch,
  } from '@sharebrary/api/firebase';

  interface SearchSuggestionsProps {
    maxSuggestions?: number;
  }

  export function SearchSuggestions({
    maxSuggestions = 5,
  }: SearchSuggestionsProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    // Load recent searches when component mounts
    useEffect(() => {
      const loadRecentSearches = async () => {
        const searches = await getRecentSearches();
        setRecentSearches(searches);
      };

      loadRecentSearches();
    }, []);

    // Fetch suggestions when query changes
    useEffect(() => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      const fetchSuggestions = async () => {
        const results = await getSearchSuggestions(query, maxSuggestions);
        setSuggestions(results);
      };

      const debounce = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(debounce);
    }, [query, maxSuggestions]);

    // Close suggestions when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          searchRef.current &&
          !searchRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      // Save to recent searches
      saveRecentSearch(searchQuery);

      // Navigate to search page
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);

      // Reset state
      setQuery('');
      setIsOpen(false);
    };

    const clearRecentSearch = (e: React.MouseEvent, search: string) => {
      e.preventDefault();
      e.stopPropagation();
      setRecentSearches((prev) => prev.filter((s) => s !== search));
      // In a real app, also remove from storage/database
    };

    return (
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />

          <Input
            type="search"
            placeholder="Search books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-10 w-full"
          />

          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isOpen && (suggestions.length > 0 || recentSearches.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover rounded-md shadow-md border z-50">
            {recentSearches.length > 0 && !query && (
              <>
                <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                  Recent Searches
                </div>
                <ul>
                  {recentSearches.map((search) => (
                    <li key={search} className="px-1">
                      <Link
                        href={`/search?q=${encodeURIComponent(search)}`}
                        className="flex items-center px-3 py-2 hover:bg-accent rounded-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="flex-1">{search}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => clearRecentSearch(e, search)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
                <hr className="my-1" />
              </>
            )}

            {suggestions.length > 0 && (
              <>
                <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                  Suggestions
                </div>
                <ul>
                  {suggestions.map((suggestion) => (
                    <li key={suggestion} className="px-1">
                      <button
                        className="flex items-center w-full text-left px-3 py-2 hover:bg-accent rounded-sm"
                        onClick={() => handleSearch(suggestion)}
                      >
                        <Book className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{suggestion}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
  ```

## Deliverables

1. Enhanced search bar component for global site search
2. Advanced filtering system with active filter pills
3. Server-side search with Firestore integration
4. Search results page with suggestions

## Dependencies

- [Project Setup](./01-project-setup.md)
- [Book Library Core](./05-book-library.md)

## Next Steps

After completing this task, you can proceed to:

- [Comments and Ratings](./09-comments-ratings.md)
- [User Collections](./10-user-collections.md)
- [Analytics Dashboard](./11-analytics-dashboard.md)
