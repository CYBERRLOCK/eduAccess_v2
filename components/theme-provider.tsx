import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Theme {
  // Background colors
  backgroundColor: string;
  surfaceColor: string;
  cardColor: string;
  
  // Background image (optional)
  backgroundImage?: any;
  
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

type ThemeMode = 'warm' | 'dark' | 'classic' | 'green';

const warmTheme: Theme = {
  backgroundColor: "#FEFCF8", // Warm cream background
  surfaceColor: "#FFFFFF", // Pure white surface
  cardColor: "#F7F3ED", // Soft warm card color
  
  textPrimary: "#1A1A1A", // Deep charcoal
  textSecondary: "#4A4A4A", // Medium gray
  textTertiary: "#8A8A8A", // Light gray
  
  accentPrimary: "#E8B4A0", // Soft coral
  accentSecondary: "#D4A574", // Warm gold
  accentTertiary: "#F0D5C1", // Light peach
  
  borderColor: "#E8E0D8", // Warm border
  borderLight: "rgba(26, 26, 26, 0.08)",
  
  success: "#34D399", // Emerald green
  error: "#EF4444", // Vibrant red
  warning: "#F59E0B", // Amber
  
  shadowColor: '#000',
  shadowOpacity: 0.08,
};

const darkTheme: Theme = {
  backgroundColor: "#0F0F0F", // Deep black background
  surfaceColor: "#1A1A1A", // Dark surface
  cardColor: "#000000", // Pure black cards
  backgroundImage: { uri: 'https://i.postimg.cc/QCd4dpt1/6640d5cc2c47cd8712a979dea017d939.jpg' },
  
  textPrimary: "#F8F9FA", // Bright white text
  textSecondary: "#E9ECEF", // Light gray text
  textTertiary: "#CED4DA", // Medium gray text
  
  accentPrimary: "#FFD93D", // Golden yellow accent
  accentSecondary: "#FF6B6B", // Coral accent
  accentTertiary: "#4ECDC4", // Turquoise accent
  
  borderColor: "#2D2D2D", // Dark border
  borderLight: "rgba(255, 255, 255, 0.12)",
  
  success: "#51CF66", // Bright green
  error: "#FF6B6B", // Bright red
  warning: "#FFD93D", // Golden yellow
  
  shadowColor: '#000',
  shadowOpacity: 0.4,
};



const classicTheme: Theme = {
  backgroundColor: "#f8f1e4", // Old light mode background
  surfaceColor: "#fff", // Old light mode surface
  cardColor: "#f3e2c7", // Old light mode card color
  
  textPrimary: "#2c2c2c", // Old light mode text
  textSecondary: "#666", // Old light mode secondary text
  textTertiary: "#999", // Old light mode tertiary text
  
  accentPrimary: "#f3e2c7", // Old light mode accent
  accentSecondary: "#d4a574", // Old light mode secondary accent
  accentTertiary: "#e8d5b5", // Old light mode tertiary accent
  
  borderColor: "#e8d5b5", // Old light mode border
  borderLight: "rgba(0, 0, 0, 0.1)", // Old light mode border light
  
  success: "#4CAF50", // Old light mode success
  error: "#F44336", // Old light mode error
  warning: "#FF9800", // Old light mode warning
  
  shadowColor: '#000', // Old light mode shadow
  shadowOpacity: 0.1, // Old light mode shadow opacity
};

const greenTheme: Theme = {
  backgroundColor: "#F0F8F0", // Light mint background
  surfaceColor: "#FFFFFF", // Pure white surface
  cardColor: "#E8F5E8", // Soft green cards
  
  textPrimary: "#2E5A2E", // Dark green text
  textSecondary: "#4A7C4A", // Medium green text
  textTertiary: "#6B8E6B", // Light green text
  
  accentPrimary: "#4CAF50", // Material green
  accentSecondary: "#66BB6A", // Light green
  accentTertiary: "#81C784", // Lighter green
  
  borderColor: "#C8E6C9", // Light green border
  borderLight: "rgba(46, 90, 46, 0.1)",
  
  success: "#2E7D32", // Dark green
  error: "#D32F2F", // Red
  warning: "#F57C00", // Orange
  
  shadowColor: '#2E5A2E',
  shadowOpacity: 0.12,
};



interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
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
  const [themeMode, setThemeModeState] = useState<ThemeMode>('warm');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_mode');
      if (savedTheme && (savedTheme === 'warm' || savedTheme === 'dark' || savedTheme === 'classic' || savedTheme === 'green')) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem('theme_mode', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const getTheme = (): Theme => {
    switch (themeMode) {
      case 'dark':
        return darkTheme;
      case 'classic':
        return classicTheme;
      case 'green':
        return greenTheme;
      default:
        return warmTheme;
    }
  };

  const theme = getTheme();

  if (!isLoaded) {
    return null; // Or a loading screen
  }

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
