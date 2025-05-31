import { colors } from '@/constants/Colors';
import { Investment } from '@/types';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface InvestmentCardProps {
  investment: Investment;
  onPress?: () => void;
}

export default function InvestmentCard({ investment, onPress }: InvestmentCardProps) {
  
  const profitLoss = (investment.currentPrice - investment.purchasePrice) * investment.quantity;
  const profitLossPercentage = ((investment.currentPrice - investment.purchasePrice) / investment.purchasePrice) * 100;
  const isProfit = profitLoss >= 0;
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  
  const getInvestmentTypeLabel = (type: Investment['type']) => {
    switch (type) {
      case 'stock':
        return 'Stock';
      case 'mutual_fund':
        return 'Mutual Fund';
      case 'crypto':
        return 'Cryptocurrency';
      default:
        return 'Other';
    }
  };
  
  // Define styles inside component to ensure they update with theme changes
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
      marginBottom: 12,
    },
    name: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    typeContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      backgroundColor: colors.primaryLight,
    },
    stockType: {
      backgroundColor: colors.primaryLight,
    },
    fundType: {
      backgroundColor: colors.secondaryLight,
    },
    cryptoType: {
      backgroundColor: colors.accentLight,
    },
    typeText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.primary,
    },
    detailsContainer: {
      marginTop: 8,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    currentPrice: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    changeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    changeIcon: {
      marginRight: 4,
    },
    changePercentage: {
      fontSize: 16,
      fontWeight: '600',
    },
    profit: {
      color: colors.success,
    },
    loss: {
      color: colors.error,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
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
        <Text style={styles.name}>{investment.name}</Text>
        <View
          style={[
            styles.typeContainer,
            investment.type === 'stock' && styles.stockType,
            investment.type === 'mutual_fund' && styles.fundType,
            investment.type === 'crypto' && styles.cryptoType,
          ]}
        >
          <Text style={styles.typeText}>
            {getInvestmentTypeLabel(investment.type)}
          </Text>
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>
            {formatCurrency(investment.currentPrice)}
          </Text>
          <View style={styles.changeContainer}>
            {isProfit ? (
              <TrendingUp size={16} color={colors.success} style={styles.changeIcon} />
            ) : (
              <TrendingDown size={16} color={colors.error} style={styles.changeIcon} />
            )}
            <Text
              style={[
                styles.changePercentage,
                isProfit ? styles.profit : styles.loss,
              ]}
            >
              {isProfit ? '+' : ''}
              {profitLossPercentage.toFixed(2)}%
            </Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Quantity</Text>
            <Text style={styles.statValue}>{investment.quantity}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Value</Text>
            <Text style={styles.statValue}>
              {formatCurrency(investment.currentPrice * investment.quantity)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Profit/Loss</Text>
            <Text
              style={[
                styles.statValue,
                isProfit ? styles.profit : styles.loss,
              ]}
            >
              {isProfit ? '+' : ''}
              {formatCurrency(profitLoss)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// Styles are now defined inside the component
