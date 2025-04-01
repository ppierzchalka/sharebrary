import Image from 'next/image';
import { Badge } from '../badge/badge';

interface BookCardProps {
  cover: string;
  title: string;
  author: string;
  tags: string[];
  description: string;
}

export function BookCard({
  cover,
  title,
  author,
  tags,
  description,
}: BookCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-md">
      <Image
        src={cover}
        width={200}
        height={300}
        alt={title}
        className="w-full h-48 object-cover"
        data-testid="next-image"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{author}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
