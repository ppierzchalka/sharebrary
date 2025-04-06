import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from './navigation-menu';
import { cn } from '../utils';
import * as React from 'react';

/**
 * The NavigationMenu component provides an accessible navigation system with dropdown menus.
 *
 * It consists of several subcomponents that you can compose to create different navigation layouts:
 * - `NavigationMenu`: Root container component
 * - `NavigationMenuList`: Horizontal list of navigation items
 * - `NavigationMenuItem`: Individual menu item container
 * - `NavigationMenuTrigger`: Button that opens a dropdown menu
 * - `NavigationMenuContent`: Content displayed in the dropdown
 * - `NavigationMenuLink`: Link for navigation items
 *
 * The component is built with accessibility in mind, including keyboard navigation
 * and proper ARIA attributes for screen readers.
 */
const meta: Meta<typeof NavigationMenu> = {
  title: 'Base Components/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

/**
 * Complete navigation menu with dropdown content and a featured promo section.
 * This example shows how to create a complex navigation with multi-column dropdowns
 * and a featured area for highlighting content.
 */
export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Sharebrary
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Share your personal library with friends and family
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Learn about Sharebrary and how it works
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install and set up your profile
              </ListItem>
              <ListItem href="/docs/getting-started" title="Getting Started">
                Quick start guide for adding your first books
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem
                href="/docs/features/library-management"
                title="Library Management"
              >
                Organize and categorize your book collection
              </ListItem>
              <ListItem href="/docs/features/sharing" title="Sharing">
                Share books with friends and track loans
              </ListItem>
              <ListItem
                href="/docs/features/recommendations"
                title="Recommendations"
              >
                Get personalized reading recommendations
              </ListItem>
              <ListItem
                href="/docs/features/reading-groups"
                title="Reading Groups"
              >
                Create and join reading groups
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/docs/api"
            className={navigationMenuTriggerStyle()}
          >
            API
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Simple horizontal navigation menu without dropdowns.
 * This example demonstrates a minimal navigation bar with just a few direct links.
 * Useful for simpler sites or applications with a flat navigation structure.
 */
export const Minimal: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/home"
            className={navigationMenuTriggerStyle()}
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/about"
            className={navigationMenuTriggerStyle()}
          >
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/contact"
            className={navigationMenuTriggerStyle()}
          >
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Navigation menu with visual indicators for active or hovered states.
 * This example shows a navigation with dropdown menus and consistent layout for menu items.
 * The gap between items creates a clearer distinction between navigation options.
 */
export const WithIndicator: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <ListItem href="/products/books" title="Books">
                Browse our collection of books
              </ListItem>
              <ListItem href="/products/ebooks" title="eBooks">
                Digital books for your device
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <ListItem href="/services/lending" title="Book Lending">
                How our lending system works
              </ListItem>
              <ListItem
                href="/services/recommendations"
                title="Recommendations"
              >
                Get personalized recommendations
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
