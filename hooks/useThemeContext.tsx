import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as appColors, lightColors, darkColors } from '@/constants/Colors';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  activeTheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const systemColorScheme = useColorScheme() || 'light';
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(systemColorScheme);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('settings-storage');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          if (parsedSettings.state?.settings?.theme) {
            setTheme(parsedSettings.state.settings.theme);
          }
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    
    loadTheme();
  }, []);

  // Update active theme whenever theme or system theme changes
  useEffect(() => {
    const newActiveTheme = theme === 'system' ? systemColorScheme : theme;
    setActiveTheme(newActiveTheme);
    
    // Apply the theme colors
    if (newActiveTheme === 'dark') {
      // Apply dark theme colors
      Object.assign(appColors, darkColors);
    } else {
      // Apply light theme colors
      Object.assign(appColors, lightColors);
    }
    
    console.log(`Theme applied: ${newActiveTheme}`);
  }, [theme, systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, activeTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
