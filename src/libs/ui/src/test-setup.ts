/* eslint-disable @typescript-eslint/no-empty-function */
// Common test setup for UI library
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock ResizeObserver which is not available in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
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

// Mock Lucide icons
vi.mock('lucide-react', () => {
  return {
    MoreHorizontal: () =>
      React.createElement('span', { 'data-testid': 'moreHorizontal-icon' }),
    ChevronDown: () =>
      React.createElement('span', { 'data-testid': 'chevronDown-icon' }),
    ChevronLeft: () =>
      React.createElement('span', { 'data-testid': 'chevronLeft-icon' }),
    ChevronRight: () =>
      React.createElement('span', { 'data-testid': 'chevronRight-icon' }),
    X: () => React.createElement('span', { 'data-testid': 'x-icon' }),
    Menu: () => React.createElement('span', { 'data-testid': 'menu-icon' }),
    BookOpen: () => React.createElement('span', { 'data-testid': 'book-icon' }),
    Heart: () => React.createElement('span', { 'data-testid': 'heart-icon' }),
    Calendar: () =>
      React.createElement('span', { 'data-testid': 'calendar-icon' }),
    Plus: () => React.createElement('span', { 'data-testid': 'plus-icon' }),
  };
});
