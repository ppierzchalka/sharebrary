import type { Meta, StoryObj } from '@storybook/react';
import { FeaturesSection } from './features-section';
import { BookOpen, Search, Share2, BookmarkPlus } from 'lucide-react';

/**
 * The FeaturesSection component displays a grid of features with icons and descriptions.
 *
 * It includes:
 * - A section title
 * - Optional section description
 * - Grid of feature cards, each with:
 *   - Icon in a colored circle
 *   - Feature title
 *   - Feature description
 *
 * The component is responsive and adapts from a single column on mobile
 * to a three-column grid on desktop screens.
 */
const meta: Meta<typeof FeaturesSection> = {
  component: FeaturesSection,
  title: 'Custom Components/FeaturesSection',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeaturesSection>;

const defaultArgs = {
  title: 'Why Choose Sharebrary?',
  description: 'Discover the benefits of joining our community of book lovers.',
  features: [
    {
      icon: Search,
      title: 'Discover Books',
      description:
        'Browse our growing collection of ebooks across various genres and find your next favorite read.',
    },
    {
      icon: Share2,
      title: 'Share Knowledge',
      description:
        'Upload your ebooks and share them with the community. Contribute to a global knowledge exchange.',
    },
    {
      icon: BookmarkPlus,
      title: 'Personal Library',
      description:
        'Build your collection of favorites and track reading history. Organize your digital bookshelf.',
    },
  ],
};

/**
 * Default features section with title, description, and three features.
 * Shows the typical display with all elements.
 */
export const Default: Story = {
  args: defaultArgs,
};

/**
 * Features section with more items to demonstrate grid behavior.
 * Shows how the component handles additional feature cards.
 */
export const MoreFeatures: Story = {
  args: {
    ...defaultArgs,
    features: [
      ...defaultArgs.features,
      {
        icon: BookOpen,
        title: 'Easy Reading',
        description:
          'Access your books anywhere, anytime. Our platform makes reading convenient and enjoyable.',
      },
      {
        icon: Search,
        title: 'Smart Search',
        description:
          'Find books quickly with our advanced search features. Filter by genre, author, or tags.',
      },
      {
        icon: Share2,
        title: 'Community Reviews',
        description:
          'Share your thoughts and read reviews from other members. Get personalized recommendations.',
      },
    ],
  },
};

/**
 * Features section without a description.
 * Shows how the component looks with minimal header content.
 */
export const NoDescription: Story = {
  args: {
    title: defaultArgs.title,
    features: defaultArgs.features,
  },
};

/**
 * Features section with custom title.
 * Shows how the component can be used in different contexts.
 */
export const CustomTitle: Story = {
  args: {
    ...defaultArgs,
    title: 'Platform Features',
    description:
      'Everything you need to manage and share your digital library.',
  },
};
