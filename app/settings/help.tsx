import { colors } from '@/constants/Colors';
import { Stack } from 'expo-router';
import { ChevronRight, FileText, HelpCircle, Mail, MessageCircle, Star } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface HelpItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const HelpItem: React.FC<HelpItemProps> = ({
  title,
  description,
  icon,
  onPress,
}) => (
  <Pressable style={styles.helpItem} onPress={onPress}>
    <View style={styles.helpIconContainer}>{icon}</View>
    <View style={styles.helpContent}>
      <Text style={styles.helpTitle}>{title}</Text>
      <Text style={styles.helpDescription}>{description}</Text>
    </View>
    <ChevronRight size={20} color={colors.textSecondary} />
  </Pressable>
);

export default function HelpScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Help & Support' }} />
      
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <HelpItem
            title="FAQs"
            description="Find answers to common questions"
            icon={<HelpCircle size={24} color={colors.primary} />}
            onPress={() => {}}
          />
          
          <HelpItem
            title="Contact Support"
            description="Get help from our support team"
            icon={<MessageCircle size={24} color={colors.primary} />}
            onPress={() => {}}
          />
          
          <HelpItem
            title="Email Us"
            description="Send us an email with your query"
            icon={<Mail size={24} color={colors.primary} />}
            onPress={() => {}}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <HelpItem
            title="Terms of Service"
            description="Read our terms of service"
            icon={<FileText size={24} color={colors.primary} />}
            onPress={() => {}}
          />
          
          <HelpItem
            title="Privacy Policy"
            description="Learn how we handle your data"
            icon={<FileText size={24} color={colors.primary} />}
            onPress={() => {}}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <HelpItem
            title="Rate the App"
            description="Let us know what you think"
            icon={<Star size={24} color={colors.primary} />}
            onPress={() => {}}
          />
        </View>
        
        <Text style={styles.versionText}>App Version: 1.0.0</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  helpItem: {
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
  helpIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textSecondary,
    marginVertical: 20,
  },
});
