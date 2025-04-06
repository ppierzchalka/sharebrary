/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, beforeEach, afterEach } from 'vitest';
import { Sidebar } from './sidebar';

// Mock next/navigation hooks
const mockUsePathname = vi.fn(() => '/library');
const mockUseSearchParams = vi.fn(() => new URLSearchParams());
const mockPush = vi.fn();
const mockRouter = { push: mockPush };

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
  useRouter: () => mockRouter,
}));

const mockProps = {
  categories: [
    { name: 'Fiction', subcategories: ['Fantasy', 'Mystery'] },
    { name: 'Non-Fiction' },
  ],
  tags: ['bestseller', 'classic'],
};

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.innerWidth for mobile detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width by default
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders filter title', () => {
    render(<Sidebar {...mockProps} />);
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('renders categories as links when no callbacks provided', () => {
    render(<Sidebar {...mockProps} />);

    // Categories should be rendered with proper navigation
    const fictionLink = screen.getByRole('link', { name: 'Fiction' });
    const nonFictionLink = screen.getByRole('link', { name: 'Non-Fiction' });

    expect(fictionLink).toHaveAttribute('href', '/library?category=Fiction');
    expect(nonFictionLink).toHaveAttribute(
      'href',
      '/library?category=Non-Fiction'
    );
  });

  it('renders categories as buttons when callback provided', async () => {
    const user = userEvent.setup();
    const onCategoryChange = vi.fn();
    render(<Sidebar {...mockProps} onCategoryChange={onCategoryChange} />);

    // Find and click the Fiction category button
    const fictionButton = screen.getByRole('button', {
      name: 'Fiction category',
    });
    await user.click(fictionButton);

    expect(onCategoryChange).toHaveBeenCalledWith('Fiction');
  });

  it('expands category and shows subcategory links when no callbacks provided', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...mockProps} selectedCategory="Fiction" />);

    // Find and click the expand trigger button
    const expandTrigger = screen.getByTestId('Fiction-expand-trigger');
    await user.click(expandTrigger);

    // Check for subcategories
    const fantasyLink = screen.getByRole('link', { name: 'Fantasy' });
    const mysteryLink = screen.getByRole('link', { name: 'Mystery' });

    expect(fantasyLink).toBeInTheDocument();
    expect(mysteryLink).toBeInTheDocument();

    expect(fantasyLink).toHaveAttribute(
      'href',
      '/library?category=Fiction&subcategory=Fantasy'
    );
    expect(mysteryLink).toHaveAttribute(
      'href',
      '/library?category=Fiction&subcategory=Mystery'
    );
  });

  it('expands category and shows subcategory buttons when callback provided', async () => {
    const user = userEvent.setup();
    const onSubcategoryChange = vi.fn();

    render(
      <Sidebar
        {...mockProps}
        selectedCategory="Fiction"
        onSubcategoryChange={onSubcategoryChange}
      />
    );

    // Find and click the expand trigger button
    const expandTrigger = screen.getByTestId('Fiction-expand-trigger');
    await user.click(expandTrigger);

    // Find and click the Fantasy subcategory button
    const fantasyButton = screen.getByRole('button', {
      name: 'Fantasy subcategory',
    });
    await user.click(fantasyButton);

    expect(onSubcategoryChange).toHaveBeenCalledWith('Fantasy');
  });

  it('renders tags as links when no callbacks provided', () => {
    render(<Sidebar {...mockProps} />);

    const bestsellerLink = screen.getByRole('link', { name: 'bestseller' });
    const classicLink = screen.getByRole('link', { name: 'classic' });

    expect(bestsellerLink).toHaveAttribute('href', '/library?tag=bestseller');
    expect(classicLink).toHaveAttribute('href', '/library?tag=classic');
  });

  it('renders tags as buttons when callback provided', async () => {
    const user = userEvent.setup();
    const onTagToggle = vi.fn();
    render(<Sidebar {...mockProps} onTagToggle={onTagToggle} />);

    const tagButton = screen.getByRole('button', { name: 'bestseller tag' });
    await user.click(tagButton);

    expect(onTagToggle).toHaveBeenCalledWith('bestseller');
  });

  it('handles clear filters button click', async () => {
    const user = userEvent.setup();
    const onClearFilters = vi.fn();

    render(
      <Sidebar
        {...mockProps}
        selectedCategory="Fiction"
        onClearFilters={onClearFilters}
      />
    );

    const clearButton = screen.getByRole('button', { name: 'Clear all' });
    await user.click(clearButton);

    expect(onClearFilters).toHaveBeenCalled();
  });

  it('renders in mobile mode with sheet', async () => {
    // Set window width to mobile size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));

    const { container } = render(<Sidebar {...mockProps} />);

    // Check if mobile trigger button exists
    const mobileTrigger = screen.getByTestId('sidebar-mobile-trigger');
    expect(mobileTrigger).toBeInTheDocument();

    // Sheet content should not be visible initially
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
});
