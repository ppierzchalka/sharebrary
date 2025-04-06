/* eslint-disable @typescript-eslint/no-empty-function */
import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, beforeEach, afterEach } from 'vitest';
import { Sidebar } from './sidebar';
import { Category } from './sidebar.types';

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

const mockCategories: Category[] = [
  {
    name: 'Fiction',
    subcategories: [
      { name: 'Science Fiction' },
      { name: 'Fantasy' },
      { name: 'Mystery' },
    ],
  },
  {
    name: 'Non-Fiction',
    subcategories: [
      { name: 'Science' },
      { name: 'History' },
      { name: 'Biography' },
    ],
  },
];

const mockTags = [
  'Bestseller',
  'New Release',
  'Award Winner',
  'Classic',
  'Popular',
  'Recommended',
];

describe('Sidebar', () => {
  const defaultProps = {
    categories: mockCategories,
    tags: mockTags,
    selectedCategory: '',
    selectedSubcategory: '',
    selectedTags: [],
    onCategoryChange: vi.fn(),
    onSubcategoryChange: vi.fn(),
    onTagToggle: vi.fn(),
    onClearFilters: vi.fn(),
    baseUrl: '/library',
  };

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
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('renders categories', () => {
    render(<Sidebar {...defaultProps} />);

    // Check if categories are rendered
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Non-Fiction')).toBeInTheDocument();
  });

  it('renders categories as links when no callbacks provided', () => {
    render(
      <Sidebar
        {...defaultProps}
        onCategoryChange={undefined}
        onSubcategoryChange={undefined}
      />
    );

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
    render(<Sidebar {...defaultProps} onCategoryChange={onCategoryChange} />);

    // Find and click the Fiction category button
    const fictionButton = screen.getByRole('button', {
      name: 'Fiction category',
    });
    await user.click(fictionButton);

    expect(onCategoryChange).toHaveBeenCalledWith('Fiction');
  });

  it('renders category expand buttons correctly', () => {
    render(<Sidebar {...defaultProps} selectedCategory="Fiction" />);

    // Test that the expand button exists for the Fiction category
    expect(screen.getByTestId('Fiction-expand-button')).toBeInTheDocument();
    // Check for Non-Fiction category expand button as well
    expect(screen.getByTestId('Non-Fiction-expand-button')).toBeInTheDocument();
  });

  it('renders tags as links when no callbacks provided', () => {
    render(<Sidebar {...defaultProps} onTagToggle={undefined} />);

    const bestsellerLink = screen.getByRole('link', { name: 'Bestseller' });
    const newReleaseLink = screen.getByRole('link', { name: 'New Release' });
    const awardWinnerLink = screen.getByRole('link', { name: 'Award Winner' });
    const classicLink = screen.getByRole('link', { name: 'Classic' });
    const popularLink = screen.getByRole('link', { name: 'Popular' });
    const recommendedLink = screen.getByRole('link', { name: 'Recommended' });

    expect(bestsellerLink).toHaveAttribute(
      'href',
      encodeURI('/library?tag=Bestseller')
    );
    expect(newReleaseLink).toHaveAttribute(
      'href',
      encodeURI('/library?tag=New Release')
    );
    expect(awardWinnerLink).toHaveAttribute(
      'href',
      encodeURI('/library?tag=Award Winner')
    );
    expect(classicLink).toHaveAttribute(
      'href',
      encodeURI('/library?tag=Classic')
    );
    expect(popularLink).toHaveAttribute(
      'href',
      encodeURI('/library?tag=Popular')
    );
    expect(recommendedLink).toHaveAttribute(
      'href',
      encodeURI('/library?tag=Recommended')
    );
  });

  it('renders tags as buttons when callback provided', async () => {
    const user = userEvent.setup();
    const onTagToggle = vi.fn();
    render(<Sidebar {...defaultProps} onTagToggle={onTagToggle} />);

    const tagButton = screen.getByRole('button', { name: 'Bestseller tag' });
    await user.click(tagButton);

    expect(onTagToggle).toHaveBeenCalledWith('Bestseller');
  });

  it('shows clear filters button when there are selections', () => {
    render(
      <Sidebar
        {...defaultProps}
        selectedCategory="Fiction"
        selectedSubcategory="Science Fiction"
        selectedTags={['Bestseller']}
      />
    );

    const clearButton = screen.getByText('Clear all');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(defaultProps.onClearFilters).toHaveBeenCalled();
  });

  it('does not show clear filters button when there are no selections', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });

  it('renders mobile trigger button on small screens', () => {
    // Mock window resize
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    const { container } = render(<Sidebar {...defaultProps} />);

    // Check if mobile trigger button exists
    const mobileButton = container.querySelector(
      '[data-testid="sidebar-mobile-trigger"]'
    );
    expect(mobileButton).toBeInTheDocument();
  });

  it('renders in mobile mode with sheet', async () => {
    // Set window width to mobile size
    window.innerWidth = 600;
    window.dispatchEvent(new Event('resize'));

    const { container } = render(<Sidebar {...defaultProps} />);

    // Check if mobile trigger button exists
    const mobileTrigger = screen.getByTestId('sidebar-mobile-trigger');
    expect(mobileTrigger).toBeInTheDocument();

    // Sheet content should not be visible initially
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
});
