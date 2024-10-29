import { render, screen } from '@testing-library/react';
import { Sidebar } from './sidebar';

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

  it('renders all categories', () => {
    render(<Sidebar {...mockProps} />);
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Non-Fiction')).toBeInTheDocument();
  });

  it('renders subcategories when present', () => {
    render(<Sidebar {...mockProps} />);
    expect(screen.getByText('Fantasy')).toBeInTheDocument();
    expect(screen.getByText('Mystery')).toBeInTheDocument();
  });

  it('renders all tags as badges', () => {
    render(<Sidebar {...mockProps} />);
    expect(screen.getByText('bestseller')).toBeInTheDocument();
    expect(screen.getByText('classic')).toBeInTheDocument();
  });

  it('applies correct styling to category items', () => {
    render(<Sidebar {...mockProps} />);
    const categoryItem = screen.getByText('Fiction').closest('span');
    expect(categoryItem).toHaveClass('cursor-pointer', 'hover:text-primary');
  });

  it('applies correct styling to subcategory items', () => {
    render(<Sidebar {...mockProps} />);
    const subcategoryItem = screen.getByText('Fantasy').closest('li');
    expect(subcategoryItem).toHaveClass(
      'text-sm',
      'text-muted-foreground',
      'hover:text-primary',
      'cursor-pointer'
    );
  });
});
