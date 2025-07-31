-- Create storage bucket for faculty notices
-- This creates the necessary storage bucket and policies for PDF uploads

-- Create the notices storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'notices',
  'notices',
  true,
  52428800, -- 50MB file size limit
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload notices" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'notices' 
  AND auth.role() = 'authenticated'
);

-- Create storage policy to allow public read access to notices
CREATE POLICY "Allow public read access to notices" ON storage.objects
FOR SELECT USING (
  bucket_id = 'notices'
);

-- Create storage policy to allow users to update their own uploads
CREATE POLICY "Allow users to update their own notices" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'notices' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policy to allow users to delete their own uploads
CREATE POLICY "Allow users to delete their own notices" ON storage.objects
FOR DELETE USING (
  bucket_id = 'notices' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated; 