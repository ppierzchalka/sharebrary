import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './footer';
import { Github, Twitter, Linkedin } from 'lucide-react';

/**
 * The Footer component provides a consistent footer section across the application.
 *
 * It includes:
 * - Navigation links
 * - Social media links with icons
 * - Copyright notice
 *
 * The component is fully responsive and adapts to different screen sizes,
 * with links stacking on mobile and displaying side-by-side on desktop.
 */
const meta: Meta<typeof Footer> = {
  component: Footer,
  title: 'Custom Components/Footer',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

const defaultArgs = {
  links: [
    { text: 'About', href: '/about' },
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Terms of Service', href: '/terms' },
    { text: 'Contact', href: '/contact' },
  ],
  socialLinks: [
    { icon: Github, href: 'https://github.com' },
    { icon: Twitter, href: 'https://twitter.com' },
    { icon: Linkedin, href: 'https://linkedin.com' },
  ],
  content: '© 2024 Sharebrary. All rights reserved.',
};

/**
 * Default footer with navigation links and social media icons.
 * Shows the typical display with both types of links and copyright notice.
 */
export const Default: Story = {
  args: defaultArgs,
};

/**
 * Footer variant with only navigation links.
 * Demonstrates how the component looks without social media icons.
 */
export const OnlyLinks: Story = {
  args: {
    links: defaultArgs.links,
  },
};

/**
 * Footer variant with only social media links.
 * Shows how the component appears when used just for social media presence.
 */
export const OnlySocialLinks: Story = {
  args: {
    socialLinks: defaultArgs.socialLinks,
  },
};

/**
 * Minimal footer with just the copyright notice.
 * Demonstrates the most basic version of the footer.
 */
export const Minimal: Story = {
  args: {},
};

/**
 * Current app implementation with custom content.
 * Shows the footer as it appears in the current application.
 */
export const CurrentApp: Story = {
  args: {
    content: (
      <>
        made with <span className="text-primary">♥</span> by przemo
      </>
    ),
  },
};
