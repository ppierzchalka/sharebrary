import '../src/styles/global.css';
import './storybook.css';
import type { Preview } from '@storybook/react';
import React from 'react';

// Add a decorator to apply styles to all stories
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: 'hsl(222.2 84% 4.9%)',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="font-sans p-4">
        <Story />
      </div>
    ),
  ],
};

export default preview;
