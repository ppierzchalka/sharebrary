import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { HeroSection } from './hero-section';

describe('HeroSection', () => {
  const user = userEvent.setup();

  it('renders default content correctly', () => {
    render(<HeroSection />);

    expect(screen.getByText('Your Community Book Library')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Upload, discover, and share ebooks with readers around the world'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Join Now' })
    ).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(
      <HeroSection title="Custom Title" description="Custom description" />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    const handleFormSubmit = vi.fn();
    render(<HeroSection handleFormSubmit={handleFormSubmit} />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(handleFormSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('handles Google sign-in click', async () => {
    const onGoogleSignIn = vi.fn();
    render(<HeroSection onGoogleSignIn={onGoogleSignIn} />);

    const googleButton = screen.getByRole('button', {
      name: 'Continue with Google',
    });
    await user.click(googleButton);

    expect(onGoogleSignIn).toHaveBeenCalled();
  });

  it('handles auth mode toggle', async () => {
    render(<HeroSection />);

    const signInLink = screen.getByRole('button', { name: 'Sign in' });
    await user.click(signInLink);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(
      screen.getByText('Sign in to your account to continue')
    ).toBeInTheDocument();
  });

  it('renders custom card content when provided', () => {
    const customContent = (
      <div data-testid="custom-content">Custom Content</div>
    );
    render(<HeroSection cardContent={customContent} />);

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('applies background image when provided', () => {
    render(<HeroSection backgroundImage="/test-image.jpg" />);

    const bgDiv = screen.getByTestId('background-image');
    expect(bgDiv).toHaveStyle({
      backgroundImage: "url('/test-image.jpg')",
    });
  });

  it('applies custom className when provided', () => {
    render(<HeroSection className="custom-class" />);

    const section = screen.getByRole('region');
    expect(section).toHaveClass('custom-class');
  });

  it('shows Sheet on mobile button click', async () => {
    render(<HeroSection />);

    const joinButton = screen.getByRole('button', { name: 'Join Now' });
    await user.click(joinButton);

    expect(screen.getAllByText('Join Sharebrary')).toHaveLength(2);
  });
});
