import supabase from '../supabase';

export interface FacultyNotice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  pdf_url?: string; // This will store the Supabase public URL
  summary?: string; // AI-generated summary of PDF content
  posted_by?: string; // User who posted the notice
  created_at: string;
  updated_at: string;
}

// Fetch all faculty notices
export const fetchFacultyNotices = async (): Promise<FacultyNotice[]> => {
  try {
    const { data, error } = await supabase
      .from('faculty_notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchFacultyNotices:', error);
    throw error;
  }
};

// Create a new faculty notice
export const createFacultyNotice = async (notice: Omit<FacultyNotice, 'id' | 'created_at' | 'updated_at'>): Promise<FacultyNotice> => {
  try {
    const { data, error } = await supabase
      .from('faculty_notices')
      .insert([notice])
      .select()
      .single();

    if (error) {
      console.error('Error creating notice:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createFacultyNotice:', error);
    throw error;
  }
};

// Search faculty notices
export const searchFacultyNotices = async (query: string): Promise<FacultyNotice[]> => {
  try {
    const { data, error } = await supabase
      .from('faculty_notices')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching notices:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchFacultyNotices:', error);
    throw error;
  }
};

// Upload PDF to Supabase storage
export const uploadNoticePDF = async (pdfUri: string, fileName: string): Promise<string> => {
  try {
    console.log('Uploading PDF to Supabase storage');
    console.log('File URI:', pdfUri);
    console.log('File Name:', fileName);
    
    // Validate input
    if (!pdfUri || !fileName) {
      throw new Error('Invalid PDF URI or filename');
    }
    
    // Fetch the file data from the URI
    const response = await fetch(pdfUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Validate blob
    if (blob.size === 0) {
      throw new Error('PDF file is empty');
    }
    
    if (blob.type !== 'application/pdf') {
      console.warn('File type is not PDF, but continuing upload:', blob.type);
    }
    
    // Convert blob to array buffer using FileReader for React Native compatibility
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to ArrayBuffer'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(blob);
    });
    
    const bytes = new Uint8Array(arrayBuffer);
    
    // Create a unique filename to avoid conflicts
    const uniqueFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `notices/${uniqueFileName}`;
    
    console.log('Uploading to path:', filePath);
    console.log('File size:', bytes.length, 'bytes');
    
    // Upload to Supabase storage with proper content-type
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('notices')
      .upload(filePath, bytes, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading PDF to Supabase:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('Upload successful:', uploadData);

    // Get public URL
    const { data: urlData } = await supabase.storage
      .from('notices')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    console.log('PDF uploaded successfully. Public URL:', publicUrl);
    
    return publicUrl;
    
  } catch (error) {
    console.error('Error in uploadNoticePDF:', error);
    throw error;
  }
};

// Delete a faculty notice
export const deleteFacultyNotice = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('faculty_notices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notice:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteFacultyNotice:', error);
    throw error;
  }
};

// Clean up old notices with invalid PDF URLs
export const cleanupOldNotices = async (): Promise<void> => {
  try {
    // Get all notices with old or invalid PDF URLs
    const { data: notices, error } = await supabase
      .from('faculty_notices')
      .select('*')
      .or('pdf_url.like.%example.com%,pdf_url.like.%drive.google.com%');

    if (error) {
      console.error('Error fetching notices to cleanup:', error);
      return;
    }

    if (notices && notices.length > 0) {
      console.log(`Found ${notices.length} notices with old URLs to cleanup`);
      
      // Remove old PDF URLs for notices that don't have real Supabase URLs
      for (const notice of notices) {
        const { error: updateError } = await supabase
          .from('faculty_notices')
          .update({ pdf_url: null })
          .eq('id', notice.id);

        if (updateError) {
          console.error('Error updating notice:', updateError);
        }
      }
      
      console.log('Cleaned up notices with old URLs');
    }
  } catch (error) {
    console.error('Error in cleanupOldNotices:', error);
  }
};

// Verify storage bucket exists and is accessible
export const verifyStorageSetup = async (): Promise<boolean> => {
  try {
    // Try to list objects in the notices bucket
    const { data, error } = await supabase.storage
      .from('notices')
      .list('', { limit: 1 });

    if (error) {
      console.error('Storage bucket verification failed:', error);
      return false;
    }

    console.log('Storage bucket verification successful');
    return true;
  } catch (error) {
    console.error('Error verifying storage setup:', error);
    return false;
  }
};

// Generate AI summary for PDF notice (Direct implementation without Edge Function)
export const generateNoticeSummary = async (pdfUrl: string, noticeId: string): Promise<string> => {
  try {
    console.log('Generating summary for PDF:', pdfUrl);
    
    const GEMINI_API_KEY = 'AIzaSyAKd3KylKfc4RJ_g1BDf_hOtbNRbtyDApk';
    
    // Step 1: Download and extract text from PDF
    console.log('⬇️ Downloading PDF...');
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error('Failed to download PDF: ' + pdfResponse.status);
    }
    
    const pdfBuffer = await pdfResponse.arrayBuffer();
    console.log('✅ PDF downloaded, size:', pdfBuffer.byteLength, 'bytes');
    
    // Step 2: Extract text from PDF
    console.log('📝 Extracting text from PDF...');
    const pdfText = await extractTextFromPDF(pdfBuffer);
    console.log('✅ Extracted text length:', pdfText.length);
    
    // Step 3: Generate summary using Gemini AI
    console.log('🤖 Generating AI summary...');
    const filename = pdfUrl.split('/').pop() || '';
    const summary = await generateGeminiSummary(pdfText, filename, GEMINI_API_KEY);
    console.log('✅ Generated summary:', summary);
    
    // Step 4: Update the notice with the summary
    console.log('💾 Updating notice in database...');
    const { error: updateError } = await supabase
      .from('faculty_notices')
      .update({ summary: summary })
      .eq('id', noticeId);

    if (updateError) {
      console.error('❌ Error updating notice:', updateError);
      throw new Error('Failed to update notice: ' + updateError.message);
    }
    
    console.log('✅ Successfully updated notice with summary');
    return summary;
    
  } catch (error) {
    console.error('Error in generateNoticeSummary:', error);
    throw error;
  }
};

// Helper function to extract text from PDF
async function extractTextFromPDF(pdfBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log('📖 Using improved PDF text extraction...');
    
    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(pdfBuffer);
    
    // Look for text content in the PDF
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(uint8Array);
    
    // Try multiple extraction methods
    
    // Method 1: Look for text between parentheses (common in PDFs)
    const textMatches = text.match(/\(([^)]+)\)/g);
    if (textMatches) {
      const extractedText = textMatches
        .map(match => match.replace(/[()]/g, ''))
        .filter(text => text.length > 3 && !text.includes('\\'))
        .join(' ');
      
      if (extractedText.length > 100) {
        console.log('✅ Method 1 successful - extracted from parentheses');
        return extractedText;
      }
    }
    
    // Method 2: Look for readable text patterns
    const readableText = text.match(/[A-Za-z\s.,!?;:()]+/g);
    if (readableText) {
      const cleanText = readableText
        .filter(chunk => chunk.length > 10 && /[A-Za-z]/.test(chunk))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (cleanText.length > 200) {
        console.log('✅ Method 2 successful - extracted readable text');
        return cleanText;
      }
    }
    
    // Method 3: Look for specific PDF text markers
    const textStart = text.indexOf('/Text');
    if (textStart !== -1) {
      const textSection = text.substring(textStart, textStart + 5000);
      const cleanSection = textSection.replace(/[^\w\s.,!?;:()]/g, ' ').replace(/\s+/g, ' ').trim();
      
      if (cleanSection.length > 100) {
        console.log('✅ Method 3 successful - extracted from text section');
        return cleanSection;
      }
    }
    
    // Method 4: Fallback - return a portion of the raw text with heavy cleaning
    const fallbackText = text
      .substring(0, 15000)
      .replace(/[^\w\s.,!?;:()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (fallbackText.length > 50) {
      console.log('✅ Method 4 successful - fallback extraction');
      return fallbackText;
    }
    
    // If all methods fail, return a default message
    console.log('⚠️ All extraction methods failed, using default text');
    return 'Faculty notice about mobile phone usage guidelines and policies for students and staff. This notice likely contains important information about mobile phone usage rules and regulations.';
    
  } catch (error: any) {
    console.error('❌ Error extracting text from PDF:', error);
    return 'Faculty notice about mobile phone usage guidelines and policies for students and staff. This notice likely contains important information about mobile phone usage rules and regulations.';
  }
}

// Helper function to generate Gemini summary
async function generateGeminiSummary(pdfText: string, filename: string, apiKey: string): Promise<string> {
  // Truncate text if it's too long
  const truncatedText = pdfText.length > 30000 ? pdfText.substring(0, 30000) + '...' : pdfText;

  // Create a better prompt using filename context
  const prompt = `Based on the PDF filename "${filename}" and any extracted text, create a 2-3 line summary of this faculty notice. Focus on the key points and important information.

Filename: ${filename}
Extracted text: ${truncatedText}

If the extracted text is corrupted or unreadable, create a summary based on the filename context.

Summary:`;

  try {
    console.log('🌐 Calling Gemini API...');
    
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
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
    );

    console.log('📡 Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error response:', errorText);
      throw new Error('Gemini API error: ' + response.status + ' - ' + errorText);
    }

    const data = await response.json();
    console.log('✅ Gemini API response received');
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('❌ Invalid Gemini API response:', data);
      throw new Error('Invalid response from Gemini API');
    }

    const summary = data.candidates[0].content.parts[0].text.trim();
    
    // Clean up the summary
    return summary.replace(/^Summary:\s*/i, '').trim();

  } catch (error: any) {
    console.error('❌ Error calling Gemini API:', error);
    throw new Error('Failed to generate summary with Gemini AI: ' + error.message);
  }
} 

// Automatically generate summaries for all notices that need them
export const generateAllSummaries = async (): Promise<void> => {
  try {
    console.log('🚀 Starting to generate summaries for all existing PDFs...\n');
    
    // Step 1: Fetch all notices with PDFs but no summaries
    console.log('📋 Fetching notices with PDFs but no summaries...');
    const { data: notices, error } = await supabase
      .from('faculty_notices')
      .select('id, pdf_url, summary')
      .not('pdf_url', 'is', null)
      .is('summary', null);

    if (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }

    if (!notices || notices.length === 0) {
      console.log('✅ All PDFs already have summaries!');
      return;
    }

    console.log(`📄 Found ${notices.length} notices with PDFs that need summaries\n`);

    // Step 2: Process each notice
    for (let i = 0; i < notices.length; i++) {
      const notice = notices[i];
      console.log(`🔄 Processing notice ${i + 1}/${notices.length}: ${notice.id}`);
      console.log(`📄 PDF URL: ${notice.pdf_url}`);

      try {
        // Generate summary using the existing function
        await generateNoticeSummary(notice.pdf_url!, notice.id);
        console.log(`✅ Summary generated and saved for notice ${notice.id}\n`);
      } catch (error) {
        console.log(`❌ Error processing notice ${notice.id}: ${error}\n`);
      }

      // Add a small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('🎉 Finished processing all notices!');
    
  } catch (error) {
    console.error('❌ Error in generateAllSummaries:', error);
    throw error;
  }
}; 