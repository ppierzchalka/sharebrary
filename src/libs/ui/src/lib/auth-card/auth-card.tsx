'use client';

import { Button } from '../button';
import { Input } from '../input';
import { Separator } from '../separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card';
import { cn } from '../utils';

export interface AuthCardProps {
  /**
   * The mode of authentication to display
   */
  mode: 'login' | 'register';
  /**
   * Callback when form is submitted with email and password
   */
  onSubmit: (data: { email: string; password: string }) => void;
  /**
   * Callback when Google authentication is requested
   */
  onGoogleAuth: () => void;
  /**
   * Callback when user wants to switch between login and register
   */
  onToggleMode: () => void;
  /**
   * Optional className for styling
   */
  className?: string;
  /**
   * Whether the card is rendered inside a sheet (mobile view)
   */
  inSheet?: boolean;
}

export function AuthCard({
  mode,
  onSubmit,
  onGoogleAuth,
  onToggleMode,
  className,
  inSheet,
}: AuthCardProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <Card
      className={cn(
        'w-full max-w-md mx-auto',
        inSheet && 'border-0 shadow-none',
        className
      )}
    >
      <CardHeader className={cn(inSheet && 'px-0 pt-0')}>
        <CardTitle>
          {mode === 'login' ? 'Welcome Back' : 'Join Sharebrary'}
        </CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Sign in to your account to continue'
            : 'Create an account to start sharing and discovering books'}
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(inSheet && 'px-0')}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input
                id="email"
                name="email"
                placeholder="Email"
                type="email"
                autoCapitalize="none"
                autoComplete={mode === 'login' ? 'email' : 'new-email'}
                autoCorrect="off"
                required
              />
            </div>
            <div className="grid gap-2">
              <Input
                id="password"
                name="password"
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                autoCorrect="off"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span
              className={cn(
                'bg-card px-2 text-muted-foreground',
                inSheet && 'bg-background'
              )}
            >
              Or continue with
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={onGoogleAuth}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </Button>
      </CardContent>
      <CardFooter className={cn('flex justify-center', inSheet && 'px-0')}>
        <div className="text-sm text-muted-foreground">
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
