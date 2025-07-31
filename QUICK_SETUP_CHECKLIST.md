# 🚀 Quick Setup Checklist

## ✅ Step 1: Set Environment Variables (CRITICAL)

**In Supabase Dashboard:**
1. Go to **Settings** → **Edge Functions**
2. Add this environment variable:
   ```
   GEMINI_API_KEY = AIzaSyDgIW5nuOTDN9Gm4dVPJRRrBERjK3sexAQ
   ```

## ✅ Step 2: Create Database Table

**Run this SQL in Supabase SQL Editor:**

```sql
-- Create faculty_notices table
CREATE TABLE IF NOT EXISTS faculty_notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    pdf_url TEXT,
    summary TEXT,
    posted_by VARCHAR(255) DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE faculty_notices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read faculty notices" ON faculty_notices
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to create faculty notices" ON faculty_notices
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own notices" ON faculty_notices
    FOR UPDATE USING (posted_by = 'Admin' OR auth.uid()::text = posted_by);

-- Grant permissions
GRANT ALL ON faculty_notices TO authenticated;
```

## ✅ Step 3: Deploy Edge Function

**In Supabase Dashboard:**
1. Go to **Edge Functions**
2. Find `summarize-notice`
3. Click **"Deploy"** or **"Redeploy"**
4. Wait for deployment to complete

## ✅ Step 4: Test Everything

**Run the diagnostic script:**
```bash
node debug-edge-function.js
```

## ✅ Step 5: Restart App

1. Stop Expo (Ctrl+C)
2. Run: `npx expo start`
3. Try uploading a PDF notice

## 🔍 If Still Not Working

**Check Edge Function Logs:**
1. Go to **Edge Functions** → **summarize-notice** → **Logs**
2. Look for error messages
3. Share the logs if you need help

**Common Issues:**
- ❌ Environment variable not set
- ❌ Edge Function not deployed
- ❌ Database table doesn't exist
- ❌ RLS policies not configured

## 🎯 Expected Result

After completing all steps:
- ✅ PDF uploads work
- ✅ Notices are created
- ✅ AI summaries are generated
- ✅ Summaries are displayed in app 