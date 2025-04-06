import type { Meta, StoryObj } from '@storybook/react';
import { Header, NavigationItem } from './header';
import { BookOpen, Heart, Calendar, Plus, Search, Users } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '../navigation-menu/navigation-menu';
import { Button } from '../button/button';

/**
 * The Header component serves as the main navigation bar for the Sharebrary application.
 * It provides a responsive layout with a navigation menu for desktop and a slide-out drawer for mobile.
 *
 * You can customize the navigation in two ways:
 * 1. Pass an array of `navigationItems` objects with configuration for each item
 * 2. Pass custom navigation components through `children` prop for complete control
 *
 * The Header component can display either a text title or an image logo.
 */
const meta: Meta<typeof Header> = {
  component: Header,
  title: 'Components/Header',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen', // This makes the header take full width in Storybook
    docs: {
      description: {
        component:
          'Main navigation header with responsive design, configurable navigation items, and customizable logo.',
      },
    },
  },
  // Add decorators to ensure the Header has proper styling context
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
        <div className="pt-20">
          {/* Add some content below header to show how it appears with content */}
          <div className="container mx-auto p-4">
            <p>Page content appears below the fixed header</p>
          </div>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

// Example navigation items for stories
const navigationItems: NavigationItem[] = [
  { icon: BookOpen, text: 'Library', href: '/library', variant: 'secondary' },
  { icon: Heart, text: 'Favorites', href: '/favorites', variant: 'secondary' },
  { icon: Calendar, text: 'History', href: '/history', variant: 'secondary' },
  {
    icon: Plus,
    text: 'Share',
    variant: 'default',
    className: 'bg-primary text-primary-foreground',
    href: '/share',
  },
];

/**
 * Default view of the header component with text title.
 */
export const WithTextTitle: Story = {
  args: {
    title: 'Sharebrary',
    navigationItems: navigationItems,
  },
  parameters: {
    docs: {
      storyDescription:
        'Header with text title and navigation items provided as props.',
    },
  },
};

/**
 * Header with an image logo instead of text title.
 */
export const WithImageLogo: Story = {
  args: {
    title: 'Sharebrary', // Fallback title
    logo: {
      src: '/images/image.png',
      width: 40,
      height: 40,
      alt: 'Sharebrary Logo',
    },
    navigationItems: navigationItems,
  },
  parameters: {
    docs: {
      storyDescription:
        'Header with image logo and navigation items provided as props.',
    },
  },
};

/**
 * Header with custom SVG logo.
 */
export const WithCustomSVGLogo: Story = {
  args: {
    logo: (
      <div className="flex items-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <rect
            x="4"
            y="8"
            width="24"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M10 8V6a2 2 0 012-2h8a2 2 0 012 2v2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M16 14v6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M13 17h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="ml-2 text-xl font-bold text-primary">Sharebrary</span>
      </div>
    ),
    navigationItems: navigationItems,
  },
  parameters: {
    docs: {
      storyDescription: 'Header with custom SVG logo alongside text.',
    },
  },
};

/**
 * Example of how to use custom link components (like Next.js Link component).
 */
export const WithCustomLinkComponents: Story = {
  args: {
    title: 'Custom Links',
    navigationItems: [
      {
        icon: Search,
        text: 'Search',
        variant: 'secondary',
        href: '/search',
        // This would be replaced with import { Link } from 'next/link' in a real app
        linkComponent: (props) => (
          <a
            {...props}
            style={{ textDecoration: 'none' }}
            aria-label="Search Link"
          >
            Search
          </a>
        ),
      },
      {
        icon: BookOpen,
        text: 'Books',
        variant: 'secondary',
        href: '/books',
        // This would be replaced with import { Link } from 'react-router-dom' in a real app
        linkComponent: (props) => (
          <a
            {...props}
            style={{ textDecoration: 'none' }}
            aria-label="Books Link"
          >
            Books
          </a>
        ),
      },
      {
        icon: Users,
        text: 'Users',
        variant: 'secondary',
        href: '/users',
        linkComponent: (props) => (
          <a
            {...props}
            style={{ textDecoration: 'none' }}
            aria-label="Users Link"
          >
            Users
          </a>
        ),
      },
      {
        icon: Plus,
        text: 'Add New',
        variant: 'default',
        className: 'bg-primary text-primary-foreground',
        href: '/new',
        linkComponent: (props) => (
          <a
            {...props}
            style={{ textDecoration: 'none' }}
            aria-label="Add New Link"
          >
            Add New
          </a>
        ),
      },
    ],
  },
  parameters: {
    docs: {
      storyDescription:
        'Using custom link components instead of standard anchor tags.',
    },
  },
};

/**
 * Example showing how to use the children prop for complete customization.
 * Note that this example does not use dropdown navigation as per requirements.
 */
export const WithCustomChildren: Story = {
  args: {
    title: 'Custom Navigation',
    children: (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/books"
              className="flex items-center px-4 py-2"
              aria-label="Books Link"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Books
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="/collections"
              className="flex items-center px-4 py-2"
              aria-label="Collections Link"
            >
              <Heart className="mr-2 h-4 w-4" />
              Collections
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="/about"
              className="flex items-center px-4 py-2"
              aria-label="History Link"
            >
              <Calendar className="mr-2 h-4 w-4" />
              History
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Button size="sm" variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
  },
  parameters: {
    docs: {
      storyDescription:
        'Header with completely custom navigation using children prop.',
    },
  },
};

/**
 * Mobile view of the header showing the hamburger menu.
 */
export const Mobile: Story = {
  args: {
    title: 'Sharebrary',
    navigationItems: navigationItems,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      storyDescription:
        'Header as displayed on mobile devices with hamburger menu.',
    },
  },
};
