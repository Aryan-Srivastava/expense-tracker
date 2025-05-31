import InvestmentCard from '@/components/InvestmentCard';
import SummaryCard from '@/components/SummaryCard';
import { colors } from '@/constants/Colors';
import { useInvestmentStore } from '@/hooks/useInvestmentStore';
import { useRouter } from 'expo-router';
import { Plus, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function InvestmentsScreen() {
  const router = useRouter();
  const {
    investments,
    getTotalInvestmentValue,
    getTotalInvestmentCost,
    getTotalProfitLoss,
    getProfitLossPercentage,
  } = useInvestmentStore();
  
  // Calculate investment metrics
  const totalValue = getTotalInvestmentValue();
  const totalCost = getTotalInvestmentCost();
  const totalProfitLoss = getTotalProfitLoss();
  const profitLossPercentage = getProfitLossPercentage();
  
  // Sort investments by profit/loss (most profitable first)
  const sortedInvestments = [...investments].sort((a, b) => {
    const profitA = (a.currentPrice - a.purchasePrice) * a.quantity;
    const profitB = (b.currentPrice - b.purchasePrice) * b.quantity;
    return profitB - profitA;
  });
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      paddingBottom: 100, // Ensure enough space at bottom
    },
    summaryCardsContainer: {
      marginVertical: 16,
    },
    summaryCardsContent: {
      paddingHorizontal: 20,
      gap: 12,
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    listContent: {
      paddingBottom: 8,
    },
    emptyContainer: {
      padding: 20,
      backgroundColor: colors.white,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    addButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  });
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.summaryCardsContainer}
        contentContainerStyle={styles.summaryCardsContent}
      >
        <SummaryCard
          title="Portfolio Value"
          amount={totalValue}
          subtitle={`${investments.length} investments`}
        />
        <SummaryCard
          title="Total Profit/Loss"
          amount={totalProfitLoss}
          subtitle={`${profitLossPercentage.toFixed(2)}%`}
          isPositive={totalProfitLoss > 0}
          isNegative={totalProfitLoss < 0}
          icon={
            totalProfitLoss >= 0 ? (
              <TrendingUp size={16} color={colors.success} />
            ) : (
              <TrendingDown size={16} color={colors.error} />
            )
}
        />
        <SummaryCard
          title="Initial Investment"
          amount={totalCost}
          subtitle="Total cost basis"
        />
      </ScrollView>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Your Investments</Text>

        <FlatList
          scrollEnabled={false}  // Disable FlatList scrolling
          data={sortedInvestments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InvestmentCard
              investment={item}
              onPress={() => router.push(`/investments/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No investments yet. Add your first investment!
              </Text>
            </View>
          }
        />
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => router.push('/investments/new')}
      >
        <Plus size={24} color={colors.white} />
      </Pressable>
    </ScrollView>
  );
}
