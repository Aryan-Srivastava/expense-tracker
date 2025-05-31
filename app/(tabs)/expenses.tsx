import ExpenseCard from '@/components/ExpenseCard';
import FilterModal, { FilterOptions } from '@/components/FilterModal';
import SearchBar from '@/components/SearchBar';
import { colors } from '@/constants/Colors';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { useRouter } from 'expo-router';
import { Filter, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ExpensesScreen() {
  const router = useRouter();
  const { expenses, searchExpenses } = useExpenseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    tags: [],
    categories: [],
    startDate: null,
    endDate: null,
    minAmount: null,
    maxAmount: null,
  });
  
  // Get unique tags and categories for filter options
  const tags = Array.from(new Set(expenses.map(expense => expense.tag)));
  const categories = Array.from(new Set(expenses.map(expense => expense.category)));
  
  // Filter expenses based on search query and filters
  const filteredExpenses = expenses
    .filter(expense => {
      // Search filter
      if (searchQuery && !searchExpenses(searchQuery).includes(expense)) {
        return false;
      }
      
      // Tag filter
      if (filters.tags.length > 0 && !filters.tags.includes(expense.tag)) {
        return false;
      }
      
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(expense.category)) {
        return false;
      }
      
      // Date range filter
      if (filters.startDate && new Date(expense.date) < filters.startDate) {
        return false;
      }
      
      if (filters.endDate) {
        const endDateCopy = new Date(filters.endDate);
        endDateCopy.setHours(23, 59, 59, 999); // End of the day
        if (new Date(expense.date) > endDateCopy) {
          return false;
        }
      }
      
      // Amount range filter
      if (filters.minAmount !== null && expense.amount < filters.minAmount) {
        return false;
      }
      
      if (filters.maxAmount !== null && expense.amount > filters.maxAmount) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const isFiltersActive = () => {
    return (
      filters.tags.length > 0 ||
      filters.categories.length > 0 ||
      filters.startDate !== null ||
      filters.endDate !== null ||
      filters.minAmount !== null ||
      filters.maxAmount !== null
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search expenses..."
        />
        <Pressable 
          style={[
            styles.filterButton,
            isFiltersActive() && styles.activeFilterButton
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={20} color={isFiltersActive() ? colors.white : colors.text} />
        </Pressable>
      </View>
      
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            onPress={() => router.push(`/expenses/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || isFiltersActive()
                ? 'No expenses match your search or filters'
                : 'No expenses yet. Add your first expense!'}
            </Text>
          </View>
        }
      />
      
      <Pressable
        style={styles.addButton}
        onPress={() => router.push('/expenses/new')}
      >
        <Plus size={24} color={colors.white} />
      </Pressable>
      
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
        tags={tags}
        categories={categories}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  emptyContainer: {
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
