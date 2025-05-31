import { colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  style?: any;
}

export default function AmountInput({
  value,
  onChangeText,
  label,
  error,
  style,
}: AmountInputProps) {
  
  const handleChangeText = (text: string) => {
    // Only allow numbers and decimal point
    const sanitizedText = text.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const decimalPoints = sanitizedText.match(/\./g)?.length || 0;
    if (decimalPoints > 1) return;
    
    // Ensure only two decimal places
    const parts = sanitizedText.split('.');
    if (parts[1]?.length > 2) return;
    
    onChangeText(sanitizedText);
  };

  // Define styles inside component to ensure they update with theme changes
  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      height: 48,
      paddingHorizontal: 12,
    },
    inputError: {
      borderColor: colors.error,
    },
    currency: {
      fontSize: 16,
      color: colors.text,
      marginRight: 4,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      padding: 0,
    },
    errorText: {
      fontSize: 12,
      color: colors.error,
      marginTop: 4,
    },
  });
  
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Text style={styles.currency}>$</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Styles are now defined inside the component
