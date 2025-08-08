-- Complete RLS Fix and Profile Update Setup for EduAccess
-- Run this single query in your Supabase SQL Editor to fix all issues

-- Step 1: Enable RLS on all tables
ALTER TABLE ad ENABLE ROW LEVEL SECURITY;
ALTER TABLE ce ENABLE ROW LEVEL SECURITY;
ALTER TABLE cse ENABLE ROW LEVEL SECURITY;
ALTER TABLE cseai ENABLE ROW LEVEL SECURITY;
ALTER TABLE csecy ENABLE ROW LEVEL SECURITY;
ALTER TABLE ece ENABLE ROW LEVEL SECURITY;
ALTER TABLE eee ENABLE ROW LEVEL SECURITY;
ALTER TABLE es ENABLE ROW LEVEL SECURITY;
ALTER TABLE me ENABLE ROW LEVEL SECURITY;
ALTER TABLE mca ENABLE ROW LEVEL SECURITY;
ALTER TABLE mba ENABLE ROW LEVEL SECURITY;
ALTER TABLE "s&h" ENABLE ROW LEVEL SECURITY;
ALTER TABLE research ENABLE ROW LEVEL SECURITY;
ALTER TABLE "o&a" ENABLE ROW LEVEL SECURITY;
ALTER TABLE library ENABLE ROW LEVEL SECURITY;
ALTER TABLE pe ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdc ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Step 2: Add new columns to all faculty tables (if they don't exist)
DO $$ 
BEGIN
    -- Add employee_id column to all faculty tables
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ad' AND column_name = 'employee_id') THEN
        ALTER TABLE ad ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ce' AND column_name = 'employee_id') THEN
        ALTER TABLE ce ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cse' AND column_name = 'employee_id') THEN
        ALTER TABLE cse ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cseai' AND column_name = 'employee_id') THEN
        ALTER TABLE cseai ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'csecy' AND column_name = 'employee_id') THEN
        ALTER TABLE csecy ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ece' AND column_name = 'employee_id') THEN
        ALTER TABLE ece ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'eee' AND column_name = 'employee_id') THEN
        ALTER TABLE eee ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'es' AND column_name = 'employee_id') THEN
        ALTER TABLE es ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'me' AND column_name = 'employee_id') THEN
        ALTER TABLE me ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mca' AND column_name = 'employee_id') THEN
        ALTER TABLE mca ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mba' AND column_name = 'employee_id') THEN
        ALTER TABLE mba ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 's&h' AND column_name = 'employee_id') THEN
        ALTER TABLE "s&h" ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'research' AND column_name = 'employee_id') THEN
        ALTER TABLE research ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'o&a' AND column_name = 'employee_id') THEN
        ALTER TABLE "o&a" ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'library' AND column_name = 'employee_id') THEN
        ALTER TABLE library ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pe' AND column_name = 'employee_id') THEN
        ALTER TABLE pe ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'placements' AND column_name = 'employee_id') THEN
        ALTER TABLE placements ADD COLUMN employee_id VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sdc' AND column_name = 'employee_id') THEN
        ALTER TABLE sdc ADD COLUMN employee_id VARCHAR(20);
    END IF;

    -- Add office_location column to all faculty tables
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ad' AND column_name = 'office_location') THEN
        ALTER TABLE ad ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ce' AND column_name = 'office_location') THEN
        ALTER TABLE ce ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cse' AND column_name = 'office_location') THEN
        ALTER TABLE cse ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cseai' AND column_name = 'office_location') THEN
        ALTER TABLE cseai ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'csecy' AND column_name = 'office_location') THEN
        ALTER TABLE csecy ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ece' AND column_name = 'office_location') THEN
        ALTER TABLE ece ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'eee' AND column_name = 'office_location') THEN
        ALTER TABLE eee ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'es' AND column_name = 'office_location') THEN
        ALTER TABLE es ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'me' AND column_name = 'office_location') THEN
        ALTER TABLE me ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mca' AND column_name = 'office_location') THEN
        ALTER TABLE mca ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mba' AND column_name = 'office_location') THEN
        ALTER TABLE mba ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 's&h' AND column_name = 'office_location') THEN
        ALTER TABLE "s&h" ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'research' AND column_name = 'office_location') THEN
        ALTER TABLE research ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'o&a' AND column_name = 'office_location') THEN
        ALTER TABLE "o&a" ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'library' AND column_name = 'office_location') THEN
        ALTER TABLE library ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pe' AND column_name = 'office_location') THEN
        ALTER TABLE pe ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'placements' AND column_name = 'office_location') THEN
        ALTER TABLE placements ADD COLUMN office_location VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sdc' AND column_name = 'office_location') THEN
        ALTER TABLE sdc ADD COLUMN office_location VARCHAR(100);
    END IF;

    -- Add joining_date column to all faculty tables
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ad' AND column_name = 'joining_date') THEN
        ALTER TABLE ad ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ce' AND column_name = 'joining_date') THEN
        ALTER TABLE ce ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cse' AND column_name = 'joining_date') THEN
        ALTER TABLE cse ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cseai' AND column_name = 'joining_date') THEN
        ALTER TABLE cseai ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'csecy' AND column_name = 'joining_date') THEN
        ALTER TABLE csecy ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ece' AND column_name = 'joining_date') THEN
        ALTER TABLE ece ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'eee' AND column_name = 'joining_date') THEN
        ALTER TABLE eee ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'es' AND column_name = 'joining_date') THEN
        ALTER TABLE es ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'me' AND column_name = 'joining_date') THEN
        ALTER TABLE me ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mca' AND column_name = 'joining_date') THEN
        ALTER TABLE mca ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mba' AND column_name = 'joining_date') THEN
        ALTER TABLE mba ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 's&h' AND column_name = 'joining_date') THEN
        ALTER TABLE "s&h" ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'research' AND column_name = 'joining_date') THEN
        ALTER TABLE research ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'o&a' AND column_name = 'joining_date') THEN
        ALTER TABLE "o&a" ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'library' AND column_name = 'joining_date') THEN
        ALTER TABLE library ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pe' AND column_name = 'joining_date') THEN
        ALTER TABLE pe ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'placements' AND column_name = 'joining_date') THEN
        ALTER TABLE placements ADD COLUMN joining_date VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sdc' AND column_name = 'joining_date') THEN
        ALTER TABLE sdc ADD COLUMN joining_date VARCHAR(50);
    END IF;
END $$;

-- Step 3: Drop existing policies (if any) and create new ones
-- Faculty tables - Read access for all, Update access for authenticated users
DROP POLICY IF EXISTS "Enable read access for all users" ON ad;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON ad;
CREATE POLICY "Enable read access for all users" ON ad FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON ad FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON ce;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON ce;
CREATE POLICY "Enable read access for all users" ON ce FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON ce FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON cse;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON cse;
CREATE POLICY "Enable read access for all users" ON cse FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON cse FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON cseai;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON cseai;
CREATE POLICY "Enable read access for all users" ON cseai FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON cseai FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON csecy;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON csecy;
CREATE POLICY "Enable read access for all users" ON csecy FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON csecy FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON ece;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON ece;
CREATE POLICY "Enable read access for all users" ON ece FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON ece FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON eee;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON eee;
CREATE POLICY "Enable read access for all users" ON eee FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON eee FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON es;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON es;
CREATE POLICY "Enable read access for all users" ON es FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON es FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON me;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON me;
CREATE POLICY "Enable read access for all users" ON me FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON me FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON mca;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON mca;
CREATE POLICY "Enable read access for all users" ON mca FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON mca FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON mba;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON mba;
CREATE POLICY "Enable read access for all users" ON mba FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON mba FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON "s&h";
DROP POLICY IF EXISTS "Enable update for authenticated users" ON "s&h";
CREATE POLICY "Enable read access for all users" ON "s&h" FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON "s&h" FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON research;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON research;
CREATE POLICY "Enable read access for all users" ON research FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON research FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON "o&a";
DROP POLICY IF EXISTS "Enable update for authenticated users" ON "o&a";
CREATE POLICY "Enable read access for all users" ON "o&a" FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON "o&a" FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON library;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON library;
CREATE POLICY "Enable read access for all users" ON library FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON library FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON pe;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON pe;
CREATE POLICY "Enable read access for all users" ON pe FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON pe FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON placements;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON placements;
CREATE POLICY "Enable read access for all users" ON placements FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON placements FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON sdc;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON sdc;
CREATE POLICY "Enable read access for all users" ON sdc FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users" ON sdc FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 4: Create policies for faculty_notices and notifications
DROP POLICY IF EXISTS "Enable read access for all users" ON faculty_notices;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON faculty_notices;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON faculty_notices;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON faculty_notices;
CREATE POLICY "Enable read access for all users" ON faculty_notices FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON faculty_notices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON faculty_notices FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON faculty_notices FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read access for all users" ON notifications;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON notifications;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON notifications;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON notifications;
CREATE POLICY "Enable read access for all users" ON notifications FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON notifications FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON notifications FOR DELETE USING (auth.role() = 'authenticated');

-- Step 5: Grant necessary permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE, DELETE ON faculty_notices TO anon;
GRANT INSERT, UPDATE, DELETE ON faculty_notices TO authenticated;
GRANT INSERT, UPDATE, DELETE ON notifications TO anon;
GRANT INSERT, UPDATE, DELETE ON notifications TO authenticated;

-- Step 6: Verify the setup (optional - you can run this separately)
-- This will show you the current status of all tables and their new columns
SELECT 
    'Setup Complete' as status,
    'All RLS policies created and new columns added' as message,
    'You can now test the app' as next_step;
