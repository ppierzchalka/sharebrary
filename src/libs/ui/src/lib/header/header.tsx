import { Button } from '../button/button';
import { BookOpen, Heart, Calendar, Plus } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">\vibrary</h1>
        <nav>
          <Button variant="secondary" className="mr-2">
            <BookOpen className="mr-2 h-4 w-4" />
            Library
          </Button>
          <Button variant="secondary" className="mr-2">
            <Heart className="mr-2 h-4 w-4" />
            Favourites
          </Button>
          <Button variant="secondary" className="mr-2">
            <Calendar className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button
            variant="primary"
            className="bg-primary text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Share
          </Button>
        </nav>
      </div>
    </header>
  );
}
