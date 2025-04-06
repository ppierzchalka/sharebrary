import { render, screen, fireEvent, within } from '@testing-library/react';
import { Header, HeaderProps, LogoProps, NavigationItem } from './header';
import { BookOpen, Heart, Calendar, Plus } from 'lucide-react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

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

  // Basic rendering tests

  it('renders the logo text', () => {
    render(<Header />);
    expect(screen.getByText('Sharebrary')).toBeInTheDocument();
  });

  it('renders a custom title when provided', () => {
    render(<Header title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.queryByText('Sharebrary')).not.toBeInTheDocument();
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

  // Logo tests

  it('renders an image logo when provided with LogoProps', () => {
    const logoProps: LogoProps = {
      src: '/test-image.jpg',
      alt: 'Logo Alt Text',
      width: 40,
      height: 40,
      className: 'test-logo-class',
    };

    render(<Header logo={logoProps} />);
    const imgElement = screen.getByAltText('Logo Alt Text');

    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', '/test-image.jpg');
    expect(imgElement).toHaveAttribute('width', '40');
    expect(imgElement).toHaveAttribute('height', '40');
    expect(imgElement).toHaveClass('test-logo-class');
    expect(imgElement).toHaveClass('object-contain');
  });

  it('renders a custom React element as logo when provided', () => {
    const customLogo = <div data-testid="custom-logo">Custom Logo</div>;
    render(<Header logo={customLogo} />);

    expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    expect(screen.getByText('Custom Logo')).toBeInTheDocument();
    expect(screen.queryByText('Sharebrary')).not.toBeInTheDocument();
  });

  it('renders logo with custom href', () => {
    render(<Header logoHref="/custom-home" />);

    const logoLink = screen.getByText('Sharebrary').closest('a');
    expect(logoLink).toHaveAttribute('href', '/custom-home');
  });

  // Navigation items tests

  it('uses default href "#" when no href is provided in navigation items', () => {
    const navItems: NavigationItem[] = [
      { text: 'No Href Item', icon: BookOpen, variant: 'secondary' },
    ];

    render(<Header navigationItems={navItems} />);
    const navLink = screen.getByText('No Href Item').closest('a');

    expect(navLink).toHaveAttribute('href', '#');
  });

  it('uses custom onClick handler in navigation items', () => {
    const onClickMock = vi.fn();
    const navItems: NavigationItem[] = [
      {
        text: 'Click Handler',
        icon: BookOpen,
        onClick: onClickMock,
        variant: 'secondary',
      },
    ];

    render(<Header navigationItems={navItems} />);
    const navLink = screen.getByText('Click Handler');

    fireEvent.click(navLink);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('uses custom linkComponent when provided', () => {
    const CustomLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >((props, ref) => (
      <a {...props} ref={ref} data-testid="custom-link">
        {props.children}
      </a>
    ));
    CustomLink.displayName = 'CustomLink';

    const navItems: NavigationItem[] = [
      {
        text: 'Custom Link',
        icon: BookOpen,
        variant: 'secondary',
        linkComponent: CustomLink,
      },
    ];

    render(<Header navigationItems={navItems} />);
    expect(screen.getByTestId('custom-link')).toBeInTheDocument();
    expect(screen.getByText('Custom Link')).toBeInTheDocument();
  });

  it('applies variant classes correctly to navigation items', () => {
    const navItems: NavigationItem[] = [
      { text: 'Default', icon: Plus, variant: 'default' },
      { text: 'Secondary', icon: BookOpen, variant: 'secondary' },
      { text: 'Ghost', icon: Heart, variant: 'ghost' },
    ];

    render(<Header navigationItems={navItems} />);

    const defaultLink = screen.getByText('Default').closest('.flex');
    const secondaryLink = screen.getByText('Secondary').closest('.flex');

    expect(defaultLink).toHaveClass('bg-primary');
    expect(defaultLink).toHaveClass('text-primary-foreground');
    expect(secondaryLink).toHaveClass('bg-secondary');
    expect(secondaryLink).toHaveClass('text-secondary-foreground');
  });

  it('applies custom className to navigation items', () => {
    const navItems: NavigationItem[] = [
      {
        text: 'Custom Class',
        icon: BookOpen,
        className: 'test-custom-class',
        variant: 'secondary',
      },
    ];

    render(<Header navigationItems={navItems} />);
    const navElement = screen.getByText('Custom Class').closest('.flex');

    expect(navElement).toHaveClass('test-custom-class');
  });

  // Children rendering tests

  it('renders children instead of navigation items when both are provided', () => {
    const children = <div data-testid="custom-children">Custom Children</div>;

    render(
      <Header navigationItems={defaultNavigationItems}>{children}</Header>
    );

    expect(screen.getByTestId('custom-children')).toBeInTheDocument();
    expect(screen.queryByText('Library')).not.toBeInTheDocument();
  });

  it('applies custom className to header', () => {
    render(<Header className="custom-header-class" />);

    const header = screen.getByRole('banner'); // header tag has implicit role="banner"
    expect(header).toHaveClass('custom-header-class');
  });

  // Mobile navigation tests

  it('renders mobile menu button on small screens', () => {
    render(<Header navigationItems={defaultNavigationItems} />);

    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile navigation when menu button is clicked', () => {
    render(<Header navigationItems={defaultNavigationItems} />);

    // Initially, the sheet content should be hidden
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click the menu button to open the navigation
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    // Now the dialog should be visible
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Mobile nav should contain all navigation items within the dialog
    const mobileNavigation = within(dialog).getByRole('navigation');
    expect(within(mobileNavigation).getByText('Library')).toBeInTheDocument();
    expect(within(mobileNavigation).getByText('Favorites')).toBeInTheDocument();
    expect(within(mobileNavigation).getByText('History')).toBeInTheDocument();
    expect(within(mobileNavigation).getByText('Share')).toBeInTheDocument();
  });

  it('closes mobile navigation when a navigation item is clicked', async () => {
    render(<Header navigationItems={defaultNavigationItems} />);

    // Open the mobile navigation
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    // Click on a navigation item within the dialog
    const dialog = screen.getByRole('dialog');
    const mobileNavigation = within(dialog).getByRole('navigation');
    const navItem = within(mobileNavigation).getByText('Library');
    fireEvent.click(navItem);

    // The navigation should close (dialog removed)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles mobile navigation with custom onClick handler', () => {
    const onClickMock = vi.fn();
    const navItems: NavigationItem[] = [
      {
        text: 'Click Handler',
        icon: BookOpen,
        onClick: onClickMock,
        variant: 'secondary',
      },
    ];

    render(<Header navigationItems={navItems} />);

    // Open the mobile navigation
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    // Click the navigation item within the dialog
    const dialog = screen.getByRole('dialog');
    const mobileNavigation = within(dialog).getByRole('navigation');
    const navItem = within(mobileNavigation).getByText('Click Handler');
    fireEvent.click(navItem);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
