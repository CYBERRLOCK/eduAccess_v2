import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Edge Function started')
    
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

    console.log('🔧 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasGeminiKey: !!GEMINI_API_KEY
    })

    // Check if environment variables are set
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is not set')
    }
    if (!supabaseServiceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
    }
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set')
    }

    // Create Supabase client
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Get the request body
    const body = await req.json()
    console.log('📥 Request body:', body)
    
    const { pdfUrl, noticeId } = body

    if (!pdfUrl || !noticeId) {
      throw new Error('Missing required parameters: pdfUrl and noticeId')
    }

    console.log('📄 Processing PDF URL:', pdfUrl)
    console.log('🆔 Notice ID:', noticeId)

    // Download the PDF from Supabase storage
    console.log('⬇️ Downloading PDF...')
    const pdfResponse = await fetch(pdfUrl)
    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.status} ${pdfResponse.statusText}`)
    }

    const pdfBuffer = await pdfResponse.arrayBuffer()
    console.log('✅ PDF downloaded, size:', pdfBuffer.byteLength, 'bytes')

    // Extract text from PDF
    console.log('📝 Extracting text from PDF...')
    const pdfText = await extractTextFromPDF(pdfBuffer)
    console.log('✅ Extracted text length:', pdfText.length)

    if (!pdfText.trim()) {
      throw new Error('No text could be extracted from the PDF')
    }

    // Generate summary using Gemini AI
    console.log('🤖 Generating AI summary...')
    const summary = await generateGeminiSummary(pdfText, GEMINI_API_KEY)
    console.log('✅ Generated summary:', summary)

    // Update the notice with the summary
    console.log('💾 Updating notice in database...')
    const { error: updateError } = await supabaseClient
      .from('faculty_notices')
      .update({ summary: summary })
      .eq('id', noticeId)

    if (updateError) {
      console.error('❌ Error updating notice:', updateError)
      throw new Error(`Failed to update notice: ${updateError.message}`)
    }

    console.log('✅ Successfully updated notice with summary')

    return new Response(
      JSON.stringify({ 
        success: true, 
        summary: summary,
        textLength: pdfText.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error in summarize-notice function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function extractTextFromPDF(pdfBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log('📖 Using pdf-parse to extract text...')
    const pdfParse = await import('https://esm.sh/pdf-parse@1.1.1')
    const result = await pdfParse.default(Buffer.from(pdfBuffer))
    return result.text || ''
  } catch (error) {
    console.error('❌ Error extracting text from PDF:', error)
    throw new Error(`Failed to extract text from PDF: ${error.message}`)
  }
}

async function generateGeminiSummary(pdfText: string, apiKey: string): Promise<string> {
  // Truncate text if it's too long
  const truncatedText = pdfText.length > 30000 ? pdfText.substring(0, 30000) + '...' : pdfText

  const prompt = `Summarize this faculty notice in 2-3 concise lines, focusing on the key points and important information:

${truncatedText}

Summary:`

  try {
    console.log('🌐 Calling Gemini API...')
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 150,
          }
        })
      }
    )

    console.log('📡 Gemini API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Gemini API error response:', errorText)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Gemini API response received')
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('❌ Invalid Gemini API response:', data)
      throw new Error('Invalid response from Gemini API')
    }

    const summary = data.candidates[0].content.parts[0].text.trim()
    
    // Clean up the summary
    return summary.replace(/^Summary:\s*/i, '').trim()

  } catch (error) {
    console.error('❌ Error calling Gemini API:', error)
    throw new Error(`Failed to generate summary with Gemini AI: ${error.message}`)
  }
} 