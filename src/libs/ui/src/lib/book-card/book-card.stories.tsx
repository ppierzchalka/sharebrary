import type { Meta, StoryObj } from '@storybook/react';
import { BookCard } from './book-card';

const meta: Meta<typeof BookCard> = {
  component: BookCard,
  title: 'Components/BookCard',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BookCard>;

const defaultArgs = {
  cover: '/images/image.png',
  title: 'The Midnight Library',
  author: 'Matt Haig',
  tags: ['fiction', 'fantasy', 'bestseller'],
  description:
    'Between life and death there is a library, and within that library, the shelves go on forever.',
};

export const Default: Story = {
  args: defaultArgs,
};

export const LongDescription: Story = {
  args: {
    ...defaultArgs,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
};

export const ManyTags: Story = {
  args: {
    ...defaultArgs,
    tags: [
      'fiction',
      'fantasy',
      'bestseller',
      'award-winning',
      'romance',
      'thriller',
      'mystery',
    ],
  },
};
