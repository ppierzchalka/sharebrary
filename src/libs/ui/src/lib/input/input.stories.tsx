import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Search } from 'lucide-react';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Components/Input',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithType: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input placeholder="Search..." className="pl-10" />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <Input
        aria-invalid="true"
        className="border-destructive focus-visible:ring-destructive"
        placeholder="Error state..."
      />
      <p className="text-sm text-destructive">This field is required</p>
    </div>
  ),
};
