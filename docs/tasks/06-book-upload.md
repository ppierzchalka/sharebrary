# Book Upload System

## Overview

This task involves implementing the book upload system for Sharebrary, including file upload, metadata extraction, cover generation, and processing queue management.

## Prerequisites

- [Project Setup](./01-project-setup.md) completed
- [Authentication System](./03-authentication.md) implemented
- [Book Library Core](./05-book-library.md) implemented

## Detailed Tasks

### 1. Upload Form UI

- [ ] Create upload page

  ```typescript
  // app/upload/page.tsx
  import { Metadata } from 'next';
  import { RouteGuard } from '@sharebrary/auth';
  import { UploadForm } from '@sharebrary/features/upload';

  export const metadata: Metadata = {
    title: 'Upload Book | Sharebrary',
    description: 'Share a book with the Sharebrary community',
  };

  export default function UploadPage() {
    return (
      <RouteGuard requireAuth>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Upload a Book</h1>
          <UploadForm />
        </div>
      </RouteGuard>
    );
  }
  ```

- [ ] Implement file dropzone component

  ```typescript
  // libs/ui/src/lib/file-dropzone/file-dropzone.tsx
  'use client';

  import { useState, useCallback } from 'react';
  import { useDropzone } from 'react-dropzone';
  import { Upload, X, AlertCircle, FileText } from 'lucide-react';
  import { Button } from '../button/button';
  import { Alert, AlertDescription } from '../alert/alert';

  interface FileDropzoneProps {
    onFileSelected: (file: File) => void;
    accept?: Record<string, string[]>;
    maxSize?: number;
  }

  export function FileDropzone({
    onFileSelected,
    accept = { 'application/pdf': ['.pdf'] },
    maxSize = 50 * 1024 * 1024, // 50MB default
  }: FileDropzoneProps) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        setError(null);

        if (acceptedFiles.length === 0) return;

        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        onFileSelected(selectedFile);
      },
      [onFileSelected]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      maxFiles: 1,
      accept,
      maxSize,
      onDropRejected: (rejections) => {
        const rejection = rejections[0];
        if (rejection.errors[0].code === 'file-too-large') {
          setError(
            `File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`
          );
        } else if (rejection.errors[0].code === 'file-invalid-type') {
          setError('Invalid file type. Only PDF files are accepted.');
        } else {
          setError('File upload failed. Please try again.');
        }
      },
    });

    const removeFile = () => {
      setFile(null);
      setError(null);
    };

    return (
      <div className="w-full">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">
              Drag and drop your book file here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse (PDF only, max 50MB)
            </p>
            <Button type="button" variant="outline">
              Select File
            </Button>
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center">
              <FileText className="h-10 w-10 text-primary mr-4" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeFile}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] Build the complete upload form

  ```typescript
  // libs/features/src/lib/upload/upload-form.tsx
  'use client';

  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { useAuth } from '@sharebrary/auth';
  import { Button } from '@sharebrary/ui/button';
  import { Input } from '@sharebrary/ui/input';
  import { Textarea } from '@sharebrary/ui/textarea';
  import { FileDropzone } from '@sharebrary/ui/file-dropzone';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@sharebrary/ui/select';
  import { Badge } from '@sharebrary/ui/badge';
  import { uploadBook } from '@sharebrary/api/firebase';
  import { CATEGORIES, TAGS } from '@sharebrary/api/models';
  import { X } from 'lucide-react';

  export function UploadForm() {
    const { user } = useAuth();
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const selectedCategory = CATEGORIES.find((c) => c.name === category);

    const handleFileSelected = (selectedFile: File) => {
      setFile(selectedFile);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!file || !user) return;

      setUploading(true);

      try {
        const bookData = {
          title,
          author,
          description,
          category,
          subcategory: subcategory || undefined,
          tags: selectedTags,
          uploadedBy: user.uid,
        };

        await uploadBook(file, bookData, (progress) => {
          setProgress(Math.round(progress));
        });

        // Navigate to the pending uploads page
        router.push('/my-uploads');
      } catch (error) {
        console.error('Upload error:', error);
        setUploading(false);
      }
    };

    const addTag = () => {
      if (!tagInput.trim()) return;

      if (!selectedTags.includes(tagInput) && selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tagInput.trim()]);
      }

      setTagInput('');
    };

    const removeTag = (tag: string) => {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
      }
    };

    if (uploading) {
      return (
        <div className="bg-card text-card-foreground rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-4">Uploading Book</h3>
          <div className="w-full bg-muted rounded-full h-4 mb-4">
            <div
              className="bg-primary h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-muted-foreground">
            Please wait while your book is being uploaded and processed...
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This may take several minutes depending on the file size.
          </p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card text-card-foreground rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upload Book File</h2>
          <FileDropzone onFileSelected={handleFileSelected} />
        </div>

        <div className="bg-card text-card-foreground rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Book Details</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title*
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium mb-1"
              >
                Author*
              </label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description*
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Enter book description"
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-1"
                >
                  Category*
                </label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory?.subcategories && (
                <div>
                  <label
                    htmlFor="subcategory"
                    className="block text-sm font-medium mb-1"
                  >
                    Subcategory
                  </label>
                  <Select value={subcategory} onValueChange={setSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory.subcategories.map((subcat) => (
                        <SelectItem key={subcat} value={subcat}>
                          {subcat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1">
                Tags <span className="text-muted-foreground">(up to 5)</span>
              </label>

              <div className="flex items-center">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Enter tag and press Enter"
                  className="flex-1"
                  disabled={selectedTags.length >= 5}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || selectedTags.length >= 5}
                  className="ml-2"
                >
                  Add
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>

              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">
                  Suggested tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {TAGS.filter((tag) => !selectedTags.includes(tag))
                    .slice(0, 8)
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => {
                          if (selectedTags.length < 5) {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={
              !file ||
              !title ||
              !author ||
              !description ||
              !category ||
              uploading
            }
          >
            Upload Book
          </Button>
        </div>
      </form>
    );
  }
  ```

### 2. Firebase Storage Integration

- [ ] Add book upload functionality to Firebase service

  ```typescript
  // libs/api/src/lib/firebase/upload-service.ts
  import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from 'firebase/storage';
  import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    serverTimestamp,
    doc,
  } from 'firebase/firestore';
  import { v4 as uuidv4 } from 'uuid';
  import { Book } from '../models/book';

  const storage = getStorage();
  const db = getFirestore();

  export interface BookUploadData {
    title: string;
    author: string;
    description: string;
    category: string;
    subcategory?: string;
    tags: string[];
    uploadedBy: string;
  }

  export async function uploadBook(
    file: File,
    bookData: BookUploadData,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // Create a unique filename using UUID
    const fileExtension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${fileExtension}`;

    // Reference to the storage location
    const filePath = `books/${filename}`;
    const storageRef = ref(storage, filePath);

    // Create a temporary cover URL (will be replaced by actual cover)
    const tempCoverURL = '/images/placeholder-cover.jpg';

    // First, create a document in Firestore with processing status
    const bookRef = await addDoc(collection(db, 'books'), {
      title: bookData.title,
      author: bookData.author,
      description: bookData.description,
      category: bookData.category,
      subcategory: bookData.subcategory || null,
      tags: bookData.tags,
      uploadedBy: bookData.uploadedBy,
      coverURL: tempCoverURL,
      fileURL: filePath,
      status: 'processing',
      uploadedAt: serverTimestamp(),
      metadataSource: 'user_provided',
    });

    // Now upload the file to Storage
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            // The upload completed successfully
            // In a production app, this would trigger a cloud function to process the file
            // For now, we'll just update the status to indicate it's completed
            await updateDoc(doc(db, 'books', bookRef.id), {
              status: 'completed',
              processedAt: serverTimestamp(),
            });

            resolve(bookRef.id);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  // Function to track user's uploads
  export async function getUserUploads(userId: string): Promise<Book[]> {
    // Implementation to fetch user's uploaded books
    // This would be added in the user collections task
    return [];
  }
  ```

- [ ] Create a book upload tracking page

  ```typescript
  // app/my-uploads/page.tsx
  import { Suspense } from 'react';
  import { Metadata } from 'next';
  import { RouteGuard } from '@sharebrary/auth';
  import { UserUploads } from '@sharebrary/features/upload';

  export const metadata: Metadata = {
    title: 'My Uploads | Sharebrary',
    description: 'Track and manage your uploaded books',
  };

  export default function MyUploadsPage() {
    return (
      <RouteGuard requireAuth>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">My Uploads</h1>
          <Suspense fallback={<div>Loading your uploads...</div>}>
            <UserUploads />
          </Suspense>
        </div>
      </RouteGuard>
    );
  }
  ```

### 3. Metadata Extraction

- [ ] Add book metadata extraction service (server side)

  ```typescript
  // libs/api/src/lib/services/metadata-extractor.ts
  import { PDFDocument } from 'pdf-lib';
  import { Book } from '../models/book';
  import { CATEGORIES } from '../models/categories';

  // Note: This would typically be a server-side function (Firebase Cloud Function)
  // Here it's simplified for demonstration

  interface ExtractedMetadata {
    title?: string;
    author?: string;
    description?: string;
    category?: string;
    subcategory?: string;
    tags?: string[];
  }

  export async function extractMetadataFromPDF(
    file: ArrayBuffer
  ): Promise<ExtractedMetadata> {
    try {
      const pdfDoc = await PDFDocument.load(file);

      // Get PDF metadata
      const { title, author, subject, keywords } = pdfDoc.getTitle()
        ? pdfDoc.getInfo()
        : {
            title: undefined,
            author: undefined,
            subject: undefined,
            keywords: undefined,
          };

      // Create a description from the first page text (if available)
      // In a real app, this might use ML to generate a better description
      let description = subject || '';

      // Extract potential tags from keywords
      const tags = keywords
        ? keywords
            .split(',')
            .map((k) => k.trim())
            .slice(0, 5)
        : [];

      // Determine category (simplified version)
      // In a real app, this would use ML for better categorization
      let category = '';
      let subcategory = '';

      if (tags.length > 0) {
        // Try to match tags with categories
        for (const cat of CATEGORIES) {
          if (
            tags.some((tag) =>
              tag.toLowerCase().includes(cat.name.toLowerCase())
            )
          ) {
            category = cat.name;

            // Try to match subcategories
            if (cat.subcategories) {
              for (const subcat of cat.subcategories) {
                if (
                  tags.some((tag) =>
                    tag.toLowerCase().includes(subcat.toLowerCase())
                  )
                ) {
                  subcategory = subcat;
                  break;
                }
              }
            }

            break;
          }
        }
      }

      // Default to "Other" if no category found
      if (!category) {
        category = 'Other';
      }

      return {
        title: title || undefined,
        author: author || undefined,
        description: description || undefined,
        category: category || undefined,
        subcategory: subcategory || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return {};
    }
  }

  // Function to generate a cover image
  // In a real app, this would be done server-side with a proper image generation service
  export function generateCoverImage(book: Partial<Book>): Promise<string> {
    // This is a placeholder - in a real app, this would generate a real cover
    // using AI or templates based on the book title, author, etc.
    return Promise.resolve('/images/generated-cover.jpg');
  }
  ```

### 4. Processing Queue Management

- [ ] Implement upload and processing flow (simplified client side)

  ```typescript
  // libs/features/src/lib/upload/processing-service.ts
  // This is a simplified version of what would typically be a server-side process
  // In a real app, this would be implemented as Firebase Cloud Functions

  import {
    getStorage,
    ref,
    getDownloadURL,
    uploadString,
  } from 'firebase/storage';
  import { getFirestore, doc, updateDoc } from 'firebase/firestore';
  import {
    extractMetadataFromPDF,
    generateCoverImage,
  } from '@sharebrary/api/services';
  import { v4 as uuidv4 } from 'uuid';

  const storage = getStorage();
  const db = getFirestore();

  export async function processUploadedBook(
    bookId: string,
    filePath: string
  ): Promise<void> {
    try {
      // 1. Get the file from storage
      const storageRef = ref(storage, filePath);
      const fileUrl = await getDownloadURL(storageRef);

      // 2. Download the file
      const response = await fetch(fileUrl);
      const fileBuffer = await response.arrayBuffer();

      // 3. Extract metadata
      const metadata = await extractMetadataFromPDF(fileBuffer);

      // 4. Generate a cover image
      // (In a real app, this would use the file content to generate a meaningful cover)
      const bookData = {
        title: metadata.title || 'Unknown Title',
        author: metadata.author || 'Unknown Author',
      };
      const coverURL = await generateCoverImage(bookData);

      // 5. Update the book document with the processed information
      const bookRef = doc(db, 'books', bookId);
      await updateDoc(bookRef, {
        status: 'completed',
        processedAt: new Date(),
        coverURL: coverURL,
        // Only update metadata if it was successfully extracted
        ...(metadata.title && { title: metadata.title }),
        ...(metadata.author && { author: metadata.author }),
        ...(metadata.description && { description: metadata.description }),
        ...(metadata.category && { category: metadata.category }),
        ...(metadata.subcategory && { subcategory: metadata.subcategory }),
        ...(metadata.tags && { tags: metadata.tags }),
        metadataSource: 'extracted',
      });
    } catch (error) {
      console.error('Error processing book:', error);

      // Update the book document with error status
      const bookRef = doc(db, 'books', bookId);
      await updateDoc(bookRef, {
        status: 'error',
        processedAt: new Date(),
      });
    }
  }
  ```

## Deliverables

1. File upload UI with dropzone and form validation
2. Firebase Storage integration for file uploads
3. Metadata extraction service (simplified implementation)
4. Processing queue management (simplified implementation)
5. Upload tracking page

## Dependencies

- [Project Setup](./01-project-setup.md)
- [Authentication System](./03-authentication.md)
- [Book Library Core](./05-book-library.md)

## Next Steps

After completing this task, you can proceed to:

- [PDF Viewer](./07-pdf-viewer.md)
- [Search and Filtering](./08-search-filtering.md)
- [Comments and Ratings](./09-comments-ratings.md)
