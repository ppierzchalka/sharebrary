import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

/**
 * The Badge component is a small visual indicator used to highlight status, categories, or counts.
 *
 * It comes in multiple variants to represent different semantic meanings:
 * - `default`: Primary badge with brand color
 * - `secondary`: Less prominent badge with subtle styling
 * - `destructive`: Indicates warning, error, or destructive actions
 * - `outline`: Badge with a border and transparent background
 *
 * Badges are compact UI elements designed to draw attention to important information
 * such as notifications, tags, labels, statuses, or counts.
 */
const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'Base Components/Badge',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

/**
 * Default badge style with the primary brand color.
 * This variant has the highest visual prominence and is good for important statuses or new items.
 */
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

/**
 * Secondary badge with a more subtle appearance.
 * Useful for less important information or secondary categories.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Destructive badge typically using red coloring.
 * Intended for warnings, errors, or destructive actions like deletion or removal indicators.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

/**
 * Outline badge with a border and transparent background.
 * The most subtle variant, useful for tags or labels that should be visible but not dominant.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};
