'use client';

import { Button } from '../button/button';
import { Menu, LucideIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../sheet/sheet';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '../navigation-menu/navigation-menu';
import { cn } from '../utils';
import Image, { StaticImageData } from 'next/image';
import React from 'react';

export interface NavigationItem {
  icon?: LucideIcon;
  iconName?: string; // Added iconName property for string-based icon mapping
  text: string;
  href?: string;
  variant?:
    | 'default'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'outline'
    | 'destructive';
  className?: string;
  onClick?: () => void; // Updated type to avoid 'any'
  linkComponent?: React.ComponentType<
    React.AnchorHTMLAttributes<HTMLAnchorElement>
  >;
}

export interface LogoProps {
  src: string | StaticImageData;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export interface HeaderProps {
  title?: string;
  logo?: React.ReactNode | LogoProps;
  logoHref?: string;
  navigationItems?: NavigationItem[];
  children?: React.ReactNode;
  className?: string;
}

// Type guard to check if an object is a LogoProps
function isLogoProps(obj: unknown): obj is LogoProps {
  return !!obj && typeof obj === 'object' && 'src' in obj;
}

export function Header({
  title = 'Sharebrary',
  logo,
  logoHref = '/',
  navigationItems = [],
  children,
  className,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate navigation menu from navigation items when no children are provided
  const navigationMenu =
    navigationItems.length > 0 ? (
      <NavigationMenu>
        <NavigationMenuList>
          {navigationItems.map((item) => {
            const LinkComponent = item.linkComponent || 'a';

            return (
              <NavigationMenuItem key={item.text}>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    'flex items-center px-4 py-2 rounded-md text-sm',
                    item.variant === 'default' &&
                      'bg-primary text-primary-foreground',
                    item.variant === 'secondary' &&
                      'bg-secondary text-secondary-foreground',
                    item.className
                  )}
                >
                  <LinkComponent
                    href={item.href || '#'}
                    onClick={(e: React.MouseEvent) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.text}
                  </LinkComponent>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    ) : null;

  // Render the logo/title element
  const renderLogo = () => {
    // If logo is a React node, use it directly
    if (React.isValidElement(logo)) {
      return logo;
    }

    // If logo is a LogoProps object with src, render an image
    if (isLogoProps(logo)) {
      const {
        src,
        alt = title,
        width = 32,
        height = 32,
        className: logoClassName,
      } = logo;
      return (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn('object-contain', logoClassName)}
        />
      );
    }

    // Default text fallback
    return <span className="text-2xl font-bold text-primary">{title}</span>;
  };

  const logoElement = (
    <a
      href={logoHref}
      className="flex items-center hover:opacity-90 transition-opacity"
    >
      {renderLogo()}
    </a>
  );

  return (
    <header
      className={cn(
        'w-full border-b fixed top-0 left-0 right-0 z-10 bg-background',
        className
      )}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {logoElement}

        {/* Desktop Navigation */}
        <div className="hidden md:block">{children || navigationMenu}</div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[385px]">
              <div className="py-4">
                <div className="mb-6">{logoElement}</div>
                {children ? (
                  <div className="mobile-navigation-wrapper">
                    {/* Apply custom styles to NavigationMenu when in mobile view */}
                    <style jsx global>{`
                      .mobile-navigation-wrapper .navigation-menu-viewport {
                        display: none !important;
                      }

                      .mobile-navigation-wrapper nav {
                        width: 100%;
                      }

                      .mobile-navigation-wrapper ul {
                        flex-direction: column;
                        align-items: flex-start;
                        width: 100%;
                      }

                      .mobile-navigation-wrapper li {
                        width: 100%;
                        margin: 4px 0;
                      }

                      .mobile-navigation-wrapper a,
                      .mobile-navigation-wrapper button {
                        width: 100%;
                        justify-content: flex-start;
                      }
                    `}</style>
                    {children}
                  </div>
                ) : navigationItems.length > 0 ? (
                  <nav className="flex flex-col gap-4">
                    {navigationItems.map((item) => {
                      const LinkComponent = item.linkComponent || 'a';

                      return (
                        <Button
                          key={item.text}
                          variant={item.variant || 'secondary'}
                          className={cn('w-full justify-start', item.className)}
                          asChild
                        >
                          <LinkComponent
                            href={item.href || '#'}
                            onClick={(e: React.MouseEvent) => {
                              if (item.onClick) {
                                e.preventDefault();
                                item.onClick();
                              }
                              setIsOpen(false);
                            }}
                          >
                            {item.icon && (
                              <item.icon className="mr-2 h-4 w-4" />
                            )}
                            {item.text}
                          </LinkComponent>
                        </Button>
                      );
                    })}
                  </nav>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
