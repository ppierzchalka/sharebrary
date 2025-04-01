import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the Inter font and FontProvider
vi.mock('next/font/google', () => ({
  Inter: () => ({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
    className: 'mock-inter-class',
  }),
}));

vi.mock('@/ui', () => ({
  ...vi.importActual('@/ui'),
  FontProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'font-provider' }, children),
}));

import Page from './page';

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
