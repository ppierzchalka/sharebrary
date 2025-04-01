# Authentication System

## Overview

This task involves implementing the authentication system for Sharebrary, including Firebase Authentication integration, user login/registration flows, protected routes, and the admin approval system for new accounts.

## Prerequisites

- [Project Setup](./01-project-setup.md) completed
- Firebase project created with Authentication service enabled

## Detailed Tasks

### 1. Firebase Authentication Setup

- [ ] Configure authentication methods in Firebase Console

  - Ensure Email/Password authentication is enabled
  - Configure Google authentication
  - Configure Facebook authentication (optional)

- [ ] Create Firebase authentication service

  ```typescript
  // libs/auth/src/lib/firebase-auth.ts
  import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    User as FirebaseUser,
    onAuthStateChanged,
  } from 'firebase/auth';
  import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
  } from 'firebase/firestore';
  import { initializeApp } from 'firebase/app';
  import { firebaseConfig } from '@sharebrary/api/firebase';

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Auth providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    isAdmin: boolean;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  // Create user document in Firestore
  async function createUserDocument(user: FirebaseUser): Promise<UserData> {
    const userRef = doc(db, 'users', user.uid);
    const userData: UserData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || '',
      isAdmin: false,
      isApproved: false, // Users need admin approval
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if this is the first user (make them admin)
    const usersCollection = await getDocs(collection(db, 'users'));
    if (usersCollection.empty) {
      userData.isAdmin = true;
      userData.isApproved = true; // First user is auto-approved
    }

    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return userData;
  }

  // Get user data from Firestore
  export async function getUserData(uid: string): Promise<UserData | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }

    return null;
  }

  // Email registration
  export async function registerWithEmail(
    email: string,
    password: string,
    displayName: string
  ): Promise<UserData> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update display name
    await updateProfile(userCredential.user, { displayName });

    // Create user document
    return createUserDocument(userCredential.user);
  }

  // Email login
  export async function loginWithEmail(
    email: string,
    password: string
  ): Promise<UserData> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userData = await getUserData(userCredential.user.uid);

    if (!userData) {
      // Create user document if it doesn't exist
      return createUserDocument(userCredential.user);
    }

    return userData;
  }

  // Google login/registration
  export async function loginWithGoogle(): Promise<UserData> {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const userData = await getUserData(userCredential.user.uid);

    if (!userData) {
      // Create user document if it doesn't exist
      return createUserDocument(userCredential.user);
    }

    return userData;
  }

  // Facebook login/registration
  export async function loginWithFacebook(): Promise<UserData> {
    const userCredential = await signInWithPopup(auth, facebookProvider);
    const userData = await getUserData(userCredential.user.uid);

    if (!userData) {
      // Create user document if it doesn't exist
      return createUserDocument(userCredential.user);
    }

    return userData;
  }

  // Sign out
  export async function signOut(): Promise<void> {
    return firebaseSignOut(auth);
  }

  // Password reset
  export async function resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  // Listen to auth state changes
  export function onAuthChange(
    callback: (user: UserData | null) => void
  ): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserData(firebaseUser.uid);
        callback(userData);
      } else {
        callback(null);
      }
    });
  }
  ```

### 2. Authentication Context

- [ ] Create authentication context

  ```typescript
  // libs/auth/src/lib/auth-context.tsx
  import React, { createContext, useContext, useEffect, useState } from 'react';
  import {
    UserData,
    onAuthChange,
    loginWithEmail,
    loginWithGoogle,
    loginWithFacebook,
    registerWithEmail,
    signOut,
    resetPassword,
  } from './firebase-auth';

  interface AuthContextType {
    user: UserData | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isApproved: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<UserData>;
    register: (
      email: string,
      password: string,
      displayName: string
    ) => Promise<UserData>;
    loginWithGoogle: () => Promise<UserData>;
    loginWithFacebook: () => Promise<UserData>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    error: string | null;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const unsubscribe = onAuthChange((userData) => {
        setUser(userData);
        setIsLoading(false);
      });

      return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
      setError(null);
      try {
        return await loginWithEmail(email, password);
      } catch (err) {
        setError('Failed to login. Please check your credentials.');
        throw err;
      }
    };

    const register = async (
      email: string,
      password: string,
      displayName: string
    ) => {
      setError(null);
      try {
        return await registerWithEmail(email, password, displayName);
      } catch (err) {
        setError('Failed to register. This email might already be in use.');
        throw err;
      }
    };

    const googleLogin = async () => {
      setError(null);
      try {
        return await loginWithGoogle();
      } catch (err) {
        setError('Google login failed.');
        throw err;
      }
    };

    const facebookLogin = async () => {
      setError(null);
      try {
        return await loginWithFacebook();
      } catch (err) {
        setError('Facebook login failed.');
        throw err;
      }
    };

    const logout = async () => {
      setError(null);
      try {
        await signOut();
        setUser(null);
      } catch (err) {
        setError('Logout failed.');
        throw err;
      }
    };

    const requestPasswordReset = async (email: string) => {
      setError(null);
      try {
        await resetPassword(email);
      } catch (err) {
        setError('Password reset failed.');
        throw err;
      }
    };

    const value = {
      user,
      isLoading,
      isAuthenticated: !!user,
      isApproved: user ? user.isApproved : false,
      isAdmin: user ? user.isAdmin : false,
      login,
      register,
      loginWithGoogle: googleLogin,
      loginWithFacebook: facebookLogin,
      logout,
      resetPassword: requestPasswordReset,
      error,
    };

    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

  export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }
  ```

### 3. Protected Routes

- [ ] Create middleware for protected routes

  ```typescript
  // middleware.ts
  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';
  import { getToken } from 'next-auth/jwt';

  export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define public paths that don't require authentication
    const publicPaths = ['/', '/login', '/register', '/forgot-password'];
    const isPublicPath = publicPaths.includes(pathname);

    // Check if the user is authenticated
    const token = await getToken({ req: request });

    // Redirect unauthenticated users to login
    if (!token && !isPublicPath) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    // Allow public paths and authenticated requests
    return NextResponse.next();
  }

  export const config = {
    matcher: [
      // Add paths that should be protected
      '/library/:path*',
      '/favorites/:path*',
      '/upload/:path*',
      '/profile/:path*',
      '/admin/:path*',
      '/book/:path*',
    ],
  };
  ```

- [ ] Create route guards for client components

  ```typescript
  // libs/auth/src/lib/route-guard.tsx
  import { useAuth } from './auth-context';
  import { useRouter } from 'next/router';
  import { useEffect } from 'react';

  interface RouteGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
  }

  export function RouteGuard({
    children,
    requireAuth = true,
    requireAdmin = false,
  }: RouteGuardProps) {
    const { isAuthenticated, isLoading, isApproved, isAdmin, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Wait until auth is determined
      if (isLoading) return;

      if (requireAuth && !isAuthenticated) {
        router.push(`/login?callbackUrl=${encodeURIComponent(router.asPath)}`);
        return;
      }

      // Handle non-approved users
      if (requireAuth && isAuthenticated && !isApproved) {
        router.push('/pending-approval');
        return;
      }

      // Handle admin-only routes
      if (requireAdmin && !isAdmin) {
        router.push('/');
        return;
      }
    }, [
      isLoading,
      isAuthenticated,
      isApproved,
      isAdmin,
      router,
      requireAuth,
      requireAdmin,
    ]);

    // Show loading state while checking auth
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    }

    // Show content if conditions are met
    if (
      !requireAuth ||
      (requireAuth && isAuthenticated && isApproved) ||
      (requireAdmin && isAdmin)
    ) {
      return <>{children}</>;
    }

    // Otherwise return nothing while redirecting
    return null;
  }
  ```

### 4. Authentication UI

- [ ] Create login form

  ```typescript
  // libs/auth/src/lib/components/login-form.tsx
  import { useState } from 'react';
  import { useAuth } from '../auth-context';
  import { useRouter } from 'next/router';
  import { Button } from '@sharebrary/ui/button';
  import { Input } from '@sharebrary/ui/input';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
  } from '@sharebrary/ui/card';
  import { Alert, AlertDescription } from '@sharebrary/ui/alert';
  import Link from 'next/link';

  export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, loginWithGoogle, error } = useAuth();
    const router = useRouter();
    const callbackUrl = (router.query.callbackUrl as string) || '/library';

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const user = await login(email, password);
        if (user.isApproved) {
          router.push(callbackUrl);
        } else {
          router.push('/pending-approval');
        }
      } catch (err) {
        console.error('Login failed:', err);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleGoogleLogin = async () => {
      setIsSubmitting(true);

      try {
        const user = await loginWithGoogle();
        if (user.isApproved) {
          router.push(callbackUrl);
        } else {
          router.push('/pending-approval');
        }
      } catch (err) {
        console.error('Google login failed:', err);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Login to Sharebrary</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-background text-muted">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              {/* Google icon path */}
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }
  ```

- [ ] Create registration form

  ```typescript
  // libs/auth/src/lib/components/register-form.tsx
  // Similar to login form with registration logic
  ```

- [ ] Create forgot password form

  ```typescript
  // libs/auth/src/lib/components/forgot-password-form.tsx
  // Implement password reset UI
  ```

- [ ] Create pending approval page
  ```typescript
  // app/pending-approval/page.tsx
  // Implement UI for users awaiting approval
  ```

### 5. Auth Integration with App

- [ ] Update root layout with AuthProvider

  ```typescript
  // app/layout.tsx
  import { WhiteLabelProvider } from '@sharebrary/ui/theme';
  import { AuthProvider } from '@sharebrary/auth';
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
    const initialConfig = await import('config/default/config.json');

    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${poppins.variable}`}>
          <WhiteLabelProvider initialConfig={initialConfig}>
            <AuthProvider>{children}</AuthProvider>
          </WhiteLabelProvider>
        </body>
      </html>
    );
  }
  ```

## Deliverables

1. Firebase Authentication integration
2. Auth context and protected routes
3. Login, register, and forgot password UI
4. Social authentication (Google, Facebook)
5. Admin approval system for new users

## Dependencies

- [Project Setup](./01-project-setup.md)

## Next Steps

After completing this task, you can proceed to:

- [User Management](./04-user-management.md)
- [Book Library Core](./05-book-library.md)
