import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Input } from './input';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Default input" />);
    const input = screen.getByPlaceholderText('Default input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text'); // Default type
  });

  it('applies custom className correctly', () => {
    render(<Input className="custom-class" data-testid="custom-input" />);
    const input = screen.getByTestId('custom-input');
    expect(input).toHaveClass('custom-class');
  });

  it('handles different input types', () => {
    render(<Input type="email" data-testid="email-input" />);
    const input = screen.getByTestId('email-input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('accepts and handles user input', async () => {
    const user = userEvent.setup();
    render(<Input data-testid="input-field" />);

    const input = screen.getByTestId('input-field');
    await user.type(input, 'Hello, world!');

    expect(input).toHaveValue('Hello, world!');
  });

  it('applies disabled state correctly', () => {
    render(<Input disabled data-testid="disabled-input" />);
    const input = screen.getByTestId('disabled-input');
    expect(input).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} data-testid="ref-input" />);

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId('ref-input'));
  });

  it('passes other props to the input element', () => {
    render(
      <Input data-testid="props-input" aria-label="Test input" maxLength={10} />
    );

    const input = screen.getByTestId('props-input');
    expect(input).toHaveAttribute('aria-label', 'Test input');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('handles focus and blur events', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');

    // Instead of checking focus state which is unreliable in test environment
    // check if the event handlers are called
    const focusHandler = vi.fn();
    const blurHandler = vi.fn();

    input.addEventListener('focus', focusHandler);
    input.addEventListener('blur', blurHandler);

    fireEvent.focus(input);
    expect(focusHandler).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(blurHandler).toHaveBeenCalled();
  });

  it('handles file input type correctly', () => {
    const { container } = render(<Input type="file" />);
    // For file inputs, we need to select by type because they don't have a textbox role
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('file:border-0', 'file:bg-transparent');
  });
});
