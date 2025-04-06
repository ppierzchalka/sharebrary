/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Sidebar } from './sidebar';

// Required to mock the next/navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: () => '/library',
  useSearchParams: () => new URLSearchParams(),
}));

const mockProps = {
  categories: [
    { name: 'Fiction', subcategories: ['Fantasy', 'Mystery'] },
    { name: 'Non-Fiction' },
  ],
  tags: ['bestseller', 'classic'],
};

describe('Sidebar', () => {
  it('renders filter title', () => {
    render(<Sidebar {...mockProps} />);
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('renders all categories as links', () => {
    render(<Sidebar {...mockProps} />);

    // Categories should be rendered as links
    const fictionLink = screen.getByText('Fiction').closest('a');
    expect(fictionLink).toHaveAttribute('href', '/library?category=Fiction');

    const nonFictionLink = screen.getByText('Non-Fiction').closest('a');
    expect(nonFictionLink).toHaveAttribute(
      'href',
      '/library?category=Non-Fiction'
    );
  });

  it('renders category as clickable when callback is provided', () => {
    const onCategoryChange = vi.fn();
    render(<Sidebar {...mockProps} onCategoryChange={onCategoryChange} />);

    // Click on the Fiction category (span, not link)
    fireEvent.click(screen.getByText('Fiction'));

    expect(onCategoryChange).toHaveBeenCalledWith('Fiction');
  });

  it('renders subcategories within accordion content', async () => {
    render(<Sidebar {...mockProps} selectedCategory="Fiction" />);

    // Find the accordion item for Fiction
    const fictionItem = screen
      .getByText('Fiction')
      .closest('div[class*="border-b-0"]');

    // Find and click the accordion trigger within the accordion item
    const accordionTrigger = fictionItem?.querySelector(
      '[class*="accordion-trigger"]'
    );
    if (accordionTrigger) {
      fireEvent.click(accordionTrigger);
    }

    // Subcategories should be visible as links
    const fantasyLink = screen.getByText('Fantasy').closest('a');
    expect(fantasyLink).toHaveAttribute(
      'href',
      '/library?category=Fiction&subcategory=Fantasy'
    );

    const mysteryLink = screen.getByText('Mystery').closest('a');
    expect(mysteryLink).toHaveAttribute(
      'href',
      '/library?category=Fiction&subcategory=Mystery'
    );
  });

  it('renders subcategories as clickable when callback is provided', () => {
    const onSubcategoryChange = vi.fn();
    render(
      <Sidebar
        {...mockProps}
        selectedCategory="Fiction"
        onCategoryChange={() => {}}
        onSubcategoryChange={onSubcategoryChange}
      />
    );

    // Find the accordion item for Fiction
    const fictionItem = screen
      .getByText('Fiction')
      .closest('div[class*="border-b-0"]');

    // Find and click the accordion trigger within the accordion item
    const accordionTrigger = fictionItem?.querySelector(
      '[class*="accordion-trigger"]'
    );
    if (accordionTrigger) {
      fireEvent.click(accordionTrigger);
    }

    // Click on a subcategory
    fireEvent.click(screen.getByText('Fantasy'));

    expect(onSubcategoryChange).toHaveBeenCalledWith('Fantasy');
  });

  it('renders all tags as badges', () => {
    render(<Sidebar {...mockProps} />);

    // Tags should be rendered within badges
    expect(screen.getByText('bestseller')).toBeInTheDocument();
    expect(screen.getByText('classic')).toBeInTheDocument();

    // Tags should be links
    const bestsellerLink = screen.getByText('bestseller').closest('a');
    expect(bestsellerLink).toHaveAttribute('href', '/library?tag=bestseller');
  });

  it('calls tag toggle callback when provided', () => {
    const onTagToggle = vi.fn();
    render(<Sidebar {...mockProps} onTagToggle={onTagToggle} />);

    // Click on a tag badge - Fix: add null check and use an assertion to ensure element exists
    const tagElement = screen
      .getByText('bestseller')
      .closest('.cursor-pointer');
    if (tagElement) {
      fireEvent.click(tagElement);
    }

    expect(onTagToggle).toHaveBeenCalledWith('bestseller');
  });

  it('offers a clear all button when filters are active', () => {
    const onClearFilters = vi.fn();
    render(
      <Sidebar
        {...mockProps}
        selectedCategory="Fiction"
        onCategoryChange={() => {}}
        onClearFilters={onClearFilters}
      />
    );

    // Clear all button should be visible
    const clearButton = screen.getByText('Clear all');
    expect(clearButton).toBeInTheDocument();

    // Click clear button
    fireEvent.click(clearButton);
    expect(onClearFilters).toHaveBeenCalled();
  });
});
