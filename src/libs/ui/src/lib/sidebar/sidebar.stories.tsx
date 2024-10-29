import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './sidebar';

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  title: 'Components/Sidebar',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const defaultArgs = {
  categories: [
    {
      name: 'Fiction',
      subcategories: ['Fantasy', 'Science Fiction', 'Mystery'],
    },
    { name: 'Non-Fiction', subcategories: ['Biography', 'History', 'Science'] },
    { name: 'Poetry' },
  ],
  tags: ['bestseller', 'classic', 'award-winning', 'new-release'],
};

export const Default: Story = {
  args: defaultArgs,
};

export const NoSubcategories: Story = {
  args: {
    categories: [
      { name: 'Fiction' },
      { name: 'Non-Fiction' },
      { name: 'Poetry' },
    ],
    tags: defaultArgs.tags,
  },
};

export const ManyTags: Story = {
  args: {
    categories: defaultArgs.categories,
    tags: [
      'bestseller',
      'classic',
      'award-winning',
      'new-release',
      'romance',
      'thriller',
      'mystery',
      'historical',
      'contemporary',
    ],
  },
};
