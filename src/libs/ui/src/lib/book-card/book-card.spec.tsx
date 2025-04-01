import { render, screen } from '@testing-library/react';
import { BookCard } from './book-card';

const mockProps = {
  cover: '/test-cover.jpg',
  title: 'Test Book',
  author: 'Test Author',
  tags: ['tag1', 'tag2'],
  description: 'Test description',
};

describe('BookCard', () => {
  it('renders all book information correctly', () => {
    render(<BookCard {...mockProps} />);

    // Check if all elements are rendered
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders image with correct src and alt', () => {
    render(<BookCard {...mockProps} />);
    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('alt', 'Test Book');
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining('/test-cover.jpg')
    );
  });

  it('renders all tags as badges', () => {
    render(<BookCard {...mockProps} />);
    const tags = screen.getAllByText(/tag/);
    expect(tags).toHaveLength(2);
    tags.forEach((tag) => {
      expect(tag.closest('div')).toHaveClass('text-xs');
    });
  });

  it('applies correct styling classes', () => {
    const { container } = render(<BookCard {...mockProps} />);
    expect(container.firstChild).toHaveClass(
      'bg-card',
      'text-card-foreground',
      'rounded-lg',
      'overflow-hidden',
      'shadow-md'
    );
  });
});
