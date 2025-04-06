import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/mode-toggle';
import { BookOpen, Search, Share2, BookmarkPlus, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function LandingPage() {
  const [showLoginMobile, setShowLoginMobile] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Simplified */}
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold text-primary">Sharebrary</span>
            </div>

            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {/* Hero Section - Full Screen */}
        <section className="flex-grow flex flex-col md:flex-row items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 z-0"></div>
          <div
            className="absolute inset-0 z-0 opacity-10"
            style={{
              backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>

          {/* Left side - Headline */}
          <div className="container mx-auto px-4 py-12 md:py-0 flex flex-col md:flex-row items-center z-10">
            <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Your Community Book Library
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
                Upload, discover, and share ebooks with readers around the world
              </p>

              {/* Mobile login button */}
              <div className="md:hidden">
                <Button
                  size="lg"
                  onClick={() => setShowLoginMobile(!showLoginMobile)}
                  className="w-full"
                >
                  {showLoginMobile ? 'Hide Login' : 'Join Now'}
                </Button>
              </div>
            </div>

            {/* Right side - Login Card */}
            <div
              className={`w-full md:w-1/2 md:pl-8 ${
                showLoginMobile ? 'block' : 'hidden md:block'
              }`}
            >
              <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Join Sharebrary</CardTitle>
                  <CardDescription>
                    Create an account to start sharing and discovering books
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Input
                          id="email"
                          placeholder="Email"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Input
                          id="password"
                          placeholder="Password"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="password"
                          autoCorrect="off"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Create Account
                      </Button>
                    </div>
                  </form>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
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
                    Google
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <div className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <a href="#" className="text-primary hover:underline">
                      Sign in
                    </a>
                  </div>
                </CardFooter>
              </Card>

              {/* Mobile close button */}
              {showLoginMobile && (
                <div className="flex justify-center mt-4 md:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLoginMobile(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section - Kept as is */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Sharebrary?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Discover Books</h3>
                <p className="text-muted-foreground">
                  Browse our growing collection of ebooks across various genres
                  and find your next favorite read.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Share Knowledge</h3>
                <p className="text-muted-foreground">
                  Upload your ebooks and share them with the community.
                  Contribute to a global knowledge exchange.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookmarkPlus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Personal Library</h3>
                <p className="text-muted-foreground">
                  Build your collection of favorites and track reading history.
                  Organize your digital bookshelf.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simplified Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Sharebrary. All rights reserved.</p>
      </footer>
    </div>
  );
}
