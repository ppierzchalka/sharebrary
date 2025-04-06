'use client';

import { Header, NavigationItem } from '@/ui';
import { BookOpen, Heart, Calendar, Plus } from 'lucide-react';

export default function ClientHeader() {
  // Define navigation items for the header with proper typing
  const navigationItems: Omit<NavigationItem, 'icon'>[] = [
    {
      iconName: 'BookOpen',
      text: 'Library',
      href: '/library',
      variant: 'secondary',
    },
    {
      iconName: 'Heart',
      text: 'Favorites',
      href: '/favorites',
      variant: 'secondary',
    },
    {
      iconName: 'Calendar',
      text: 'History',
      href: '/history',
      variant: 'secondary',
    },
    {
      iconName: 'Plus',
      text: 'Share',
      variant: 'default',
      className: 'bg-primary text-primary-foreground',
      href: '/share',
    },
  ];

  // Map for rendering the actual Lucide icons in client component
  const iconMap = {
    BookOpen,
    Heart,
    Calendar,
    Plus,
  };

  // Custom logo with SVG and text
  const logo = (
    <div className="flex items-center">
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <rect
          x="4"
          y="8"
          width="24"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M10 8V6a2 2 0 012-2h8a2 2 0 012 2v2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M16 14v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M13 17h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="ml-2 text-xl font-bold text-primary">Sharebrary</span>
    </div>
  );

  return (
    <Header
      logo={logo}
      logoHref="/"
      navigationItems={navigationItems.map((item) => ({
        ...item,
        icon: iconMap[item.iconName as keyof typeof iconMap],
      }))}
    />
  );
}
