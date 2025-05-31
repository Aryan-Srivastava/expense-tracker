import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useInvestmentStore } from '@/hooks/useInvestmentStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Edit2, Trash2, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function InvestmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getInvestmentById, deleteInvestment } = useInvestmentStore();
  
  const investment = getInvestmentById(id);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    notFoundContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    notFoundText: {
      fontSize: 18,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.white,
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    name: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    typeContainer: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
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
      fontSize: 14,
      fontWeight: '500',
      color: colors.primary,
    },
    priceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.white,
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    currentPriceContainer: {
      alignItems: 'flex-start',
    },
    currentPriceLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    currentPrice: {
      fontSize: 24,
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
      fontSize: 18,
      fontWeight: '600',
    },
    profit: {
      color: colors.success,
    },
    loss: {
      color: colors.error,
    },
    card: {
      backgroundColor: colors.white,
      margin: 20,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    detailLabel: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateIcon: {
      marginRight: 4,
    },
    notesContainer: {
      marginTop: 16,
    },
    notesLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 8,
    },
    notesText: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    actionsContainer: {
      padding: 20,
    },
  });
  
  if (!investment) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Investment not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="primary"
          size="medium"
        />
      </View>
    );
  }
  
  const profitLoss = (investment.currentPrice - investment.purchasePrice) * investment.quantity;
  const profitLossPercentage = ((investment.currentPrice - investment.purchasePrice) / investment.purchasePrice) * 100;
  const isProfit = profitLoss >= 0;
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Investment',
      'Are you sure you want to delete this investment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteInvestment(id);
            router.back();
          },
        },
      ]
    );
  };
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const getInvestmentTypeLabel = (type: string) => {
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
  
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Investment Details',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Button
                title="Edit"
                onPress={() => router.push(`/investments/edit/${id}`)}
                variant="ghost"
                size="small"
                icon={<Edit2 size={16} color={colors.primary} />}
              />
              <Button
                title="Delete"
                onPress={handleDelete}
                variant="ghost"
                size="small"
                icon={<Trash2 size={16} color={colors.error} />}
              />
            </View>
          ),
        }}
      />
      
      <ScrollView style={styles.container}>
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
        
        <View style={styles.priceContainer}>
          <View style={styles.currentPriceContainer}>
            <Text style={styles.currentPriceLabel}>Current Price</Text>
            <Text style={styles.currentPrice}>
              {formatCurrency(investment.currentPrice)}
            </Text>
          </View>
          
          <View style={styles.changeContainer}>
            {isProfit ? (
              <TrendingUp size={20} color={colors.success} style={styles.changeIcon} />
            ) : (
              <TrendingDown size={20} color={colors.error} style={styles.changeIcon} />
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
        
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Purchase Price</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(investment.purchasePrice)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity</Text>
            <Text style={styles.detailValue}>{investment.quantity}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Cost</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(investment.purchasePrice * investment.quantity)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Value</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(investment.currentPrice * investment.quantity)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Profit/Loss</Text>
            <Text
              style={[
                styles.detailValue,
                isProfit ? styles.profit : styles.loss,
              ]}
            >
              {isProfit ? '+' : ''}
              {formatCurrency(profitLoss)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Purchase Date</Text>
            <View style={styles.dateContainer}>
              <Calendar size={16} color={colors.textSecondary} style={styles.dateIcon} />
              <Text style={styles.detailValue}>
                {formatDate(investment.purchaseDate)}
              </Text>
            </View>
          </View>
          
          {investment.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{investment.notes}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Update Price"
            onPress={() => router.push(`/investments/update-price/${id}`)}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </>
  );
}
