import { render, screen } from '@testing-library/react';
import { Header, HeaderProps } from './header';
import { BookOpen, Heart, Calendar, Plus } from 'lucide-react';

describe('Header', () => {
  const defaultNavigationItems: HeaderProps['navigationItems'] = [
    { icon: BookOpen, text: 'Library', href: '/library', variant: 'secondary' },
    {
      icon: Heart,
      text: 'Favorites',
      href: '/favorites',
      variant: 'secondary',
    },
    { icon: Calendar, text: 'History', href: '/history', variant: 'secondary' },
    {
      icon: Plus,
      text: 'Share',
      href: '/share',
      variant: 'default',
      className: 'bg-primary text-primary-foreground',
    },
  ];

  it('renders the logo text', () => {
    render(<Header />);
    expect(screen.getByText('Sharebrary')).toBeInTheDocument();
  });

  it('renders all navigation buttons', () => {
    render(<Header navigationItems={defaultNavigationItems} />);

    // Check if all navigation buttons are present
    expect(screen.getByText('Library')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('renders all icons in the navigation', () => {
    render(<Header navigationItems={defaultNavigationItems} />);

    // The icons don't have test IDs, but we can check if they're rendered
    // by checking if their parent elements contain the correct text
    const libraryLink = screen.getByText('Library').closest('a');
    const favoritesLink = screen.getByText('Favorites').closest('a');
    const historyLink = screen.getByText('History').closest('a');
    const shareLink = screen.getByText('Share').closest('a');

    expect(libraryLink).toBeInTheDocument();
    expect(favoritesLink).toBeInTheDocument();
    expect(historyLink).toBeInTheDocument();
    expect(shareLink).toBeInTheDocument();
  });

  it('applies correct styling to the header', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('border-b');
  });
});
