import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from './book-card';
import { expect, describe, it } from 'vitest';

const mockProps = {
  cover: '/test-cover.jpg',
  title: 'Test Book',
  author: 'Test Author',
  tags: ['Fiction', 'Science Fiction'],
  description:
    'A comprehensive test description that spans multiple lines to test text wrapping and display capabilities.',
};

describe('BookCard', () => {
  it('renders all book information correctly', () => {
    render(<BookCard {...mockProps} />);

    // Check if all elements are rendered
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.author)).toBeInTheDocument();
    expect(screen.getByText(mockProps.tags[0])).toBeInTheDocument();
    expect(screen.getByText(mockProps.tags[1])).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('renders image with correct src and alt attributes', () => {
    render(<BookCard {...mockProps} />);
    const image = screen.getByTestId('next-image');

    expect(image).toHaveAttribute('alt', mockProps.title);
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining(mockProps.cover)
    );
    expect(image).toHaveAttribute('width', '200');
    expect(image).toHaveAttribute('height', '300');
    expect(image).toHaveClass('w-full', 'h-48', 'object-cover');
  });

  it('renders all tags as badges', () => {
    render(<BookCard {...mockProps} />);
    const tags = screen.getAllByText(new RegExp(mockProps.tags.join('|')));

    expect(tags).toHaveLength(mockProps.tags.length);
    tags.forEach((tag) => {
      expect(tag.closest('div')).toHaveClass('text-xs');
    });
  });

  it('applies correct styling classes to the card', () => {
    const { container } = render(<BookCard {...mockProps} />);
    const card = container.firstChild;

    expect(card).toHaveClass('overflow-hidden');
  });

  it('handles books with no tags gracefully', () => {
    const propsWithoutTags = { ...mockProps, tags: [] };
    render(<BookCard {...propsWithoutTags} />);

    // The badges container should still exist but be empty
    const badgeContainer = screen
      .getByRole('heading', { name: mockProps.title })
      .parentElement?.querySelector('.flex.flex-wrap');
    expect(badgeContainer).toBeInTheDocument();
    expect(badgeContainer?.children.length).toBe(0);
  });

  it('handles long titles and descriptions with proper text wrapping', () => {
    const propsWithLongText = {
      ...mockProps,
      title:
        'This is an extremely long book title that should wrap properly in the UI component without breaking the layout',
      description:
        'This is a very long description that contains multiple sentences to test how the component handles text wrapping. It should correctly display all text without any overflow issues or layout problems. The text should be contained within the card boundaries.',
    };

    render(<BookCard {...propsWithLongText} />);

    expect(screen.getByText(propsWithLongText.title)).toBeInTheDocument();
    expect(screen.getByText(propsWithLongText.description)).toBeInTheDocument();
  });

  it('renders CardContent with correct padding', () => {
    render(<BookCard {...mockProps} />);
    const title = screen.getByText(mockProps.title);
    const cardContent = title.closest('div');

    expect(cardContent).toHaveClass('p-4');
  });

  it('renders title with correct typography styles', () => {
    render(<BookCard {...mockProps} />);
    const title = screen.getByText(mockProps.title);

    expect(title).toHaveClass('font-semibold', 'text-lg', 'mb-1');
  });

  it('renders author with correct typography styles', () => {
    render(<BookCard {...mockProps} />);
    const author = screen.getByText(mockProps.author);

    expect(author).toHaveClass('text-sm', 'text-muted-foreground', 'mb-2');
  });

  it('renders description with correct typography styles', () => {
    render(<BookCard {...mockProps} />);
    const description = screen.getByText(mockProps.description);

    expect(description).toHaveClass('text-sm');
  });

  // Add test for interactive elements if applicable
  it('handles user interactions correctly', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    // Render with a click handler to test interaction
    const { container } = render(
      <div onClick={onClick}>
        <BookCard {...mockProps} />
      </div>
    );

    // Click on the card
    await user.click(container.firstChild as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
