import { colors, theme } from '@/constants/Colors';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { UserSettings } from '@/types';
import { Stack, useRouter } from 'expo-router';
import { Check, Moon, Smartphone, Sun } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

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
}) => (
  <Pressable
    style={[styles.themeItem, isSelected && styles.selectedThemeItem]}
    onPress={onSelect}
  >
    <View style={styles.themeIconContainer}>{icon}</View>
    <View style={styles.themeContent}>
      <Text style={styles.themeTitle}>{title}</Text>
      <Text style={styles.themeDescription}>{description}</Text>
    </View>
    {isSelected && (
      <View style={styles.checkContainer}>
        <Check size={20} color={colors.white} />
      </View>
    )}
  </Pressable>
);

export default function ThemeScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useSettingsStore();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Apply theme when screen is loaded or settings change
    applyTheme(settings.theme);
  }, [settings.theme]);
  const applyTheme = (selectedTheme: ThemeOption) => {
    const activeTheme = selectedTheme === 'system'
      ? colorScheme || 'light'
      : selectedTheme;

    // Apply theme-specific colors
    const themeColors = activeTheme === 'dark' ? theme.dark : theme.light;

    // You can expand this to apply global theme settings
    Object.keys(themeColors).forEach(key => {
      colors[key] = themeColors[key];
    });
  };

  const handleThemeSelect = (theme: ThemeOption) => {
    updateSettings({ theme });
    Alert.alert('Success', 'Theme updated successfully.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

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
        
        <Text style={styles.note}>
          Note: Dark mode is currently in development and will be available in a future update.
        </Text>
      </View>
    </>
  );
}

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

