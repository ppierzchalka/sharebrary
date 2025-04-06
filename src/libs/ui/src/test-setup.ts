/* eslint-disable @typescript-eslint/no-empty-function */
// Common test setup for UI library
import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as React from 'react';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock ResizeObserver which is not available in jsdom
class ResizeObserverMock implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    // Store callback for cleanup
    this.callback = callback;
  }

  private callback: ResizeObserverCallback;
  private elements = new Set<Element>();

  observe(target: Element) {
    this.elements.add(target);
  }

  unobserve(target: Element) {
    this.elements.delete(target);
  }

  disconnect() {
    this.elements.clear();
  }
}

global.ResizeObserver = ResizeObserverMock;

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(props: React.ComponentPropsWithoutRef<'img'>) {
    return React.createElement('img', {
      ...props,
      'data-testid': 'next-image',
    });
  },
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  __esModule: true,
  default: function MockLink({
    children,
    href,
    ...props
  }: React.ComponentPropsWithoutRef<'a'> & { href: string }) {
    return React.createElement(
      'a',
      {
        ...props,
        href,
        onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          props.onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
        },
      },
      children
    );
  },
}));

// Mock Lucide icons - use specific mocks instead of generic proxy
vi.mock('lucide-react', () => ({
  __esModule: true,
  BookOpen: () =>
    React.createElement(
      'span',
      { 'data-testid': 'book-open-icon' },
      'Book Open Icon'
    ),
  Heart: () =>
    React.createElement('span', { 'data-testid': 'heart-icon' }, 'Heart Icon'),
  Calendar: () =>
    React.createElement(
      'span',
      { 'data-testid': 'calendar-icon' },
      'Calendar Icon'
    ),
  Plus: () =>
    React.createElement('span', { 'data-testid': 'plus-icon' }, 'Plus Icon'),
  Search: () =>
    React.createElement(
      'span',
      { 'data-testid': 'search-icon' },
      'Search Icon'
    ),
  Share2: () =>
    React.createElement(
      'span',
      { 'data-testid': 'share2-icon' },
      'Share2 Icon'
    ),
  Github: () =>
    React.createElement(
      'span',
      { 'data-testid': 'github-icon' },
      'Github Icon'
    ),
  Twitter: () =>
    React.createElement(
      'span',
      { 'data-testid': 'twitter-icon' },
      'Twitter Icon'
    ),
  Linkedin: () =>
    React.createElement(
      'span',
      { 'data-testid': 'linkedin-icon' },
      'LinkedIn Icon'
    ),
  BookmarkPlus: () =>
    React.createElement('div', { 'data-testid': 'bookmark-plus-icon' }),
  X: () => React.createElement('div', { 'data-testid': 'x-icon' }),
  MoreHorizontal: () =>
    React.createElement('span', { 'data-testid': 'moreHorizontal-icon' }),
  ChevronDown: () =>
    React.createElement('span', { 'data-testid': 'chevronDown-icon' }),
  ChevronLeft: () =>
    React.createElement('span', { 'data-testid': 'chevronLeft-icon' }),
  ChevronRight: () =>
    React.createElement('span', { 'data-testid': 'chevronRight-icon' }),
  Menu: () => React.createElement('span', { 'data-testid': 'menu-icon' }),
  FilterIcon: () =>
    React.createElement('span', { 'data-testid': 'filter-icon' }),
}));
