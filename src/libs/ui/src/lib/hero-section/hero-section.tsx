'use client';

import { ReactNode, useState } from 'react';
import { cn } from '../utils';
import { Button } from '../button';
import { Sheet, SheetContent, SheetTrigger } from '../sheet';
import { AuthCard } from '../auth-card';

export interface HeroSectionProps {
  /**
   * The main title of the hero section
   * @default "Your Community Book Library"
   */
  title?: string;
  /**
   * The subtitle or description text
   * @default "Upload, discover, and share ebooks with readers around the world"
   */
  description?: string;
  /**
   * Optional background image URL
   */
  backgroundImage?: string;
  /**
   * Optional custom content for the login/signup card
   */
  cardContent?: ReactNode;
  /**
   * Optional callback for form submission
   */
  handleFormSubmit?: (data: { email: string; password: string }) => void;
  /**
   * Optional callback for Google sign-in
   */
  onGoogleSignIn?: () => void;
  /**
   * Optional callback for sign-in link click
   */
  onSignInClick?: () => void;
  /**
   * Optional className for styling
   */
  className?: string;
}

export function HeroSection({
  title = 'Your Community Book Library',
  description = 'Upload, discover, and share ebooks with readers around the world',
  backgroundImage,
  cardContent,
  handleFormSubmit,
  onGoogleSignIn,
  onSignInClick,
  className,
}: HeroSectionProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const AuthContent = ({ inSheet }: { inSheet?: boolean }) =>
    cardContent || (
      <AuthCard
        mode={authMode}
        onSubmit={
          handleFormSubmit ||
          (() => {
            console.log('Form submit not implemented');
          })
        }
        onGoogleAuth={
          onGoogleSignIn ||
          (() => {
            console.log('Google sign-in not implemented');
          })
        }
        onToggleMode={toggleAuthMode}
        inSheet={inSheet}
      />
    );

  return (
    <section
      role="region"
      aria-label="Hero"
      className={cn(
        'relative flex flex-col md:flex-row items-center h-[100vh]',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 z-0" />
      {backgroundImage && (
        <div
          data-testid="background-image"
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <div className="container mx-auto px-4 py-12 md:py-0 flex flex-col md:flex-row items-center z-10">
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            {description}
          </p>

          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button size="lg" className="w-full">
                  Join Now
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] pt-16">
                <AuthContent inSheet />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="w-full md:w-1/2 md:pl-8 hidden md:block">
          <AuthContent />
        </div>
      </div>
    </section>
  );
}
