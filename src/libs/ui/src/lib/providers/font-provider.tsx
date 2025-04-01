import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

// Export the font instance so it can be used directly for className
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

interface FontProviderProps {
  children: ReactNode;
  // If true, will add the font class to a div wrapper.
  // For Next.js apps, set to false and apply to html element instead.
  applyToWrapper?: boolean;
}

// The FontProvider component can be used in different environments
export function FontProvider({
  children,
  applyToWrapper = true,
}: FontProviderProps) {
  if (applyToWrapper) {
    return <div className={inter.variable}>{children}</div>;
  }

  // For cases where the caller will apply the class elsewhere (e.g., Next.js on html element)
  return children;
}
