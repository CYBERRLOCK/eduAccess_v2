# 🔧 Edge Function Setup Guide

## 🚨 Current Issues
- Edge Function returning non-2xx status code
- AI summary not being generated
- Environment variables not configured

## ✅ Step-by-Step Fix

### Step 1: Set Environment Variables

**In your Supabase Dashboard:**
1. Go to **Settings** → **Edge Functions**
2. Add these environment variables:

```
GEMINI_API_KEY = AIzaSyDgIW5nuOTDN9Gm4dVPJRRrBERjK3sexAQ
```

### Step 2: Create Database Table

**Run this SQL in Supabase SQL Editor:**

```sql
-- Create faculty_notices table if it doesn't exist
CREATE TABLE IF NOT EXISTS faculty_notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    pdf_url TEXT,
    summary TEXT, -- AI-generated summary of PDF content
    posted_by VARCHAR(255) DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faculty_notices_created_at ON faculty_notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_faculty_notices_category ON faculty_notices(category);
CREATE INDEX IF NOT EXISTS idx_faculty_notices_priority ON faculty_notices(priority);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_faculty_notices_search ON faculty_notices USING gin(
    to_tsvector('english', title || ' ' || content)
);

CREATE INDEX IF NOT EXISTS idx_faculty_notices_summary_search ON faculty_notices USING gin(
    to_tsvector('english', summary)
);

-- Enable Row Level Security
ALTER TABLE faculty_notices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to read faculty notices" ON faculty_notices;
CREATE POLICY "Allow authenticated users to read faculty notices" ON faculty_notices
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to create faculty notices" ON faculty_notices;
CREATE POLICY "Allow authenticated users to create faculty notices" ON faculty_notices
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow users to update their own notices" ON faculty_notices;
CREATE POLICY "Allow users to update their own notices" ON faculty_notices
    FOR UPDATE USING (posted_by = 'Admin' OR auth.uid()::text = posted_by);

DROP POLICY IF EXISTS "Allow users to delete their own notices" ON faculty_notices;
CREATE POLICY "Allow users to delete their own notices" ON faculty_notices
    FOR DELETE USING (posted_by = 'Admin' OR auth.uid()::text = posted_by);

-- Grant permissions
GRANT ALL ON faculty_notices TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
```

### Step 3: Deploy Edge Function

**In your Supabase Dashboard:**
1. Go to **Edge Functions**
2. Find the `summarize-notice` function
3. Click **"Deploy"** or **"Redeploy"**
4. Wait for deployment to complete

### Step 4: Test the Setup

**Run this test script:**

```bash
node test-edge-function.js
```

### Step 5: Restart Your App

1. Stop your Expo app (Ctrl+C)
2. Run: `npx expo start`
3. Try uploading a notice with PDF

## 🔍 Troubleshooting

### If Edge Function Still Fails:

1. **Check Edge Function Logs:**
   - Go to **Edge Functions** → **summarize-notice** → **Logs**
   - Look for error messages

2. **Verify Environment Variables:**
   - Go to **Settings** → **Edge Functions**
   - Ensure `GEMINI_API_KEY` is set correctly

3. **Check Database:**
   - Go to **Table Editor** → **faculty_notices**
   - Ensure table exists and has correct columns

### Common Error Solutions:

**Error: "Missing environment variables"**
- Set the `GEMINI_API_KEY` in Edge Function settings

**Error: "Table does not exist"**
- Run the SQL query to create the table

**Error: "Gemini API error"**
- Check if the API key is valid
- Ensure the API key has proper permissions

## ✅ Expected Result

After following these steps:
- ✅ PDF uploads will work
- ✅ Notices will be created in database
- ✅ AI summaries will be generated automatically
- ✅ Summaries will be displayed in the app

## 🎯 Test the Complete Flow

1. Upload a PDF notice
2. Check that the notice appears in the list
3. Verify that an AI summary is generated and displayed
4. Confirm the summary is searchable

## 📞 Need Help?

If you still encounter issues:
1. Check the Edge Function logs in Supabase dashboard
2. Verify all environment variables are set
3. Ensure the database table exists with correct schema 