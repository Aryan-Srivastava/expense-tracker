import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useInvestmentStore } from '@/hooks/useInvestmentStore';
import { Investment } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function NewInvestmentScreen() {
  const router = useRouter();
  const { addInvestment } = useInvestmentStore();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<Investment['type']>('stock');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleSave = () => {
    if (!name || !purchasePrice || !currentPrice || !quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    const newInvestment: Omit<Investment, 'id'> = {
      name,
      type,
      purchasePrice: parseFloat(purchasePrice),
      currentPrice: parseFloat(currentPrice),
      quantity: parseFloat(quantity),
      purchaseDate: purchaseDate.toISOString(),
      notes: notes.trim() || undefined,
    };
    
    addInvestment(newInvestment);
    
    Alert.alert('Success', 'Investment added successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setPurchaseDate(selectedDate);
    }
  };
  
  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const investmentTypes: Array<{ value: Investment['type']; label: string }> = [
    { value: 'stock', label: 'Stock' },
    { value: 'mutual_fund', label: 'Mutual Fund' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'other', label: 'Other' },
  ];
  
  return (
    <>
      <Stack.Screen options={{ title: 'Add Investment' }} />
      
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Investment Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter investment name"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={styles.label}>Investment Type</Text>
          <View style={styles.typeContainer}>
            {investmentTypes.map((item) => (
              <Pressable
                key={item.value}
                style={[
                  styles.typeButton,
                  type === item.value && styles.selectedTypeButton,
                ]}
                onPress={() => setType(item.value)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === item.value && styles.selectedTypeButtonText,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
          
          <Text style={styles.label}>Purchase Price</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.priceInput}
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>
          
          <Text style={styles.label}>Current Price</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.priceInput}
              value={currentPrice}
              onChangeText={setCurrentPrice}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>
          
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Enter quantity"
            placeholderTextColor={colors.textSecondary}
            keyboardType="decimal-pad"
          />
          
          <Text style={styles.label}>Purchase Date</Text>
          <Pressable style={styles.dateInput} onPress={showDatepicker}>
            <Text style={styles.dateText}>{formatDate(purchaseDate)}</Text>
            <Calendar size={20} color={colors.textSecondary} />
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={purchaseDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
          
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save Investment"
            onPress={handleSave}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </>
  );
}

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
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTypeButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
  priceInputContainer: {
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
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 12,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
  },
  buttonContainer: {
    marginBottom: 20,
  },
});
