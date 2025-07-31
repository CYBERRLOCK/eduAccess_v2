// Test script for the summarize-notice Edge Function
// Run this after deploying the function to verify it works

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

async function testSummarizeFunction() {
  try {
    console.log('Testing summarize-notice Edge Function...');
    
    // Test with a sample PDF URL (replace with actual URL)
    const testData = {
      pdfUrl: 'https://your-supabase-storage-url/test-notice.pdf',
      noticeId: 'test-notice-id'
    };
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/summarize-notice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Function test successful!');
      console.log('Summary:', result.summary);
      console.log('Text length:', result.textLength);
    } else {
      console.error('❌ Function test failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Uncomment to run the test
// testSummarizeFunction(); 