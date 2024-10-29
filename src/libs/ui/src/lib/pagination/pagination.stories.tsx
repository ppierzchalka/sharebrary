import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './pagination';
import Button from '../button/button';

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: 'Components/Pagination',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {};

export const WithManyPages: Story = {
  render: () => (
    <div className="mt-8 flex justify-center">
      <Button variant="secondary" className="mr-2">
        Previous
      </Button>
      {[1, 2, 3, 4, 5].map((page) => (
        <Button key={page} variant="secondary" className="mr-2">
          {page}
        </Button>
      ))}
      <Button variant="secondary">Next</Button>
    </div>
  ),
};
