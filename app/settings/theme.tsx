import { useToast } from '@/components/ui/Toast';
import { colors } from '@/constants/Colors';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { useThemeContext } from '@/hooks/useThemeContext';
import { UserSettings } from '@/types';
import { Stack } from 'expo-router';
import { Check, Moon, Smartphone, Sun } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ThemeOption = UserSettings['theme'];

interface ThemeItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
}

const ThemeItem: React.FC<ThemeItemProps> = ({
  title,
  description,
  icon,
  isSelected,
  onSelect,
}) => {

  const styles = StyleSheet.create({
    themeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    selectedThemeItem: {
      backgroundColor: colors.primary,
    },
    selectedThemeItemText: {
      color: colors.white,
    },
    themeIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    themeContent: {
      flex: 1,
    },
    themeTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    themeDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    checkContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    note: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 16,
      fontStyle: 'italic',
    },
  });
  
  return (
    <Pressable
      style={[styles.themeItem, isSelected && styles.selectedThemeItem]}
      onPress={onSelect}
    >
      <View style={styles.themeIconContainer}>{icon}</View>
      <View style={styles.themeContent}>
        <Text style={[styles.themeTitle, isSelected && styles.selectedThemeItemText]}>{title}</Text>
        <Text style={styles.themeDescription}>{description}</Text>
      </View>
      {isSelected && (
        <View style={styles.checkContainer}>
          <Check size={20} color={colors.white} />
        </View>
      )}
    </Pressable>
  )
};

export default function ThemeScreen() {
  const { settings, updateSettings } = useSettingsStore();
  const { setTheme } = useThemeContext();

  const { showToast } = useToast();
  
  const handleToast = (themeName: string) => {
    showToast({
      message: `${themeName.slice(0, 1).toUpperCase() + themeName.slice(1)} Theme updated successfully!`,
      type: "success",
      position: "top-right",
      animation: "slide-left",
      duration: 2000,
      showTimebar: false
    });
  };

  const handleThemeSelect = (theme: ThemeOption) => {
    // Update the theme in both the settings store and theme context
    updateSettings({ theme });
    setTheme(theme);
    handleToast(theme);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Theme' }} />
      
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Choose Theme</Text>
        
        <ThemeItem
          title="Light"
          description="Standard light theme"
          icon={<Sun size={24} color={colors.primary} />}
          isSelected={settings.theme === 'light'}
          onSelect={() => handleThemeSelect('light')}
        />
        
        <ThemeItem
          title="Dark"
          description="Easier on the eyes in low light"
          icon={<Moon size={24} color={colors.primary} />}
          isSelected={settings.theme === 'dark'}
          onSelect={() => handleThemeSelect('dark')}
        />
        
        <ThemeItem
          title="System"
          description="Follows your device settings"
          icon={<Smartphone size={24} color={colors.primary} />}
          isSelected={settings.theme === 'system'}
          onSelect={() => handleThemeSelect('system')}
        />
      </View>
    </>
  );
}
