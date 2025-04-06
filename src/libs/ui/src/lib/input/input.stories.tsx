import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

/**
 * The Input component is a foundational form element for collecting user data.
 *
 * It supports various HTML input types and states to accommodate different data collection needs:
 * - Text inputs for general text entry
 * - Email inputs with appropriate validation patterns
 * - Password inputs with masked characters
 * - Number inputs for numerical data
 * - Search inputs for search functionality
 * - File inputs for uploading files
 * - Date and time inputs for temporal data
 *
 * The component can be customized with different states including:
 * - Default state for normal input
 * - Disabled state for non-interactive inputs
 * - Required state for mandatory fields
 * - Error state for validation feedback
 */
const meta: Meta<typeof Input> = {
  title: 'Base Components/Input',
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

/**
 * Default text input for general purpose data entry.
 * This variant serves as the foundation for all other input types.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text here',
  },
};

/**
 * Email input optimized for collecting email addresses.
 * On supporting devices, this will show an email-specific keyboard.
 */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'example@email.com',
  },
};

/**
 * Password input that masks characters for secure entry.
 * The content is hidden from view for privacy and security.
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

/**
 * Number input for collecting numerical data.
 * Typically shows number-specific keyboard on mobile devices.
 */
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '0',
  },
};

/**
 * Input in a disabled state that prevents user interaction.
 * Used for form fields that are not currently available.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
};

/**
 * Input with pre-filled content.
 * Useful for forms with default values or when editing existing data.
 */
export const WithValue: Story = {
  args: {
    defaultValue: 'This is a pre-filled value',
  },
};

/**
 * Required input that must be filled before form submission.
 * Part of form validation patterns to ensure data completeness.
 */
export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Required field',
  },
};

/**
 * Input with an associated label for improved accessibility.
 * Labels provide context about what data should be entered.
 */
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

/**
 * Different size variants of the input component.
 * Allows for flexible integration in various UI contexts.
 */
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

/**
 * Input showing an error state with feedback message.
 * Used to indicate validation problems and guide users to correct them.
 */
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

/**
 * File input for uploading files and documents.
 * Allows users to select files from their device.
 */
export const FileInput: Story = {
  args: {
    type: 'file',
    className: 'cursor-pointer',
  },
};

/**
 * Input with a decorative icon to provide additional context.
 * Icons help users understand the purpose of the input field.
 */
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
