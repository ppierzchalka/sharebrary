import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './header';

const meta: Meta<typeof Header> = {
  component: Header,
  title: 'Components/Header',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen', // This makes the header take full width in Storybook
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};

// You might want to add a mobile viewport story to show responsive behavior
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
