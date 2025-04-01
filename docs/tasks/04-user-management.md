# User Management

## Overview

This task involves implementing user profile management, admin dashboard for user approval, and role-based permissions for the Sharebrary application.

## Prerequisites

- [Project Setup](./01-project-setup.md) completed
- [Authentication System](./03-authentication.md) implemented

## Detailed Tasks

### 1. User Profile Page

- [ ] Create user profile page

  ```typescript
  // app/profile/page.tsx
  import { Metadata } from 'next';
  import { ProfileForm } from '@sharebrary/auth/components';
  import { RouteGuard } from '@sharebrary/auth';

  export const metadata: Metadata = {
    title: 'Profile | Sharebrary',
    description: 'Manage your Sharebrary profile',
  };

  export default function ProfilePage() {
    return (
      <RouteGuard requireAuth>
        <div className="container py-10">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          <div className="grid gap-10">
            <ProfileForm />
          </div>
        </div>
      </RouteGuard>
    );
  }
  ```

- [ ] Implement profile form component

  ```typescript
  // libs/auth/src/lib/components/profile-form.tsx
  import { useState, useEffect } from 'react';
  import { useAuth } from '../auth-context';
  import { Button } from '@sharebrary/ui/button';
  import { Input } from '@sharebrary/ui/input';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from '@sharebrary/ui/card';
  import { Alert, AlertDescription } from '@sharebrary/ui/alert';
  import { updateUserProfile } from '../firebase-auth';

  export function ProfileForm() {
    const { user, isLoading } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (user) {
        setDisplayName(user.displayName);
      }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);
      setIsSubmitting(true);

      try {
        await updateUserProfile(user?.uid!, { displayName });
        setSuccess('Profile updated successfully!');
      } catch (err) {
        setError('Failed to update profile.');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (isLoading) {
      return (
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed.
                </p>
              </div>

              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium"
                >
                  Display Name
                </label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
  ```

- [ ] Add profile picture upload functionality

  ```typescript
  // libs/auth/src/lib/components/profile-picture.tsx
  import { useState } from 'react';
  import Image from 'next/image';
  import { useAuth } from '../auth-context';
  import { Button } from '@sharebrary/ui/button';
  import { uploadUserPhoto, updateUserProfile } from '../firebase-auth';

  export function ProfilePicture() {
    const { user } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user) return;

      setIsUploading(true);
      setProgress(0);

      try {
        const photoURL = await uploadUserPhoto(user.uid, file, (progress) =>
          setProgress(Math.round(progress))
        );

        await updateUserProfile(user.uid, { photoURL });
      } catch (error) {
        console.error('Error uploading photo:', error);
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-muted">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-4xl">{user?.displayName?.[0] || '?'}</span>
            </div>
          )}
        </div>

        {isUploading && (
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <div>
          <label htmlFor="photo-upload">
            <Button
              variant="outline"
              disabled={isUploading}
              tabIndex={-1}
              className="cursor-pointer"
            >
              {isUploading ? 'Uploading...' : 'Change Picture'}
            </Button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
    );
  }
  ```

- [ ] Implement change password functionality

  ```typescript
  // libs/auth/src/lib/components/change-password.tsx
  import { useState } from 'react';
  import { useAuth } from '../auth-context';
  import { Button } from '@sharebrary/ui/button';
  import { Input } from '@sharebrary/ui/input';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from '@sharebrary/ui/card';
  import { Alert, AlertDescription } from '@sharebrary/ui/alert';
  import { changePassword } from '../firebase-auth';

  export function ChangePasswordForm() {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      // Validate passwords
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }

      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }

      setIsSubmitting(true);

      try {
        await changePassword(currentPassword, newPassword);
        setSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        setError(
          'Failed to change password. Please check your current password.'
        );
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    };

    // Only show for email/password users
    if (!user?.providerData?.some((p) => p.providerId === 'password')) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Password change is not available for accounts that signed in with
              social providers.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium"
                >
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium"
                >
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium"
                >
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Changing Password...' : 'Change Password'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
  ```

### 2. Admin Dashboard

- [ ] Create admin dashboard layout

  ```typescript
  // app/admin/layout.tsx
  import { Metadata } from 'next';
  import { RouteGuard } from '@sharebrary/auth';
  import { AdminNav } from '@sharebrary/features/admin';

  export const metadata: Metadata = {
    title: 'Admin Dashboard | Sharebrary',
    description: 'Sharebrary administration',
  };

  export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <RouteGuard requireAuth requireAdmin>
        <div className="container py-10">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3">
              <AdminNav />
            </div>
            <div className="col-span-12 md:col-span-9">{children}</div>
          </div>
        </div>
      </RouteGuard>
    );
  }
  ```

- [ ] Implement admin navigation component

  ```typescript
  // libs/features/src/lib/admin/admin-nav.tsx
  import { usePathname } from 'next/navigation';
  import Link from 'next/link';

  const navItems = [
    { label: 'Overview', href: '/admin' },
    { label: 'User Approval', href: '/admin/users/approval' },
    { label: 'Manage Users', href: '/admin/users' },
    { label: 'Manage Books', href: '/admin/books' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  export function AdminNav() {
    const pathname = usePathname();

    return (
      <nav className="bg-card rounded-lg shadow-sm p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block p-2 rounded hover:bg-muted transition-colors ${
                    isActive ? 'bg-primary/10 text-primary font-medium' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
  ```

- [ ] Create user approval page

  ```typescript
  // app/admin/users/approval/page.tsx
  import { Suspense } from 'react';
  import { UserApprovalList } from '@sharebrary/features/admin';

  export default function UserApprovalPage() {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Pending User Approval</h2>
        <Suspense fallback={<div>Loading pending users...</div>}>
          <UserApprovalList />
        </Suspense>
      </div>
    );
  }
  ```

- [ ] Implement user approval list component

  ```typescript
  // libs/features/src/lib/admin/user-approval-list.tsx
  'use client';

  import { useEffect, useState } from 'react';
  import {
    getAllPendingUsers,
    approveUser,
    rejectUser,
  } from '@sharebrary/api/firebase';
  import { Button } from '@sharebrary/ui/button';
  import { Card } from '@sharebrary/ui/card';
  import { UserData } from '@sharebrary/auth';

  export function UserApprovalList() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingUser, setProcessingUser] = useState<string | null>(null);

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const pendingUsers = await getAllPendingUsers();
          setUsers(pendingUsers);
        } catch (error) {
          console.error('Error fetching pending users:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }, []);

    const handleApprove = async (userId: string) => {
      setProcessingUser(userId);
      try {
        await approveUser(userId);
        setUsers(users.filter((user) => user.uid !== userId));
      } catch (error) {
        console.error('Error approving user:', error);
      } finally {
        setProcessingUser(null);
      }
    };

    const handleReject = async (userId: string) => {
      setProcessingUser(userId);
      try {
        await rejectUser(userId);
        setUsers(users.filter((user) => user.uid !== userId));
      } catch (error) {
        console.error('Error rejecting user:', error);
      } finally {
        setProcessingUser(null);
      }
    };

    if (loading) {
      return <div>Loading pending users...</div>;
    }

    if (users.length === 0) {
      return (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            No pending users to approve.
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.uid} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{user.displayName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  Registered: {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleReject(user.uid)}
                  disabled={processingUser === user.uid}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(user.uid)}
                  disabled={processingUser === user.uid}
                >
                  Approve
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  ```

- [ ] Create user management page and functionality

  ```typescript
  // app/admin/users/page.tsx
  import { Suspense } from 'react';
  import { UserManagementList } from '@sharebrary/features/admin';

  export default function UserManagementPage() {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>
        <Suspense fallback={<div>Loading users...</div>}>
          <UserManagementList />
        </Suspense>
      </div>
    );
  }
  ```

### 3. Firebase Utilities for User Management

- [ ] Add admin functionality to Firebase service

  ```typescript
  // libs/api/src/lib/firebase/admin-service.ts
  import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    getFirestore,
    orderBy,
  } from 'firebase/firestore';
  import { getStorage, ref, deleteObject } from 'firebase/storage';
  import { getAuth, deleteUser } from 'firebase/auth';
  import { UserData } from '@sharebrary/auth';

  const db = getFirestore();
  const storage = getStorage();
  const auth = getAuth();

  // Get all users with pending approval
  export async function getAllPendingUsers(): Promise<UserData[]> {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('isApproved', '==', false),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as UserData);
  }

  // Get all users
  export async function getAllUsers(): Promise<UserData[]> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('displayName'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as UserData);
  }

  // Approve a user
  export async function approveUser(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    return updateDoc(userRef, {
      isApproved: true,
      updatedAt: new Date(),
    });
  }

  // Reject a user
  export async function rejectUser(userId: string): Promise<void> {
    // Delete user document
    await deleteDoc(doc(db, 'users', userId));

    // Delete user auth account
    // Note: This requires Firebase Admin SDK in a server environment
    // For client-side, we'd need to use a Cloud Function or server API
  }

  // Toggle admin status
  export async function toggleAdminStatus(
    userId: string,
    isAdmin: boolean
  ): Promise<void> {
    const userRef = doc(db, 'users', userId);
    return updateDoc(userRef, {
      isAdmin,
      updatedAt: new Date(),
    });
  }

  // Update user profile
  export async function updateUserProfile(
    userId: string,
    data: Partial<UserData>
  ): Promise<void> {
    const userRef = doc(db, 'users', userId);
    return updateDoc(userRef, {
      ...data,
      updatedAt: new Date(),
    });
  }
  ```

### 4. Account Settings

- [ ] Implement account deletion functionality

  ```typescript
  // libs/auth/src/lib/components/account-deletion.tsx
  import { useState } from 'react';
  import { useAuth } from '../auth-context';
  import { Button } from '@sharebrary/ui/button';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
  } from '@sharebrary/ui/card';
  import { deleteUserAccount } from '../firebase-auth';
  import { useRouter } from 'next/navigation';

  export function AccountDeletion() {
    const { user, logout } = useAuth();
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
      if (!user) return;

      setIsDeleting(true);
      try {
        await deleteUserAccount(user.uid);
        await logout();
        router.push('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        setIsDeleting(false);
        setIsConfirming(false);
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>

          {!isConfirming ? (
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setIsConfirming(true)}
            >
              Delete Account
            </Button>
          ) : (
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <p className="font-medium text-red-700 mb-4">
                Are you sure you want to delete your account? This will delete:
              </p>
              <ul className="list-disc list-inside text-sm text-red-600 mb-4 space-y-1">
                <li>Your profile and personal information</li>
                <li>Your uploaded books</li>
                <li>Your comments and ratings</li>
                <li>Your favorites and history</li>
              </ul>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsConfirming(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  ```

## Deliverables

1. User profile management features
2. Admin dashboard for user approval and management
3. Account settings including profile picture, password change, and account deletion
4. Firebase utilities for user management operations

## Dependencies

- [Project Setup](./01-project-setup.md)
- [Authentication System](./03-authentication.md)

## Next Steps

After completing this task, you can proceed to:

- [Book Library Core](./05-book-library.md)
- [Comments and Ratings](./09-comments-ratings.md) (after Book Library Core is completed)
