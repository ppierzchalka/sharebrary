import { BookCard, Input, Pagination, Sidebar } from '@/ui';
import { Search } from 'lucide-react';
import { BOOKS, CATEGORIES, TAGS } from '../constants/library';

export default function HomePage() {
  return (
    <div className="flex-grow container mx-auto px-4 py-8 flex">
      <Sidebar categories={CATEGORIES} tags={TAGS} />
      <main className="flex-grow">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by keyword, author, title"
              className="pl-10 w-full max-w-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {BOOKS.map((book, index) => (
            <BookCard key={index} {...book} />
          ))}
        </div>
        <Pagination />
      </main>
    </div>
  );
}
