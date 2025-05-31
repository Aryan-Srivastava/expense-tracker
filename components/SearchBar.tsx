import { colors } from '@/constants/Colors';
import { Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, TextInput } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search...',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = new Animated.Value(0);

  const handleClear = () => {
    onChangeText('');
    if (onClear) {
      onClear();
    }
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  // Define styles inside component to ensure they update with theme changes
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      paddingHorizontal: 16,
      height: 48,
      borderWidth: 1,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 4,
    },
    searchIcon: {
      marginRight: 12,
      opacity: 0.7,
    },
    input: {
      flex: 1,
      height: '100%',
      fontSize: 16,
      color: colors.text,
      padding: 0,
      fontWeight: '400',
    },
    clearButton: {
      padding: 4,
      opacity: 0.8,
    },
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: borderColor,
          shadowOpacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.1],
          }),
          elevation: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 2],
          }),
        }
      ]}
    >
      <Search
        size={20}
        color={isFocused ? colors.primary : colors.textSecondary}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        clearButtonMode="never"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <X
            size={18}
            color={isFocused ? colors.primary : colors.textSecondary}
          />
        </Pressable>
      )}
    </Animated.View>
  );
};

// Styles are now defined inside the component
