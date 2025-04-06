# Book Detail Page Design - Sharebrary

## Overview

Design a comprehensive book detail page that showcases all information about a specific book, allowing users to view metadata, read descriptions, download the book, preview content, and interact with social features like comments and ratings.

## Brand Context

- **App Name**: Sharebrary
- **Primary Colors**: Blue (#3b82f6) and green (#10b981)
- **Typography**: Modern, clean sans-serif (Inter)

## Layout Requirements

### Header

- Standard Sharebrary navigation bar
- Breadcrumb navigation (Home > Library > Book Title)
- Back to library button/link

### Book Hero Section

- Two-column layout (book cover on left, details on right for desktop)
- High-quality book cover image with appropriate sizing
- Book title (large, prominent)
- Author name with link to search by author
- Publication details (if available)
- Category and subcategory with links to filter by them
- Tag chips with links to filter by tag
- Rating display (star system) with average rating and count
- Action buttons row:
  - Download button (primary action)
  - Preview button (to open PDF viewer)
  - Add to Favorites button (toggleable)
  - Share button (optional)

### Book Description Section

- Full description text with proper formatting
- Read more/less toggle if description is lengthy
- Book metadata in sidebar or info box:
  - File format
  - File size
  - Upload date
  - Uploader (if publicly shown)
  - Download count

### Tabbed Content Section

- Tab navigation for different content sections:
  - Comments/Reviews
  - Similar Books
  - Book Details (additional metadata)

### Comments and Ratings Tab

- Form to add a new comment and rating
- Comment thread showing existing comments
- Each comment should show:
  - User avatar and name
  - Rating given (stars)
  - Comment text
  - Date posted
  - Like/reply options (if implemented)
- Comments pagination if there are many comments
- Sort options for comments (newest, oldest, highest rated)

### Similar Books Tab

- Horizontal scrollable row or grid of similar book cards
- Same book card design as the library page but possibly smaller
- "View More" button that links to library with appropriate filters

### Book Details Tab

- Full metadata table with all available information
- Technical details about the file
- Potential alternative downloads (different formats if available)

## Interaction Notes

- Download button should trigger download process with visual feedback
- Preview button should open the PDF viewer in a modal or new page
- Add to Favorites should toggle with visual feedback
- Rating interaction should be intuitive with hover states
- Comment form should have validation and submission feedback
- All interactive elements should have appropriate hover/focus states
- Consider lazy loading comments for performance

## Responsive Considerations

- On mobile, the layout should stack vertically
- Book cover should resize appropriately but remain prominent
- Action buttons should remain easily accessible on mobile
- Tabs should transform to an accordion or scrollable tabs on smaller screens
- Comment form should adapt to smaller screens with appropriate input sizing

## Special Requirements

- Dark/light theme versions with appropriate contrast
- Loading states for when book details are being fetched
- Error state if book details can't be loaded
- Placeholder designs for missing information
- PDF preview integration design
- Download progress indicator
- Success/failure states for actions like adding to favorites
- Consider design for reporting inappropriate content

## Security and Access Considerations

- Visual indication if the book requires special permissions
- Design for access-denied state if user doesn't have permission
- Admin-only actions should be visually distinct
