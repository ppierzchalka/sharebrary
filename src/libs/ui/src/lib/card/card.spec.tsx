import { render, screen } from '@testing-library/react';
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
});

describe('CardContent', () => {
  it('renders correctly with padding', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('p-6');
  });

  it('applies custom className', () => {
    render(<CardContent className="test-content-class">Content</CardContent>);
    expect(screen.getByText('Content')).toHaveClass('test-content-class');
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
});
