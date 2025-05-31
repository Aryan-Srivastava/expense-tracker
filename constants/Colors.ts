/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Light and dark theme base colors
export const theme = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Light mode color palette
export const lightColors = {
  // Primary colors
  primary: '#3366FF',
  primaryLight: '#D6E4FF',
  
  // Secondary colors
  secondary: '#6979F8',
  secondaryLight: '#E5E8FF',
  
  // Accent colors
  accent: '#00C48C',
  accentLight: '#E6F9F1',
  
  // Status colors
  success: '#00C48C',
  warning: '#FFCF5C',
  error: '#FF647C',
  info: '#0095FF',
  
  // Neutral colors
  white: '#FFFFFF',
  background: '#F7F9FC',
  card: '#FFFFFF',
  text: '#1A1F36',
  textSecondary: '#8F9BB3',
  border: '#EDF1F7',
  
  // Specific feature colors
  expense: '#FF647C',
  income: '#00C48C',
  investment: '#6979F8',
  subscription: '#FFCF5C',
  split: '#0095FF',
};

// Dark mode color palette
export const darkColors = {
  // Primary colors
  primary: '#fff',
  primaryLight: '#1F2B5F',
  
  // Secondary colors
  secondary: '#8A94FF',
  secondaryLight: '#2A2E5C',
  
  // Accent colors
  accent: '#00D69D',
  accentLight: '#1A3D33',
  
  // Status colors
  success: '#00D69D',
  warning: '#FFD76B',
  error: '#FF7D91',
  info: '#33A9FF',
  
  // Neutral colors
  white: '#1E2023',
  background: '#121212',
  card: '#1E2023',
  text: '#ECEDEE',
  textSecondary: '#9BA1A6',
  border: '#2C2F33',
  
  // Specific feature colors
  expense: '#FF7D91',
  income: '#00D69D',
  investment: '#8A94FF',
  subscription: '#FFD76B',
  split: '#33A9FF',
};

// Default to light mode colors initially
export let colors = { ...lightColors };

// Semantic color mapping
export const semantic = {
  // Dashboard
  dashboardBackground: colors.background,
  dashboardCard: colors.card,
  
  // Expense tracking
  expensePositive: colors.success,
  expenseNegative: colors.error,
  
  // Group splits
  splitBackground: colors.primaryLight,
  splitAccent: colors.primary,
  
  // Investments
  investmentPositive: colors.success,
  investmentNegative: colors.error,
  investmentNeutral: colors.info,
  
  // Subscriptions
  subscriptionBackground: colors.secondaryLight,
  subscriptionAccent: colors.secondary,
};

// Export default Colors object with both light and dark themes
export default {
  light: {
    text: lightColors.text,
    background: lightColors.background,
    tint: lightColors.primary,
    tabIconDefault: lightColors.textSecondary,
    tabIconSelected: lightColors.primary,
  },
  dark: {
    text: darkColors.text,
    background: darkColors.background,
    tint: darkColors.primary,
    tabIconDefault: darkColors.textSecondary,
    tabIconSelected: darkColors.primary,
  }
};
