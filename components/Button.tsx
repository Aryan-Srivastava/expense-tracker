import { colors } from '@/constants/Colors';
import { useThemeContext } from '@/hooks/useThemeContext';
import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}: ButtonProps) {
  // Get theme context to force re-render on theme change
  const { activeTheme } = useThemeContext();
  
  // Force component to re-render when theme changes
  useEffect(() => {}, [activeTheme]);
  const getContainerStyle = () => {
    const containerStyle: ViewStyle = { ...styles.container };
    
    // Variant styles
    if (variant === 'primary') {
      containerStyle.backgroundColor = colors.primary;
    } else if (variant === 'secondary') {
      containerStyle.backgroundColor = colors.secondary;
    } else if (variant === 'outline') {
      containerStyle.backgroundColor = 'transparent';
      containerStyle.borderWidth = 1;
      containerStyle.borderColor = colors.primary;
    } else if (variant === 'ghost') {
      containerStyle.backgroundColor = 'transparent';
    }
    
    // Size styles
    if (size === 'small') {
      containerStyle.height = 36;
      containerStyle.paddingHorizontal = 12;
    } else if (size === 'large') {
      containerStyle.height = 56;
      containerStyle.paddingHorizontal = 24;
    }
    
    // Width style
    if (fullWidth) {
      containerStyle.width = '100%';
    }
    
    // Disabled style
    if (disabled) {
      containerStyle.backgroundColor = colors.border;
      containerStyle.borderColor = colors.border;
    }
    
    return containerStyle;
  };
  
  const getTextStyle = () => {
    const textStyle: TextStyle = { ...styles.text };
    
    // Variant styles
    if (variant === 'primary') {
      textStyle.color = colors.white;
    } else if (variant === 'secondary') {
      textStyle.color = colors.white;
    } else if (variant === 'outline') {
      textStyle.color = colors.primary;
    } else if (variant === 'ghost') {
      textStyle.color = colors.primary;
    }
    
    // Size styles
    if (size === 'small') {
      textStyle.fontSize = 14;
    } else if (size === 'large') {
      textStyle.fontSize = 18;
    }
    
    // Disabled style
    if (disabled) {
      textStyle.color = colors.textSecondary;
    }
    
    return textStyle;
  };
  
  // Define styles inside component to ensure they update with theme changes
  const styles = StyleSheet.create({
    container: {
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      height: 48,
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    text: {
      fontSize: 16,
      fontWeight: '600',
    },
    iconLeft: {
      marginRight: 8,
    },
    iconRight: {
      marginLeft: 8,
    },
  });
  
  return (
    <Pressable
      style={({ pressed }) => {
        const baseStyle = getContainerStyle();
        const pressedStyle = pressed && !disabled ? { ...styles.pressed } : {};
        return [baseStyle, pressedStyle, style];
      }}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </Pressable>
  );
};

// Styles are now defined inside the component
