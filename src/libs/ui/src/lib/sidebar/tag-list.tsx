import Link from 'next/link';
import { Badge } from '../badge/badge';
import { LinkProps } from './types';

export interface TagListProps {
  tags: string[];
  selectedTags?: string[];
  onTagToggle?: (tag: string) => void;
  onMobileClose?: () => void;
  baseUrl?: string;
  LinkComponent?: React.ComponentType<LinkProps>;
}

export function TagList({
  tags,
  selectedTags = [],
  onTagToggle,
  onMobileClose,
  baseUrl = '/library',
  LinkComponent = Link,
}: TagListProps) {
  const createTagUrl = (tag: string) => {
    if (onTagToggle) return undefined;
    return `${baseUrl}?tag=${encodeURIComponent(tag)}`;
  };

  const handleTagClick = (tag: string) => {
    onTagToggle?.(tag);
    onMobileClose?.();
  };

  return (
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
            <LinkComponent
              href={createTagUrl(tag) || '#'}
              className="block h-full"
              onClick={onMobileClose}
            >
              {tag}
            </LinkComponent>
          )}
        </Badge>
      ))}
    </div>
  );
}
