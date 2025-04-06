import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeaturesSection } from './features-section';
import { Search, Share2, BookOpen } from 'lucide-react';

const mockFeatures = [
  {
    icon: Search,
    title: 'Discover Books',
    description: 'Browse our growing collection of ebooks.',
  },
  {
    icon: BookOpen,
    title: 'Read Anywhere',
    description: 'Access your library on any device.',
  },
  {
    icon: Share2,
    title: 'Share with Friends',
    description: 'Share your favorite books with your network.',
  },
];

describe('FeaturesSection', () => {
  it('renders all features correctly', () => {
    render(<FeaturesSection features={mockFeatures} />);

    // Check if all feature titles and descriptions are rendered
    mockFeatures.forEach(({ title, description }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  it('renders default title when no title is provided', () => {
    render(<FeaturesSection features={mockFeatures} />);
    expect(screen.getByText('Why Choose Sharebrary?')).toBeInTheDocument();
  });

  it('renders custom title when provided', () => {
    const customTitle = 'Custom Features Title';
    render(<FeaturesSection features={mockFeatures} title={customTitle} />);
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    const description = 'Test description';
    render(
      <FeaturesSection features={mockFeatures} description={description} />
    );
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<FeaturesSection features={mockFeatures} />);
    const descriptionContainer = screen.queryByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'p' &&
        element?.classList.contains('text-lg')
    );
    expect(descriptionContainer).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-features';
    const { container } = render(
      <FeaturesSection features={mockFeatures} className={customClass} />
    );
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('renders features in a grid layout', () => {
    const { container } = render(<FeaturesSection features={mockFeatures} />);
    const grid = container.querySelector('.grid.md\\:grid-cols-3');
    expect(grid).toBeInTheDocument();
    expect(grid?.children.length).toBe(mockFeatures.length);
  });

  it('renders feature cards with correct structure', () => {
    render(<FeaturesSection features={mockFeatures} />);

    mockFeatures.forEach(({ title }) => {
      const card = screen.getByText(title).closest('.bg-card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-lg', 'p-6', 'text-center', 'shadow-sm');
    });
  });

  it('renders icons with correct styling', () => {
    render(<FeaturesSection features={mockFeatures} />);
    const iconContainers = screen.getAllByTestId(/-icon$/);
    expect(iconContainers).toHaveLength(mockFeatures.length);
    iconContainers.forEach((container) => {
      expect(container).toBeInTheDocument();
    });
  });

  it('renders section header with correct styling', () => {
    render(<FeaturesSection features={mockFeatures} />);
    const header = screen.getByText('Why Choose Sharebrary?');

    expect(header).toHaveClass('text-3xl', 'font-bold', 'mb-4');
    expect(header.parentElement).toHaveClass('text-center', 'mb-12');
  });
});
