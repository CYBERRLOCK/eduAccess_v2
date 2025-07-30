# Supabase Setup for Faculty Notices

This document provides instructions for setting up the Supabase database and storage for the faculty notices feature.

## Prerequisites

1. A Supabase project (you can create one at https://supabase.com)
2. Access to your Supabase project dashboard

## Database Setup

### 1. Create the Faculty Notices Table

1. Go to your Supabase dashboard
2. Navigate to the **SQL Editor** section
3. Create a new query and paste the contents of `supabase_table_setup.sql`
4. Run the query to create the table and all necessary policies

### 2. Table Structure

The `faculty_notices` table contains the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `title` | TEXT | Notice title (required) |
| `content` | TEXT | Notice content (required) |
| `category` | TEXT | Notice category (required) |
| `priority` | TEXT | Priority level: 'low', 'medium', 'high' (required) |
| `pdf_url` | TEXT | Optional PDF URL |
| `created_at` | TIMESTAMP | When the notice was created (auto-generated) |
| `updated_at` | TIMESTAMP | When the notice was last updated (auto-generated) |
| `created_by` | TEXT | Who created the notice (required) |

### 3. Storage Setup

The setup script also creates:
- A storage bucket called `notice-pdfs` for storing notice PDFs
- Appropriate storage policies for public read access and authenticated write access

## Features

### 1. Real-time Data
- Notices are stored in Supabase and can be accessed in real-time
- Automatic timestamps for creation and updates
- Proper indexing for fast queries

### 2. PDF Upload
- PDFs are stored in Supabase Storage
- Public URLs are generated for easy access
- Automatic file naming to prevent conflicts

### 3. Search Functionality
- Full-text search on title and content
- Category and priority filtering
- Real-time search results

### 4. Security
- Row Level Security (RLS) enabled
- Public read access for all users
- Authenticated write access for admins
- Proper storage policies for images

## Usage

### For Admins
1. Navigate to the Faculty Notice screen
2. Tap the "+" button in the header
3. Fill in the notice details:
   - Title (required)
   - Content (required)
   - Category (select from predefined options)
   - Priority (select from low/medium/high)
   - PDF (optional)
4. Tap "Upload Notice" to save

### For Users
1. Navigate to the Faculty Notice screen
2. View all notices with creation date/time
3. Use the search bar to find specific notices
4. Pull to refresh for latest notices
5. Tap on PDF links to view them in browser

## API Functions

The following functions are available in `api/noticesApi.ts`:

- `fetchFacultyNotices()` - Get all notices
- `createFacultyNotice(notice)` - Create a new notice
- `searchFacultyNotices(query)` - Search notices
- `uploadNoticePDF(file, fileName)` - Upload a PDF
- `deleteFacultyNotice(id)` - Delete a notice

## Troubleshooting

### Common Issues

1. **"Failed to load notices"**
   - Check your Supabase URL and API key in `supabase.js`
   - Ensure the table exists and has the correct structure
   - Verify RLS policies are set up correctly

2. **"Failed to upload notice"**
   - Check that you're authenticated
   - Verify the storage bucket exists
   - Ensure storage policies allow uploads

3. **PDFs not loading**
   - Check that the storage bucket is public
   - Verify the PDF URL is correct
   - Ensure storage policies allow public read access

### Verification Steps

1. **Check Table Exists:**
   ```sql
   SELECT * FROM faculty_notices LIMIT 1;
   ```

2. **Check Storage Bucket:**
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'notice-pdfs';
   ```

3. **Test Insert:**
   ```sql
   INSERT INTO faculty_notices (title, content, category, priority, created_by)
   VALUES ('Test Notice', 'This is a test notice', 'General', 'medium', 'Admin');
   ```

## Next Steps

1. Implement user authentication to properly identify who created notices
2. Add admin role checking to restrict upload functionality
3. Add notice editing and deletion features
4. Implement push notifications for new notices
5. Add notice categories and filtering options 