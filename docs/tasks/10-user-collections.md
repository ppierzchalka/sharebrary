# User Collections

## Overview

This task involves implementing user collections functionality for the Sharebrary application, allowing users to organize books into custom collections, mark favorites, track reading history, and manage personal libraries.

## Prerequisites

- [Project Setup](./01-project-setup.md) completed
- [Authentication System](./03-authentication.md) implemented
- [Book Library Core](./05-book-library.md) implemented

## Detailed Tasks

### 1. Collection Data Models

- [ ] Define collection data models

  ```typescript
  // libs/api/src/lib/models/collection.ts
  export interface Collection {
    id: string;
    userId: string;
    name: string;
    description?: string;
    coverURL?: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    bookCount: number;
  }

  export interface CollectionBook {
    id: string;
    collectionId: string;
    bookId: string;
    addedAt: Date;
    sortOrder: number;
    notes?: string;
  }

  export interface ReadingHistory {
    id: string;
    userId: string;
    bookId: string;
    startedAt?: Date;
    finishedAt?: Date;
    status: 'want_to_read' | 'reading' | 'completed' | 'dnf';
    progress?: number; // 0-100
    lastOpenedPage?: number;
  }
  ```

### 2. User Library Page

- [ ] Create user library page

  ```typescript
  // app/my-library/page.tsx
  import { Suspense } from 'react';
  import { Metadata } from 'next';
  import { RouteGuard } from '@sharebrary/auth';
  import { UserLibraryView } from '@sharebrary/features/collections';

  export const metadata: Metadata = {
    title: 'My Library | Sharebrary',
    description: 'Your personal library and book collections',
  };

  export default function MyLibraryPage() {
    return (
      <RouteGuard requireAuth>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">My Library</h1>

          <Suspense fallback={<div>Loading your library...</div>}>
            <UserLibraryView />
          </Suspense>
        </div>
      </RouteGuard>
    );
  }
  ```

- [ ] Add user library view component

  ```typescript
  // libs/features/src/lib/collections/user-library-view.tsx
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '@sharebrary/ui/tabs';
  import {
    getUserCollections,
    getUserReadingHistory,
  } from '@sharebrary/api/firebase';
  import { CollectionsGrid } from './collections-grid';
  import { ReadingHistoryList } from './reading-history-list';
  import { FavoritesList } from './favorites-list';
  import { auth } from '@sharebrary/auth';

  export async function UserLibraryView() {
    const { currentUser } = auth;

    if (!currentUser) {
      return <div>Please log in to view your library</div>;
    }

    const collections = await getUserCollections(currentUser.uid);
    const readingHistory = await getUserReadingHistory(currentUser.uid);

    return (
      <Tabs defaultValue="collections">
        <TabsList className="mb-8">
          <TabsTrigger value="collections">My Collections</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="reading">Reading History</TabsTrigger>
        </TabsList>

        <TabsContent value="collections">
          <CollectionsGrid collections={collections} userId={currentUser.uid} />
        </TabsContent>

        <TabsContent value="favorites">
          <FavoritesList userId={currentUser.uid} />
        </TabsContent>

        <TabsContent value="reading">
          <ReadingHistoryList
            readingHistory={readingHistory}
            userId={currentUser.uid}
          />
        </TabsContent>
      </Tabs>
    );
  }
  ```

### 3. Collection Management

- [ ] Create collection dialog component

  ```typescript
  // libs/features/src/lib/collections/collection-dialog.tsx
  'use client';

  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { useAuth } from '@sharebrary/auth';
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from '@sharebrary/ui/dialog';
  import { Button } from '@sharebrary/ui/button';
  import { Input } from '@sharebrary/ui/input';
  import { Textarea } from '@sharebrary/ui/textarea';
  import { Switch } from '@sharebrary/ui/switch';
  import { Label } from '@sharebrary/ui/label';
  import { Collection } from '@sharebrary/api/models';
  import { createCollection, updateCollection } from '@sharebrary/api/firebase';

  interface CollectionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    collection?: Collection;
    isEditing?: boolean;
  }

  export function CollectionDialog({
    isOpen,
    onOpenChange,
    collection,
    isEditing = false,
  }: CollectionDialogProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [name, setName] = useState(collection?.name || '');
    const [description, setDescription] = useState(
      collection?.description || ''
    );
    const [isPublic, setIsPublic] = useState(collection?.isPublic || false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!user || !name.trim() || isSubmitting) return;

      setIsSubmitting(true);

      try {
        if (isEditing && collection) {
          // Update existing collection
          await updateCollection(collection.id, {
            name,
            description: description || undefined,
            isPublic,
            updatedAt: new Date(),
          });
        } else {
          // Create new collection
          await createCollection({
            userId: user.uid,
            name,
            description: description || undefined,
            isPublic,
            bookCount: 0,
          });
        }

        // Close dialog and refresh
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        console.error('Collection operation failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Collection' : 'Create Collection'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Favorite Sci-Fi Books"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A collection of my favorite science fiction novels"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public">Make this collection public</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim() || isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : isEditing
                  ? 'Update Collection'
                  : 'Create Collection'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
  ```

- [ ] Implement collections grid component

  ```typescript
  // libs/features/src/lib/collections/collections-grid.tsx
  'use client';

  import { useState } from 'react';
  import { Collection } from '@sharebrary/api/models';
  import { CollectionCard } from './collection-card';
  import { Button } from '@sharebrary/ui/button';
  import { Plus } from 'lucide-react';
  import { CollectionDialog } from './collection-dialog';

  interface CollectionsGridProps {
    collections: Collection[];
    userId: string;
  }

  export function CollectionsGrid({
    collections,
    userId,
  }: CollectionsGridProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Collections</h2>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>

        {collections.length === 0 ? (
          <div className="bg-card text-card-foreground rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No collections yet</h3>
            <p className="text-muted-foreground mb-4">
              Create collections to organize your books and reading lists.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}

        <CollectionDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
    );
  }
  ```

### 4. Reading Status and History

- [ ] Create reading status component for book detail

  ```typescript
  // libs/features/src/lib/collections/reading-status.tsx
  'use client';

  import { useState, useEffect } from 'react';
  import { useAuth } from '@sharebrary/auth';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@sharebrary/ui/dropdown-menu';
  import { Button } from '@sharebrary/ui/button';
  import { Check, ChevronDown, BookOpen, BookX } from 'lucide-react';
  import {
    getReadingStatus,
    updateReadingStatus,
  } from '@sharebrary/api/firebase';

  interface ReadingStatusProps {
    bookId: string;
  }

  const statusLabels = {
    want_to_read: 'Want to Read',
    reading: 'Currently Reading',
    completed: 'Completed',
    dnf: 'Did Not Finish',
  };

  const statusIcons = {
    want_to_read: null,
    reading: BookOpen,
    completed: Check,
    dnf: BookX,
  };

  export function ReadingStatus({ bookId }: ReadingStatusProps) {
    const { user } = useAuth();
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchStatus = async () => {
        if (!user) {
          setIsLoading(false);
          return;
        }

        try {
          const readingStatus = await getReadingStatus(user.uid, bookId);
          setStatus(readingStatus?.status || null);
        } catch (error) {
          console.error('Error fetching reading status:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchStatus();
    }, [user, bookId]);

    const handleStatusChange = async (newStatus: string) => {
      if (!user) return;

      try {
        setStatus(newStatus);
        await updateReadingStatus(user.uid, bookId, newStatus as any);
      } catch (error) {
        console.error('Error updating reading status:', error);
        // Revert on error
        setStatus(status);
      }
    };

    if (!user || isLoading) {
      return null;
    }

    const StatusIcon = status
      ? statusIcons[status as keyof typeof statusIcons]
      : null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={status ? 'default' : 'outline'} className="w-full">
            {StatusIcon && <StatusIcon className="h-4 w-4 mr-2" />}
            {status
              ? statusLabels[status as keyof typeof statusLabels]
              : 'Add to Reading List'}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {Object.entries(statusLabels).map(([value, label]) => (
            <DropdownMenuItem
              key={value}
              onClick={() => handleStatusChange(value)}
              className={status === value ? 'bg-primary/10' : ''}
            >
              {status === value && <Check className="h-4 w-4 mr-2" />}
              {label}
            </DropdownMenuItem>
          ))}

          {status && (
            <DropdownMenuItem
              onClick={() => handleStatusChange('')}
              className="text-destructive"
            >
              Remove from Reading List
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  ```

### 5. Firebase Integration

- [ ] Add collections and reading history Firebase services

  ```typescript
  // libs/api/src/lib/firebase/collections-service.ts
  import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    doc,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    increment,
    limit,
  } from 'firebase/firestore';
  import {
    Collection,
    CollectionBook,
    ReadingHistory,
  } from '../models/collection';
  import { Book } from '../models/book';

  const db = getFirestore();

  // Collections

  export async function createCollection(
    collectionData: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const collectionsRef = collection(db, 'collections');

    const docRef = await addDoc(collectionsRef, {
      ...collectionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }

  export async function updateCollection(
    collectionId: string,
    data: Partial<Collection>
  ): Promise<void> {
    const collectionRef = doc(db, 'collections', collectionId);

    await updateDoc(collectionRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  export async function deleteCollection(collectionId: string): Promise<void> {
    // Delete the collection
    await deleteDoc(doc(db, 'collections', collectionId));

    // Delete all associated collection books
    const collectionBooksRef = collection(db, 'collectionBooks');
    const q = query(
      collectionBooksRef,
      where('collectionId', '==', collectionId)
    );
    const snapshot = await getDocs(q);

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }

  export async function getUserCollections(
    userId: string
  ): Promise<Collection[]> {
    const collectionsRef = collection(db, 'collections');
    const q = query(
      collectionsRef,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Collection)
    );
  }

  export async function addBookToCollection(
    collectionId: string,
    bookId: string,
    notes?: string
  ): Promise<string> {
    // Get the current collection for validation
    const collectionRef = doc(db, 'collections', collectionId);
    const collectionSnap = await getDoc(collectionRef);

    if (!collectionSnap.exists()) {
      throw new Error('Collection not found');
    }

    // Get current book count for sort order
    const collectionBooksRef = collection(db, 'collectionBooks');
    const countQuery = query(
      collectionBooksRef,
      where('collectionId', '==', collectionId)
    );
    const countSnapshot = await getDocs(countQuery);
    const bookCount = countSnapshot.size;

    // Add book to collection
    const docRef = await addDoc(collectionBooksRef, {
      collectionId,
      bookId,
      addedAt: serverTimestamp(),
      sortOrder: bookCount,
      notes: notes || null,
    });

    // Update collection's book count
    await updateDoc(collectionRef, {
      bookCount: increment(1),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }

  export async function removeBookFromCollection(
    collectionId: string,
    bookId: string
  ): Promise<void> {
    // Find the collection book entry
    const collectionBooksRef = collection(db, 'collectionBooks');
    const q = query(
      collectionBooksRef,
      where('collectionId', '==', collectionId),
      where('bookId', '==', bookId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('Book not found in collection');
    }

    // Delete the collection book entry
    const collectionBookId = snapshot.docs[0].id;
    await deleteDoc(doc(db, 'collectionBooks', collectionBookId));

    // Update collection's book count
    const collectionRef = doc(db, 'collections', collectionId);
    await updateDoc(collectionRef, {
      bookCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
  }

  // Reading History

  export async function getReadingStatus(
    userId: string,
    bookId: string
  ): Promise<ReadingHistory | null> {
    const historyRef = collection(db, 'readingHistory');
    const q = query(
      historyRef,
      where('userId', '==', userId),
      where('bookId', '==', bookId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as ReadingHistory;
  }

  export async function updateReadingStatus(
    userId: string,
    bookId: string,
    status: 'want_to_read' | 'reading' | 'completed' | 'dnf' | '',
    progress?: number
  ): Promise<void> {
    const historyRef = collection(db, 'readingHistory');
    const q = query(
      historyRef,
      where('userId', '==', userId),
      where('bookId', '==', bookId)
    );

    const snapshot = await getDocs(q);

    if (status === '') {
      // Remove reading status if exists
      if (!snapshot.empty) {
        await deleteDoc(snapshot.docs[0].ref);
      }
      return;
    }

    const now = new Date();
    let data: Partial<ReadingHistory> = {
      status,
      progress,
    };

    // Set appropriate timestamps based on status
    if (status === 'reading' && !snapshot.docs[0]?.data().startedAt) {
      data.startedAt = now;
    } else if (status === 'completed') {
      data.finishedAt = now;

      if (!snapshot.docs[0]?.data().startedAt) {
        data.startedAt = now;
      }
    }

    if (snapshot.empty) {
      // Create new reading history entry
      await addDoc(historyRef, {
        userId,
        bookId,
        ...data,
      });
    } else {
      // Update existing reading history entry
      await updateDoc(snapshot.docs[0].ref, data);
    }
  }

  export async function getUserReadingHistory(
    userId: string
  ): Promise<ReadingHistory[]> {
    const historyRef = collection(db, 'readingHistory');
    const q = query(
      historyRef,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as ReadingHistory)
    );
  }

  // Favorites

  export async function toggleFavorite(
    userId: string,
    bookId: string
  ): Promise<boolean> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnap.data();
    const favorites = userData.favorites || [];
    const isFavorite = favorites.includes(bookId);

    // Toggle favorite status
    await updateDoc(userRef, {
      favorites: isFavorite ? arrayRemove(bookId) : arrayUnion(bookId),
    });

    return !isFavorite;
  }

  export async function getUserFavoriteBooks(userId: string): Promise<Book[]> {
    // Get user's favorites list
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return [];
    }

    const userData = userSnap.data();
    const favorites = userData.favorites || [];

    if (favorites.length === 0) {
      return [];
    }

    // Get book details for each favorite
    const booksRef = collection(db, 'books');
    const books: Book[] = [];

    // Firestore doesn't support large IN queries, so we'll batch them
    const batchSize = 10;
    for (let i = 0; i < favorites.length; i += batchSize) {
      const batch = favorites.slice(i, i + batchSize);

      const q = query(booksRef, where('__name__', 'in', batch));

      const snapshot = await getDocs(q);

      books.push(
        ...snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Book)
        )
      );
    }

    return books;
  }
  ```

## Deliverables

1. User collections functionality with CRUD operations
2. Reading status tracking (want to read, reading, completed)
3. Favorites system for bookmarking preferred books
4. Personal library page with collections, favorites, and reading history
5. Integration with book detail page

## Dependencies

- [Project Setup](./01-project-setup.md)
- [Authentication System](./03-authentication.md)
- [Book Library Core](./05-book-library.md)

## Next Steps

After completing this task, you can proceed to:

- [Analytics Dashboard](./11-analytics-dashboard.md)
- [Performance Optimization](./12-performance-optimization.md)
