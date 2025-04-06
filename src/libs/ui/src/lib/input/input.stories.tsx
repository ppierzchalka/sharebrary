import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A form input field component based on shadcn/ui.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: [
        'text',
        'email',
        'password',
        'number',
        'search',
        'tel',
        'url',
        'file',
        'date',
        'time',
      ],
      description: 'HTML input type attribute',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the input',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'example@email.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'This is a pre-filled value',
  },
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Required field',
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="space-y-2">
      <label htmlFor="with-label" className="text-sm font-medium">
        Email address
      </label>
      <Input id="with-label" {...args} />
    </div>
  ),
  args: {
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small</p>
        <Input className="h-8 text-sm" placeholder="Small input" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <Input placeholder="Default input" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large</p>
        <Input className="h-12 text-lg" placeholder="Large input" />
      </div>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <Input
        placeholder="Invalid input"
        className="border-red-500 focus-visible:ring-red-500"
      />
      <p className="text-sm text-red-500">This field is required</p>
    </div>
  ),
};

export const FileInput: Story = {
  args: {
    type: 'file',
    className: 'cursor-pointer',
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </span>
      <Input className="pl-10" placeholder="Search..." />
    </div>
  ),
};
