import type { Meta, StoryObj } from '@storybook/react';
import { AuthCard } from './auth-card';

/**
 * The AuthCard component handles user authentication, providing both login and registration
 * functionality in a clean, consistent interface. It supports email/password authentication
 * and Google sign-in, with easy mode switching between login and registration.
 */
const meta: Meta<typeof AuthCard> = {
  title: 'Custom Components/AuthCard',
  component: AuthCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AuthCard>;

const defaultArgs = {
  mode: 'register' as const,
  onSubmit: (data: { email: string; password: string }) => {
    console.log('Form submitted:', data);
  },
  onGoogleAuth: () => {
    console.log('Google auth requested');
  },
  onToggleMode: () => {
    console.log('Toggle mode requested');
  },
};

/**
 * The registration view of the auth card, showing the create account form.
 */
export const Register: Story = {
  args: defaultArgs,
};

/**
 * The login view of the auth card, showing the sign in form.
 */
export const Login: Story = {
  args: {
    ...defaultArgs,
    mode: 'login',
  },
};

/**
 * The mobile view of the auth card, with adjusted styling for sheet display.
 */
export const MobileView: Story = {
  args: {
    ...defaultArgs,
    inSheet: true,
  },
};
