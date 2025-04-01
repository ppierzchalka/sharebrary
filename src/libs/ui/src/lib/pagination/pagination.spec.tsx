import { render, screen } from '@testing-library/react';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('renders navigation buttons', () => {
    render(<Pagination />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders page numbers', () => {
    render(<Pagination />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<Pagination />);
    const paginationContainer = container.firstChild;
    expect(paginationContainer).toHaveClass('mt-8', 'flex', 'justify-center');
  });

  it('applies outline variant to all buttons', () => {
    render(<Pagination />);
    const buttons = screen.getAllByRole('button');

    buttons.forEach((button) => {
      expect(button).toHaveAttribute('data-variant', 'outline');
    });
  });
});
