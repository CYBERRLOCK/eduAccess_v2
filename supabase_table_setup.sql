-- Create the faculty_notices table
CREATE TABLE IF NOT EXISTS faculty_notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL
);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_faculty_notices_created_at ON faculty_notices(created_at DESC);

-- Create an index on category for filtering
CREATE INDEX IF NOT EXISTS idx_faculty_notices_category ON faculty_notices(category);

-- Create an index on priority for filtering
CREATE INDEX IF NOT EXISTS idx_faculty_notices_priority ON faculty_notices(priority);

-- Enable Row Level Security (RLS)
ALTER TABLE faculty_notices ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to read notices
CREATE POLICY "Allow all users to read faculty notices" ON faculty_notices
  FOR SELECT USING (true);

-- Create a policy that allows authenticated users to insert notices (for admin functionality)
CREATE POLICY "Allow authenticated users to insert faculty notices" ON faculty_notices
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to update notices (for admin functionality)
CREATE POLICY "Allow authenticated users to update faculty notices" ON faculty_notices
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to delete notices (for admin functionality)
CREATE POLICY "Allow authenticated users to delete faculty notices" ON faculty_notices
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_faculty_notices_updated_at 
  BEFORE UPDATE ON faculty_notices 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for notice PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('notice-pdfs', 'notice-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for notice PDFs
CREATE POLICY "Allow public access to notice PDFs" ON storage.objects
  FOR SELECT USING (bucket_id = 'notice-pdfs');

-- Create storage policy for uploading notice PDFs
CREATE POLICY "Allow authenticated users to upload notice PDFs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'notice-pdfs' AND auth.role() = 'authenticated');

-- Create storage policy for updating notice PDFs
CREATE POLICY "Allow authenticated users to update notice PDFs" ON storage.objects
  FOR UPDATE USING (bucket_id = 'notice-pdfs' AND auth.role() = 'authenticated');

-- Create storage policy for deleting notice PDFs
CREATE POLICY "Allow authenticated users to delete notice PDFs" ON storage.objects
  FOR DELETE USING (bucket_id = 'notice-pdfs' AND auth.role() = 'authenticated'); 