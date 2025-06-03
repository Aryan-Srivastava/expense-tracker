import { colors } from '@/constants/Colors';
import { useThemeContext } from '@/hooks/useThemeContext';
import { Tabs } from 'expo-router';
import { Home, PieChart, Settings, Users } from 'lucide-react-native';
import React, { useEffect } from 'react';

export default function TabLayout() {
  const { activeTheme } = useThemeContext();
  
  // Force re-render when theme changes
  useEffect(() => {
    // Re-render the component when the theme changes
    console.log(`Theme changed to: ${activeTheme}`);
  }, [activeTheme]);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.card,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: colors.text,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarLabel: 'Expenses',
          tabBarIcon: ({ color, size }) => <PieChart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarLabel: 'Groups',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="investments"
        options={{
          title: 'Investments',
          tabBarLabel: 'Invest',
          tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
