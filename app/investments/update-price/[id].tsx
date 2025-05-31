import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useInvestmentStore } from '@/hooks/useInvestmentStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function UpdateInvestmentPriceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getInvestmentById, updateInvestment } = useInvestmentStore();
  
  const investment = getInvestmentById(id);
  
  const [currentPrice, setCurrentPrice] = useState('');
  
  useEffect(() => {
    if (investment) {
      setCurrentPrice(investment.currentPrice.toString());
    }
  }, [investment]);
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
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
    card: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      marginBottom: 20,
    },
    investmentName: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    investmentType: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    priceContainer: {
      flexDirection: 'row',
      marginBottom: 24,
    },
    priceItem: {
      flex: 1,
    },
    priceLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    priceValue: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    inputContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 8,
    },
    priceInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
    },
    currencySymbol: {
      fontSize: 20,
      fontWeight: '500',
      color: colors.text,
      marginRight: 8,
    },
    priceInput: {
      flex: 1,
      fontSize: 20,
      fontWeight: '500',
      color: colors.text,
      padding: 12,
    },
    previewContainer: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 16,
    },
    previewTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 12,
    },
    profitLossContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    profitLossItem: {
      flex: 1,
    },
    profitLossLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    profitLossValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profitLossIcon: {
      marginRight: 4,
    },
    profitLossValue: {
      fontSize: 16,
      fontWeight: '500',
    },
    profit: {
      color: colors.success,
    },
    loss: {
      color: colors.error,
    },
    totalValueContainer: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    totalValueLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    totalValueAmount: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    updateButton: {
      marginTop: 'auto',
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
  
  const handleUpdatePrice = () => {
    const priceValue = parseFloat(currentPrice);
    
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    
    updateInvestment(id, { currentPrice: priceValue });
    
    Alert.alert('Success', 'Investment price updated successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };
  
  const calculateProfitLoss = () => {
    const newPrice = parseFloat(currentPrice) || 0;
    return (newPrice - investment.purchasePrice) * investment.quantity;
  };
  
  const calculateProfitLossPercentage = () => {
    const newPrice = parseFloat(currentPrice) || 0;
    if (investment.purchasePrice === 0) return 0;
    return ((newPrice - investment.purchasePrice) / investment.purchasePrice) * 100;
  };
  
  const profitLoss = calculateProfitLoss();
  const profitLossPercentage = calculateProfitLossPercentage();
  const isProfit = profitLoss >= 0;
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Update Price' }} />
      
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.investmentName}>{investment.name}</Text>
          <Text style={styles.investmentType}>
            {investment.type.charAt(0).toUpperCase() + investment.type.slice(1).replace('_', ' ')}
          </Text>
          
          <View style={styles.priceContainer}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Purchase Price</Text>
              <Text style={styles.priceValue}>
                {formatCurrency(investment.purchasePrice)}
              </Text>
            </View>
            
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Current Price</Text>
              <Text style={styles.priceValue}>
                {formatCurrency(investment.currentPrice)}
              </Text>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Price</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                value={currentPrice}
                onChangeText={setCurrentPrice}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>
          </View>
          
          {currentPrice && !isNaN(parseFloat(currentPrice)) && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>Preview</Text>
              
              <View style={styles.profitLossContainer}>
                <View style={styles.profitLossItem}>
                  <Text style={styles.profitLossLabel}>Profit/Loss</Text>
                  <View style={styles.profitLossValueContainer}>
                    {isProfit ? (
                      <TrendingUp size={16} color={colors.success} style={styles.profitLossIcon} />
                    ) : (
                      <TrendingDown size={16} color={colors.error} style={styles.profitLossIcon} />
                    )}
                    <Text
                      style={[
                        styles.profitLossValue,
                        isProfit ? styles.profit : styles.loss,
                      ]}
                    >
                      {isProfit ? '+' : ''}
                      {formatCurrency(profitLoss)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.profitLossItem}>
                  <Text style={styles.profitLossLabel}>Percentage</Text>
                  <Text
                    style={[
                      styles.profitLossValue,
                      isProfit ? styles.profit : styles.loss,
                    ]}
                  >
                    {isProfit ? '+' : ''}
                    {profitLossPercentage.toFixed(2)}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.totalValueContainer}>
                <Text style={styles.totalValueLabel}>Total Value</Text>
                <Text style={styles.totalValueAmount}>
                  {formatCurrency(parseFloat(currentPrice) * investment.quantity)}
                </Text>
              </View>
            </View>
          )}
        </View>
        
        <Button
          title="Update Price"
          onPress={handleUpdatePrice}
          variant="primary"
          size="large"
          fullWidth
          style={styles.updateButton}
        />
      </View>
    </>
  );
}
