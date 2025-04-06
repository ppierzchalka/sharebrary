'use client';

import { useState } from 'react';
import { FilterIcon } from 'lucide-react';
import { Button } from '../button/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../sheet';
import { Sidebar } from './sidebar';

interface Category {
  name: string;
  subcategories?: string[];
}

interface MobileFiltersProps {
  categories: Category[];
  tags: string[];
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedTags?: string[];
  onCategoryChange?: (category: string | null) => void;
  onSubcategoryChange?: (subcategory: string | null) => void;
  onTagToggle?: (tag: string) => void;
  onClearFilters?: () => void;
}

export function MobileFilters({
  categories,
  tags,
  selectedCategory,
  selectedSubcategory,
  selectedTags,
  onCategoryChange,
  onSubcategoryChange,
  onTagToggle,
  onClearFilters,
}: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  // Count active filters for the badge
  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedSubcategory ? 1 : 0) +
    (selectedTags?.length || 0);

  // Handle actions inside the drawer and close it when done
  const handleCategoryChange = (category: string | null) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const handleSubcategoryChange = (subcategory: string | null) => {
    if (onSubcategoryChange) {
      onSubcategoryChange(subcategory);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (onTagToggle) {
      onTagToggle(tag);
    }
  };

  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="p-4 h-full overflow-auto">
          <Sidebar
            categories={categories}
            tags={tags}
            className="w-full m-0"
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            selectedTags={selectedTags}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
            onTagToggle={handleTagToggle}
            onClearFilters={handleClearFilters}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
