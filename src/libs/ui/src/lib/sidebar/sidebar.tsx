import { Badge } from '../badge/badge';

interface Category {
  name: string;
  subcategories?: string[];
}

interface SidebarProps {
  categories: Category[];
  tags: string[];
}

export function Sidebar({ categories, tags }: SidebarProps) {
  return (
    <aside className="w-64 mr-8">
      <h2 className="text-xl font-semibold mb-4">Filter</h2>
      <div className="mb-6">
        <h3 className="font-medium mb-2">Categories</h3>
        <ul>
          {categories.map((category) => (
            <li key={category.name} className="mb-2">
              <span className="cursor-pointer hover:text-primary">
                {category.name}
              </span>
              {category.subcategories && (
                <ul className="ml-4 mt-1">
                  {category.subcategories.map((sub) => (
                    <li
                      key={sub}
                      className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </aside>
  );
}
