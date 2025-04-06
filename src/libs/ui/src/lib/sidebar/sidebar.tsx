'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion';
import { Badge } from '../badge/badge';
import { ScrollArea } from '../scroll-area';
import { Separator } from '../separator';
import { Menu, Plus, Minus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../sheet/sheet';
import { useState, useEffect } from 'react';
import { Button } from '../button';

interface Category {
  name: string;
  subcategories?: string[] | Category[];
}

interface SidebarProps {
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
}

export function Sidebar({
  categories,
  tags,
  className = '',
  selectedCategory,
  selectedSubcategory,
  selectedTags = [],
  onCategoryChange,
  onSubcategoryChange,
  onTagToggle,
  onClearFilters,
  baseUrl = '/library',
  mobileIcon,
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Check if we have active filters
  const hasActiveFilters =
    selectedCategory ||
    selectedSubcategory ||
    (selectedTags && selectedTags.length > 0);

  // Effect to detect mobile viewport
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is standard md breakpoint
    };

    // Check initially
    checkIfMobile();

    // Add resize listener
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Helper function to create URL search parameters
  const createCategoryUrl = (category: string, subcategory?: string) => {
    if (onCategoryChange) {
      return undefined; // Using callbacks instead of navigation
    }

    let url = baseUrl;
    url += `?category=${encodeURIComponent(category)}`;
    if (subcategory) {
      url += `&subcategory=${encodeURIComponent(subcategory)}`;
    }
    return url;
  };

  const createTagUrl = (tag: string) => {
    if (onTagToggle) {
      return undefined; // Using callbacks instead of navigation
    }

    return `${baseUrl}?tag=${encodeURIComponent(tag)}`;
  };

  // Handle category click based on whether callback is provided
  const handleCategoryClick = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(selectedCategory === category ? null : category);
    }
  };

  // Handle subcategory click based on whether callback is provided
  const handleSubcategoryClick = (subcategory: string) => {
    if (onSubcategoryChange) {
      onSubcategoryChange(
        selectedSubcategory === subcategory ? null : subcategory
      );
    }
  };

  // Handle tag click based on whether callback is provided
  const handleTagClick = (tag: string) => {
    if (onTagToggle) {
      onTagToggle(tag);
    }

    // If on mobile, close the sheet after selection
    if (isMobile) {
      setSheetOpen(false);
    }
  };

  // Handle clear filters, also close mobile sheet
  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    }

    if (isMobile) {
      setSheetOpen(false);
    }
  };

  // Recursive function to render categories and their subcategories
  const renderCategoryItem = (category: Category) => {
    const hasSubcategories =
      category.subcategories && category.subcategories.length > 0;
    const isSelected = selectedCategory === category.name;

    // Simple link for categories without subcategories
    if (!hasSubcategories) {
      return (
        <li
          key={category.name}
          className={`py-1 text-sm ${
            isSelected ? 'text-primary font-medium' : ''
          }`}
        >
          {onCategoryChange ? (
            <button
              className="cursor-pointer w-full text-left hover:text-primary"
              onClick={() => {
                handleCategoryClick(category.name);
                if (isMobile) setSheetOpen(false);
              }}
              aria-label={`${category.name} category`}
            >
              {category.name}
            </button>
          ) : (
            <Link
              href={createCategoryUrl(category.name) || '#'}
              className="cursor-pointer block hover:text-primary underline-offset-4 hover:underline"
              onClick={() => isMobile && setSheetOpen(false)}
            >
              {category.name}
            </Link>
          )}
        </li>
      );
    }

    // Accordion for categories with subcategories
    return (
      <AccordionItem
        key={category.name}
        value={category.name}
        className="border-b-0"
      >
        <div className="flex items-center justify-between gap-2">
          {/* Category link/button part */}
          <div
            className={`flex-1 py-2 text-sm ${
              isSelected ? 'text-primary font-medium' : ''
            }`}
          >
            {onCategoryChange ? (
              <button
                className="cursor-pointer w-full text-left hover:text-primary"
                onClick={() => {
                  handleCategoryClick(category.name);
                  if (isMobile) setSheetOpen(false);
                }}
                aria-label={`${category.name} category`}
              >
                {category.name}
              </button>
            ) : (
              <Link
                href={createCategoryUrl(category.name) || '#'}
                className="cursor-pointer block hover:text-primary underline-offset-4 hover:underline"
                onClick={() => isMobile && setSheetOpen(false)}
              >
                {category.name}
              </Link>
            )}
          </div>

          {/* Square button with chevron */}
          <AccordionTrigger
            className="py-0 hover:no-underline flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground"
            data-testid={`${category.name}-expand-button`}
          >
            <button
              type="button"
              data-testid={`${category.name}-expand-trigger`}
              className="p-0 flex items-center justify-center w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">
                Toggle {category.name} subcategories
              </span>
            </button>
          </AccordionTrigger>
        </div>

        <AccordionContent>
          <ul className="pl-4 py-1 space-y-1">
            {Array.isArray(category.subcategories) &&
              category.subcategories.map((sub) => {
                // Handle string subcategories (simple list)
                if (typeof sub === 'string') {
                  const isSubSelected =
                    selectedCategory === category.name &&
                    selectedSubcategory === sub;
                  return (
                    <li
                      key={sub}
                      className={`text-sm py-1 ${
                        isSubSelected ? 'text-primary font-medium' : ''
                      }`}
                    >
                      {onSubcategoryChange ? (
                        <button
                          className="cursor-pointer w-full text-left text-muted-foreground hover:text-primary"
                          onClick={() => {
                            handleSubcategoryClick(sub);
                            if (isMobile) setSheetOpen(false);
                          }}
                          aria-label={`${sub} subcategory`}
                        >
                          {sub}
                        </button>
                      ) : (
                        <Link
                          href={createCategoryUrl(category.name, sub) || '#'}
                          className="cursor-pointer block text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                          onClick={() => isMobile && setSheetOpen(false)}
                        >
                          {sub}
                        </Link>
                      )}
                    </li>
                  );
                }

                // Handle nested category objects (recursive)
                return renderCategoryItem(sub as Category);
              })}
          </ul>
        </AccordionContent>
      </AccordionItem>
    );
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Filter</h2>
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Categories</h3>
          <ScrollArea className="h-[300px] pr-4">
            <Accordion
              type="multiple"
              defaultValue={selectedCategory ? [selectedCategory] : []}
              className="w-full"
            >
              <ul className="space-y-1">
                {categories.map((category) => renderCategoryItem(category))}
              </ul>
            </Accordion>
          </ScrollArea>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags?.includes(tag) ? 'default' : 'secondary'}
                className={`cursor-pointer transition-colors ${
                  selectedTags?.includes(tag)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-primary/10 hover:text-primary'
                }`}
                onClick={() => handleTagClick(tag)}
              >
                {onTagToggle ? (
                  <button
                    className="w-full text-left"
                    onClick={() => handleTagClick(tag)}
                    aria-label={`${tag} tag`}
                  >
                    {tag}
                  </button>
                ) : (
                  <Link
                    href={createTagUrl(tag) || '#'}
                    className="block h-full"
                    onClick={() => isMobile && setSheetOpen(false)}
                  >
                    {tag}
                  </Link>
                )}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // Mobile floating button version
  if (isMobile) {
    return (
      <div className="relative">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="fixed bottom-6 left-6 z-40 h-12 w-12 rounded-full shadow-lg"
              data-testid="sidebar-mobile-trigger"
            >
              {mobileIcon || <Menu />}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
            <div className="pr-8">{sidebarContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop version
  return <aside className={`w-64 mr-8 ${className}`}>{sidebarContent}</aside>;
}
