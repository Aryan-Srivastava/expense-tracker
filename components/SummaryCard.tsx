import { colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SummaryCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  isPositive?: boolean;
  isNegative?: boolean;
  icon?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  subtitle,
  isPositive,
  isNegative,
  icon,
}) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
      
      <Text
        style={[
          styles.amount,
          isPositive && styles.positive,
          isNegative && styles.negative,
        ]}
      >
        {isPositive && '+'}
        {formatCurrency(amount)}
      </Text>
      
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  iconContainer: {
    marginLeft: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  positive: {
    color: colors.success,
  },
  negative: {
    color: colors.error,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default SummaryCard;
