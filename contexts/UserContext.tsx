import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../supabase';

interface UserContextType {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userEmail, setUserEmailState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check Supabase authentication status on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Get current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking auth status:', error);
        setIsLoading(false);
        return;
      }

      if (session && session.user) {
        // User is authenticated with Supabase
        const email = session.user.email;
        setUserEmailState(email || null);
        // Also save to AsyncStorage for consistency
        await AsyncStorage.setItem('userEmail', email || '');
      } else {
        // No active session, clear any stored email
        setUserEmailState(null);
        await AsyncStorage.removeItem('userEmail');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear any stored data on error
      setUserEmailState(null);
      await AsyncStorage.removeItem('userEmail');
    } finally {
      setIsLoading(false);
    }
  };

  const setUserEmail = async (email: string | null) => {
    try {
      if (email) {
        await AsyncStorage.setItem('userEmail', email);
      } else {
        await AsyncStorage.removeItem('userEmail');
      }
      setUserEmailState(email);
    } catch (error) {
      console.error('Error saving user email:', error);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      // Clear local state
      await setUserEmail(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if Supabase logout fails
      await setUserEmail(null);
    }
  };

  if (isLoading) {
    // You can return a loading screen here if needed
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        userEmail,
        setUserEmail,
        isAuthenticated: !!userEmail,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 