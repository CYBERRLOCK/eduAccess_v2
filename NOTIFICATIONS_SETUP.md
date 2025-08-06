# Notifications Table Setup Guide

## Error: "relation 'public.notifications' does not exist"

The error occurs because the `notifications` table hasn't been created in your Supabase database yet. Follow these steps to fix it:

## Step 1: Access Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to the **SQL Editor** in the left sidebar

## Step 2: Run the SQL Script

1. In the SQL Editor, click **"New Query"**
2. Copy and paste the entire contents of `create_notifications_table.sql` into the editor
3. Click **"Run"** to execute the script

## Step 3: Verify the Table Creation

1. Go to **Table Editor** in the left sidebar
2. You should see a new table called `notifications`
3. The table should have these columns:
   - `id` (UUID, Primary Key)
   - `title` (Text)
   - `description` (Text)
   - `timestamp` (Text)
   - `type` (Text)
   - `is_read` (Boolean)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

## What the Script Does

The SQL script creates:
- ✅ **notifications table** with proper structure
- ✅ **Row Level Security (RLS)** policies for security
- ✅ **Indexes** for better performance
- ✅ **Triggers** for automatic timestamp updates

## After Setup

Once the table is created:
1. The notification system will work automatically
2. When faculty notices are published, notifications will be created
3. The NotificationScreen will display real notifications from the database

## Troubleshooting

If you encounter any issues:
1. Make sure you're in the correct Supabase project
2. Check that you have the necessary permissions
3. Verify the SQL script executed without errors
4. Restart your app after creating the table

The notification system will be fully functional once this table is created! 🎉 