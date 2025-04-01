# White-Labeling Foundation

## Overview

This task involves implementing the white-labeling functionality of the Sharebrary application, allowing for easy customization of themes, branding, and appearance. The goal is to create a flexible configuration system that can be used to customize the application for different deployments.

## Prerequisites

- [Project Setup](./01-project-setup.md) completed
- TailwindCSS configured
- Basic UI components implemented

## Detailed Tasks

### 1. Configuration Structure

- [ ] Create configuration directory structure

  ```bash
  mkdir -p config/default config/themes
  ```

- [ ] Create schema for white-label configuration

  ```typescript
  // config/schema.ts
  export interface WhiteLabelConfig {
    appName: string;
    logo: {
      light: string;
      dark: string;
    };
    theme: {
      light: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        muted: string;
        accent: string;
        // Additional color tokens
      };
      dark: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        muted: string;
        accent: string;
        // Additional color tokens
      };
    };
    typography: {
      fontFamily: string;
      headingFontFamily?: string;
    };
    footer: {
      text: string;
      links: Array<{
        label: string;
        url: string;
      }>;
    };
  }
  ```

- [ ] Create default configuration

  ```json
  // config/default/config.json
  {
    "appName": "Sharebrary",
    "logo": {
      "light": "/images/logo-light.svg",
      "dark": "/images/logo-dark.svg"
    },
    "theme": {
      "light": {
        "primary": "#3b82f6",
        "secondary": "#10b981",
        "background": "#ffffff",
        "text": "#1f2937",
        "muted": "#6b7280",
        "accent": "#f97316"
      },
      "dark": {
        "primary": "#60a5fa",
        "secondary": "#34d399",
        "background": "#1f2937",
        "text": "#f9fafb",
        "muted": "#9ca3af",
        "accent": "#fb923c"
      }
    },
    "typography": {
      "fontFamily": "Inter, system-ui, sans-serif",
      "headingFontFamily": "Inter, system-ui, sans-serif"
    },
    "footer": {
      "text": "© 2023 Sharebrary. All rights reserved.",
      "links": [
        {
          "label": "Privacy Policy",
          "url": "/privacy"
        },
        {
          "label": "Terms of Service",
          "url": "/terms"
        }
      ]
    }
  }
  ```

- [ ] Create example alternate theme
  ```json
  // config/themes/dark-blue/config.json
  {
    "appName": "Sharebrary Dark",
    "logo": {
      "light": "/themes/dark-blue/logo-light.svg",
      "dark": "/themes/dark-blue/logo-dark.svg"
    },
    "theme": {
      "light": {
        "primary": "#2563eb",
        "secondary": "#0891b2",
        "background": "#f8fafc",
        "text": "#0f172a",
        "muted": "#64748b",
        "accent": "#7c3aed"
      },
      "dark": {
        "primary": "#3b82f6",
        "secondary": "#06b6d4",
        "background": "#0f172a",
        "text": "#f8fafc",
        "muted": "#94a3b8",
        "accent": "#8b5cf6"
      }
    },
    "typography": {
      "fontFamily": "Poppins, system-ui, sans-serif",
      "headingFontFamily": "Poppins, system-ui, sans-serif"
    },
    "footer": {
      "text": "© 2023 Sharebrary Dark Edition. All rights reserved.",
      "links": [
        {
          "label": "Privacy Policy",
          "url": "/privacy"
        },
        {
          "label": "Terms of Service",
          "url": "/terms"
        },
        {
          "label": "Contact",
          "url": "/contact"
        }
      ]
    }
  }
  ```

### 2. Theme Provider Implementation

- [ ] Create configuration loader utility

  ```typescript
  // libs/utils/src/lib/config/loader.ts
  import { WhiteLabelConfig } from 'config/schema';
  import defaultConfig from 'config/default/config.json';

  export async function loadConfig(
    theme: string | null = null
  ): Promise<WhiteLabelConfig> {
    // If no theme is specified, use the default
    if (!theme) {
      return defaultConfig as WhiteLabelConfig;
    }

    try {
      // Attempt to load the specified theme
      const themeConfig = await import(`config/themes/${theme}/config.json`);
      return themeConfig as WhiteLabelConfig;
    } catch (error) {
      console.warn(`Failed to load theme: ${theme}. Using default.`, error);
      return defaultConfig as WhiteLabelConfig;
    }
  }

  export function resolveDomainConfig(domain: string): string | null {
    // Map domains to theme names
    const domainMap: Record<string, string> = {
      'example.com': 'dark-blue',
      // Add more domain mappings as needed
    };

    return domainMap[domain] || null;
  }
  ```

- [ ] Implement theme context provider

  ```typescript
  // libs/ui/src/lib/theme/white-label-provider.tsx
  import React, { createContext, useContext, useEffect, useState } from 'react';
  import { WhiteLabelConfig } from 'config/schema';
  import { loadConfig, resolveDomainConfig } from '@sharebrary/utils/config';

  interface WhiteLabelContextType {
    config: WhiteLabelConfig;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
  }

  const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(
    undefined
  );

  export function WhiteLabelProvider({
    children,
    initialConfig,
  }: {
    children: React.ReactNode;
    initialConfig?: WhiteLabelConfig;
  }) {
    const [config, setConfig] = useState<WhiteLabelConfig>(initialConfig);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
      async function initConfig() {
        if (!initialConfig) {
          // Attempt to load config based on domain
          const domain = window.location.hostname;
          const themeFromDomain = resolveDomainConfig(domain);

          // Fallback to environment variable
          const themeFromEnv = process.env.NEXT_PUBLIC_THEME;

          // Load the appropriate config
          const resolvedConfig = await loadConfig(
            themeFromDomain || themeFromEnv || null
          );
          setConfig(resolvedConfig);
        }

        // Check user's preferred color scheme
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        setIsDarkMode(prefersDark);
      }

      initConfig();
    }, [initialConfig]);

    // Apply theme variables when config or dark mode changes
    useEffect(() => {
      if (!config) return;

      const themeTokens = isDarkMode ? config.theme.dark : config.theme.light;

      // Apply CSS variables to document root
      const root = document.documentElement;
      root.style.setProperty('--color-primary', themeTokens.primary);
      root.style.setProperty('--color-secondary', themeTokens.secondary);
      root.style.setProperty('--color-background', themeTokens.background);
      root.style.setProperty('--color-text', themeTokens.text);
      root.style.setProperty('--color-muted', themeTokens.muted);
      root.style.setProperty('--color-accent', themeTokens.accent);

      // Set font family
      root.style.setProperty('--font-family', config.typography.fontFamily);
      root.style.setProperty(
        '--heading-font-family',
        config.typography.headingFontFamily || config.typography.fontFamily
      );

      // Set dark mode class
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [config, isDarkMode]);

    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
    };

    return (
      <WhiteLabelContext.Provider
        value={{ config, isDarkMode, toggleDarkMode }}
      >
        {children}
      </WhiteLabelContext.Provider>
    );
  }

  export function useWhiteLabel() {
    const context = useContext(WhiteLabelContext);
    if (context === undefined) {
      throw new Error('useWhiteLabel must be used within a WhiteLabelProvider');
    }
    return context;
  }
  ```

### 3. TailwindCSS Integration

- [ ] Update TailwindCSS config to use CSS variables
  ```javascript
  // tailwind.config.js
  module.exports = {
    darkMode: 'class',
    content: ['./app/**/*.{js,ts,jsx,tsx}', './libs/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          background: 'var(--color-background)',
          foreground: 'var(--color-text)',
          muted: 'var(--color-muted)',
          accent: 'var(--color-accent)',
        },
        fontFamily: {
          sans: ['var(--font-family)'],
          heading: ['var(--heading-font-family)'],
        },
      },
    },
    plugins: [],
  };
  ```

### 4. Customizable Components

- [ ] Create configurable logo component

  ```typescript
  // libs/ui/src/lib/branding/logo.tsx
  import Image from 'next/image';
  import { useWhiteLabel } from '../theme/white-label-provider';

  export interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
  }

  export function Logo({ size = 'md' }: LogoProps) {
    const { config, isDarkMode } = useWhiteLabel();

    const logoSrc = isDarkMode ? config.logo.dark : config.logo.light;

    const sizes = {
      sm: { width: 100, height: 40 },
      md: { width: 150, height: 60 },
      lg: { width: 200, height: 80 },
    };

    const { width, height } = sizes[size];

    return (
      <Image
        src={logoSrc}
        alt={config.appName}
        width={width}
        height={height}
        className="h-auto"
        priority
      />
    );
  }
  ```

- [ ] Implement configurable app title

  ```typescript
  // libs/ui/src/lib/branding/app-title.tsx
  import { useWhiteLabel } from '../theme/white-label-provider';

  export interface AppTitleProps {
    variant?: 'default' | 'large' | 'small';
  }

  export function AppTitle({ variant = 'default' }: AppTitleProps) {
    const { config } = useWhiteLabel();

    const classes = {
      default: 'text-2xl font-bold font-heading',
      large: 'text-4xl font-bold font-heading',
      small: 'text-xl font-semibold font-heading',
    };

    return <span className={classes[variant]}>{config.appName}</span>;
  }
  ```

- [ ] Create customizable footer component

  ```typescript
  // libs/ui/src/lib/layout/custom-footer.tsx
  import Link from 'next/link';
  import { useWhiteLabel } from '../theme/white-label-provider';

  export function CustomFooter() {
    const { config } = useWhiteLabel();

    return (
      <footer className="border-t bg-background py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted">{config.footer.text}</p>
            </div>

            <div className="flex space-x-4">
              {config.footer.links.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="text-sm text-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }
  ```

### 5. Theme Switching

- [ ] Implement theme toggle component

  ```typescript
  // libs/ui/src/lib/theme/theme-toggle.tsx
  import { Button } from '../button/button';
  import { Moon, Sun } from 'lucide-react';
  import { useWhiteLabel } from './white-label-provider';

  export function ThemeToggle() {
    const { isDarkMode, toggleDarkMode } = useWhiteLabel();

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    );
  }
  ```

### 6. Integration with App Layout

- [ ] Update root layout to use WhiteLabelProvider

  ```typescript
  // app/layout.tsx
  import { WhiteLabelProvider } from '@sharebrary/ui/theme';
  import { Inter, Poppins } from 'next/font/google';
  import './globals.css';

  // Load fonts
  const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
  const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-poppins',
  });

  export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // This could be fetched from an API in a production environment
    const initialConfig = await import('config/default/config.json');

    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${poppins.variable}`}>
          <WhiteLabelProvider initialConfig={initialConfig}>
            {children}
          </WhiteLabelProvider>
        </body>
      </html>
    );
  }
  ```

## Deliverables

1. Complete white-label configuration structure
2. Theme provider with context API
3. TailwindCSS integration with CSS variables
4. Customizable UI components (logo, app title, footer)
5. Theme switching functionality
6. Documentation for customizing themes

## Dependencies

- [Project Setup](./01-project-setup.md)

## Next Steps

After completing this task, you can proceed to:

- [Authentication System](./03-authentication.md)
- [User Management](./04-user-management.md) (requires Authentication first)
- [Book Library Core](./05-book-library.md)
