import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
  tags: string[];
  categories: string[];
}

export interface FilterOptions {
  tags: string[];
  categories: string[];
  startDate: Date | null;
  endDate: Date | null;
  minAmount: number | null;
  maxAmount: number | null;
}

export default function FilterModal({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
  tags,
  categories,
}: FilterModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.tags || []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categories || []
  );
  const [startDate, setStartDate] = useState<Date | null>(initialFilters?.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialFilters?.endDate || null);
  const [minAmount, setMinAmount] = useState<string>(
    initialFilters?.minAmount ? initialFilters.minAmount.toString() : ''
  );
  const [maxAmount, setMaxAmount] = useState<string>(
    initialFilters?.maxAmount ? initialFilters.maxAmount.toString() : ''
  );
  
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };
  
  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handleApplyFilters = () => {
    const filters: FilterOptions = {
      tags: selectedTags,
      categories: selectedCategories,
      startDate,
      endDate,
      minAmount: minAmount ? parseFloat(minAmount) : null,
      maxAmount: maxAmount ? parseFloat(maxAmount) : null,
    };
    
    onApplyFilters(filters);
    onClose();
  };
  
  const handleResetFilters = () => {
    setSelectedTags([]);
    setSelectedCategories([]);
    setStartDate(null);
    setEndDate(null);
    setMinAmount('');
    setMaxAmount('');
  };
  
  // Define styles inside component to ensure they update with theme changes
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    scrollContent: {
      flex: 1,
    },
    section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tagButton: {
      backgroundColor: colors.card,
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
    dateContainer: {
      marginBottom: 16,
    },
    dateLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    dateButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateText: {
      fontSize: 16,
      color: colors.text,
    },
    amountContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    amountInputContainer: {
      flex: 1,
    },
    amountLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    amountInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
    },
    currencySymbol: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginRight: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      padding: 12,
    },
    buttonContainer: {
      flexDirection: 'row',
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 12,
    },
    resetButton: {
      flex: 1,
    },
    applyButton: {
      flex: 2,
    },
  });
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Expenses</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.text} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag) => (
                  <Pressable
                    key={tag}
                    style={[
                      styles.tagButton,
                      selectedTags.includes(tag) && styles.selectedTagButton,
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text
                      style={[
                        styles.tagButtonText,
                        selectedTags.includes(tag) && styles.selectedTagButtonText,
                      ]}
                    >
                      {tag}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.tagsContainer}>
                {categories.map((category) => (
                  <Pressable
                    key={category}
                    style={[
                      styles.tagButton,
                      selectedCategories.includes(category) && styles.selectedTagButton,
                    ]}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text
                      style={[
                        styles.tagButtonText,
                        selectedCategories.includes(category) && styles.selectedTagButtonText,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date Range</Text>
              
              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>From</Text>
                <Pressable
                  style={styles.dateButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                  <Calendar size={20} color={colors.textSecondary} />
                </Pressable>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                    maximumDate={endDate || undefined}
                  />
                )}
              </View>
              
              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>To</Text>
                <Pressable
                  style={styles.dateButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                  <Calendar size={20} color={colors.textSecondary} />
                </Pressable>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
                    minimumDate={startDate || undefined}
                    maximumDate={new Date()}
                  />
                )}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amount Range</Text>
              
              <View style={styles.amountContainer}>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.amountLabel}>Min</Text>
                  <View style={styles.amountInputWrapper}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.amountInput}
                      value={minAmount}
                      onChangeText={setMinAmount}
                      placeholder="0.00"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
                
                <View style={styles.amountInputContainer}>
                  <Text style={styles.amountLabel}>Max</Text>
                  <View style={styles.amountInputWrapper}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.amountInput}
                      value={maxAmount}
                      onChangeText={setMaxAmount}
                      placeholder="0.00"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Reset"
              onPress={handleResetFilters}
              variant="outline"
              size="medium"
              style={styles.resetButton}
            />
            <Button
              title="Apply Filters"
              onPress={handleApplyFilters}
              variant="primary"
              size="medium"
              style={styles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles are now defined inside the component
