import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Theme {
  // Background colors
  backgroundColor: string;
  surfaceColor: string;
  cardColor: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  
  // Accent colors (same in both modes)
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  
  // Border colors
  borderColor: string;
  borderLight: string;
  
  // Status colors
  success: string;
  error: string;
  warning: string;
  
  // Shadow colors
  shadowColor: string;
  shadowOpacity: number;
}

const lightTheme: Theme = {
  backgroundColor: "#f8f1e4",
  surfaceColor: "#fff",
  cardColor: "#f3e2c7",
  
  textPrimary: "#2c2c2c",
  textSecondary: "#666",
  textTertiary: "#999",
  
  accentPrimary: "#f3e2c7",
  accentSecondary: "#d4a574",
  accentTertiary: "#e8d5b5",
  
  borderColor: "#e8d5b5",
  borderLight: "rgba(0, 0, 0, 0.1)",
  
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FF9800",
  
  shadowColor: '#000',
  shadowOpacity: 0.1,
};

const darkTheme: Theme = {
  backgroundColor: "#1a1a1a",
  surfaceColor: "#2c2c2c",
  cardColor: "#3a3a3a",
  
  textPrimary: "#f8f1e4",
  textSecondary: "#cccccc",
  textTertiary: "#999999",
  
  accentPrimary: "#f3e2c7",
  accentSecondary: "#d4a574",
  accentTertiary: "#e8d5b5",
  
  borderColor: "#4a4a4a",
  borderLight: "rgba(255, 255, 255, 0.1)",
  
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FF9800",
  
  shadowColor: '#000',
  shadowOpacity: 0.3,
};

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_mode');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      await AsyncStorage.setItem('theme_mode', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  if (!isLoaded) {
    return null; // Or a loading screen
  }

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
