'use client';

import Link from 'next/link';
import { Accordion } from '../accordion';
import { ScrollArea } from '../scroll-area';
import { Separator } from '../separator';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../sheet/sheet';
import { useState } from 'react';
import { Button } from '../button';
import { CategoryItem } from './category-item';
import { TagList } from './tag-list';
import { SidebarProps } from './sidebar.types';
import { useMobileDetection } from './sidebar.hooks';

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
  LinkComponent = Link,
}: SidebarProps) {
  const isMobile = useMobileDetection();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Check if we have active filters
  const hasActiveFilters =
    selectedCategory ||
    selectedSubcategory ||
    (selectedTags && selectedTags.length > 0);

  const handleMobileClose = () => {
    if (isMobile) {
      setSheetOpen(false);
    }
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Filter</h2>
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
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
                {categories.map((category) => (
                  <CategoryItem
                    key={category.name}
                    category={category}
                    isSelected={selectedCategory === category.name}
                    selectedSubcategory={selectedSubcategory}
                    onCategoryChange={onCategoryChange}
                    onSubcategoryChange={onSubcategoryChange}
                    onMobileClose={handleMobileClose}
                    baseUrl={baseUrl}
                    LinkComponent={LinkComponent}
                  />
                ))}
              </ul>
            </Accordion>
          </ScrollArea>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">Tags</h3>
          <TagList
            tags={tags}
            selectedTags={selectedTags}
            onTagToggle={onTagToggle}
            onMobileClose={handleMobileClose}
            baseUrl={baseUrl}
            LinkComponent={LinkComponent}
          />
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
