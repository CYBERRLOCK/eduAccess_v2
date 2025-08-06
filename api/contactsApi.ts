import supabase from '../supabase';
import type { Contact } from "../types";

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

export const fetchContacts = async (): Promise<Contact[]> => {
  try {
    console.log('Fetching contacts from all tables...');
    const allContacts: Contact[] = [];
    
    // Fetch contacts from all tables
    for (const tableName of ALL_TABLES) {
      try {
        console.log(`Fetching from table: ${tableName}`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*');

        if (error) {
          console.log(`Table ${tableName} error:`, error.message);
          continue; // Skip this table and continue to next
        }

        if (data && data.length > 0) {
          // Map the data to Contact interface
          const tableContacts: Contact[] = data.map((item: any) => ({
            id: item.id || '',
            name: item.name || item.full_name || item.faculty_name || 'Unknown',
            phone: item.phone || item.phone_number || item.contact || '',
            email: item.email || '',
            department: item.department || item.dept || tableName.toUpperCase(),
            avatar: item.avatar || item.image_url || item.profile_image || '',
            role: item.role || item.designation || item.title || '',
            designation: item.designation || item.role || item.title || ''
          }));
          
          allContacts.push(...tableContacts);
          console.log(`Found ${tableContacts.length} contacts in ${tableName}`);
        }
      } catch (tableError) {
        console.log(`Error fetching from table ${tableName}:`, tableError);
        continue; // Continue to next table
      }
    }

    console.log('Total contacts fetched:', allContacts.length);
    return allContacts;
  } catch (error) {
    console.error('Exception while fetching contacts:', error);
    // Fallback to mock data if database is not available
    return [
      {
        id: "1",
        name: "Sarah Johnson",
        phone: "(555) 123-4567",
        email: "sarah.j@example.com",
        department: "Engineering",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EduAccess_1-PFNF5kgQ9inxmcEjx7pWfrVqBfRvjb.svg",
        role: "Software Engineer",
      },
      {
        id: "2",
        name: "Michael Chen",
        phone: "(555) 987-6543",
        email: "michael.c@example.com",
        department: "Product",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EduAccess_1-PFNF5kgQ9inxmcEjx7pWfrVqBfRvjb.svg",
        role: "Product Manager",
      },
    ];
  }
};

export const searchContacts = async (query: string): Promise<Contact[]> => {
  try {
    if (!query.trim()) {
      return await fetchContacts();
    }

    console.log('Searching contacts across all tables with query:', query);
    const searchResults: Contact[] = [];
    
    // Search through all tables
    for (const tableName of ALL_TABLES) {
      try {
        console.log(`Searching in table: ${tableName}`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .or(`name.ilike.%${query}%,full_name.ilike.%${query}%,faculty_name.ilike.%${query}%,department.ilike.%${query}%,dept.ilike.%${query}%,phone.ilike.%${query}%,phone_number.ilike.%${query}%,contact.ilike.%${query}%`);

        if (error) {
          console.log(`Table ${tableName} search error:`, error.message);
          continue;
        }

        if (data && data.length > 0) {
          // Map the data to Contact interface
          const tableResults: Contact[] = data.map((item: any) => ({
            id: item.id || '',
            name: item.name || item.full_name || item.faculty_name || 'Unknown',
            phone: item.phone || item.phone_number || item.contact || '',
            email: item.email || '',
            department: item.department || item.dept || tableName.toUpperCase(),
            avatar: item.avatar || item.image_url || item.profile_image || '',
            role: item.role || item.designation || item.title || '',
            designation: item.designation || item.role || item.title || ''
          }));
          
          searchResults.push(...tableResults);
          console.log(`Found ${tableResults.length} matches in ${tableName}`);
        }
      } catch (tableError) {
        console.log(`Error searching table ${tableName}:`, tableError);
        continue;
      }
    }

    console.log('Total search results:', searchResults.length);
    return searchResults;
  } catch (error) {
    console.error('Exception while searching contacts:', error);
    // Fallback to client-side filtering
    const contacts = await fetchContacts();
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.department.toLowerCase().includes(query.toLowerCase()) ||
        contact.phone.includes(query),
    );
  }
};

export const getContactByEmail = async (email: string): Promise<Contact | null> => {
  try {
    console.log('Fetching contact by email across all tables:', email);
    
    // Search through all tables for the specific email
    for (const tableName of ALL_TABLES) {
      try {
        console.log(`Searching in table: ${tableName}`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('email', email)
          .single();

        if (error) {
          console.log(`Table ${tableName} error:`, error.message);
          continue;
        }

        if (data) {
          console.log(`Contact found in table: ${tableName}`, data);
          
          const contact: Contact = {
            id: data.id || '',
            name: data.name || data.full_name || data.faculty_name || 'Unknown',
            phone: data.phone || data.phone_number || data.contact || '',
            email: data.email || '',
            department: data.department || data.dept || tableName.toUpperCase(),
            avatar: data.avatar || data.image_url || data.profile_image || '',
            role: data.role || data.designation || data.title || '',
            designation: data.designation || data.role || data.title || ''
          };
          
          return contact;
        }
      } catch (tableError) {
        console.log(`Error searching table ${tableName}:`, tableError);
        continue;
      }
    }

    console.log('No contact found with email:', email);
    return null;
  } catch (error) {
    console.error('Exception while fetching contact by email:', error);
    return null;
  }
};

