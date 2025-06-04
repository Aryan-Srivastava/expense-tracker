import { colors } from '@/constants/Colors';
import { Group } from '@/types';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface GroupCardProps {
  group: Group;
  balance: number;
  onPress?: () => void;
}

export default function GroupCard({ group, balance, onPress }: GroupCardProps) {
  // Calculate how many members to show and how many are remaining
  const visibleMembers = group.members.slice(0, 3);
  const remainingMembers = Math.max(0, group.members.length - 3);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    pressed: {
      opacity: 0.9,
      transform: [{ scale: 0.98 }],
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    name: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      flexShrink: 1,
      marginRight: 12, // Add more margin to prevent overlap with balance
      flex: 1, // Take available space but allow shrinking
    },
    balance: {
      fontSize: 16,
      fontWeight: '600',
    },
    positive: {
      color: colors.success,
    },
    negative: {
      color: colors.error,
    },
    neutral: {
      color: colors.textSecondary,
    },
    membersContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    avatarsContainer: {
      flexDirection: 'row',
      marginRight: 12,
    },
    avatarWrapper: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.white,
      overflow: 'hidden',
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    remainingWrapper: {
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    remainingText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
    membersText: {
      fontSize: 14,
      color: colors.textSecondary,
      flexGrow: 1,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    expensesText: {
      fontSize: 14,
      color: colors.textSecondary,
      flexShrink: 1,
      flexGrow: 1,
    },
    updatedText: {
      fontSize: 14,
      color: colors.textSecondary,
      flexShrink: 1,
      textAlign: 'right',
    },    
  });  
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{group.name}</Text>
        <Text
          style={[
            styles.balance,
            balance > 0 ? styles.positive : balance < 0 ? styles.negative : styles.neutral,
          ]}
        >
          {balance > 0 ? '+' : balance < 0 ? '-' : ''}${Math.abs(balance).toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.membersContainer}>
        <View style={styles.avatarsContainer}>
          {visibleMembers.map((member, index) => (
            <View
              key={member.id}
              style={[
                styles.avatarWrapper,
                { marginLeft: index > 0 ? -12 : 0, zIndex: 3 - index },
              ]}
            >
              <Image
                source={{ uri: member.avatar }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            </View>
          ))}
          
          {remainingMembers > 0 && (
            <View style={[styles.avatarWrapper, styles.remainingWrapper, { marginLeft: -12 }]}>
              <Text style={styles.remainingText}>+{remainingMembers}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.membersText}>
          {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.expensesText}>
            {group.expenses.length} {group.expenses.length === 1 ? 'expense' : 'expenses'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.updatedText} numberOfLines={1} ellipsizeMode="tail">
            Updated {formatDate(group.updatedAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'today';
  } else if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};
