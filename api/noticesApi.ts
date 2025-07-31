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

// Generate AI summary for PDF notice
export const generateNoticeSummary = async (pdfUrl: string, noticeId: string): Promise<string> => {
  try {
    console.log('Generating summary for PDF:', pdfUrl);
    
    const { data, error } = await supabase.functions.invoke('summarize-notice', {
      body: {
        pdfUrl: pdfUrl,
        noticeId: noticeId
      }
    });

    if (error) {
      console.error('Error calling summarize-notice function:', error);
      throw error;
    }

    if (!data || !data.success) {
      throw new Error(data?.error || 'Failed to generate summary');
    }

    console.log('Summary generated successfully:', data.summary);
    return data.summary;
    
  } catch (error) {
    console.error('Error in generateNoticeSummary:', error);
    throw error;
  }
}; 