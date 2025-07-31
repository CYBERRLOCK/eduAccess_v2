// Test script for the summarize-notice Edge Function
const SUPABASE_URL = 'https://iqexempgykricaxbrhjo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZXhlbXBneWtyaWNheGJyaGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTA5NTMsImV4cCI6MjA1NzI4Njk1M30.DZ4K1fI6PRZdPUEE0pD-DOpHpEOhvKZY5FKQ3fpKK8w';

async function testEdgeFunction() {
  try {
    console.log('Testing Edge Function...');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/summarize-notice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        pdfUrl: 'https://iqexempgykricaxbrhjo.supabase.co/storage/v1/object/public/notices/notices/1753958043334_58._Notice-_Use_of_Mobile_Phone__18-07-2025.pdf',
        noticeId: 'test-notice-id'
      })
    });

    const result = await response.json();
    console.log('Edge Function Response:', result);
    
    if (result.success) {
      console.log('✅ Edge Function is working!');
      console.log('Summary:', result.summary);
    } else {
      console.log('❌ Edge Function failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testEdgeFunction(); 