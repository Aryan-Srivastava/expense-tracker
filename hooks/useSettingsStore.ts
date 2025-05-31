import { UserSettings } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  monthlyExpenseLimit: 2000,
  currency: 'USD',
  reminderFrequency: 'weekly',
  theme: 'light',
  notifications: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      isLoading: false,
      error: null,
      
      // Actions
      updateSettings: (updatedSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...updatedSettings,
          },
        }));
      },
      
      resetSettings: () => {
        set({
          settings: defaultSettings,
        });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
