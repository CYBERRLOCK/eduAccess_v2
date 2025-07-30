-- Create the notices storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('notices', 'notices', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable Row Level Security for the notices bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to notices
CREATE POLICY "Public read access for notices" ON storage.objects
FOR SELECT USING (bucket_id = 'notices');

-- Create policy to allow authenticated users to upload notices
CREATE POLICY "Authenticated users can upload notices" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'notices' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to update their own notices
CREATE POLICY "Users can update their own notices" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'notices' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to delete their own notices
CREATE POLICY "Users can delete their own notices" ON storage.objects
FOR DELETE USING (
  bucket_id = 'notices' 
  AND auth.role() = 'authenticated'
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated; 