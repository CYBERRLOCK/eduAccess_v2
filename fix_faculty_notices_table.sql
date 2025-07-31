-- Complete SQL to fix faculty_notices table
-- This will drop and recreate the table with the correct structure

-- Step 1: Drop the existing table (if it exists)
DROP TABLE IF EXISTS faculty_notices CASCADE;

-- Step 2: Create the faculty_notices table with correct structure
CREATE TABLE faculty_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT DEFAULT '', -- Made optional with default empty string
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    pdf_url TEXT,
    summary TEXT, -- For AI-generated summaries
    posted_by VARCHAR(255) DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create indexes for better performance
CREATE INDEX idx_faculty_notices_created_at ON faculty_notices(created_at DESC);
CREATE INDEX idx_faculty_notices_category ON faculty_notices(category);
CREATE INDEX idx_faculty_notices_priority ON faculty_notices(priority);
CREATE INDEX idx_faculty_notices_posted_by ON faculty_notices(posted_by);

-- Step 4: Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_faculty_notices_updated_at 
    BEFORE UPDATE ON faculty_notices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Enable Row Level Security (RLS)
ALTER TABLE faculty_notices ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies
-- Policy for selecting notices (public read access)
CREATE POLICY "Allow public read access to faculty notices" ON faculty_notices
    FOR SELECT USING (true);

-- Policy for inserting notices (authenticated users)
CREATE POLICY "Allow authenticated users to insert notices" ON faculty_notices
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for updating notices (users can update their own notices)
CREATE POLICY "Allow users to update their own notices" ON faculty_notices
    FOR UPDATE USING (auth.uid()::text = posted_by OR posted_by = 'Admin');

-- Policy for deleting notices (users can delete their own notices)
CREATE POLICY "Allow users to delete their own notices" ON faculty_notices
    FOR DELETE USING (auth.uid()::text = posted_by OR posted_by = 'Admin');

-- Step 7: Grant permissions
GRANT ALL ON faculty_notices TO authenticated;
GRANT ALL ON faculty_notices TO anon;

-- Step 8: Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'faculty_notices' 
ORDER BY ordinal_position;

-- Step 9: Insert a test notice to verify everything works
INSERT INTO faculty_notices (title, category, priority, posted_by) 
VALUES ('Test Notice', 'General', 'medium', 'Admin');

-- Step 10: Verify the test notice was created
SELECT * FROM faculty_notices LIMIT 5; 