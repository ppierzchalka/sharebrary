import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

/**
 * The Card component provides a flexible container for organizing related content.
 *
 * It consists of several subcomponents that you can compose to create different card layouts:
 * - `Card`: The main container component with subtle borders and styling
 * - `CardHeader`: Top section typically containing title and description
 * - `CardTitle`: Main heading element for the card
 * - `CardDescription`: Supporting text that explains the card's purpose
 * - `CardContent`: Main content area of the card
 * - `CardFooter`: Bottom section typically containing actions or metadata
 *
 * Cards are useful for presenting information, displaying data, or building interactive UI elements
 * like settings panels, user profiles, product details, etc.
 */
const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Base Components/Card',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * The standard card with all sections: header (with title and description),
 * content, and footer. This provides a complete container for related content.
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Card content with details and information about this card&apos;s
          purpose.
        </p>
      </CardContent>
      <CardFooter>
        <p>Card footer with actions</p>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card variation without a footer section, focusing on content display.
 * Useful for cards that don't require action buttons or additional metadata at the bottom.
 */
export const NoFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>No Footer Card</CardTitle>
        <CardDescription>This card doesn&apos;t have a footer</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with details and information.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * Card variation without a header section, starting directly with content.
 * Useful for simpler cards that don't need a title or when the content is self-explanatory.
 */
export const NoHeader: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <p>This card doesn&apos;t have a header section.</p>
      </CardContent>
      <CardFooter>
        <p>Card footer</p>
      </CardFooter>
    </Card>
  ),
};

/**
 * Minimalist card with only content section.
 * The most basic card variant when you need just a container with styling,
 * without the structure of headers or footers.
 */
export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <p>This card only has content without header or footer.</p>
      </CardContent>
    </Card>
  ),
};
