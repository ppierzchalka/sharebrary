import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

const meta: Meta<typeof Sheet> = {
  component: Sheet,
  title: 'Base Components/Sheet',
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The Sheet component creates a dialog-like panel that slides out from the edge of the screen.
 *
 * It consists of several subcomponents that you can compose to create different sheet layouts:
 * - `Sheet`: Root container component
 * - `SheetTrigger`: Element that triggers opening the sheet
 * - `SheetContent`: Contains the sheet's content, with configurable side placement
 * - `SheetHeader`: Layout component for sheet header content
 * - `SheetFooter`: Layout component for sheet actions/buttons
 * - `SheetTitle`: Accessible title for the sheet
 * - `SheetDescription`: Accessible description text
 * - `SheetClose`: Closes the sheet when clicked
 *
 * The Sheet is built on top of Radix UI's Dialog primitive and automatically manages focus,
 * keyboard interactions, and proper ARIA attributes.
 */
export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Sheet content goes here</p>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet sliding out from the left side
 */
export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Left Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Left Sheet</SheetTitle>
          <SheetDescription>
            This sheet slides in from the left side of the screen.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Content for left-positioned sheet</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet sliding in from the top
 */
export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Top Sheet</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Top Sheet</SheetTitle>
          <SheetDescription>
            This sheet slides in from the top of the screen.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Content for top-positioned sheet</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet sliding in from the bottom
 */
export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Bottom Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Bottom Sheet</SheetTitle>
          <SheetDescription>
            This sheet slides in from the bottom of the screen.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p>Content for bottom-positioned sheet</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Example of using the sheet in a form scenario
 */
export const FormSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Edit User</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>
            Update user details and preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="w-full rounded-md border p-2"
              defaultValue="John Doe"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border p-2"
              defaultValue="john@example.com"
            />
          </div>
        </div>
        <SheetFooter>
          <Button>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
