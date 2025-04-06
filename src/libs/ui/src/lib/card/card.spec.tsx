import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';

describe('Card', () => {
  it('renders correctly', () => {
    render(<Card>Test Card</Card>);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Card className="test-class">Test Card</Card>);
    expect(screen.getByText('Test Card')).toHaveClass('test-class');
  });

  it('passes data attributes', () => {
    render(<Card data-testid="test-card">Test Card</Card>);
    expect(screen.getByTestId('test-card')).toBeInTheDocument();
  });

  it('renders with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('has default styling', () => {
    const { container } = render(<Card>Test Card</Card>);
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('rounded-lg');
    expect(cardElement).toHaveClass('border');
    expect(cardElement).toHaveClass('bg-card');
    expect(cardElement).toHaveClass('text-card-foreground');
    expect(cardElement).toHaveClass('shadow-sm');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Test Card</Card>);
    expect(ref).toHaveBeenCalled();
  });
});

describe('CardHeader', () => {
  it('renders correctly', () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <CardHeader className="test-header-class">Header Content</CardHeader>
    );
    expect(screen.getByText('Header Content')).toHaveClass('test-header-class');
  });

  it('passes data attributes', () => {
    render(<CardHeader data-testid="test-header">Header Content</CardHeader>);
    expect(screen.getByTestId('test-header')).toBeInTheDocument();
  });

  it('has default styling', () => {
    const { container } = render(<CardHeader>Header Content</CardHeader>);
    const headerElement = container.firstChild as HTMLElement;
    expect(headerElement).toHaveClass('flex');
    expect(headerElement).toHaveClass('flex-col');
    expect(headerElement).toHaveClass('space-y-1.5');
    expect(headerElement).toHaveClass('p-6');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<CardHeader ref={ref}>Header Content</CardHeader>);
    expect(ref).toHaveBeenCalled();
  });
});

describe('CardTitle', () => {
  it('renders correctly', () => {
    render(<CardTitle>Card Title</CardTitle>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardTitle className="test-title-class">Card Title</CardTitle>);
    expect(screen.getByText('Card Title')).toHaveClass('test-title-class');
  });

  it('passes data attributes', () => {
    render(<CardTitle data-testid="test-title">Card Title</CardTitle>);
    expect(screen.getByTestId('test-title')).toBeInTheDocument();
  });

  it('has default styling', () => {
    const { container } = render(<CardTitle>Card Title</CardTitle>);
    const titleElement = container.firstChild as HTMLElement;
    expect(titleElement).toHaveClass('text-2xl');
    expect(titleElement).toHaveClass('font-semibold');
    expect(titleElement).toHaveClass('leading-none');
    expect(titleElement).toHaveClass('tracking-tight');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<CardTitle ref={ref}>Card Title</CardTitle>);
    expect(ref).toHaveBeenCalled();
  });
});

describe('CardDescription', () => {
  it('renders correctly', () => {
    render(<CardDescription>Card Description</CardDescription>);
    expect(screen.getByText('Card Description')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <CardDescription className="test-desc-class">
        Card Description
      </CardDescription>
    );
    expect(screen.getByText('Card Description')).toHaveClass('test-desc-class');
  });

  it('passes data attributes', () => {
    render(
      <CardDescription data-testid="test-description">
        Card Description
      </CardDescription>
    );
    expect(screen.getByTestId('test-description')).toBeInTheDocument();
  });

  it('has default styling', () => {
    const { container } = render(
      <CardDescription>Card Description</CardDescription>
    );
    const descElement = container.firstChild as HTMLElement;
    expect(descElement).toHaveClass('text-sm');
    expect(descElement).toHaveClass('text-muted-foreground');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<CardDescription ref={ref}>Card Description</CardDescription>);
    expect(ref).toHaveBeenCalled();
  });
});

describe('CardContent', () => {
  it('renders correctly', () => {
    render(<CardContent>Content</CardContent>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardContent className="test-content-class">Content</CardContent>);
    expect(screen.getByText('Content')).toHaveClass('test-content-class');
  });

  it('passes data attributes', () => {
    render(<CardContent data-testid="test-content">Content</CardContent>);
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('has default styling', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const contentElement = container.firstChild as HTMLElement;
    expect(contentElement).toHaveClass('p-6');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<CardContent ref={ref}>Content</CardContent>);
    expect(ref).toHaveBeenCalled();
  });
});

describe('CardFooter', () => {
  it('renders correctly', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <CardFooter className="test-footer-class">Footer Content</CardFooter>
    );
    expect(screen.getByText('Footer Content')).toHaveClass('test-footer-class');
  });

  it('passes data attributes', () => {
    render(<CardFooter data-testid="test-footer">Footer Content</CardFooter>);
    expect(screen.getByTestId('test-footer')).toBeInTheDocument();
  });

  it('has default styling', () => {
    const { container } = render(<CardFooter>Footer Content</CardFooter>);
    const footerElement = container.firstChild as HTMLElement;
    expect(footerElement).toHaveClass('flex');
    expect(footerElement).toHaveClass('items-center');
    expect(footerElement).toHaveClass('p-6');
    expect(footerElement).toHaveClass('pt-0');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<CardFooter ref={ref}>Footer Content</CardFooter>);
    expect(ref).toHaveBeenCalled();
  });
});

// Integration tests
describe('Card integration', () => {
  it('renders nested components with proper structure', () => {
    const { container } = render(
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Membership Card</CardTitle>
          <CardDescription>Your premium benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You have access to all premium features until Jan 2024.</p>
        </CardContent>
        <CardFooter className="justify-between">
          <button>Renew</button>
          <button>Contact Support</button>
        </CardFooter>
      </Card>
    );

    expect(container.firstChild).toHaveClass('max-w-md');
    expect(container.firstChild).toHaveClass('mx-auto');
    expect(screen.getByText('Membership Card')).toBeInTheDocument();
    expect(screen.getByText('Your premium benefits')).toBeInTheDocument();
    expect(
      screen.getByText(
        'You have access to all premium features until Jan 2024.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Renew')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();

    const footer = screen.getByText('Renew').parentElement;
    expect(footer).toHaveClass('justify-between');
  });

  it('works with complex nesting and children', () => {
    render(
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <div className="mr-2">Icon</div>
            <CardTitle>Dashboard</CardTitle>
          </div>
          <CardDescription>
            <span>Last updated: </span>
            <strong>Today</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>Chart 1</div>
            <div>Chart 2</div>
          </div>
        </CardContent>
        <CardFooter>
          <a href="#view-more">View more details</a>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Last updated:')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Chart 1')).toBeInTheDocument();
    expect(screen.getByText('Chart 2')).toBeInTheDocument();
    expect(screen.getByText('View more details')).toBeInTheDocument();
  });
});
