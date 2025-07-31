-- Add summary column to faculty_notices table
-- This migration adds an AI-generated summary field for PDF notices

-- Add the summary column
ALTER TABLE faculty_notices 
ADD COLUMN summary TEXT;

-- Add index for better performance when searching summaries
CREATE INDEX IF NOT EXISTS idx_faculty_notices_summary 
ON faculty_notices USING gin(to_tsvector('english', summary));

-- Add comment to document the column
COMMENT ON COLUMN faculty_notices.summary IS 'AI-generated summary of the PDF notice content using Gemini AI';

-- Verify the column was added (optional - you can run this to check)
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'faculty_notices' AND column_name = 'summary'; 