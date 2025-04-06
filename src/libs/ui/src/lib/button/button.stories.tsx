import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

/**
 * The Button component is a versatile interactive element used for triggering actions.
 *
 * It comes in multiple variants and sizes to accommodate different UI needs:
 * - `default`: Primary action button with brand color background
 * - `secondary`: Less prominent actions with a subtle background
 * - `destructive`: For actions that delete or remove content
 * - `outline`: Button with a border and transparent background
 * - `ghost`: Button with no background or border until hover
 * - `link`: Button that looks like a text link
 *
 * Sizes include:
 * - `default`: Standard size for most interfaces
 * - `sm`: Compact size for tight spaces
 * - `lg`: Larger size for prominent actions
 * - `icon`: Square shape optimized for icon content
 */
const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Base Components/Button',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * Default button style used for primary actions.
 * This variant has the most visual prominence.
 */
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Default Button',
  },
};

/**
 * Secondary button style for supporting actions.
 * Less visually dominant than the default variant.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'default',
    children: 'Secondary Button',
  },
};

/**
 * Compact button size for space-constrained UI areas.
 * Maintains the same styling as standard buttons but with reduced padding.
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

/**
 * Larger button size for high-emphasis actions.
 * Creates more visual weight and improves touch targets on mobile.
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};
