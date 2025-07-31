# PDF Upload and Display Test Guide

## Prerequisites
1. Ensure Supabase storage bucket "notices" is created and configured
2. Verify RLS policies are set up correctly
3. Make sure the app is running with the latest changes

## Test Steps

### 1. Test PDF Upload
1. Navigate to Faculty Notice screen
2. Tap the "+" button to go to Admin Notice Upload
3. Fill in the form:
   - Title: "Test PDF Notice"
   - Content: "This is a test notice with PDF attachment"
   - Category: "Academic"
   - Priority: "Medium"
4. Tap "Tap to select PDF" and choose a PDF file
5. Verify the PDF preview shows correctly
6. Tap "Upload Notice"
7. Check that the upload completes successfully

### 2. Test PDF Display
1. Go back to Faculty Notice screen
2. Verify the uploaded notice appears in the list
3. Check that the PDF card shows "View PDF Notice"
4. Tap on the PDF card
5. Choose "In App" to test the WebView PDF viewer
6. Verify the PDF loads correctly in the app
7. Close the PDF viewer
8. Tap the PDF card again and choose "In Browser"
9. Verify the PDF opens in the external browser/app

### 3. Test Error Handling
1. Try uploading a very large PDF (>10MB) - should show appropriate error
2. Try uploading a non-PDF file - should show warning but continue
3. Test with no internet connection - should show appropriate error messages

## Expected Results

### ✅ Success Cases:
- PDF uploads successfully to Supabase storage
- Public URL is generated and stored in database
- PDF appears immediately in the uploaded notices list
- PDF opens correctly in both in-app viewer and external browser
- No hardcoded URLs are used

### ❌ Error Cases:
- Invalid file types show appropriate warnings
- Network errors show user-friendly messages
- Storage errors are handled gracefully
- Empty files are rejected

## Database Verification
Check the `faculty_notices` table:
```sql
SELECT id, title, pdf_url, created_at 
FROM faculty_notices 
WHERE pdf_url IS NOT NULL 
ORDER BY created_at DESC;
```

## Storage Verification
Check Supabase storage bucket:
```sql
SELECT name, size, created_at 
FROM storage.objects 
WHERE bucket_id = 'notices' 
ORDER BY created_at DESC;
```

## Troubleshooting

### Common Issues:
1. **PDF not uploading**: Check Supabase storage bucket permissions
2. **PDF not displaying**: Verify the public URL is accessible
3. **WebView not loading**: Check internet connection and URL validity
4. **File picker not working**: Ensure expo-document-picker is properly configured

### Debug Steps:
1. Check console logs for detailed error messages
2. Verify Supabase configuration in `supabase.js`
3. Test storage bucket access manually
4. Check network connectivity

## Performance Notes
- PDF files are converted using FileReader for React Native compatibility
- Unique filenames prevent conflicts
- Proper content-type ensures correct handling
- Error handling provides user feedback 