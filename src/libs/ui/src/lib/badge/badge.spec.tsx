import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary');
    expect(badge).toHaveClass('text-primary-foreground');
  });

  it('renders with secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);

    const badge = screen.getByText('Secondary Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-secondary');
    expect(badge).toHaveClass('text-secondary-foreground');
  });

  it('renders with destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);

    const badge = screen.getByText('Destructive Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-destructive');
    expect(badge).toHaveClass('text-destructive-foreground');
  });

  it('renders with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>);

    const badge = screen.getByText('Outline Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-foreground');
    // Should not have bg-* classes
    expect(badge).not.toHaveClass('bg-primary');
    expect(badge).not.toHaveClass('bg-secondary');
    expect(badge).not.toHaveClass('bg-destructive');
  });

  it('merges custom className with variant styles', () => {
    render(<Badge className="test-class">Badge with Custom Class</Badge>);

    const badge = screen.getByText('Badge with Custom Class');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('test-class');
    // Should still have default variant classes
    expect(badge).toHaveClass('bg-primary');
    expect(badge).toHaveClass('text-primary-foreground');
  });

  it('applies additional HTML attributes', () => {
    render(
      <Badge
        data-testid="test-badge"
        aria-label="Test badge"
        id="badge-id"
        title="Badge Title"
      >
        Badge with HTML Attributes
      </Badge>
    );

    const badge = screen.getByTestId('test-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('aria-label', 'Test badge');
    expect(badge).toHaveAttribute('id', 'badge-id');
    expect(badge).toHaveAttribute('title', 'Badge Title');
  });

  it('renders children content correctly', () => {
    render(
      <Badge>
        <span data-testid="child-element">Child Content</span>
      </Badge>
    );

    const childElement = screen.getByTestId('child-element');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Child Content');
  });

  it('has correct base styles regardless of variant', () => {
    render(<Badge>Base Style Badge</Badge>);

    const badge = screen.getByText('Base Style Badge');
    expect(badge).toHaveClass('inline-flex');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('rounded-full');
    expect(badge).toHaveClass('border');
    expect(badge).toHaveClass('px-2.5');
    expect(badge).toHaveClass('py-0.5');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('font-semibold');
  });
});
