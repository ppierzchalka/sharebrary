// Common test setup for all projects
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

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
    BookOpen: () => React.createElement('span', { 'data-testid': 'book-icon' }),
    Heart: () => React.createElement('span', { 'data-testid': 'heart-icon' }),
    Calendar: () =>
      React.createElement('span', { 'data-testid': 'calendar-icon' }),
    Plus: () => React.createElement('span', { 'data-testid': 'plus-icon' }),
  };
});
