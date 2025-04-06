import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './hero-section';

/**
 * The HeroSection component serves as the main landing area of the application.
 * It features a full-screen layout with a gradient background, optional background image,
 * and a two-column design on desktop that adapts to a single column on mobile.
 *
 * The left side contains a headline and description, while the right side displays
 * a login/signup card that appears in a modal sheet on mobile devices.
 */
const meta = {
  title: 'Custom Components/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  title: 'Your Community Book Library',
  description:
    'Upload, discover, and share ebooks with readers around the world',
  backgroundImage: '/placeholder.svg?height=1080&width=1920',
  handleFormSubmit: (data: { email: string; password: string }) => {
    console.log('Form submitted:', data);
  },
  onGoogleSignIn: () => {
    console.log('Google sign in clicked');
  },
  onSignInClick: () => {
    console.log('Sign in clicked');
  },
};

export const Default: Story = {
  args: defaultArgs,
};

export const CustomContent: Story = {
  args: {
    ...defaultArgs,
    title: 'Welcome to Sharebrary',
    description:
      'Join our growing community of book lovers and share your favorite reads.',
  },
};

export const WithoutBackground: Story = {
  args: {
    ...defaultArgs,
    backgroundImage: undefined,
  },
};

export const CustomCard: Story = {
  args: {
    ...defaultArgs,
    cardContent: (
      <div className="w-full max-w-md mx-auto bg-card p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Custom Card Content</h2>
        <p className="text-muted-foreground">
          This is an example of using custom content in the card area.
        </p>
      </div>
    ),
  },
};
