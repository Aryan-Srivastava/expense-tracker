import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ExpenseLimitScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useSettingsStore();
  const [expenseLimit, setExpenseLimit] = useState(settings.monthlyExpenseLimit.toString());

  const handleSave = () => {
    const limitValue = parseFloat(expenseLimit);
    
    if (isNaN(limitValue) || limitValue <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid expense limit.');
      return;
    }
    
    updateSettings({ monthlyExpenseLimit: limitValue });
    Alert.alert('Success', 'Monthly expense limit updated successfully.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    label: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      marginBottom: 16,
    },
    currencySymbol: {
      fontSize: 20,
      fontWeight: '500',
      color: colors.text,
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 20,
      fontWeight: '500',
      color: colors.text,
      padding: 12,
    },
    currentLimit: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    buttonContainer: {
      marginTop: 'auto',
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Monthly Expense Limit' }} />
      
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Set your monthly expense limit</Text>
          <Text style={styles.description}>
            You&apos;ll be notified when your expenses exceed this limit.
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.input}
              value={expenseLimit}
              onChangeText={setExpenseLimit}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <Text style={styles.currentLimit}>
            Current limit: ${settings.monthlyExpenseLimit.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save"
            onPress={handleSave}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </View>
    </>
  );
}
