import { colors } from '@/constants/Colors';
import { Subscription } from '@/types';
import { Image } from 'expo-image';
import { Calendar } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress?: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getCycleText = (cycle: Subscription['cycle']) => {
    switch (cycle) {
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      case 'weekly':
        return 'Weekly';
      case 'quarterly':
        return 'Quarterly';
      default:
        return '';
    }
  };
  
  const getDaysUntilNextBilling = () => {
    const today = new Date();
    const nextBilling = new Date(subscription.nextBillingDate);
    const diffTime = Math.abs(nextBilling.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `In ${diffDays} days`;
    }
  };
  
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
          source={{ uri: subscription.icon }}
          style={styles.icon}
          contentFit="cover"
          transition={200}
        />
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {subscription.name}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {subscription.description}
        </Text>
        <View style={styles.billingContainer}>
          <Calendar size={14} color={colors.textSecondary} style={styles.calendarIcon} />
          <Text style={styles.billingText}>
            {getDaysUntilNextBilling()} • {formatDate(subscription.nextBillingDate)}
          </Text>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${subscription.amount.toFixed(2)}</Text>
        <Text style={styles.cycle}>{getCycleText(subscription.cycle)}</Text>
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
  billingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: 4,
  },
  billingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cycle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default SubscriptionCard;
