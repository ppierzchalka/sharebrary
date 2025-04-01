# PDF Viewer

## Overview

This task involves implementing an in-browser PDF viewer for Sharebrary, allowing users to preview books before downloading them. The viewer will include page navigation, zoom controls, and a responsive design.

## Prerequisites

- [Project Setup](./01-project-setup.md) completed
- [Authentication System](./03-authentication.md) implemented
- [Book Library Core](./05-book-library.md) implemented

## Detailed Tasks

### 1. PDF Viewer Component

- [ ] Create PDF viewer component using React-PDF

  ```typescript
  // libs/ui/src/lib/pdf-viewer/pdf-viewer.tsx
  'use client';

  import { useState, useEffect } from 'react';
  import { Document, Page, pdfjs } from 'react-pdf';
  import { Button } from '../button/button';
  import { Input } from '../input/input';
  import { Slider } from '../slider/slider';
  import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Download,
    X,
  } from 'lucide-react';

  // Set up PDF.js worker
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

  interface PDFViewerProps {
    fileURL: string;
    onClose?: () => void;
    onDownload?: () => void;
  }

  export function PDFViewer({ fileURL, onClose, onDownload }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setLoading(false);
    };

    const onDocumentLoadError = (error: Error) => {
      console.error('Error loading PDF:', error);
      setError('Failed to load the PDF. Please try again later.');
      setLoading(false);
    };

    const goToPrevPage = () => {
      setPageNumber((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
      if (numPages) {
        setPageNumber((prev) => Math.min(prev + 1, numPages));
      }
    };

    const changePageNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
      const page = parseInt(e.target.value);
      if (!isNaN(page) && numPages) {
        setPageNumber(Math.min(Math.max(page, 1), numPages));
      }
    };

    const zoomIn = () => {
      setScale((prev) => Math.min(prev + 0.1, 2.0));
    };

    const zoomOut = () => {
      setScale((prev) => Math.max(prev - 0.1, 0.5));
    };

    const changeZoom = (value: number[]) => {
      setScale(value[0]);
    };

    return (
      <div className="bg-background flex flex-col h-full">
        {/* PDF Viewer Toolbar */}
        <div className="bg-card border-b p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center">
              <Input
                type="number"
                min={1}
                max={numPages || 1}
                value={pageNumber}
                onChange={changePageNumber}
                className="w-16 text-center"
              />
              <span className="mx-2 text-muted-foreground">
                of {numPages || '?'}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={!numPages || pageNumber >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Slider
              value={[scale]}
              min={0.5}
              max={2.0}
              step={0.1}
              onValueChange={changeZoom}
              className="w-32"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 2.0}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            {onDownload && (
              <Button variant="outline" onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}

            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* PDF Document */}
        <div className="flex-1 overflow-auto p-4 flex justify-center">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-destructive mb-2">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          <Document
            file={fileURL}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
    );
  }
  ```

### 2. Book Preview Modal

- [ ] Create book preview modal component

  ```typescript
  // libs/features/src/lib/library/book-preview-modal.tsx
  'use client';

  import { useState } from 'react';
  import { PDFViewer } from '@sharebrary/ui/pdf-viewer';
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from '@sharebrary/ui/dialog';
  import { Button } from '@sharebrary/ui/button';
  import { Book } from '@sharebrary/api/models';
  import {
    getBookDownloadURL,
    trackBookPreview,
  } from '@sharebrary/api/firebase';
  import { useAuth } from '@sharebrary/auth';

  interface BookPreviewModalProps {
    book: Book;
    isOpen: boolean;
    onClose: () => void;
    onDownload: () => void;
  }

  export function BookPreviewModal({
    book,
    isOpen,
    onClose,
    onDownload,
  }: BookPreviewModalProps) {
    const { user } = useAuth();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Load the PDF when the modal opens
    const loadPdf = async () => {
      if (!isOpen || pdfUrl) return;

      setLoading(true);
      setError(null);

      try {
        // Get the download URL from Firebase Storage
        const url = await getBookDownloadURL(book.fileURL);
        setPdfUrl(url);

        // Track the preview if a user is logged in
        if (user) {
          await trackBookPreview(user.uid, book.id);
        }
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load the preview. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // When the modal state changes, load the PDF
    if (isOpen && !pdfUrl && !loading && !error) {
      loadPdf();
    }

    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className="max-w-5xl w-[90vw] h-[80vh] max-h-[80vh]"
          hideClose
        >
          <DialogHeader>
            <DialogTitle>Preview: {book.title}</DialogTitle>
          </DialogHeader>

          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-destructive mb-4">{error}</p>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={loadPdf}>
                  Retry
                </Button>
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          )}

          {pdfUrl && (
            <PDFViewer
              fileURL={pdfUrl}
              onClose={onClose}
              onDownload={onDownload}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }
  ```

### 3. Add Preview Button to Book Detail

- [ ] Update book detail component to add preview functionality

  ```typescript
  // libs/features/src/lib/library/book-detail.tsx
  'use client';

  import { useState } from 'react';
  import Image from 'next/image';
  import Link from 'next/link';
  import { Book } from '@sharebrary/api/models';
  import { Badge } from '@sharebrary/ui/badge';
  import { Button } from '@sharebrary/ui/button';
  import {
    getBookDownloadURL,
    trackBookDownload,
  } from '@sharebrary/api/firebase';
  import { useAuth } from '@sharebrary/auth';
  import { Download, Heart, Eye } from 'lucide-react';
  import { BookPreviewModal } from './book-preview-modal';

  interface BookDetailProps {
    book: Book;
  }

  export function BookDetail({ book }: BookDetailProps) {
    const { user } = useAuth();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleDownload = async () => {
      setIsDownloading(true);

      try {
        // Get download URL from Firebase Storage
        const downloadUrl = await getBookDownloadURL(book.fileURL);

        // Create anchor and simulate click
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${book.title} - ${book.author}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Track download
        if (user) {
          await trackBookDownload(user.uid, book.id);
        }
      } catch (error) {
        console.error('Download error:', error);
      } finally {
        setIsDownloading(false);
      }
    };

    const toggleFavorite = async () => {
      // Implement favorite toggling (will be covered in User Collections task)
      setIsFavorite(!isFavorite);
    };

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-24">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={book.coverURL}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                  priority
                />
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Book
                </Button>

                <Button
                  onClick={handleDownload}
                  className="w-full"
                  disabled={isDownloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? 'Downloading...' : 'Download'}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={toggleFavorite}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${
                      isFavorite ? 'fill-primary' : ''
                    }`}
                  />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </div>
            </div>
          </div>

          {/* Rest of the book detail content remains the same */}
          <div className="md:col-span-8 lg:col-span-9">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">
              by {book.author}
            </p>

            {/* Tags */}
            {/* Category info */}
            {/* Book description */}
            {/* Comments section */}
            {/* These sections remain unchanged */}
          </div>
        </div>

        {/* Book Preview Modal */}
        <BookPreviewModal
          book={book}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDownload={handleDownload}
        />
      </>
    );
  }
  ```

### 4. Firebase Integration for PDF Access

- [ ] Add tracking function for book previews

  ```typescript
  // libs/api/src/lib/firebase/book-service.ts
  // Add to the existing file

  // Track when a user previews a book
  export async function trackBookPreview(
    userId: string,
    bookId: string
  ): Promise<void> {
    const db = getFirestore();

    try {
      // Add to user's preview history
      await addDoc(collection(db, 'users', userId, 'previews'), {
        bookId,
        previewedAt: serverTimestamp(),
      });

      // Increment preview count on the book document
      const bookRef = doc(db, 'books', bookId);
      await updateDoc(bookRef, {
        previewCount: increment(1),
      });
    } catch (error) {
      console.error('Error tracking preview:', error);
    }
  }
  ```

- [ ] Add PDF access security checks (server side API route)

  ```typescript
  // app/api/books/[id]/preview/route.ts
  import { NextRequest, NextResponse } from 'next/server';
  import { getFirestore, doc, getDoc } from 'firebase/firestore';
  import { getStorage, ref, getDownloadURL } from 'firebase/storage';
  import { initializeApp } from 'firebase/app';
  import { firebaseConfig } from '@sharebrary/api/firebase';
  import { getAuth, verifyIdToken } from 'firebase-admin/auth';
  import { getToken } from 'next-auth/jwt';

  // Initialize Firebase if not already initialized
  let app;
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Firebase already initialized');
  }

  const db = getFirestore(app);
  const storage = getStorage(app);

  export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      // Extract the bookId from the URL parameters
      const bookId = params.id;

      // Verify authentication
      const token = await getToken({ req: request as any });

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Get the book document from Firestore
      const bookRef = doc(db, 'books', bookId);
      const bookSnap = await getDoc(bookRef);

      if (!bookSnap.exists()) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      }

      const book = bookSnap.data();

      // Check if the book is ready to be viewed
      if (book.status !== 'completed') {
        return NextResponse.json(
          { error: 'Book is not ready for viewing' },
          { status: 403 }
        );
      }

      // Get the download URL for the book file
      const storageRef = ref(storage, book.fileURL);
      const downloadURL = await getDownloadURL(storageRef);

      // Return the download URL to the client
      return NextResponse.json({ downloadURL });
    } catch (error) {
      console.error('Error generating preview URL:', error);
      return NextResponse.json(
        { error: 'Failed to generate preview URL' },
        { status: 500 }
      );
    }
  }
  ```

## Deliverables

1. PDF viewer component with page navigation and zoom controls
2. Book preview modal for an in-browser reading experience
3. Preview button on book detail page
4. Backend integration for secure PDF access

## Dependencies

- [Project Setup](./01-project-setup.md)
- [Authentication System](./03-authentication.md)
- [Book Library Core](./05-book-library.md)

## Next Steps

After completing this task, you can proceed to:

- [Search and Filtering](./08-search-filtering.md)
- [Comments and Ratings](./09-comments-ratings.md)
- [User Collections](./10-user-collections.md)
