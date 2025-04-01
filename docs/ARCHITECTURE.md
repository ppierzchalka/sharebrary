# Sharebrary - Technical Architecture

This document outlines the technical architecture decisions for the Sharebrary application.

## Technology Stack

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: React Context + React Query
- **Build System**: Nx Monorepo

### Backend

- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Serverless Functions**: Firebase Functions
- **API Integration**: Google Books API, Gemini AI API

## System Architecture

### Monorepo Structure

The application is structured as an Nx monorepo to promote code reusability and maintainable architecture:

```
sharebrary/
├── apps/                      # Applications
│   └── web/                   # Main Next.js application
├── libs/                      # Shared libraries
│   ├── auth/                  # Authentication modules
│   ├── features/              # Feature libraries
│   ├── ui/                    # UI component libraries
│   ├── api/                   # API integration libraries
│   └── utils/                 # Utility libraries
├── config/                    # White-label configuration
│   ├── default/               # Default theme and branding
│   └── themes/                # Additional theme presets
└── functions/                 # Firebase Functions
```

### White-Label Architecture

The application is designed as a white-label solution with a clear separation between core functionality and customizable branding:

1. **Configuration-Driven Theming**:

   - Configuration files define all customizable aspects
   - Runtime theme loading based on environment or domain
   - Theme tokens mapped to TailwindCSS variables

2. **Component Abstraction**:

   - Core UI components accept theming props
   - Layout components handle logo and branding placement
   - Footer and header components are fully configurable

3. **White-Label Build Process**:

   - Environment variables to specify theme at build time
   - Separate deployment pipelines for different branded instances
   - Asset management for different logos and brand materials

4. **Configuration Schema**:

```
config/
├── default/                # Default configuration (fallback)
│   ├── theme.json         # Theme configuration
│   ├── branding.json      # Logo and app name
│   └── footer.json        # Footer text and links
├── themes/
│   ├── theme1/            # Custom theme configuration
│   │   ├── theme.json
│   │   ├── branding.json
│   │   └── footer.json
│   └── theme2/            # Another custom theme
└── schema.json            # JSON Schema for validation
```

### Authentication Flow

1. User authenticates via Firebase Authentication (Google, Facebook, Email)
2. Auth state is managed through React Context
3. New registrations are stored with `isApproved: false` flag
4. Admin reviews and approves/rejects registrations
5. Protected routes check for both authentication and approval status

### Book Processing Pipeline

1. **Upload Phase**:

   - User uploads ebook file + minimal metadata (title, author)
   - File is stored in Firebase Storage
   - Initial database record created with `status: "processing"`
   - Response returns immediately to user

2. **Processing Phase** (Firebase Function triggered by database write):

   - Function reads the uploaded file
   - Attempts Google Books API lookup by title/author
   - If not found, extracts text from ebook
   - Uses Gemini AI to analyze text and extract metadata
   - Updates database record with complete metadata

3. **Access Phase**:
   - Processed books appear in library with complete metadata
   - Users can download, comment, rate, and favorite books

### Data Flow Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Next.js    │     │   Firebase   │     │  External APIs   │
│  Frontend   │◄───►│   Services   │◄───►│   Google Books   │
└─────────────┘     └──────────────┘     │   Gemini AI      │
                                         └──────────────────┘
```

## Database Schema

### Collections

#### Users Collection

```
users/{userId}
  - uid: string
  - email: string
  - displayName: string
  - isAdmin: boolean
  - isApproved: boolean
  - createdAt: timestamp
  - updatedAt: timestamp
```

#### Books Collection

```
books/{bookId}
  - id: string
  - title: string
  - author: string
  - description: string
  - coverURL: string
  - fileURL: string
  - tags: string[]
  - category: string
  - subcategory?: string
  - uploadedBy: string (User UID)
  - status: 'processing' | 'completed' | 'error'
  - uploadedAt: timestamp
  - processedAt?: timestamp
  - metadataSource: 'google_books' | 'gemini_ai' | 'user_provided'
```

#### Favorites Collection

```
favorites/{favoriteId}
  - userId: string
  - bookId: string
  - createdAt: timestamp
```

#### Downloads Collection

```
downloads/{downloadId}
  - userId: string
  - bookId: string
  - downloadedAt: timestamp
```

#### Comments Collection

```
comments/{commentId}
  - bookId: string
  - userId: string
  - text: string
  - createdAt: timestamp
```

#### Ratings Collection

```
ratings/{ratingId}
  - userId: string
  - bookId: string
  - score: number (1-5)
  - createdAt: timestamp
```

## API Integration Architecture

### Google Books API

- Used for primary metadata lookup
- Implemented with custom caching to avoid duplicate API calls
- Search query uses title + author for best match

### Gemini AI Integration

- Fallback when Google Books data is unavailable
- Text extraction from ebook before processing
- Prompt engineering for consistent metadata extraction
- Response parsing and validation before storage

## Security Architecture

### Authentication Security

- Firebase Authentication for identity management
- Manual approval flow to prevent abuse
- Role-based access control for admin functions

### Data Security

- Firestore security rules enforce user permissions
- Storage rules restrict file access to authenticated users
- Function-level security for background processing

### File Security

- Secure download links with expiring tokens
- File type validation on upload
- Size limits to prevent abuse

## Performance Considerations

### Data Loading Strategy

- Server-side rendering for initial page load
- React Query for client-side data fetching and caching
- Pagination with cursor-based queries for library views

### Image Optimization

- Next.js Image component for automatic optimization
- Image size variants stored in Firebase Storage
- Lazy loading for images below the fold

### Caching Strategy

- Static generation for non-user-specific pages
- SWR patterns for data freshness
- Browser caching headers for static assets

## Background Processing

### Firebase Functions

- Triggered by Firestore writes for new book uploads
- Scheduled functions for maintenance tasks
- Fault-tolerant design with retries and error reporting

### Error Handling

- Comprehensive error tracking
- Automatic retry mechanism for transient failures
- User-friendly error messages and recovery paths

## White-Label Implementation

### Theme Provider Architecture

The theme provider implements a React Context that provides access to the white-label configuration:

```typescript
// Simplified example
const WhiteLabelContext = createContext<WhiteLabelConfig>(defaultConfig);

export function WhiteLabelProvider({
  config = defaultConfig,
  children,
}: WhiteLabelProviderProps) {
  // Load the correct theme based on domain or env var
  const [activeConfig, setActiveConfig] = useState(config);

  useEffect(() => {
    // Apply theme to document root for CSS variables
    document.documentElement.style.setProperty(
      '--primary-color',
      activeConfig.theme.light.primary
    );
    // Apply other theme variables...
  }, [activeConfig]);

  return (
    <WhiteLabelContext.Provider value={activeConfig}>
      {children}
    </WhiteLabelContext.Provider>
  );
}
```

### Configuration Loading

The application determines which configuration to load using the following priority:

1. Environment variable specified configuration
2. Domain-based configuration (for multi-tenant deployments)
3. Default configuration as fallback

```typescript
// Configuration resolution logic (simplified)
async function resolveConfiguration() {
  // Check for environment-specified theme
  const envTheme = process.env.NEXT_PUBLIC_THEME;
  if (envTheme) {
    return loadThemeConfig(envTheme);
  }

  // Check for domain-based theme
  const domain = window.location.hostname;
  const domainTheme = await getDomainTheme(domain);
  if (domainTheme) {
    return loadThemeConfig(domainTheme);
  }

  // Fallback to default
  return defaultConfig;
}
```

### Deployment Strategy

For white-labeled deployments, the application can be deployed in two ways:

1. **Single Instance, Multiple Themes**:

   - One deployment serving multiple branded versions
   - Domain-based theme detection
   - Dynamic loading of assets and configurations

2. **Separate Instances**:
   - Build process creates separate deployments for each brand
   - Environment variables specify the theme at build time
   - Optimized for performance with pre-compiled themes
