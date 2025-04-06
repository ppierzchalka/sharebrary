import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, beforeEach, afterEach } from 'vitest';
import { AuthCard } from './auth-card';

describe('AuthCard', () => {
  const defaultProps = {
    mode: 'register' as const,
    onSubmit: vi.fn(),
    onGoogleAuth: vi.fn(),
    onToggleMode: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders register mode correctly', () => {
    render(<AuthCard {...defaultProps} />);

    expect(screen.getByText('Join Sharebrary')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Create an account to start sharing and discovering books'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create Account' })
    ).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders login mode correctly', () => {
    render(<AuthCard {...defaultProps} mode="login" />);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(
      screen.getByText('Sign in to your account to continue')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    const user = userEvent.setup();
    render(<AuthCard {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('handles Google authentication click', async () => {
    const user = userEvent.setup();
    render(<AuthCard {...defaultProps} />);

    const googleButton = screen.getByRole('button', {
      name: 'Continue with Google',
    });
    await user.click(googleButton);

    await waitFor(() => {
      expect(defaultProps.onGoogleAuth).toHaveBeenCalled();
    });
  });

  it('handles mode toggle', async () => {
    const user = userEvent.setup();
    render(<AuthCard {...defaultProps} />);

    const toggleButton = screen.getByRole('button', { name: 'Sign in' });
    await user.click(toggleButton);

    await waitFor(() => {
      expect(defaultProps.onToggleMode).toHaveBeenCalled();
    });
  });

  it('applies inSheet styles correctly', () => {
    const { container } = render(<AuthCard {...defaultProps} inSheet />);

    const card = container.querySelector('.rounded-lg');
    const header = container.querySelector('[class*="px-0 pt-0"]');
    const content = container.querySelector('[class*="px-0"]');
    const footer = container.querySelector('[class*="px-0"]');

    expect(card).toHaveClass('border-0', 'shadow-none');
    expect(header).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });
});
