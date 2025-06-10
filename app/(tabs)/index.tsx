import ExpenseCard from '@/components/ExpenseCard';
import SubscriptionCard from '@/components/SubscriptionCard';
import SummaryCard from '@/components/SummaryCard';
import { colors } from '@/constants/Colors';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { useGroupStore } from '@/hooks/useGroupStore';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { useSubscriptionStore } from '@/hooks/useSubscriptionStore';
import { useThemeContext } from '@/hooks/useThemeContext';
import { useRouter } from 'expo-router';
import { ArrowDownRight, ArrowUpRight, Bell, Plus } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

/**
 * Renders the main financial dashboard, providing an overview of monthly expenses, group balances, recent expenses, and upcoming subscriptions.
 *
 * Displays a greeting, a budget progress indicator, summary cards for group debts and subscriptions, a weekly expense line chart, and lists of recent expenses and upcoming subscriptions. Supports navigation to detailed expense and subscription screens and adapts its appearance to the active theme.
 */
export default function DashboardScreen() {
  const router = useRouter();
  const { expenses, getTotalExpenses } = useExpenseStore();
  const { getTotalOwed, getTotalOwes } = useGroupStore();
  const { subscriptions, getUpcomingSubscriptions } = useSubscriptionStore();
  const { settings } = useSettingsStore();
  const { activeTheme } = useThemeContext();
  
  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculate start and end dates for current month
  const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString();
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString();
  
  // Get monthly expense total
  const monthlyTotal = getTotalExpenses(startOfMonth, endOfMonth);
  
  // Check if monthly expenses exceed limit
  const isOverBudget = monthlyTotal > settings.monthlyExpenseLimit;
  
  // Get recent expenses (last 5)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Get upcoming subscriptions (next 7 days)
  const upcomingSubscriptions = getUpcomingSubscriptions(7);
  
  // Sample weekly expense data for the chart
  const weeklyExpenseData = [
    { value: 150, label: 'Mon' },
    { value: 220, label: 'Tue' },
    { value: 180, label: 'Wed' },
    { value: 340, label: 'Thu' },
    { value: 280, label: 'Fri' },
    { value: 190, label: 'Sat' },
    { value: 120, label: 'Sun' },
  ];

  // Calculate total owed and owes
  const totalOwed = getTotalOwed('user1'); // Assuming current user is 'user1'
  const totalOwes = getTotalOwes('user1');
  
  // Use theme context to force re-render when theme changes
  useEffect(() => {
    // This will force the component to re-render when the theme changes
    console.log(`Dashboard theme changed to: ${activeTheme}`);
  }, [activeTheme]);
  
  // Define styles inside component to ensure they update with theme changes
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    greeting: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    name: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
    notificationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    monthlyExpenseContainer: {
      margin: 20,
      padding: 20,
      backgroundColor: colors.card,
      borderRadius: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    monthlyExpenseTitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    monthlyExpenseContent: {
      alignItems: 'flex-start',
    },
    monthlyExpenseAmount: {
      fontSize: 32,
      fontWeight: '700',
      marginBottom: 12,
    },
    overBudget: {
      color: colors.error,
    },
    underBudget: {
      color: colors.success,
    },
    budgetContainer: {
      height: 8,
      width: '100%',
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    budgetBar: {
      height: '100%',
      borderRadius: 4,
    },
    overBudgetBar: {
      backgroundColor: colors.error,
    },
    underBudgetBar: {
      backgroundColor: colors.success,
    },
    budgetText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    summaryCardsContainer: {
      marginBottom: 20,
    },
    summaryCardsContent: {
      paddingHorizontal: 20,
      gap: 12,
    },
    sectionContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    seeAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 8,
    },
    seeAllText: {
      fontSize: 14,
      color: colors.primary,
      minWidth: 60, // Ensure minimum width for the text
      textAlign: 'center', // Center-align the text
      fontWeight: '500',
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingBlock: 4,
      paddingInline: 16,
      marginRight: -12,
    },
    emptyContainer: {
      padding: 20,
      backgroundColor: colors.card,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    addButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello there,</Text>
          <Text style={styles.name}>Alex</Text>
        </View>
        <Pressable style={styles.notificationButton}>
          <Bell size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.monthlyExpenseContainer}>
        <Text style={styles.monthlyExpenseTitle}>Monthly Expenses</Text>
        <View style={styles.monthlyExpenseContent}>
          <Text
            style={[
              styles.monthlyExpenseAmount,
              isOverBudget ? styles.overBudget : styles.underBudget,
            ]}
          >
            ${monthlyTotal.toFixed(2)}
          </Text>
          <View style={styles.budgetContainer}>
            <View
              style={[
                styles.budgetBar,
                {
                  width: `${Math.min(
                    (monthlyTotal / settings.monthlyExpenseLimit) * 100,
                    100
                  )}%`,
                },
                isOverBudget ? styles.overBudgetBar : styles.underBudgetBar,
              ]}
            />
          </View>
          <Text style={styles.budgetText}>
            {isOverBudget ? 'Over budget' : 'Budget'}: $
            {settings.monthlyExpenseLimit.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.summaryCardsContainer}
        contentContainerStyle={styles.summaryCardsContent}
      >
        <SummaryCard
          title="You are owed"
          amount={totalOwed}
          subtitle="From group expenses"
          isPositive
          icon={<ArrowDownRight size={16} color={colors.success} />}
        />
        <SummaryCard
          title="You owe"
          amount={totalOwes}
          subtitle="To group members"
          isNegative
          icon={<ArrowUpRight size={16} color={colors.error} />}
        />
        <SummaryCard
          title="Subscriptions"
          amount={subscriptions.length > 0 ? subscriptions[0].amount : 0}
          subtitle={
            subscriptions.length > 0
              ? `Next: ${subscriptions[0].name}`
              : 'No upcoming subscriptions'
          }
        />
      </ScrollView>
      
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <Pressable 
            style={styles.seeAllButton}
            onPress={() => router.push('/expenses')}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>
        
        {recentExpenses.length > 0 ? (
          recentExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onPress={() => router.push(`/expenses/${expense.id}`)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recent expenses</Text>
          </View>
        )}
        
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/expenses/new')}
        >
          <Plus size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Add Expense</Text>
        </Pressable>
      </View>
      
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Subscriptions</Text>
          <Pressable 
            style={styles.seeAllButton}
            onPress={() => router.push('/subscriptions/all')}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </Pressable>
        </View>
        
        {upcomingSubscriptions.length > 0 ? (
          upcomingSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onPress={() => router.push(`/subscriptions/all`)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No upcoming subscriptions</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Styles are now defined inside the component
