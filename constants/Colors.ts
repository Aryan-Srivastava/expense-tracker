/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

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

// Color palette for the financial tracker app
export const colors = {
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

export default {
  light: {
    text: colors.text,
    background: colors.background,
    tint: colors.primary,
    tabIconDefault: colors.textSecondary,
    tabIconSelected: colors.primary,
  },
};
