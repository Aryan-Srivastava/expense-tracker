import { colors } from '@/constants/Colors';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  CreditCard,
  DollarSign,
  HelpCircle,
  LogOut,
  Moon,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useSettingsStore();
  
  const toggleNotifications = () => {
    updateSettings({ notifications: !settings.notifications });
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    profileSection: {
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.white,
      marginBottom: 20,
    },
    profileImageContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    profileInitial: {
      fontSize: 32,
      fontWeight: '600',
      color: colors.white,
    },
    profileName: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '400',
    },
    section: {
      backgroundColor: colors.white,
      borderRadius: 16,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    settingValue: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      borderRadius: 16,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 16,
    },
    logoutIcon: {
      marginRight: 8,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.error,
    },
    versionText: {
      textAlign: 'center',
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 20,
    },
  });
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileInitial}>A</Text>
        </View>
        <Text style={styles.profileName}>Alex Johnson</Text>
        <Text style={styles.profileEmail}>alex.johnson@example.com</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <Pressable
          style={styles.settingItem}
          onPress={() => router.push('/settings/expense-limit')}
        >
          <View style={styles.settingIconContainer}>
            <DollarSign size={20} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Monthly Expense Limit</Text>
            <Text style={styles.settingValue}>
              ${settings.monthlyExpenseLimit.toFixed(2)}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
        
        <Pressable
          style={styles.settingItem}
          onPress={() => router.push('/settings/currency')}
        >
          <View style={styles.settingIconContainer}>
            <CreditCard size={20} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Currency</Text>
            <Text style={styles.settingValue}>{settings.currency}</Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Bell size={20} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive reminders and alerts
            </Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
        
        <Pressable
          style={styles.settingItem}
          onPress={() => router.push('/settings/theme')}
        >
          <View style={styles.settingIconContainer}>
            <Moon size={20} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Theme</Text>
            <Text style={styles.settingValue}>
              {settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <Pressable
          style={styles.settingItem}
          onPress={() => router.push('/settings/help')}
        >
          <View style={styles.settingIconContainer}>
            <HelpCircle size={20} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Help & Support</Text>
            <Text style={styles.settingDescription}>
              Get help with the app
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
      
      <Pressable style={styles.logoutButton}>
        <LogOut size={20} color={colors.error} style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}
