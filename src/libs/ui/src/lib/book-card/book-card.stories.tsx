import type { Meta, StoryObj } from '@storybook/react';
import { BookCard } from './book-card';

/**
 * The BookCard component displays book information in a visually appealing card format.
 *
 * It presents essential book details including:
 * - Cover image
 * - Title
 * - Author name
 * - Tags or genres
 * - Description or summary
 *
 * This component is designed to provide consistent book display across the Sharebrary application,
 * with responsive behavior and truncation for longer text to maintain a clean layout.
 */
const meta: Meta<typeof BookCard> = {
  component: BookCard,
  title: 'Custom Components/BookCard',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-[240px]">
        <Story />
      </div>
    ),
  ],
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

/**
 * Standard book card with all essential information.
 * Shows the typical display for a book with cover image, title, author, tags, and a short description.
 */
export const Default: Story = {
  args: defaultArgs,
};

/**
 * Book card with an extended description that demonstrates text truncation.
 * Shows how the component handles longer text while maintaining a consistent card size.
 */
export const LongDescription: Story = {
  args: {
    ...defaultArgs,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
};

/**
 * Book card with numerous tags showing how tag overflow is handled.
 * Demonstrates the component's ability to display multiple genres or categories
 * while maintaining a clean, organized layout through truncation or wrapping.
 */
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
