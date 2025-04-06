import { ComponentProps } from 'react';
import Link from 'next/link';

export type LinkProps = ComponentProps<typeof Link>;

export interface Category {
  name: string;
  subcategories?: Category[];
}

export interface SidebarProps {
  categories: Category[];
  tags: string[];
  className?: string;
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedTags?: string[];
  onCategoryChange?: (category: string | null) => void;
  onSubcategoryChange?: (subcategory: string | null) => void;
  onTagToggle?: (tag: string) => void;
  onClearFilters?: () => void;
  baseUrl?: string;
  mobileIcon?: React.ReactNode;
  LinkComponent?: React.ComponentType<LinkProps>;
}
