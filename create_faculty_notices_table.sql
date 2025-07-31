-- Create faculty_notices table from scratch
-- This creates a complete table structure for faculty notices with AI summary support

-- Create the faculty_notices table
CREATE TABLE faculty_notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    pdf_url TEXT,
    summary TEXT, -- AI-generated summary of PDF content
    posted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_faculty_notices_created_at ON faculty_notices(created_at DESC);
CREATE INDEX idx_faculty_notices_category ON faculty_notices(category);
CREATE INDEX idx_faculty_notices_priority ON faculty_notices(priority);
CREATE INDEX idx_faculty_notices_posted_by ON faculty_notices(posted_by);

-- Create full-text search index for title and content
CREATE INDEX idx_faculty_notices_search ON faculty_notices USING gin(
    to_tsvector('english', title || ' ' || content)
);

-- Create full-text search index for summary (AI-generated content)
CREATE INDEX idx_faculty_notices_summary_search ON faculty_notices USING gin(
    to_tsvector('english', summary)
);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_faculty_notices_updated_at 
    BEFORE UPDATE ON faculty_notices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to document the table and columns
COMMENT ON TABLE faculty_notices IS 'Stores faculty notices with optional PDF attachments and AI-generated summaries';
COMMENT ON COLUMN faculty_notices.id IS 'Unique identifier for the notice';
COMMENT ON COLUMN faculty_notices.title IS 'Title of the faculty notice';
COMMENT ON COLUMN faculty_notices.content IS 'Main content/body of the notice';
COMMENT ON COLUMN faculty_notices.category IS 'Category of the notice (e.g., academic, administrative, events)';
COMMENT ON COLUMN faculty_notices.priority IS 'Priority level: low, medium, or high';
COMMENT ON COLUMN faculty_notices.pdf_url IS 'URL to the uploaded PDF file in Supabase storage';
COMMENT ON COLUMN faculty_notices.summary IS 'AI-generated summary of the PDF notice content using Gemini AI';
COMMENT ON COLUMN faculty_notices.posted_by IS 'Reference to the user who posted the notice';
COMMENT ON COLUMN faculty_notices.created_at IS 'Timestamp when the notice was created';
COMMENT ON COLUMN faculty_notices.updated_at IS 'Timestamp when the notice was last updated';

-- Enable Row Level Security (RLS)
ALTER TABLE faculty_notices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow all authenticated users to read notices
CREATE POLICY "Allow authenticated users to read faculty notices" ON faculty_notices
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to create notices
CREATE POLICY "Allow authenticated users to create faculty notices" ON faculty_notices
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own notices
CREATE POLICY "Allow users to update their own notices" ON faculty_notices
    FOR UPDATE USING (auth.uid() = posted_by);

-- Allow users to delete their own notices
CREATE POLICY "Allow users to delete their own notices" ON faculty_notices
    FOR DELETE USING (auth.uid() = posted_by);

-- Grant necessary permissions
GRANT ALL ON faculty_notices TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 