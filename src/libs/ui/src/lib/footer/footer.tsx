import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../utils';

export interface FooterProps {
  links?: Array<{
    text: string;
    href: string;
  }>;
  socialLinks?: Array<{
    icon: LucideIcon;
    href: string;
  }>;
  className?: string;
  content?: React.ReactNode;
}

export function Footer({
  links = [],
  socialLinks = [],
  className,
  content,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const hasNavigation = links.length > 0 || socialLinks.length > 0;

  return (
    <footer
      className={cn('border-t', hasNavigation ? 'py-6' : 'py-4', className)}
    >
      <div className="container mx-auto px-4">
        {/* Navigation Section */}
        {hasNavigation && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            {/* Links */}
            {links.length > 0 && (
              <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                {links.map(({ text, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="hover:text-primary transition-colors duration-[var(--transition-normal)]"
                  >
                    {text}
                  </a>
                ))}
              </nav>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map(({ icon: Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-[var(--transition-normal)]"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">Social media link</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Copyright or Custom Content */}
        <div
          className={cn(
            'text-center text-sm text-muted-foreground',
            hasNavigation && 'mt-4'
          )}
        >
          {content || `© ${currentYear} Sharebrary. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
