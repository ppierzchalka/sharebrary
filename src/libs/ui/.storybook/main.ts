import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: true,
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'vite.config.ts',
      },
    },
  },
  viteFinal: async (config) => {
    // Add any custom Vite configuration here
    return mergeConfig(config, {
      // Ensure Vite finds the root tailwind config
      resolve: {
        alias: {
          'tailwind.config.js': path.resolve(
            __dirname,
            '../../../../tailwind.config.js'
          ),
          // Add alias for next/image
          'next/image': path.resolve(__dirname, './nextImageMock.js'),
          'next/router': path.resolve(__dirname, './nextRouterMock.js'),
        },
      },
      define: {
        // Add any environment variables needed by Next.js components
        'process.env': {},
        'import.meta.env.NEXT_PUBLIC_DOMAIN': JSON.stringify(
          'http://localhost:3000'
        ),
      },
      optimizeDeps: {
        include: ['react', 'react-dom'],
        esbuildOptions: {
          target: 'esnext',
        },
      },
      build: {
        target: 'esnext',
        modulePreload: false,
        rollupOptions: {
          output: {
            format: 'esm',
          },
        },
      },
    });
  },
};

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
