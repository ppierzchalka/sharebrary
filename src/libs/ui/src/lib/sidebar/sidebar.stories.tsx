import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './sidebar';

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  title: 'Custom Components/Sidebar',
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

/**
 * This story showcases how the sidebar can handle deeply nested category structures.
 * It demonstrates a real-world example where categories can have multiple levels of subcategories,
 * each of which can be expanded/collapsed independently.
 *
 * The recursive rendering allows for any depth of nesting, making the sidebar component
 * suitable for complex categorization systems like those found in large digital libraries.
 */
export const DeepNestedCategories: Story = {
  args: {
    categories: [
      {
        name: 'Fiction',
        subcategories: [
          {
            name: 'Fantasy',
            subcategories: [
              { name: 'Epic Fantasy' },
              { name: 'Urban Fantasy' },
              {
                name: 'Young Adult',
                subcategories: ['Coming of Age', 'School Life', 'Dystopian'],
              },
              { name: 'Magical Realism' },
            ],
          },
          {
            name: 'Science Fiction',
            subcategories: [
              { name: 'Space Opera' },
              { name: 'Cyberpunk' },
              {
                name: 'Speculative Fiction',
                subcategories: [
                  'Alternate History',
                  'Post-Apocalyptic',
                  'Time Travel',
                ],
              },
            ],
          },
          { name: 'Mystery' },
          { name: 'Romance' },
        ],
      },
      {
        name: 'Non-Fiction',
        subcategories: [
          { name: 'Biography' },
          {
            name: 'Science',
            subcategories: [
              { name: 'Physics' },
              { name: 'Biology' },
              {
                name: 'Technology',
                subcategories: [
                  'Programming',
                  'Artificial Intelligence',
                  'Digital Culture',
                ],
              },
              { name: 'Mathematics' },
            ],
          },
          {
            name: 'History',
            subcategories: ['Ancient', 'Medieval', 'Modern', 'Contemporary'],
          },
          { name: 'Philosophy' },
        ],
      },
      {
        name: 'Academic',
        subcategories: ['Journals', 'Papers', 'Dissertations'],
      },
    ],
    tags: ['bestseller', 'classic', 'award-winning'],
    selectedCategory: 'Fiction',
    baseUrl: '/library',
  },
};
