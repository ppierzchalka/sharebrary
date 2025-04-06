import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './sidebar';

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  title: 'Custom Components/Sidebar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
A sidebar component for filtering and navigation. It supports both link-based navigation and callback-based interactions.

## Features
- Categories with optional subcategories
- Tag filtering
- Mobile responsive with sheet interface
- Clear filters functionality

## Interaction Patterns
- Category/subcategory names act as links (with underline on hover) or buttons when callbacks provided
- Categories with subcategories have a square expand/collapse button with chevron
- Links use underline hover effect for better accessibility
- Tags can be clicked for filtering
- Mobile view provides a slide-out sheet

## Usage
- Use \`onCategoryChange\`, \`onSubcategoryChange\`, \`onTagToggle\` callbacks for controlled behavior
- Omit callbacks to use link-based navigation with URL parameters
- Provide \`baseUrl\` to customize the base path for links

## Styling
- Links have hover underline effect with proper offset
- Active items are highlighted in primary color
- Expand/collapse buttons use a square border style
- Subcategories use muted text color for better hierarchy
`,
      },
    },
  },
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

export const WithCallbacks: Story = {
  args: {
    ...defaultArgs,
    onCategoryChange: (category: string | null) =>
      console.log('Category:', category),
    onSubcategoryChange: (subcategory: string | null) =>
      console.log('Subcategory:', subcategory),
    onTagToggle: (tag: string) => console.log('Tag:', tag),
  },
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
 * each of which can be expanded/collapsed independently using the + icon buttons.
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
