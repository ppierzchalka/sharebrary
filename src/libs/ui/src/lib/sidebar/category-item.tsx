import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion';
import Link from 'next/link';
import { Category, LinkProps } from './types';

export interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  selectedSubcategory?: string;
  onCategoryChange?: (category: string | null) => void;
  onSubcategoryChange?: (subcategory: string | null) => void;
  onMobileClose?: () => void;
  baseUrl?: string;
  LinkComponent?: React.ComponentType<LinkProps>;
}

export function CategoryItem({
  category,
  isSelected,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  onMobileClose,
  baseUrl = '/library',
  LinkComponent = Link,
}: CategoryItemProps) {
  const hasSubcategories =
    category.subcategories && category.subcategories.length > 0;

  const createCategoryUrl = (category: string, subcategory?: string) => {
    if (onCategoryChange) return undefined;
    let url = baseUrl;
    url += `?category=${encodeURIComponent(category)}`;
    if (subcategory) url += `&subcategory=${encodeURIComponent(subcategory)}`;
    return url;
  };

  const handleCategoryClick = () => {
    onCategoryChange?.(isSelected ? null : category.name);
    onMobileClose?.();
  };

  const handleSubcategoryClick = (subcategory: string) => {
    onSubcategoryChange?.(
      selectedSubcategory === subcategory ? null : subcategory
    );
    onMobileClose?.();
  };

  // Simple link/button for categories without subcategories
  if (!hasSubcategories) {
    return (
      <li className="py-1 text-sm">
        {onCategoryChange ? (
          <button
            className="w-full text-left hover:text-primary"
            onClick={handleCategoryClick}
            aria-label={`${category.name} category`}
          >
            {category.name}
          </button>
        ) : (
          <LinkComponent
            href={createCategoryUrl(category.name) || '#'}
            className="block hover:text-primary hover:underline underline-offset-4"
            onClick={onMobileClose}
          >
            {category.name}
          </LinkComponent>
        )}
      </li>
    );
  }

  // Category with subcategories
  return (
    <AccordionItem value={category.name} className="border-b-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 py-2 text-sm">
          {onCategoryChange ? (
            <button
              className="w-full text-left hover:text-primary"
              onClick={handleCategoryClick}
              aria-label={`${category.name} category`}
            >
              {category.name}
            </button>
          ) : (
            <LinkComponent
              href={createCategoryUrl(category.name) || '#'}
              className="block hover:text-primary hover:underline underline-offset-4"
              onClick={onMobileClose}
            >
              {category.name}
            </LinkComponent>
          )}
        </div>

        <AccordionTrigger
          className="py-0 hover:no-underline flex h-8 w-8 items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground"
          data-testid={`${category.name}-expand-button`}
        >
          <span className="sr-only">Toggle {category.name} subcategories</span>
        </AccordionTrigger>
      </div>

      <AccordionContent>
        <ul className="pl-4 py-1 space-y-1">
          {Array.isArray(category.subcategories) &&
            category.subcategories.map((sub) => {
              if (typeof sub === 'string') {
                const isSubSelected = isSelected && selectedSubcategory === sub;
                return (
                  <li key={sub} className="text-sm py-1">
                    {onSubcategoryChange ? (
                      <button
                        className="w-full text-left text-muted-foreground hover:text-primary"
                        onClick={() => handleSubcategoryClick(sub)}
                        aria-label={`${sub} subcategory`}
                      >
                        {sub}
                      </button>
                    ) : (
                      <LinkComponent
                        href={createCategoryUrl(category.name, sub) || '#'}
                        className="block text-muted-foreground hover:text-primary hover:underline underline-offset-4"
                        onClick={onMobileClose}
                      >
                        {sub}
                      </LinkComponent>
                    )}
                  </li>
                );
              }
              return (
                <CategoryItem
                  key={sub.name}
                  category={sub}
                  isSelected={isSelected}
                  selectedSubcategory={selectedSubcategory}
                  onCategoryChange={onCategoryChange}
                  onSubcategoryChange={onSubcategoryChange}
                  onMobileClose={onMobileClose}
                  baseUrl={baseUrl}
                  LinkComponent={LinkComponent}
                />
              );
            })}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
