# Book Library Core

## Overview

This task involves implementing the core book library functionality for Sharebrary, including book data models, the book card component, the library view with masonry layout, and the detailed book page.

## Prerequisites

- [Project Setup](./01-project-setup.md) completed
- [Authentication System](./03-authentication.md) implemented

## Detailed Tasks

### 1. Book Data Models

- [ ] Define book interface and schema

  ```typescript
  // libs/api/src/lib/models/book.ts
  export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    coverURL: string;
    fileURL: string;
    tags: string[];
    category: string;
    subcategory?: string;
    uploadedBy: string; // User UID
    status: 'processing' | 'completed' | 'error';
    uploadedAt: Date;
    processedAt?: Date;
    metadataSource: 'google_books' | 'gemini_ai' | 'user_provided';
  }
  ```

- [ ] Create category and tag data structures

  ```typescript
  // libs/api/src/lib/models/categories.ts
  export interface Category {
    name: string;
    subcategories?: string[];
  }

  export const CATEGORIES: Category[] = [
    {
      name: 'Fiction',
      subcategories: [
        'Fantasy',
        'Science Fiction',
        'Mystery',
        'Romance',
        'Thriller',
        'Horror',
      ],
    },
    {
      name: 'Non-Fiction',
      subcategories: [
        'Biography',
        'History',
        'Science',
        'Self-Help',
        'Business',
        'Philosophy',
      ],
    },
    { name: 'Poetry' },
    { name: 'Drama' },
    {
      name: 'Computers',
      subcategories: [
        'Programming',
        'Networking',
        'Databases',
        'Web Development',
      ],
    },
    { name: 'Art', subcategories: ['Design', 'Photography', 'Architecture'] },
    { name: 'Other' },
  ];

  export const TAGS = [
    'bestseller',
    'classic',
    'award-winning',
    'new-release',
    'translated',
    'illustrated',
    'academic',
    'recommended',
    'popular',
    'textbook',
  ];
  ```

- [ ] Implement Firestore data access methods

  ```typescript
  // libs/api/src/lib/firebase/book-service.ts
  import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getFirestore,
    orderBy,
    limit,
    startAfter,
    serverTimestamp,
    QueryDocumentSnapshot,
  } from 'firebase/firestore';
  import { getStorage, ref, getDownloadURL } from 'firebase/storage';
  import { Book } from '../models/book';

  const db = getFirestore();
  const storage = getStorage();
  const BOOKS_PER_PAGE = 20;

  export async function getBooks(
    page = 1,
    category?: string,
    tags?: string[],
    searchQuery?: string
  ): Promise<{
    books: Book[];
    hasMore: boolean;
    lastDoc: QueryDocumentSnapshot | null;
  }> {
    const booksRef = collection(db, 'books');
    let q = query(
      booksRef,
      where('status', '==', 'completed'),
      orderBy('uploadedAt', 'desc'),
      limit(BOOKS_PER_PAGE)
    );

    // Apply category filter
    if (category) {
      q = query(
        booksRef,
        where('status', '==', 'completed'),
        where('category', '==', category),
        orderBy('uploadedAt', 'desc'),
        limit(BOOKS_PER_PAGE)
      );
    }

    // Tags and search query filtering would be client-side for now
    // More advanced filtering would require Firestore composite indexes

    const snapshot = await getDocs(q);

    let books = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];

    // Client-side filtering for tags if specified
    if (tags && tags.length > 0) {
      books = books.filter((book) =>
        tags.some((tag) => book.tags.includes(tag))
      );
    }

    // Client-side filtering for search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery) ||
          book.description.toLowerCase().includes(lowerQuery)
      );
    }

    const hasMore = books.length === BOOKS_PER_PAGE;
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return { books, hasMore, lastDoc };
  }

  export async function getBookById(id: string): Promise<Book | null> {
    const bookRef = doc(db, 'books', id);
    const bookSnap = await getDoc(bookRef);

    if (!bookSnap.exists()) {
      return null;
    }

    return {
      id: bookSnap.id,
      ...bookSnap.data(),
    } as Book;
  }

  export async function getBookDownloadURL(fileURL: string): Promise<string> {
    // Convert storage path to download URL
    const storageRef = ref(storage, fileURL);
    return getDownloadURL(storageRef);
  }
  ```

### 2. Book Card Component

- [ ] Create book card component

  ```typescript
  // libs/ui/src/lib/book-card/book-card.tsx
  import Image from 'next/image';
  import Link from 'next/link';
  import { Book } from '@sharebrary/api/models';
  import { Badge } from '../badge/badge';

  interface BookCardProps {
    book: Book;
  }

  export function BookCard({ book }: BookCardProps) {
    // Limit tags shown to prevent overflow
    const displayTags = book.tags.slice(0, 3);

    return (
      <Link href={`/book/${book.id}`} className="block">
        <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={book.coverURL}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/jfwAJhAPKCEHhQgAAAABJRU5ErkJggg=="
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {book.author}
            </p>

            {displayTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {displayTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {book.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{book.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <p className="text-sm line-clamp-2">{book.description}</p>
          </div>
        </div>
      </Link>
    );
  }
  ```

- [ ] Create book card skeleton for loading states
  ```typescript
  // libs/ui/src/lib/book-card/book-card-skeleton.tsx
  export function BookCardSkeleton() {
    return (
      <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-md">
        <div className="relative aspect-[2/3] bg-muted animate-pulse"></div>
        <div className="p-4 space-y-3">
          <div className="h-5 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="flex gap-1">
            <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
            <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-muted rounded animate-pulse"></div>
            <div className="h-3 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  ```

### 3. Library View

- [ ] Create masonry layout component

  ```typescript
  // libs/ui/src/lib/masonry/masonry-grid.tsx
  'use client';

  import { useRef, useEffect, useState } from 'react';
  import { useWindowSize } from '@sharebrary/utils/hooks';

  interface MasonryGridProps {
    children: React.ReactNode[];
    columnWidth?: number;
    gap?: number;
  }

  export function MasonryGrid({
    children,
    columnWidth = 300,
    gap = 16,
  }: MasonryGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [columns, setColumns] = useState(1);
    const windowSize = useWindowSize();

    useEffect(() => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const cols = Math.max(1, Math.floor(width / (columnWidth + gap)));
        setColumns(cols);
      }
    }, [windowSize, columnWidth, gap]);

    // Distribute children among columns
    const columnItems: React.ReactNode[][] = Array.from(
      { length: columns },
      () => []
    );

    children.forEach((child, index) => {
      columnItems[index % columns].push(
        <div key={index} style={{ marginBottom: `${gap}px` }}>
          {child}
        </div>
      );
    });

    return (
      <div
        ref={containerRef}
        className="w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `0 ${gap}px`,
        }}
      >
        {columnItems.map((items, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {items}
          </div>
        ))}
      </div>
    );
  }
  ```

- [ ] Implement library page

  ```typescript
  // app/library/page.tsx
  import { Suspense } from 'react';
  import { Metadata } from 'next';
  import { RouteGuard } from '@sharebrary/auth';
  import { BookLibrary } from '@sharebrary/features/library';
  import { LibraryFilters } from '@sharebrary/features/library';

  export const metadata: Metadata = {
    title: 'Library | Sharebrary',
    description: 'Browse and discover books in the Sharebrary collection',
  };

  interface LibraryPageProps {
    searchParams: {
      category?: string;
      tag?: string;
      q?: string;
      page?: string;
    };
  }

  export default function LibraryPage({ searchParams }: LibraryPageProps) {
    return (
      <RouteGuard requireAuth>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Library</h1>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3">
              <Suspense fallback={<div>Loading filters...</div>}>
                <LibraryFilters
                  selectedCategory={searchParams.category}
                  selectedTag={searchParams.tag}
                />
              </Suspense>
            </div>

            <div className="col-span-12 lg:col-span-9">
              <Suspense fallback={<div>Loading books...</div>}>
                <BookLibrary
                  category={searchParams.category}
                  tag={searchParams.tag}
                  searchQuery={searchParams.q}
                  page={searchParams.page ? parseInt(searchParams.page) : 1}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </RouteGuard>
    );
  }
  ```

- [ ] Create library filters component

  ```typescript
  // libs/features/src/lib/library/library-filters.tsx
  'use client';

  import { useState } from 'react';
  import Link from 'next/link';
  import { useRouter, usePathname, useSearchParams } from 'next/navigation';
  import { CATEGORIES, TAGS } from '@sharebrary/api/models';
  import { Badge } from '@sharebrary/ui/badge';
  import { Button } from '@sharebrary/ui/button';
  import { Input } from '@sharebrary/ui/input';

  interface LibraryFiltersProps {
    selectedCategory?: string;
    selectedTag?: string;
  }

  export function LibraryFilters({
    selectedCategory,
    selectedTag,
  }: LibraryFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

    const createQueryString = (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      // Reset page when filters change
      if (name !== 'page') {
        params.delete('page');
      }

      return params.toString();
    };

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());

      if (searchValue) {
        params.set('q', searchValue);
      } else {
        params.delete('q');
      }

      // Reset page when search changes
      params.delete('page');

      router.push(`${pathname}?${params.toString()}`);
    };

    return (
      <div className="space-y-6">
        <form onSubmit={handleSearch} className="space-y-2">
          <div className="flex items-center">
            <Input
              type="search"
              placeholder="Search books..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" className="ml-2">
              Search
            </Button>
          </div>

          {searchParams.has('q') && (
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">
                Search: {searchParams.get('q')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('q');
                  params.delete('page');
                  setSearchValue('');
                  router.push(`${pathname}?${params.toString()}`);
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </form>

        <div>
          <h3 className="font-medium mb-2">Categories</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href={pathname}
                className={`block p-2 rounded hover:bg-muted transition-colors ${
                  !selectedCategory ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                All Categories
              </Link>
            </li>
            {CATEGORIES.map((category) => (
              <li key={category.name}>
                <Link
                  href={`${pathname}?${createQueryString(
                    'category',
                    category.name
                  )}`}
                  className={`block p-2 rounded hover:bg-muted transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-primary/10 text-primary'
                      : ''
                  }`}
                >
                  {category.name}
                </Link>

                {selectedCategory === category.name &&
                  category.subcategories && (
                    <ul className="pl-4 mt-1 space-y-1">
                      {category.subcategories.map((subcat) => (
                        <li key={subcat}>
                          <Link
                            href={`${pathname}?${createQueryString(
                              'subcategory',
                              subcat
                            )}&${createQueryString('category', category.name)}`}
                            className="block p-1 text-sm rounded hover:bg-muted transition-colors"
                          >
                            {subcat}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <Link
                key={tag}
                href={`${pathname}?${createQueryString('tag', tag)}`}
              >
                <Badge
                  className={
                    selectedTag === tag
                      ? 'bg-primary text-primary-foreground'
                      : ''
                  }
                  variant={selectedTag === tag ? 'default' : 'outline'}
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] Create book library component

  ```typescript
  // libs/features/src/lib/library/book-library.tsx
  import { getBooks } from '@sharebrary/api/firebase';
  import { BookCard, BookCardSkeleton } from '@sharebrary/ui/book-card';
  import { MasonryGrid } from '@sharebrary/ui/masonry';
  import { Button } from '@sharebrary/ui/button';
  import { Pagination } from '@sharebrary/ui/pagination';
  import Link from 'next/link';

  interface BookLibraryProps {
    category?: string;
    tag?: string;
    searchQuery?: string;
    page: number;
  }

  export async function BookLibrary({
    category,
    tag,
    searchQuery,
    page,
  }: BookLibraryProps) {
    // Fetch books with filters
    const { books, hasMore } = await getBooks(
      page,
      category,
      tag ? [tag] : undefined,
      searchQuery
    );

    if (books.length === 0) {
      return (
        <div className="bg-card text-card-foreground rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No books found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : 'No books match the selected filters'}
          </p>
          <Link href="/library">
            <Button>Clear Filters</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-6">
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

### 4. Book Detail Page

- [ ] Create book detail page

  ```typescript
  // app/book/[id]/page.tsx
  import { Suspense } from 'react';
  import { Metadata } from 'next';
  import { notFound } from 'next/navigation';
  import { RouteGuard } from '@sharebrary/auth';
  import { getBookById } from '@sharebrary/api/firebase';
  import { BookDetail } from '@sharebrary/features/library';

  interface BookPageProps {
    params: {
      id: string;
    };
  }

  export async function generateMetadata({
    params,
  }: BookPageProps): Promise<Metadata> {
    const book = await getBookById(params.id);

    if (!book) {
      return {
        title: 'Book Not Found | Sharebrary',
      };
    }

    return {
      title: `${book.title} | Sharebrary`,
      description: book.description.substring(0, 160),
    };
  }

  export default async function BookPage({ params }: BookPageProps) {
    const book = await getBookById(params.id);

    if (!book) {
      return notFound();
    }

    return (
      <RouteGuard requireAuth>
        <div className="container py-8">
          <Suspense fallback={<div>Loading book details...</div>}>
            <BookDetail book={book} />
          </Suspense>
        </div>
      </RouteGuard>
    );
  }
  ```

- [ ] Implement book detail component

  ```typescript
  // libs/features/src/lib/library/book-detail.tsx
  'use client';

  import { useState } from 'react';
  import Image from 'next/image';
  import Link from 'next/link';
  import { Book } from '@sharebrary/api/models';
  import { Badge } from '@sharebrary/ui/badge';
  import { Button } from '@sharebrary/ui/button';
  import { getBookDownloadURL } from '@sharebrary/api/firebase';
  import { useAuth } from '@sharebrary/auth';
  import { trackBookDownload } from '@sharebrary/api/firebase';
  import { Download, Heart } from 'lucide-react';

  interface BookDetailProps {
    book: Book;
  }

  export function BookDetail({ book }: BookDetailProps) {
    const { user } = useAuth();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleDownload = async () => {
      setIsDownloading(true);

      try {
        // Get download URL from Firebase Storage
        const downloadUrl = await getBookDownloadURL(book.fileURL);

        // Create anchor and simulate click
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${book.title} - ${book.author}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Track download
        if (user) {
          await trackBookDownload(user.uid, book.id);
        }
      } catch (error) {
        console.error('Download error:', error);
      } finally {
        setIsDownloading(false);
      }
    };

    const toggleFavorite = async () => {
      // Implement favorite toggling (will be covered in User Collections task)
      setIsFavorite(!isFavorite);
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={book.coverURL}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={handleDownload}
                className="w-full"
                disabled={isDownloading}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={toggleFavorite}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-primary' : ''}`}
                />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

          {book.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {book.tags.map((tag) => (
                <Link key={tag} href={`/library?tag=${tag}`}>
                  <Badge variant="outline">{tag}</Badge>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <span className="font-medium mr-1">Category:</span>
              <Link
                href={`/library?category=${book.category}`}
                className="hover:text-primary"
              >
                {book.category}
              </Link>
            </div>

            {book.subcategory && (
              <>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <span className="font-medium mr-1">Subcategory:</span>
                  <Link
                    href={`/library?category=${book.category}&subcategory=${book.subcategory}`}
                    className="hover:text-primary"
                  >
                    {book.subcategory}
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">About this book</h2>
            <div className="whitespace-pre-line">{book.description}</div>
          </div>

          {/* Comments will be added in Comments & Ratings task */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            <p className="text-muted-foreground">
              Comments functionality will be implemented soon.
            </p>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] Create 404 page for missing books

  ```typescript
  // app/not-found.tsx
  import Link from 'next/link';
  import { Button } from '@sharebrary/ui/button';

  export default function NotFound() {
    return (
      <div className="container py-20">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/library">
            <Button>Go to Library</Button>
          </Link>
        </div>
      </div>
    );
  }
  ```

## Deliverables

1. Book data model and Firestore integration
2. Book card component with consistent styling
3. Library page with masonry layout and filtering
4. Book detail page with download functionality
5. 404 page for missing content

## Dependencies

- [Project Setup](./01-project-setup.md)
- [Authentication System](./03-authentication.md)

## Next Steps

After completing this task, you can proceed to:

- [Book Upload System](./06-book-upload.md)
- [Search and Filtering](./08-search-filtering.md) (already partially implemented here)
- [Comments and Ratings](./09-comments-ratings.md)
- [User Collections](./10-user-collections.md)
