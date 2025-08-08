import supabase from '../supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  phone: string;
  employee_id?: string;
  office_location?: string;
  joining_date?: string;
  avatar?: string;
  table_source?: string; // Track which table the user was found in
}

// List of all tables from the database
const ALL_TABLES = [
  'ad',
  'ce', 
  'cse',
  'cseai',
  'csecy',
  'ece',
  'eee',
  'es',
  'faculty_notices',
  'library',
  'mba',
  'mca',
  'me',
  'o&a',
  'pe',
  'placements',
  'research',
  's&h',
  'sdc'
];

export const fetchUserProfileByEmail = async (email: string): Promise<UserProfile | null> => {
  try {
    console.log('Searching for user profile across all tables with email:', email);
    
    // Search through all tables for the user
    for (const tableName of ALL_TABLES) {
      try {
        console.log(`Searching in table: ${tableName}`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('email', email)
          .single();

        if (error) {
          // If table doesn't exist or other error, continue to next table
          console.log(`Table ${tableName} error:`, error.message);
          continue;
        }

        if (data) {
          console.log(`✅ User found in table: ${tableName}`);
          console.log('📊 Raw data from database:', data);
          
          // Map the database fields to our UserProfile interface
          const userProfile: UserProfile = {
            id: data.id || '',
            name: data.name || data.full_name || data.faculty_name || '',
            email: data.email || '',
            designation: data.designation || data.role || data.title || '',
            department: data.department || data.dept || tableName.toUpperCase(), // Use table name as department if not specified
            phone: data.phone || data.phone_number || data.contact || '',
            employee_id: data.employee_id || data.emp_id || '',
            office_location: data.office_location || data.office || data.location || '',
            joining_date: data.joining_date || data.join_date || data.date_joined || '',
            avatar: data.avatar || data.image_url || data.profile_image || '',
            table_source: tableName
          };

          console.log('✅ User profile mapped successfully:', userProfile);
          console.log('📋 New fields status:');
          console.log(`   - employee_id: ${userProfile.employee_id || 'Not set'}`);
          console.log(`   - office_location: ${userProfile.office_location || 'Not set'}`);
          console.log(`   - joining_date: ${userProfile.joining_date || 'Not set'}`);
          
          return userProfile;
        }
      } catch (tableError) {
        console.log(`Error searching table ${tableName}:`, tableError);
        continue; // Continue to next table
      }
    }

    console.log('No user found with email:', email, 'in any table');
    return null;
  } catch (error) {
    console.error('Exception while fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (email: string, updates: Partial<UserProfile>): Promise<boolean> => {
  try {
    console.log('🔍 Updating user profile for email:', email);
    console.log('📝 Updates to apply:', updates);
    
    // First find which table the user is in
    const userProfile = await fetchUserProfileByEmail(email);
    if (!userProfile || !userProfile.table_source) {
      console.error('❌ User not found or no table source');
      return false;
    }

    const tableName = userProfile.table_source;
    console.log(`📊 Updating user in table: ${tableName}`);
    
    // Prepare the update data with proper field mapping
    const updateData: any = {};
    
    // Map the new fields to their database column names
    if (updates.employee_id !== undefined) {
      updateData.employee_id = updates.employee_id;
    }
    if (updates.office_location !== undefined) {
      updateData.office_location = updates.office_location;
    }
    if (updates.joining_date !== undefined) {
      updateData.joining_date = updates.joining_date;
    }
    
    // Also handle other fields that might be updated
    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }
    if (updates.phone !== undefined) {
      updateData.phone = updates.phone;
    }
    if (updates.designation !== undefined) {
      updateData.designation = updates.designation;
    }
    if (updates.department !== undefined) {
      updateData.department = updates.department;
    }
    if (updates.avatar !== undefined) {
      updateData.avatar = updates.avatar;
    }
    
    console.log(`💾 Updating table ${tableName} with data:`, updateData);
    
    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('email', email)
      .select();

    if (error) {
      console.error('❌ Error updating user profile:', error);
      console.error('❌ Error details:', error);
      return false;
    }

    console.log('✅ User profile updated successfully');
    console.log('📊 Updated record:', data);
    return true;
  } catch (error) {
    console.error('❌ Exception while updating user profile:', error);
    return false;
  }
};

// Helper function to get all tables that exist in the database
export const getAvailableTables = async (): Promise<string[]> => {
  try {
    console.log('Checking which tables exist in the database...');
    const availableTables: string[] = [];
    
    for (const tableName of ALL_TABLES) {
      try {
        // Try to select one row from each table to check if it exists
        const { error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!error) {
          availableTables.push(tableName);
          console.log(`Table ${tableName} exists`);
        } else {
          console.log(`Table ${tableName} does not exist or is not accessible`);
        }
      } catch (tableError) {
        console.log(`Error checking table ${tableName}:`, tableError);
      }
    }
    
    console.log('Available tables:', availableTables);
    return availableTables;
  } catch (error) {
    console.error('Exception while checking available tables:', error);
    return [];
  }
}; 