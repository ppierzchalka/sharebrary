import { ComponentProps } from 'react';
import { default as NextLink } from 'next/link';

export type LinkProps = Pick<
  ComponentProps<typeof NextLink>,
  'href' | 'className' | 'onClick' | 'children'
>;

export interface Category {
  name: string;
  subcategories?: string[] | Category[];
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
