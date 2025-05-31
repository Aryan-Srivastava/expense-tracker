import { colors } from '@/constants/Colors';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { Stack, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

// List of common currencies
const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
];

export default function CurrencyScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useSettingsStore();

  const handleCurrencySelect = (currencyCode: string) => {
    updateSettings({ currency: currencyCode });
    Alert.alert('Success', 'Currency updated successfully.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Currency' }} />
      
      <View style={styles.container}>
        <FlatList
          data={currencies}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <Pressable
              style={styles.currencyItem}
              onPress={() => handleCurrencySelect(item.code)}
            >
              <View style={styles.currencyInfo}>
                <Text style={styles.currencySymbol}>{item.symbol}</Text>
                <View>
                  <Text style={styles.currencyName}>{item.name}</Text>
                  <Text style={styles.currencyCode}>{item.code}</Text>
                </View>
              </View>
              
              {settings.currency === item.code && (
                <Check size={20} color={colors.primary} />
              )}
            </Pressable>
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 20,
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    width: 40,
    textAlign: 'center',
    marginRight: 12,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  currencyCode: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
