# Performance Optimization

## Overview

This task involves optimizing the Sharebrary application for better performance, focusing on improving loading times, implementing caching strategies, optimizing Firebase queries, and enhancing the user experience through optimized rendering.

## Prerequisites

- All core functionality implemented
- [Project Setup](./01-project-setup.md) completed
- [Book Library Core](./05-book-library.md) implemented

## Detailed Tasks

### 1. Performance Monitoring

- [ ] Set up performance monitoring

  ```typescript
  // libs/utils/src/lib/performance.ts
  import { getPerformance, trace } from 'firebase/performance';

  export function initPerformanceMonitoring() {
    if (typeof window !== 'undefined') {
      try {
        // Initialize Firebase Performance Monitoring
        const perf = getPerformance();
        console.log('Firebase Performance Monitoring initialized');
        return perf;
      } catch (error) {
        console.error('Failed to initialize performance monitoring:', error);
      }
    }
    return null;
  }

  export function startTrace(traceName: string) {
    if (typeof window !== 'undefined') {
      try {
        return trace(getPerformance(), traceName);
      } catch (error) {
        console.error(`Failed to start trace ${traceName}:`, error);
      }
    }
    return null;
  }
  ```

- [ ] Add performance monitoring initialization

  ```typescript
  // app/layout.tsx
  import { initPerformanceMonitoring } from '@sharebrary/utils/performance';

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // Initialize performance monitoring on the client
    useEffect(() => {
      initPerformanceMonitoring();
    }, []);

    return (
      <html lang="en" suppressHydrationWarning>
        <body className={fontSans.className}>
          {/* ... existing layout code ... */}
        </body>
      </html>
    );
  }
  ```

### 2. Image Optimization

- [ ] Optimize book cover loading

  ```typescript
  // libs/ui/src/lib/book-card/book-card.tsx
  import Image from 'next/image';

  export function BookCard({ book }: BookCardProps) {
    // ... existing code ...

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
              loading="lazy"
              quality={80}
            />
          </div>

          {/* ... rest of the component ... */}
        </div>
      </Link>
    );
  }
  ```

- [ ] Add image preloading for book detail page

  ```typescript
  // app/book/[id]/page.tsx
  import { Metadata, ResolvingMetadata } from 'next';

  interface BookPageProps {
    params: {
      id: string;
    };
  }

  export async function generateMetadata(
    { params }: BookPageProps,
    parent: ResolvingMetadata
  ): Promise<Metadata> {
    const book = await getBookById(params.id);

    if (!book) {
      return {
        title: 'Book Not Found | Sharebrary',
      };
    }

    return {
      title: `${book.title} | Sharebrary`,
      description: book.description.substring(0, 160),
      openGraph: {
        images: [{ url: book.coverURL }],
      },
    };
  }

  export default async function BookPage({ params }: BookPageProps) {
    // ... existing code ...
  }
  ```

### 3. React Component Optimization

- [ ] Memoize expensive components

  ```typescript
  // libs/features/src/lib/library/book-library.tsx
  import { memo } from 'react';
  import { BookCard } from '@sharebrary/ui/book-card';

  // Memoize BookCard to prevent unnecessary re-renders
  const MemoizedBookCard = memo(BookCard);

  export async function BookLibrary({
    category,
    tag,
    searchQuery,
    page,
  }: BookLibraryProps) {
    // ... existing code ...

    return (
      <div className="space-y-6">
        <MasonryGrid columnWidth={250} gap={24}>
          {books.map((book) => (
            <MemoizedBookCard key={book.id} book={book} />
          ))}
        </MasonryGrid>

        <Pagination currentPage={page} hasMore={hasMore} />
      </div>
    );
  }
  ```

- [ ] Implement virtualization for long lists

  ```typescript
  // libs/ui/src/lib/virtualized-list/virtualized-list.tsx
  'use client';

  import { useRef, useEffect, useState } from 'react';
  import { useInView } from 'react-intersection-observer';

  interface VirtualizedListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    itemHeight?: number;
    overscan?: number;
    className?: string;
    onEndReached?: () => void;
    endReachedThreshold?: number;
  }

  export function VirtualizedList<T>({
    items,
    renderItem,
    itemHeight = 250,
    overscan = 5,
    className = '',
    onEndReached,
    endReachedThreshold = 0.8,
  }: VirtualizedListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

    // Setup intersection observer for infinite loading
    const { ref: endRef, inView } = useInView({
      threshold: endReachedThreshold,
    });

    useEffect(() => {
      if (inView && onEndReached) {
        onEndReached();
      }
    }, [inView, onEndReached]);

    // Calculate visible items on scroll
    useEffect(() => {
      const handleScroll = () => {
        if (!containerRef.current) return;

        const { scrollTop, clientHeight } = containerRef.current;
        const visibleStart = Math.floor(scrollTop / itemHeight);
        const visibleEnd = Math.min(
          items.length - 1,
          Math.ceil((scrollTop + clientHeight) / itemHeight)
        );

        setVisibleRange({
          start: Math.max(0, visibleStart - overscan),
          end: Math.min(items.length - 1, visibleEnd + overscan),
        });
      };

      const container = containerRef.current;
      container?.addEventListener('scroll', handleScroll);

      // Initial calculation
      handleScroll();

      return () => container?.removeEventListener('scroll', handleScroll);
    }, [items.length, itemHeight, overscan]);

    const visibleItems = items.slice(visibleRange.start, visibleRange.end + 1);
    const paddingTop = visibleRange.start * itemHeight;

    return (
      <div
        ref={containerRef}
        className={`overflow-auto ${className}`}
        style={{ height: '100%' }}
      >
        <div
          style={{
            paddingTop,
            height: `${items.length * itemHeight}px`,
            position: 'relative',
          }}
        >
          {visibleItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: `${(visibleRange.start + idx) * itemHeight}px`,
                width: '100%',
              }}
            >
              {renderItem(item, visibleRange.start + idx)}
            </div>
          ))}
          <div ref={endRef} style={{ height: '1px' }} />
        </div>
      </div>
    );
  }
  ```

### 4. Data Caching and State Management

- [ ] Implement SWR for data fetching

  ```typescript
  // libs/api/src/lib/hooks/use-book.ts
  import useSWR from 'swr';
  import { getBookById } from '../firebase/book-service';

  export function useBook(bookId: string | null) {
    const { data, error, isLoading, mutate } = useSWR(
      bookId ? `book-${bookId}` : null,
      () => (bookId ? getBookById(bookId) : null),
      {
        revalidateOnFocus: false,
        dedupingInterval: 60000, // 1 minute
      }
    );

    return {
      book: data,
      isLoading,
      isError: error,
      mutate,
    };
  }
  ```

- [ ] Add global SWR config

  ```typescript
  // app/providers.tsx
  'use client';

  import { SWRConfig } from 'swr';
  import { ThemeProvider } from 'next-themes';
  import { AuthProvider } from '@sharebrary/auth';
  import { WhiteLabelProvider } from '@sharebrary/features/white-label';

  interface ProvidersProps {
    children: React.ReactNode;
  }

  export function Providers({ children }: ProvidersProps) {
    return (
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          errorRetryCount: 3,
          dedupingInterval: 10000, // 10 seconds
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <WhiteLabelProvider>{children}</WhiteLabelProvider>
          </AuthProvider>
        </ThemeProvider>
      </SWRConfig>
    );
  }
  ```

### 5. Firestore Query Optimization

- [ ] Optimize Firebase queries

  ```typescript
  // libs/api/src/lib/firebase/book-service.ts

  // Before
  export async function getBooks(params: BookSearchParams = {}): Promise<{
    books: Book[];
    hasMore: boolean;
    lastDoc: QueryDocumentSnapshot | null;
  }> {
    // ... existing code ...

    // Execute the query
    const snapshot = await getDocs(queryRef);

    // Convert to Book objects
    let books = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Book[];

    // ... rest of the function ...
  }

  // After
  export async function getBooks(params: BookSearchParams = {}): Promise<{
    books: Book[];
    hasMore: boolean;
    lastDoc: QueryDocumentSnapshot | null;
  }> {
    // ... existing code ...

    // Execute the query
    const snapshot = await getDocs(queryRef);

    // Convert to Book objects, but only select fields we need
    let books = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        author: data.author,
        description: data.description?.substring(0, 150) || '',
        coverURL: data.coverURL,
        tags: data.tags || [],
        category: data.category,
        subcategory: data.subcategory,
        // Only include fields needed for display
      } as Book;
    });

    // ... rest of the function ...
  }
  ```

- [ ] Add Firebase query caching

  ```typescript
  // libs/api/src/lib/firebase/cache.ts

  type CacheEntry<T> = {
    data: T;
    timestamp: number;
    expiresAt: number;
  };

  const CACHE: Record<string, CacheEntry<any>> = {};
  const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  export function getCachedData<T>(key: string): T | null {
    const entry = CACHE[key];

    if (!entry) return null;

    if (entry.expiresAt < Date.now()) {
      // Cache expired
      delete CACHE[key];
      return null;
    }

    return entry.data as T;
  }

  export function setCachedData<T>(
    key: string,
    data: T,
    ttl = DEFAULT_TTL
  ): void {
    const now = Date.now();

    CACHE[key] = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };
  }

  export function clearCache(): void {
    Object.keys(CACHE).forEach((key) => {
      delete CACHE[key];
    });
  }

  export function buildCacheKey(
    name: string,
    params: Record<string, any> = {}
  ): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce<Record<string, any>>((acc, key) => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {});

    return `${name}:${JSON.stringify(sortedParams)}`;
  }
  ```

### 6. Next.js Build Optimization

- [ ] Optimize Next.js configuration

  ```typescript
  // next.config.js
  const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
  const { join } = require('path');

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    transpilePackages: [
      '@sharebrary/ui',
      '@sharebrary/api',
      '@sharebrary/auth',
      '@sharebrary/features',
      '@sharebrary/utils',
    ],
    images: {
      domains: [
        'firebasestorage.googleapis.com',
        'localhost',
        // Add other image domains as needed
      ],
      formats: ['image/webp'],
    },
    swcMinify: true,
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    experimental: {
      optimizeCss: true,
      nextScriptWorkers: true,
    },
    // Only analyze in build workflow
    webpack: (config, { isServer, dev }) => {
      if (process.env.ANALYZE === 'true' && !isServer && !dev) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: true,
          })
        );
      }
      return config;
    },
  };

  module.exports = nextConfig;
  ```

## Deliverables

1. Performance monitoring integration
2. Optimized image loading with Next.js Image
3. React component optimizations (memoization, virtualization)
4. Data fetching and caching strategies
5. Firestore query optimizations
6. Next.js build configuration improvements

## Dependencies

All application features should be implemented before optimizing performance.

## Next Steps

Once all tasks are completed, prepare for production deployment with:

1. Thorough testing across devices and browsers
2. Security review
3. Accessibility review
4. Production deployment setup
