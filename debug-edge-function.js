// Diagnostic script to debug Edge Function issues
const SUPABASE_URL = 'https://iqexempgykricaxbrhjo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZXhlbXBneWtyaWNheGJyaGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTA5NTMsImV4cCI6MjA1NzI4Njk1M30.DZ4K1fI6PRZdPUEE0pD-DOpHpEOhvKZY5FKQ3fpKK8w';

async function debugEdgeFunction() {
  console.log('🔍 Starting Edge Function diagnostics...\n');
  
  try {
    // Test 1: Check if Edge Function exists
    console.log('📋 Test 1: Checking if Edge Function exists...');
    const listResponse = await fetch(`${SUPABASE_URL}/functions/v1/`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });
    
    if (listResponse.ok) {
      const functions = await listResponse.json();
      console.log('✅ Edge Functions found:', functions);
    } else {
      console.log('❌ Could not list Edge Functions');
    }
    
    // Test 2: Test the summarize-notice function
    console.log('\n📋 Test 2: Testing summarize-notice function...');
    const testResponse = await fetch(`${SUPABASE_URL}/functions/v1/summarize-notice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        pdfUrl: 'https://iqexempgykricaxbrhjo.supabase.co/storage/v1/object/public/notices/notices/1753958657235_58._Notice-_Use_of_Mobile_Phone__18-07-2025.pdf',
        noticeId: 'test-notice-id'
      })
    });

    console.log('📊 Response Status:', testResponse.status);
    console.log('📊 Response Headers:', Object.fromEntries(testResponse.headers.entries()));
    
    const result = await testResponse.text();
    console.log('📊 Response Body:', result);
    
    if (testResponse.ok) {
      console.log('✅ Edge Function is working!');
      try {
        const jsonResult = JSON.parse(result);
        console.log('📝 Summary:', jsonResult.summary);
      } catch (e) {
        console.log('⚠️ Response is not JSON:', result);
      }
    } else {
      console.log('❌ Edge Function failed with status:', testResponse.status);
      console.log('❌ Error details:', result);
    }
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
  }
}

// Run diagnostics
debugEdgeFunction(); 