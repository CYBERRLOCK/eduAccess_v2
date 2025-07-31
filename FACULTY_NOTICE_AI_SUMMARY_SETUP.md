# Faculty Notice PDF Summary with Gemini AI - Setup Guide

This feature automatically generates AI-powered summaries of PDF notices using Google's Gemini AI when faculty upload PDF documents.

## 🚀 Features

- **Automatic PDF Processing**: Extracts text from uploaded PDF notices
- **AI-Powered Summaries**: Uses Google Gemini AI to generate concise 2-3 line summaries
- **Smart Display**: Shows summaries alongside notices in the app
- **Search Integration**: Search through both notice content and AI summaries
- **Real-time Updates**: Summaries are generated and stored automatically

## 📋 Prerequisites

1. **Google Gemini API Key**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Supabase Project**: Ensure your Supabase project is set up with storage and database
3. **Supabase CLI**: Install and configure Supabase CLI for deployment

## 🔧 Setup Instructions

### 1. Database Migration

Run the database migration to add the summary column:

```sql
-- Run this in your Supabase SQL editor
ALTER TABLE faculty_notices 
ADD COLUMN summary TEXT;

-- Add index for better performance when searching summaries
CREATE INDEX IF NOT EXISTS idx_faculty_notices_summary 
ON faculty_notices USING gin(to_tsvector('english', summary));

-- Add comment to document the column
COMMENT ON COLUMN faculty_notices.summary IS 'AI-generated summary of the PDF notice content using Gemini AI';
```

### 2. Environment Variables

Add your Gemini API key to Supabase environment variables:

```bash
# Using Supabase CLI
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here

# Or add in Supabase Dashboard:
# Settings > API > Environment Variables
# Key: GEMINI_API_KEY
# Value: your_gemini_api_key_here
```

### 3. Deploy Edge Function

Deploy the summarize-notice Edge Function:

```bash
# Navigate to your project directory
cd eduAccess_v2_fresh

# Deploy the function
supabase functions deploy summarize-notice

# Or deploy all functions
supabase functions deploy
```

### 4. Verify Deployment

Check that the function is deployed:

```bash
supabase functions list
```

You should see `summarize-notice` in the list.

## 🎯 How It Works

### Frontend Flow

1. **PDF Upload**: Faculty uploads a PDF notice through the AdminNoticeUpload screen
2. **Storage**: PDF is uploaded to Supabase storage
3. **Notice Creation**: Notice is created in the database
4. **Summary Generation**: Edge Function is called to generate AI summary
5. **Display**: Summary is displayed alongside the notice in FacultyNotice screen

### Backend Flow

1. **PDF Download**: Edge Function downloads PDF from Supabase storage
2. **Text Extraction**: Uses pdf-parse to extract text content
3. **AI Processing**: Sends text to Gemini AI for summarization
4. **Database Update**: Stores the generated summary in the database
5. **Response**: Returns summary to frontend

## 🔍 API Endpoints

### Edge Function: `/functions/v1/summarize-notice`

**Method**: POST  
**Body**:
```json
{
  "pdfUrl": "https://your-supabase-storage-url/notice.pdf",
  "noticeId": "notice-uuid"
}
```

**Response**:
```json
{
  "success": true,
  "summary": "AI-generated summary text",
  "textLength": 1500
}
```

## 🎨 UI Components

### Summary Display

The AI summary is displayed in a styled container with:
- Robot icon to indicate AI-generated content
- Distinctive styling with accent colors
- Clear typography for readability

### Loading States

- Upload button shows "Generating AI Summary..." during processing
- Graceful error handling if summary generation fails
- Notice upload continues even if summary fails

## 🔧 Configuration

### Gemini AI Settings

The Edge Function uses these Gemini AI parameters:
- **Model**: `gemini-pro`
- **Temperature**: 0.3 (for consistent summaries)
- **Max Tokens**: 150 (for concise summaries)
- **Top-K**: 40
- **Top-P**: 0.95

### PDF Processing

- **Text Limit**: 30,000 characters (Gemini API limit)
- **Error Handling**: Graceful fallback if text extraction fails
- **Content Type**: Supports standard PDF formats

## 🐛 Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY environment variable is not set"**
   - Ensure the API key is set in Supabase environment variables
   - Check that the function has access to the environment variable

2. **"Failed to extract text from PDF"**
   - Verify the PDF is not corrupted or password-protected
   - Check that the PDF contains extractable text (not just images)

3. **"Gemini API error"**
   - Verify your API key is valid and has sufficient quota
   - Check the Gemini API status page for any outages

4. **Summary not appearing**
   - Check the function logs in Supabase Dashboard
   - Verify the notice ID is being passed correctly
   - Ensure the database update is successful

### Debugging

Check function logs:
```bash
supabase functions logs summarize-notice
```

Or view in Supabase Dashboard:
- Edge Functions > summarize-notice > Logs

## 📱 Usage

### For Faculty/Admins

1. Navigate to Faculty Notice screen
2. Tap the "+" button to upload a new notice
3. Fill in notice details and select a PDF
4. Tap "Upload Notice"
5. The system will automatically generate an AI summary
6. View the summary in the notice list

### For Users

1. Browse notices in the Faculty Notice screen
2. Look for the "AI Summary" section in notices with PDFs
3. Use the search function to find notices by content or summary
4. Tap on PDF notices to view the full document

## 🔒 Security Considerations

- API keys are stored securely in Supabase environment variables
- PDF processing happens server-side in Edge Functions
- No sensitive data is exposed to the client
- CORS headers are properly configured
- Input validation prevents malicious PDF uploads

## 📈 Performance

- PDF processing is asynchronous and doesn't block notice upload
- Summaries are cached in the database for fast retrieval
- Search includes summaries for better discoverability
- Edge Functions provide low-latency processing

## 🔄 Future Enhancements

Potential improvements:
- Batch processing for multiple PDFs
- Summary quality scoring
- Custom summary prompts per category
- Summary editing capabilities
- Multi-language support
- Summary analytics and insights 