export interface Contact {
  id: string
  name: string
  phone: string
  email: string
  department: string
  avatar?: string
  image_url?: string
  role?: string
  designation?: string
}

export type RootStackParamList = {
  LoginPage: undefined;
  SignupPage: undefined;
  FacultyDirectory: undefined;
  SettingsPage: undefined;
  ContactDetails: { contacts: any[]; department: string };
  NotificationScreen: undefined;
  // Add other routes as needed
};

