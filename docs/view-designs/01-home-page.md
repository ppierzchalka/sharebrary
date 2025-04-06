## Step 1: Filter Out Already Existing Components

From the workspace and your clarification, the following components already exist and can be reused:

1. **Button**: Available in `@/components/ui/button`.
2. **Input**: Available in `@/components/ui/input`.
3. **Card**: Available in `@/components/ui/card`.
4. **Lucide-react icons**: Available for use.
5. **Header**: Available in `@/components/ui/header`.
6. **Sheet**: Available in `@/components/ui/sheet`.
7. **NavigationMenu**: Available in `@/components/ui/navigation-menu`.

---

## Step 2: Components to Pull from ShadCN

The following components need to be pulled from ShadCN using the `install-shadcn-component.sh` script:

1. **Separator**: Used in the login card to separate sections.
2. **DropdownMenu**: For the user menu in the header.
3. **Avatar**: For the user profile display.

To pull these components, run:

```bash
./install-shadcn-component.sh separator
./install-shadcn-component.sh dropdown-menu
./install-shadcn-component.sh avatar
```

---

## Step 3: Complex Components to Create

The following "complex" components need to be created by composing simple components:

### 1. HeroSection (`src/libs/ui/src/lib/hero-section/hero-section.tsx`)

- **Purpose**: Eye-catching introduction to the app.
- **Props**:
  ```typescript
  interface HeroSectionProps {
    title: string;
    subtitle: string;
    primaryCta: {
      text: string;
      onClick: () => void;
    };
    secondaryCta?: {
      text: string;
      onClick: () => void;
    };
    backgroundImage?: string;
  }
  ```
- **Dependencies**: `Button`.

### 2. AuthCard (`src/libs/ui/src/lib/auth-card/auth-card.tsx`)

- **Purpose**: Handles login and registration.
- **Props**:
  ```typescript
  interface AuthCardProps {
    mode: 'login' | 'register';
    onSubmit: (data: { email: string; password: string }) => void;
    onGoogleAuth: () => void;
    onToggleMode: () => void;
  }
  ```
- **Dependencies**: `Input`, `Button`, `Card`, `Separator`.

### 3. FeaturesSection (`src/libs/ui/src/lib/features-section/features-section.tsx`)

- **Purpose**: Displays app features in a grid.
- **Props**:

  ```typescript
  interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
  }

  interface FeaturesSectionProps {
    features: Feature[];
  }
  ```

- **Dependencies**: `Card`, `Lucide-react` icons.

### 4. Footer (`src/libs/ui/src/lib/footer/footer.tsx`)

- **Purpose**: App footer with links and info.
- **Props**:
  ```typescript
  interface FooterProps {
    links?: Array<{
      text: string;
      href: string;
    }>;
    socialLinks?: Array<{
      icon: LucideIcon;
      href: string;
    }>;
  }
  ```
- **Dependencies**: None.

---

## Step 4: Page Implementation

1. **Create Home Page**:
   Create `src/app/(marketing)/page.tsx` with:

   ```typescript
   import {
     HeroSection,
     AuthCard,
     FeaturesSection,
     Footer,
     Header,
   } from '@/ui';

   export default function HomePage() {
     // Implementation here
   }
   ```

2. **Update Layout**:
   Create `src/app/(marketing)/layout.tsx` with:

   ```typescript
   import { Header } from '@/ui';

   export default function MarketingLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <>
         <Header />
         {children}
       </>
     );
   }
   ```

3. **Update Route Configuration**:
   - Ensure Next.js app router is configured correctly
   - Add metadata for SEO
   - Set up proper navigation between pages

---

## Step 5: Implementation Order

1. Pull required ShadCN components
2. Create complex components in this order:
   - Footer (simplest)
   - FeaturesSection
   - HeroSection
   - AuthCard (most complex)
3. Implement the page layout
4. Implement the home page
5. Add routing and navigation
6. Test and refine

Each step can be executed independently, and if any step fails, you can paste its section into a new chat to get specific help for that part.
