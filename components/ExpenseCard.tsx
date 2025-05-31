import { colors } from '@/constants/Colors';
import { Expense } from '@/types';
import { Image } from 'expo-image';
import { ArrowUpRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ExpenseCardProps {
  expense: Expense;
  onPress?: () => void;
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    essentials: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    bills: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    leisure: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    social: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    daily: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    subscriptions: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    shopping: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
  };
  
  return icons[category] || icons.daily;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: getCategoryIcon(expense.category) }}
          style={styles.icon}
          contentFit="cover"
          transition={200}
        />
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {expense.name}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {expense.description}
        </Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tag} numberOfLines={1}>{expense.tag}</Text>
          <Text style={styles.date}>{formatDate(expense.date)}</Text>
        </View>
      </View>
      
      <View style={styles.amountContainer}>
        <View style={styles.amountWrapper}>
          <ArrowUpRight
            size={16}
            color={colors.error}
            style={styles.amountIcon}
          />
          <Text style={styles.amount}>
            ${expense.amount.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },  tag: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
    minWidth: 80,
    maxWidth: 120,
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 16,
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountIcon: {
    marginRight: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
});

export default ExpenseCard;
