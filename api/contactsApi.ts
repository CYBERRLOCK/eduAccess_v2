import type { Contact } from "../types"

// In a real application, this would be an actual API call
// This is just a mock implementation for demonstration purposes
export const fetchContacts = async (): Promise<Contact[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would do something like:
  // const response = await fetch('https://your-api.com/contacts');
  // if (!response.ok) throw new Error('Failed to fetch contacts');
  // return await response.json();

  // For now, return mock data
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
    // Additional contacts would be here
  ]
}

export const searchContacts = async (query: string): Promise<Contact[]> => {
  const contacts = await fetchContacts()

  if (!query) return contacts

  return contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.department.toLowerCase().includes(query.toLowerCase()) ||
      contact.phone.includes(query),
  )
}

