# Comments and Ratings

## Overview

This task involves implementing a comments and ratings system for books in the Sharebrary application, including user reviews, star ratings, and comment moderation capabilities.

## Prerequisites

- [Project Setup](./01-project-setup.md) completed
- [Authentication System](./03-authentication.md) implemented
- [Book Library Core](./05-book-library.md) implemented

## Detailed Tasks

### 1. Rating Component

- [ ] Create star rating component

  ```typescript
  // libs/ui/src/lib/rating/star-rating.tsx
  'use client';

  import { useState } from 'react';
  import { Star } from 'lucide-react';
  import { cn } from '@sharebrary/utils';

  interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onChange?: (rating: number) => void;
    className?: string;
  }

  export function StarRating({
    rating,
    maxRating = 5,
    size = 'md',
    interactive = false,
    onChange,
    className,
  }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const starSize = sizeClasses[size];

    return (
      <div
        className={cn('flex items-center gap-0.5', className)}
        onMouseLeave={() => interactive && setHoverRating(0)}
      >
        {Array.from({ length: maxRating }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = interactive
            ? starValue <= (hoverRating || rating)
            : starValue <= rating;

          return (
            <Star
              key={i}
              className={cn(
                starSize,
                'transition-colors',
                isFilled
                  ? 'fill-primary text-primary'
                  : 'text-muted-foreground',
                interactive && 'cursor-pointer'
              )}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onClick={() => interactive && onChange?.(starValue)}
            />
          );
        })}
      </div>
    );
  }
  ```

### 2. Comments System

- [ ] Define comment data model

  ```typescript
  // libs/api/src/lib/models/comment.ts
  export interface Comment {
    id: string;
    bookId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating?: number;
    text: string;
    createdAt: Date;
    updatedAt?: Date;
    status: 'pending' | 'approved' | 'rejected';
    likes: number;
    parentId?: string; // For replies
    isEdited: boolean;
  }
  ```

- [ ] Create comment list component

  ```typescript
  // libs/features/src/lib/comments/comment-list.tsx
  import { Fragment } from 'react';
  import { Comment } from '@sharebrary/api/models';
  import { CommentItem } from './comment-item';
  import { Separator } from '@sharebrary/ui/separator';

  interface CommentListProps {
    comments: Comment[];
    bookId: string;
    onReply: (commentId: string) => void;
    onEdit: (comment: Comment) => void;
    onDelete: (commentId: string) => void;
    onLike: (commentId: string) => void;
  }

  export function CommentList({
    comments,
    bookId,
    onReply,
    onEdit,
    onDelete,
    onLike,
  }: CommentListProps) {
    // Group comments by parent (top-level vs replies)
    const topLevelComments = comments.filter((comment) => !comment.parentId);
    const commentReplies = comments.filter((comment) => comment.parentId);

    // Create a map of replies by parent ID for easy lookup
    const repliesByParentId = commentReplies.reduce((map, reply) => {
      const parentId = reply.parentId as string;
      if (!map[parentId]) {
        map[parentId] = [];
      }
      map[parentId].push(reply);
      return map;
    }, {} as Record<string, Comment[]>);

    if (topLevelComments.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {topLevelComments.map((comment, index) => (
          <Fragment key={comment.id}>
            {index > 0 && <Separator />}
            <div className="pt-6 first:pt-0">
              <CommentItem
                comment={comment}
                bookId={bookId}
                onReply={() => onReply(comment.id)}
                onEdit={() => onEdit(comment)}
                onDelete={() => onDelete(comment.id)}
                onLike={() => onLike(comment.id)}
              />

              {/* Render replies indented */}
              {repliesByParentId[comment.id]?.length > 0 && (
                <div className="ml-12 mt-4 space-y-4">
                  {repliesByParentId[comment.id].map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      bookId={bookId}
                      isReply
                      onEdit={() => onEdit(reply)}
                      onDelete={() => onDelete(reply.id)}
                      onLike={() => onLike(reply.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </Fragment>
        ))}
      </div>
    );
  }
  ```

- [ ] Implement comment form component

  ```typescript
  // libs/features/src/lib/comments/comment-form.tsx
  'use client';

  import { useState } from 'react';
  import { useAuth } from '@sharebrary/auth';
  import { Button } from '@sharebrary/ui/button';
  import { Textarea } from '@sharebrary/ui/textarea';
  import { StarRating } from '@sharebrary/ui/rating';
  import { addComment, updateComment } from '@sharebrary/api/firebase';
  import { Comment } from '@sharebrary/api/models';
  import { Avatar, AvatarFallback, AvatarImage } from '@sharebrary/ui/avatar';
  import { getInitials } from '@sharebrary/utils';

  interface CommentFormProps {
    bookId: string;
    parentId?: string;
    existingComment?: Comment;
    onCancel?: () => void;
    onSuccess?: () => void;
    showRating?: boolean;
  }

  export function CommentForm({
    bookId,
    parentId,
    existingComment,
    onCancel,
    onSuccess,
    showRating = false,
  }: CommentFormProps) {
    const { user } = useAuth();
    const [text, setText] = useState(existingComment?.text || '');
    const [rating, setRating] = useState(existingComment?.rating || 0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user) {
      return (
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-muted-foreground">
            Please log in to leave a comment.
          </p>
        </div>
      );
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!text.trim() || isSubmitting) return;

      setIsSubmitting(true);

      try {
        if (existingComment) {
          // Update existing comment
          await updateComment(existingComment.id, {
            text,
            rating: showRating ? rating : undefined,
            updatedAt: new Date(),
            isEdited: true,
          });
        } else {
          // Add new comment
          await addComment({
            bookId,
            userId: user.uid,
            userName: user.displayName || 'Anonymous',
            userAvatar: user.photoURL || undefined,
            text,
            rating: showRating ? rating : undefined,
            parentId,
            createdAt: new Date(),
            status: 'approved', // Auto-approve for now
          });
        }

        // Reset form and call success callback
        setText('');
        setRating(0);
        onSuccess?.();
      } catch (error) {
        console.error('Error submitting comment:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage
              src={user.photoURL || undefined}
              alt={user.displayName || ''}
            />
            <AvatarFallback>
              {getInitials(user.displayName || 'User')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            {showRating && (
              <div className="mb-2">
                <p className="text-sm font-medium mb-1">Your Rating</p>
                <StarRating rating={rating} interactive onChange={setRating} />
              </div>
            )}

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                parentId ? 'Write a reply...' : 'Share your thoughts...'
              }
              rows={3}
              className="resize-none"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={!text.trim() || isSubmitting}>
            {isSubmitting
              ? 'Submitting...'
              : existingComment
              ? 'Update'
              : parentId
              ? 'Reply'
              : 'Comment'}
          </Button>
        </div>
      </form>
    );
  }
  ```

### 3. Firebase Integration

- [ ] Add comment and rating related functions to Firebase service

  ```typescript
  // libs/api/src/lib/firebase/comment-service.ts
  import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    increment,
  } from 'firebase/firestore';
  import { Comment } from '../models/comment';

  const db = getFirestore();

  // Add a new comment
  export async function addComment(
    commentData: Omit<Comment, 'id' | 'likes' | 'isEdited'>
  ): Promise<string> {
    const commentsRef = collection(db, 'comments');

    const docRef = await addDoc(commentsRef, {
      ...commentData,
      createdAt: serverTimestamp(),
      likes: 0,
      isEdited: false,
    });

    // Update book ratings if this is a top-level comment with rating
    if (!commentData.parentId && commentData.rating) {
      await updateBookRating(commentData.bookId);
    }

    return docRef.id;
  }

  // Get comments for a book
  export async function getBookComments(bookId: string): Promise<Comment[]> {
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('bookId', '==', bookId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Comment)
    );
  }

  // Update an existing comment
  export async function updateComment(
    commentId: string,
    data: Partial<Comment>
  ): Promise<void> {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    // If rating was updated, update the book's average rating
    if (data.rating) {
      const comment = (await getDoc(commentRef)).data() as Comment;
      await updateBookRating(comment.bookId);
    }
  }

  // Delete a comment
  export async function deleteComment(commentId: string): Promise<void> {
    const commentRef = doc(db, 'comments', commentId);
    const comment = (await getDoc(commentRef)).data() as Comment;

    // Delete the comment
    await deleteDoc(commentRef);

    // If it had a rating, update the book's average rating
    if (comment.rating) {
      await updateBookRating(comment.bookId);
    }
  }

  // Like a comment
  export async function likeComment(commentId: string): Promise<void> {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      likes: increment(1),
    });
  }

  // Update a book's average rating
  async function updateBookRating(bookId: string): Promise<void> {
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('bookId', '==', bookId),
      where('status', '==', 'approved'),
      where('rating', '>', 0)
    );

    const snapshot = await getDocs(q);
    const ratings = snapshot.docs.map((doc) => doc.data().rating as number);

    if (ratings.length === 0) {
      // No ratings, reset book rating to 0
      const bookRef = doc(db, 'books', bookId);
      await updateDoc(bookRef, {
        ratingAvg: 0,
        ratingCount: 0,
      });
      return;
    }

    // Calculate average rating
    const ratingSum = ratings.reduce((sum, rating) => sum + rating, 0);
    const ratingAvg = ratingSum / ratings.length;

    // Update book document
    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, {
      ratingAvg,
      ratingCount: ratings.length,
    });
  }
  ```

### 4. Integrating with Book Detail Page

- [ ] Add comments section to book detail page

  ```typescript
  // libs/features/src/lib/library/book-detail.tsx
  // Add to the existing file

  import { Suspense } from 'react';
  import { BookComments } from '@sharebrary/features/comments';

  export function BookDetail({ book }: BookDetailProps) {
    // ... existing code ...

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Book cover and buttons section */}
          <div className="md:col-span-4 lg:col-span-3">
            {/* ... existing code ... */}
          </div>

          {/* Book details section */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* ... existing code ... */}

            {/* Book description section */}
            <div className="prose max-w-none mb-12">
              <h2 className="text-xl font-semibold mb-4">About this book</h2>
              <div className="whitespace-pre-line">{book.description}</div>
            </div>

            {/* Comments section */}
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">Reviews & Comments</h2>

              <Suspense fallback={<div>Loading comments...</div>}>
                <BookComments bookId={book.id} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* ... existing modals ... */}
      </>
    );
  }
  ```

### 5. Admin Moderation Dashboard

- [ ] Create comment moderation interface for administrators

  ```typescript
  // app/admin/comments/page.tsx
  import { Suspense } from 'react';
  import { Metadata } from 'next';
  import { RouteGuard } from '@sharebrary/auth';
  import { CommentModerationDashboard } from '@sharebrary/features/admin';

  export const metadata: Metadata = {
    title: 'Moderate Comments | Admin | Sharebrary',
    description: 'Moderate user comments and reviews',
  };

  export default function CommentModerationPage() {
    return (
      <RouteGuard requireAuth requireAdmin>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Comment Moderation</h1>

          <Suspense fallback={<div>Loading comments...</div>}>
            <CommentModerationDashboard />
          </Suspense>
        </div>
      </RouteGuard>
    );
  }
  ```

## Deliverables

1. Star rating component for books
2. Comment system with replies and likes
3. Firebase integration for comments and ratings
4. Comment integration in book detail page
5. Admin moderation interface for comments

## Dependencies

- [Project Setup](./01-project-setup.md)
- [Authentication System](./03-authentication.md)
- [Book Library Core](./05-book-library.md)

## Next Steps

After completing this task, you can proceed to:

- [User Collections](./10-user-collections.md)
- [Analytics Dashboard](./11-analytics-dashboard.md)
- [Performance Optimization](./12-performance-optimization.md)
