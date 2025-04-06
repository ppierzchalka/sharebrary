import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Footer } from './footer';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { expect, describe, it, vi } from 'vitest';

const mockProps = {
  links: [
    { text: 'About', href: '/about' },
    { text: 'Privacy', href: '/privacy' },
    { text: 'Terms', href: '/terms' },
  ],
  socialLinks: [
    { icon: Github, href: 'https://github.com' },
    { icon: Twitter, href: 'https://twitter.com' },
    { icon: Linkedin, href: 'https://linkedin.com' },
  ],
};

describe('Footer', () => {
  it('renders all footer information correctly', () => {
    render(<Footer {...mockProps} />);

    // Check if navigation links are rendered
    mockProps.links.forEach((link) => {
      expect(screen.getByText(link.text)).toBeInTheDocument();
    });

    // Check if social links are rendered (by their aria labels)
    const socialLinks = screen.getAllByText('Social media link');
    expect(socialLinks).toHaveLength(mockProps.socialLinks.length);
  });

  it('renders copyright notice with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Sharebrary. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('applies correct styling classes to the footer', () => {
    const { container } = render(<Footer {...mockProps} />);
    const footer = container.firstChild;

    expect(footer).toHaveClass('border-t', 'py-6');
  });

  it('handles custom className prop correctly', () => {
    const customClass = 'custom-footer';
    const { container } = render(<Footer className={customClass} />);
    const footer = container.firstChild;

    expect(footer).toHaveClass(customClass);
  });

  it('renders navigation links with correct attributes', () => {
    render(<Footer {...mockProps} />);

    mockProps.links.forEach((link) => {
      const linkElement = screen.getByText(link.text);
      expect(linkElement).toHaveAttribute('href', link.href);
      expect(linkElement).toHaveClass(
        'hover:text-primary',
        'transition-colors',
        'duration-[var(--transition-normal)]'
      );
    });
  });

  it('renders social links with correct attributes', () => {
    render(<Footer {...mockProps} />);
    const socialLinks = screen.getAllByTestId(/-icon$/);

    expect(socialLinks).toHaveLength(mockProps.socialLinks.length);
    socialLinks.forEach((link) => {
      expect(link).toBeInTheDocument();
    });
  });

  it('handles footer without links gracefully', () => {
    render(<Footer />);
    const nav = screen.queryByRole('navigation');
    expect(nav).not.toBeInTheDocument();
  });

  it('handles footer without social links gracefully', () => {
    render(<Footer links={mockProps.links} />);
    const socialLinks = screen.queryAllByRole('link', {
      name: 'Social media link',
    });
    expect(socialLinks).toHaveLength(0);
  });

  // Test for interactive elements
  it('handles link clicks correctly', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <div onClick={onClick}>
        <Footer {...mockProps} />
      </div>
    );

    // Click on a navigation link
    await user.click(screen.getByText(mockProps.links[0].text));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with responsive layout classes', () => {
    render(<Footer {...mockProps} />);

    const container = screen.getByText(
      `© ${new Date().getFullYear()} Sharebrary. All rights reserved.`
    ).parentElement?.parentElement;

    expect(
      container?.querySelector('.flex-col.md\\:flex-row')
    ).toBeInTheDocument();
  });
});
