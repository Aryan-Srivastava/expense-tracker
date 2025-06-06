import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

/**
 * Displays a screen for creating and saving a new expense entry.
 *
 * Presents a form for entering expense details such as name, description, amount, date, tag, and category. Validates required fields and saves the expense to the store upon submission.
 *
 * @remark If the name or amount fields are empty, an alert is shown and the expense is not saved.
 */
export default function NewExpenseScreen() {
  const router = useRouter();
  const { addExpense } = useExpenseStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [tag, setTag] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleSave = () => {
    if (!name || !amount) {
      alert('Please enter a name and amount');
      return;
    }
    
    addExpense({
      name,
      description,
      amount: parseFloat(amount),
      tag: tag || 'other',
      category: category || 'other',
      date: date.toISOString(),
    });
    
    router.back();
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
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
  
  // Predefined tags and categories for selection
  const tags = ['food', 'transport', 'utilities', 'entertainment', 'health', 'electronics', 'other'];
  const categories = ['essentials', 'bills', 'leisure', 'social', 'travel', 'daily', 'subscriptions', 'shopping', 'other'];
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'New Expense', 
          headerStyle: { backgroundColor: colors.card }, 
          headerTitleStyle: { color: colors.text }, 
          headerTintColor: colors.text 
        }} 
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter expense name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description (optional)"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <Pressable style={styles.dateInput} onPress={showDatepicker}>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <Calendar size={20} color={colors.textSecondary} />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tag</Text>
            <View style={styles.tagsContainer}>
              {tags.map((t) => (
                <Pressable
                  key={t}
                  style={[
                    styles.tagButton,
                    tag === t && styles.selectedTagButton,
                  ]}
                  onPress={() => setTag(t)}
                >
                  <Text
                    style={[
                      styles.tagButtonText,
                      tag === t && styles.selectedTagButtonText,
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.tagsContainer}>
              {categories.map((c) => (
                <Pressable
                  key={c}
                  style={[
                    styles.tagButton,
                    category === c && styles.selectedTagButton,
                  ]}
                  onPress={() => setCategory(c)}
                >
                  <Text
                    style={[
                      styles.tagButtonText,
                      category === c && styles.selectedTagButtonText,
                    ]}
                  >
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save Expense"
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
  },
  formContainer: {
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
  inputGroup: {
    marginBottom: 20,
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
  },
  textArea: {
    minHeight: 80,
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
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  selectedTagButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTagButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 0,
  },
});
