import supabase from '../supabase';

export interface FacultyNotice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  pdf_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
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
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
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
    // For now, let's create a simple implementation that works with Expo
    // We'll store the file URI directly in the database
    // In a production app, you'd want to upload to a proper storage service
    
    console.log('PDF upload simplified for Expo compatibility');
    console.log('File URI:', pdfUri);
    console.log('File Name:', fileName);
    
    // Return a placeholder URL for now
    // In a real implementation, you'd upload to Supabase storage
    return `https://example.com/pdfs/${fileName}`;
    
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