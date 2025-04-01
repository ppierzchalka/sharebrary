# Project Setup

## Overview

This task involves setting up the Nx monorepo with Next.js, configuring Firebase services, and establishing the core UI structure for the Sharebrary application.

## Prerequisites

- Node.js 16+ installed
- npm or yarn installed
- Firebase account created
- Basic knowledge of React, Next.js, and Firebase

## Detailed Tasks

### 1. Nx Monorepo Setup

- [ ] Initialize the Nx workspace

  ```bash
  npx create-nx-workspace@latest sharebrary --preset=next
  ```

- [ ] Navigate to the project directory

  ```bash
  cd sharebrary
  ```

- [ ] Install necessary dependencies

  ```bash
  npm install tailwindcss postcss autoprefixer shadcn-ui @nx/next @nx/react
  ```

- [ ] Configure ESLint and Prettier

  ```bash
  npm install -D eslint-config-prettier eslint-plugin-prettier
  ```

- [ ] Update `.eslintrc.json` with proper configuration

- [ ] Create Nx libraries for code organization
  ```bash
  nx g @nx/react:lib ui --directory=libs/ui
  nx g @nx/react:lib auth --directory=libs/auth
  nx g @nx/react:lib features --directory=libs/features
  nx g @nx/react:lib api --directory=libs/api
  nx g @nx/react:lib utils --directory=libs/utils
  ```

### 2. TailwindCSS Setup

- [ ] Initialize TailwindCSS

  ```bash
  nx g @nx/react:setup-tailwind --project=web
  ```

- [ ] Create a TailwindCSS configuration file with theme tokens

  ```js
  // tailwind.config.js
  module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './libs/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        // Custom theme tokens
      },
    },
    plugins: [],
  };
  ```

- [ ] Set up shadcn/ui component library
  ```bash
  npx shadcn-ui@latest init
  ```

### 3. Firebase Setup

- [ ] Create a new Firebase project in the Firebase console

  - Go to [Firebase Console](https://console.firebase.google.com/)
  - Click "Add project"
  - Name the project "Sharebrary" (or your preferred name)
  - Configure Google Analytics (optional)
  - Click "Create project"

- [ ] Enable Authentication service

  - In Firebase console, navigate to "Authentication"
  - Click "Get started"
  - Enable Email/Password authentication
  - Enable Google authentication
  - Enable Facebook authentication (requires Facebook Developer App)

- [ ] Set up Firestore database

  - Navigate to "Firestore Database"
  - Click "Create database"
  - Start in production mode
  - Choose a location close to your target users
  - Create initial security rules

- [ ] Configure Firebase Storage

  - Navigate to "Storage"
  - Click "Get started"
  - Set up appropriate security rules
  - Create folders for book covers and ebooks

- [ ] Install Firebase SDK

  ```bash
  npm install firebase firebase-admin
  ```

- [ ] Create Firebase configuration file

  ```typescript
  // libs/api/src/firebase/config.ts
  export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  ```

- [ ] Set up environment variables
  - Create `.env.local` file with Firebase config values
  - Update `.gitignore` to exclude `.env.local`

### 4. Core UI Components

- [ ] Create layout components

  ```bash
  npx shadcn-ui@latest add button
  npx shadcn-ui@latest add card
  npx shadcn-ui@latest add avatar
  npx shadcn-ui@latest add dropdown-menu
  ```

- [ ] Build a basic shell layout component

  ```typescript
  // libs/ui/src/lib/layout/shell.tsx
  import React from 'react';

  export interface ShellProps {
    children: React.ReactNode;
  }

  export function Shell({ children }: ShellProps) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b bg-background">
          {/* Navigation will go here */}
        </header>
        <main className="container mx-auto py-6">{children}</main>
        <footer className="border-t bg-background py-6">
          {/* Footer content will go here */}
        </footer>
      </div>
    );
  }
  ```

- [ ] Create navigation bar component

  ```typescript
  // libs/ui/src/lib/layout/navbar.tsx
  // Navigation bar implementation
  ```

- [ ] Build footer component

  ```typescript
  // libs/ui/src/lib/layout/footer.tsx
  // Footer implementation
  ```

- [ ] Implement basic theme switching
  ```typescript
  // libs/ui/src/lib/theme/theme-provider.tsx
  // Theme provider implementation
  ```

### 5. Next.js App Configuration

- [ ] Set up Next.js app router structure

  - Create `app/layout.tsx` for the root layout
  - Set up metadata in the root layout
  - Create `app/page.tsx` for the home page

- [ ] Configure Next.js with Nx

  ```js
  // next.config.js
  const { composePlugins, withNx } = require('@nx/next');

  const nextConfig = {
    // Add your Next.js config here
  };

  const plugins = [
    withNx,
    // Add more plugins as needed
  ];

  module.exports = composePlugins(...plugins)(nextConfig);
  ```

- [ ] Set up API routes for server-side logic

  - Create `app/api/route.ts` files for API endpoints

- [ ] Configure Next.js Image optimization
  ```js
  // next.config.js
  // Add to nextConfig
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
  },
  ```

## Deliverables

1. Nx monorepo with Next.js configured
2. TailwindCSS and shadcn/ui setup
3. Firebase project with all necessary services enabled
4. Core UI components implemented
5. Basic application shell

## Dependencies

This task has no dependencies as it is the foundational setup.

## Next Steps

After completing this task, you can proceed to:

- [White-Labeling Foundation](./02-white-labeling.md)
- [Authentication System](./03-authentication.md)
- [Book Library Core](./05-book-library.md)
