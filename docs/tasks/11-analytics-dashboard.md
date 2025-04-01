# Analytics Dashboard

## Overview

This task involves implementing analytics features for the Sharebrary application, including an admin dashboard to track platform statistics and user activity, as well as personalized insights for regular users.

## Prerequisites

- [Project Setup](./01-project-setup.md) completed
- [Authentication System](./03-authentication.md) implemented
- [Book Library Core](./05-book-library.md) implemented
- [User Management](./04-user-management.md) implemented

## Detailed Tasks

### 1. Analytics Data Models

- [ ] Define analytics data models

  ```typescript
  // libs/api/src/lib/models/analytics.ts
  export interface SystemStats {
    totalUsers: number;
    activeUsers: number; // Users active in the last 7 days
    totalBooks: number;
    totalDownloads: number;
    booksAddedToday: number;
    downloadsToday: number;
    userSignupsToday: number;
    trendingBooks: string[]; // Book IDs
    topCategories: { category: string; count: number }[];
    updatedAt: Date;
  }

  export interface UserActivity {
    userId: string;
    date: Date;
    action:
      | 'signup'
      | 'login'
      | 'book_view'
      | 'book_download'
      | 'book_upload'
      | 'comment'
      | 'rating'
      | 'collection_create'
      | 'add_to_collection';
    bookId?: string;
    collectionId?: string;
    metadata?: Record<string, any>;
  }

  export interface UserInsights {
    userId: string;
    favoriteCategories: { category: string; count: number }[];
    readingStreak: number;
    booksRead: number;
    readingSpeed: number; // Average days to complete a book
    completionRate: number; // % of books marked as "completed" vs "dnf"
    updatedAt: Date;
  }
  ```

### 2. Admin Dashboard Overview

- [ ] Create admin dashboard page

  ```typescript
  // app/admin/dashboard/page.tsx
  import { Suspense } from 'react';
  import { Metadata } from 'next';
  import { RouteGuard } from '@sharebrary/auth';
  import { AdminDashboardView } from '@sharebrary/features/admin';

  export const metadata: Metadata = {
    title: 'Admin Dashboard | Sharebrary',
    description: 'Analytics and statistics for Sharebrary administrators',
  };

  export default function AdminDashboardPage() {
    return (
      <RouteGuard requireAuth requireAdmin>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          <Suspense fallback={<div>Loading dashboard...</div>}>
            <AdminDashboardView />
          </Suspense>
        </div>
      </RouteGuard>
    );
  }
  ```

- [ ] Implement admin dashboard component

  ```typescript
  // libs/features/src/lib/admin/admin-dashboard-view.tsx
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '@sharebrary/ui/tabs';
  import {
    getSystemStats,
    getRecentUserActivity,
  } from '@sharebrary/api/firebase';
  import { SystemStatsOverview } from './system-stats-overview';
  import { UserActivityTable } from './user-activity-table';
  import { TopBooksChart } from './top-books-chart';
  import { CategoryDistributionChart } from './category-distribution-chart';
  import { UserGrowthChart } from './user-growth-chart';

  export async function AdminDashboardView() {
    const stats = await getSystemStats();
    const recentActivity = await getRecentUserActivity(50); // Get last 50 activities

    return (
      <div className="space-y-8">
        <SystemStatsOverview stats={stats} />

        <Tabs defaultValue="charts">
          <TabsList>
            <TabsTrigger value="charts">Analytics Charts</TabsTrigger>
            <TabsTrigger value="activity">User Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TopBooksChart />
              <CategoryDistributionChart categories={stats.topCategories} />
            </div>
            <UserGrowthChart />
          </TabsContent>

          <TabsContent value="activity">
            <UserActivityTable activities={recentActivity} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  ```

### 3. Analytics Charts

- [ ] Create system stats overview component

  ```typescript
  // libs/features/src/lib/admin/system-stats-overview.tsx
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@sharebrary/ui/card';
  import { SystemStats } from '@sharebrary/api/models';
  import { formatDate, formatNumber } from '@sharebrary/utils';

  interface SystemStatsOverviewProps {
    stats: SystemStats;
  }

  export function SystemStatsOverview({ stats }: SystemStatsOverviewProps) {
    const statCards = [
      {
        title: 'Total Users',
        value: formatNumber(stats.totalUsers),
        description: `+${formatNumber(stats.userSignupsToday)} today`,
      },
      {
        title: 'Total Books',
        value: formatNumber(stats.totalBooks),
        description: `+${formatNumber(stats.booksAddedToday)} today`,
      },
      {
        title: 'Downloads',
        value: formatNumber(stats.totalDownloads),
        description: `+${formatNumber(stats.downloadsToday)} today`,
      },
      {
        title: 'Active Users',
        value: formatNumber(stats.activeUsers),
        description: `${Math.round(
          (stats.activeUsers / stats.totalUsers) * 100
        )}% of total users`,
      },
    ];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">System Overview</h2>
          <p className="text-sm text-muted-foreground">
            Last updated: {formatDate(stats.updatedAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                <CardDescription>{card.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  ```

- [ ] Implement category distribution chart

  ```typescript
  // libs/features/src/lib/admin/category-distribution-chart.tsx
  'use client';

  import { useTheme } from 'next-themes';
  import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
  } from 'recharts';
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from '@sharebrary/ui/card';

  interface CategoryDistributionChartProps {
    categories: { category: string; count: number }[];
  }

  export function CategoryDistributionChart({
    categories,
  }: CategoryDistributionChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Colors for the chart (adjusted based on theme)
    const COLORS = isDark
      ? ['#9333ea', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      : ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Book Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="category"
                  label={({ category, percent }) =>
                    `${category}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} books`, 'Count']}
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderColor: isDark ? '#374151' : '#e5e7eb',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }
  ```

### 4. User Activity Tracking

- [ ] Create activity tracking Firebase service

  ```typescript
  // libs/api/src/lib/firebase/analytics-service.ts
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    Timestamp,
  } from 'firebase/firestore';
  import { UserActivity, SystemStats, UserInsights } from '../models/analytics';

  const db = getFirestore();

  // Activity tracking

  export async function trackUserActivity(
    userId: string,
    action: UserActivity['action'],
    metadata: Partial<UserActivity> = {}
  ): Promise<void> {
    const activitiesRef = collection(db, 'userActivities');

    await addDoc(activitiesRef, {
      userId,
      action,
      date: serverTimestamp(),
      ...metadata,
    });

    // Update user's last activity timestamp
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        lastActive: serverTimestamp(),
      },
      { merge: true }
    );
  }

  export async function getRecentUserActivity(
    limit = 100
  ): Promise<UserActivity[]> {
    const activitiesRef = collection(db, 'userActivities');
    const q = query(activitiesRef, orderBy('date', 'desc'), limit(limit));

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as UserActivity)
    );
  }

  export async function getUserActivityByUser(
    userId: string,
    limitVal = 50
  ): Promise<UserActivity[]> {
    const activitiesRef = collection(db, 'userActivities');
    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitVal)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as UserActivity)
    );
  }

  // System stats

  export async function getSystemStats(): Promise<SystemStats> {
    const statsRef = doc(db, 'system', 'stats');
    const statsSnap = await getDoc(statsRef);

    if (!statsSnap.exists()) {
      throw new Error('System stats not found');
    }

    return statsSnap.data() as SystemStats;
  }

  // User insights

  export async function getUserInsights(
    userId: string
  ): Promise<UserInsights | null> {
    const insightsRef = doc(db, 'userInsights', userId);
    const insightsSnap = await getDoc(insightsRef);

    if (!insightsSnap.exists()) {
      return null;
    }

    return insightsSnap.data() as UserInsights;
  }
  ```

- [ ] Add event tracking to key user actions

  ```typescript
  // libs/features/src/lib/library/book-detail.tsx
  // Update the existing component to add tracking

  import { trackUserActivity } from '@sharebrary/api/firebase';

  export function BookDetail({ book }: BookDetailProps) {
    // ... existing code ...

    const handleViewBook = async () => {
      if (user) {
        // Track that user viewed this book
        await trackUserActivity(user.uid, 'book_view', { bookId: book.id });
      }
    };

    const handleDownload = async () => {
      setIsDownloading(true);

      try {
        // ... existing download code ...

        // Track download
        if (user) {
          await trackBookDownload(user.uid, book.id);
          await trackUserActivity(user.uid, 'book_download', {
            bookId: book.id,
          });
        }
      } catch (error) {
        console.error('Download error:', error);
      } finally {
        setIsDownloading(false);
      }
    };

    // Call handleViewBook when component mounts
    useEffect(() => {
      handleViewBook();
    }, [book.id]);

    // ... rest of the component ...
  }
  ```

### 5. User Insights Page

- [ ] Create user insights page

  ```typescript
  // app/insights/page.tsx
  import { Suspense } from 'react';
  import { Metadata } from 'next';
  import { RouteGuard } from '@sharebrary/auth';
  import { UserInsightsView } from '@sharebrary/features/insights';

  export const metadata: Metadata = {
    title: 'Reading Insights | Sharebrary',
    description: 'Personalized reading insights and statistics',
  };

  export default function InsightsPage() {
    return (
      <RouteGuard requireAuth>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Your Reading Insights</h1>

          <Suspense fallback={<div>Analyzing your reading habits...</div>}>
            <UserInsightsView />
          </Suspense>
        </div>
      </RouteGuard>
    );
  }
  ```

- [ ] Implement user insights component

  ```typescript
  // libs/features/src/lib/insights/user-insights-view.tsx
  import { auth } from '@sharebrary/auth';
  import {
    getUserInsights,
    getUserActivityByUser,
  } from '@sharebrary/api/firebase';
  import { ReadingOverview } from './reading-overview';
  import { ReadingHabitsChart } from './reading-habits-chart';
  import { CategoryPreferencesChart } from './category-preferences-chart';
  import { RecentActivityList } from './recent-activity-list';
  import { RecommendationsList } from './recommendations-list';

  export async function UserInsightsView() {
    const { currentUser } = auth;

    if (!currentUser) {
      return <div>Please sign in to view your insights</div>;
    }

    const insights = await getUserInsights(currentUser.uid);
    const recentActivity = await getUserActivityByUser(currentUser.uid, 20);

    if (!insights) {
      return (
        <div className="bg-card text-card-foreground rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Not enough data yet</h3>
          <p className="text-muted-foreground mb-4">
            We need more data about your reading habits to generate insights.
            Try reading more books or adding them to your collections.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <ReadingOverview
          booksRead={insights.booksRead}
          readingStreak={insights.readingStreak}
          completionRate={insights.completionRate}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ReadingHabitsChart userId={currentUser.uid} />
          <CategoryPreferencesChart categories={insights.favoriteCategories} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivityList activities={recentActivity} />
          <RecommendationsList userId={currentUser.uid} />
        </div>
      </div>
    );
  }
  ```

## Deliverables

1. Admin dashboard with system statistics and charts
2. User activity tracking throughout the application
3. Personal reading insights for users
4. Analytics data models and Firebase integration
5. Recommendation engine based on user behavior

## Dependencies

- [Project Setup](./01-project-setup.md)
- [Authentication System](./03-authentication.md)
- [Book Library Core](./05-book-library.md)
- [User Management](./04-user-management.md)

## Next Steps

After completing this task, you can proceed to:

- [Performance Optimization](./12-performance-optimization.md)
