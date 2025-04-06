import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './sidebar';
import { Category } from './sidebar.types';

const mockCategories: Category[] = [
  {
    name: 'Fiction',
    subcategories: [
      { name: 'Science Fiction' },
      { name: 'Fantasy' },
      { name: 'Mystery' },
    ],
  },
  {
    name: 'Non-Fiction',
    subcategories: [
      { name: 'Science' },
      { name: 'History' },
      { name: 'Biography' },
    ],
  },
];

const mockTags = [
  'Bestseller',
  'New Release',
  'Award Winner',
  'Classic',
  'Popular',
  'Recommended',
];

const deepNestedCategories: Category[] = [
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
            subcategories: [
              { name: 'Coming of Age' },
              { name: 'School Life' },
              { name: 'Dystopian' },
            ],
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
              { name: 'Alternate History' },
              { name: 'Post-Apocalyptic' },
              { name: 'Time Travel' },
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
              { name: 'Programming' },
              { name: 'Artificial Intelligence' },
              { name: 'Digital Culture' },
            ],
          },
          { name: 'Mathematics' },
        ],
      },
      {
        name: 'History',
        subcategories: [
          { name: 'Ancient' },
          { name: 'Medieval' },
          { name: 'Modern' },
          { name: 'Contemporary' },
        ],
      },
      { name: 'Philosophy' },
    ],
  },
  {
    name: 'Academic',
    subcategories: [
      { name: 'Journals' },
      { name: 'Papers' },
      { name: 'Dissertations' },
    ],
  },
];

const meta = {
  component: Sidebar,
  title: 'Custom Components/Sidebar',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    categories: mockCategories,
    tags: mockTags,
    selectedCategory: '',
    selectedSubcategory: '',
    selectedTags: [],
    baseUrl: '/library',
  },
};

export const WithSelections: Story = {
  args: {
    categories: mockCategories,
    tags: mockTags,
    selectedCategory: 'Fiction',
    selectedSubcategory: 'Science Fiction',
    selectedTags: ['Bestseller', 'New Release'],
    baseUrl: '/library',
  },
};

export const WithCallbacks: Story = {
  args: {
    categories: mockCategories,
    tags: mockTags,
    selectedCategory: '',
    selectedSubcategory: '',
    selectedTags: [],
    onCategoryChange: (category) => console.log('Category:', category),
    onSubcategoryChange: (subcategory) =>
      console.log('Subcategory:', subcategory),
    onTagToggle: (tag) => console.log('Tag:', tag),
    onClearFilters: () => console.log('Clear filters'),
    baseUrl: '/library',
  },
};

export const DeepNestedCategories: Story = {
  args: {
    categories: deepNestedCategories,
    tags: mockTags,
    selectedCategory: 'Fiction',
    selectedSubcategory: 'Fantasy',
    selectedTags: ['Bestseller'],
    baseUrl: '/library',
  },
  parameters: {
    docs: {
      description: {
        story: `This story showcases how the sidebar can handle deeply nested category structures.
        It demonstrates a real-world example where categories can have multiple levels of subcategories,
        each of which can be expanded/collapsed independently.`,
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    categories: mockCategories,
    tags: mockTags,
    selectedCategory: '',
    selectedSubcategory: '',
    selectedTags: [],
    baseUrl: '/library',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
