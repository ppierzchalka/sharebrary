# Sharebrary - Book Sharing Library

## Overview

Sharebrary is a book sharing platform where users can upload, download, and discover ebooks. The application includes user authentication, admin controls, ebook management with automatic metadata extraction, and social features like comments and ratings. The platform is designed as a white-label solution that can be customized and deployed with different branding, themes, and configurations.

## Core Features

### White-Labeling

- Simple configuration file for customization
- Customizable themes (light/dark variants)
- Replaceable logo and application name
- Configurable branding colors and typography
- Customizable footer text and links
- Domain-based configuration detection

### Authentication

- Firebase Authentication integration
- Multiple auth methods: Google, Facebook, Email/Password
- Manual approval required by admin for new accounts
- Password reset functionality
- User profile management (nickname, email, password changes)

### User Management

- Two user types: Admin and User
- Admin dashboard for pending registration approval/rejection
- User profiles with personalized settings

### Book Library

- Masonry-style book grid display
- Each book card shows:
  - Cover image
  - Title
  - Author
  - Tags
  - Short description
- Book detail pages with:
  - Full metadata
  - Download options
  - Comments section
  - Rating system
  - Add to favorites option

### Filtering & Search

- Category and tag-based filtering
  - Dedicated pages for each category/tag
- Search functionality with debounced input
  - Searches across title, author, and description
- Pagination (20 books per page)

### User Collections

- Favorites page for bookmarked titles
- Download history page

### Book Upload System

- Simple form (file + author + title)
- Automated processing pipeline:
  1. Store uploaded ebook in Firebase Storage
  2. Create initial database entry with "processing" status
  3. Use Google Books API for metadata lookup
  4. Fallback to Gemini AI for metadata extraction if not found
  5. Background processing using Firebase Functions
  6. Update database when processing completes

### UI/UX

- Dark/light theme support based on user preference
- Responsive design
- Error pages (404)
- Landing page for non-authenticated users

## Technical Architecture

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: React Context + React Query
- **Build System**: Nx Monorepo
- **Theming**: Theme provider with white-label configuration

### Backend & Services

- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Serverless Functions**: Firebase Functions
- **API Integration**: Google Books API, Gemini AI API

## Nx Workspace Structure

```
sharebrary/
├── apps/
│   └── web/                   # Main Next.js application
├── libs/
│   ├── auth/                  # Authentication related components
│   │   ├── firebase/          # Firebase auth implementation
│   │   └── components/        # Login/register UI components
│   │
│   ├── features/
│   │   ├── library/           # Main library feature
│   │   ├── upload/            # Book upload feature
│   │   ├── user-profile/      # User profile management
│   │   ├── admin/             # Admin features
│   │   ├── favorites/         # Favorites feature
│   │   └── history/           # Download history feature
│   │
│   ├── ui/                    # Shared UI components
│   │   ├── book-card/         # Book card component
│   │   ├── badge/             # Badge component for tags
│   │   ├── layout/            # Layout components
│   │   └── theme/             # Theme configuration and white-labeling
│   │
│   ├── api/                   # API integrations
│   │   ├── firebase/          # Firebase API services
│   │   ├── google-books/      # Google Books API client
│   │   └── gemini/            # Gemini AI API client
│   │
│   └── utils/                 # Shared utilities
│       ├── hooks/             # Custom React hooks
│       ├── metadata/          # Book metadata processing
│       └── firebase-admin/    # Firebase admin utilities
├── config/                    # White-label configuration
│   ├── default/               # Default theme and branding
│   └── themes/                # Additional theme presets
└── functions/                 # Firebase Functions
    └── metadata-processor/    # Background job for book processing
```

## White-Label Configuration

### Configuration File Structure

```typescript
interface WhiteLabelConfig {
  appName: string; // Application name
  logo: {
    light: string; // Logo path for light theme
    dark: string; // Logo path for dark theme
  };
  theme: {
    light: {
      primary: string; // Primary color (hex)
      secondary: string; // Secondary color (hex)
      background: string; // Background color
      text: string; // Main text color
      // Additional color tokens
    };
    dark: {
      // Dark theme color tokens
    };
  };
  typography: {
    fontFamily: string; // Primary font family
    headingFontFamily?: string; // Optional heading font
  };
  footer: {
    text: string; // Footer text
    links: Array<{
      label: string;
      url: string;
    }>;
  };
  // Additional customization options
}
```

## Data Models

### User

```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  isApproved: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Book

```typescript
interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverURL: string;
  fileURL: string;
  tags: string[];
  category: string;
  subcategory?: string;
  uploadedBy: string; // User UID
  status: 'processing' | 'completed' | 'error';
  uploadedAt: Timestamp;
  processedAt?: Timestamp;
  metadataSource: 'google_books' | 'gemini_ai' | 'user_provided';
}
```

### Favorite

```typescript
interface Favorite {
  userId: string;
  bookId: string;
  createdAt: Timestamp;
}
```

### Download

```typescript
interface Download {
  userId: string;
  bookId: string;
  downloadedAt: Timestamp;
}
```

### Comment

```typescript
interface Comment {
  id: string;
  bookId: string;
  userId: string;
  text: string;
  createdAt: Timestamp;
}
```

### Rating

```typescript
interface Rating {
  userId: string;
  bookId: string;
  score: number; // 1-5
  createdAt: Timestamp;
}
```

## Implementation Plan

### Phase 1: Project Setup & Core Infrastructure

- Initialize Nx monorepo with Next.js
- Set up Firebase project
- Configure authentication
- Create basic UI components
- Implement theme switching
- Set up white-label configuration structure

### Phase 2: User Management

- User registration and login flows
- Admin approval interface
- User profile management
- Access control based on user role

### Phase 3: Book Library Core

- Book data model implementation
- Book card and detail components
- Basic library view with static data
- Setup Firebase Storage for file handling

### Phase 4: Book Upload & Processing

- Book upload form
- Implement Firebase Functions for background processing
- Google Books API integration
- Gemini AI integration as fallback
- Book processing pipeline

### Phase 5: Social & Discovery Features

- Comments system
- Ratings implementation
- Favorites functionality
- Download history tracking
- Search and filtering

### Phase 6: Refinement & Performance

- Pagination implementation
- Optimization of image loading
- White-label theme customization refinement
- Error handling improvements
- Unit and integration tests
