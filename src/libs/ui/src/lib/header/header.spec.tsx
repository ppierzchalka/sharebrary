import { render, screen } from '@testing-library/react';
import { Header } from './header';

describe('Header', () => {
  it('renders the logo text', () => {
    render(<Header />);
    expect(screen.getByText(/vibrary/i)).toBeInTheDocument();
  });

  it('renders all navigation buttons', () => {
    render(<Header />);

    // Check if all navigation buttons are present
    expect(screen.getByText('Library')).toBeInTheDocument();
    expect(screen.getByText('Favourites')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('renders all icons in the navigation', () => {
    render(<Header />);

    // Check if all icons are present
    expect(screen.getByTestId('book-icon')).toBeInTheDocument();
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('applies correct styling to the header', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('border-b');
  });

  it('applies correct styling to the Share button', () => {
    render(<Header />);
    const shareButton = screen.getByText('Share').closest('button');
    expect(shareButton).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('applies secondary variant to navigation buttons except Share', () => {
    render(<Header />);
    const libraryButton = screen.getByText('Library').closest('button');
    const favouritesButton = screen.getByText('Favourites').closest('button');
    const historyButton = screen.getByText('History').closest('button');

    [libraryButton, favouritesButton, historyButton].forEach((button) => {
      expect(button).toHaveClass('bg-gray-200', 'text-gray-800');
    });
  });

  it('maintains consistent spacing between navigation items', () => {
    render(<Header />);
    const navButtons = screen.getAllByRole('button');

    // Check if all nav buttons except the last one have margin-right
    navButtons.slice(0, -1).forEach((button) => {
      expect(button).toHaveClass('mr-2');
    });
  });
});
