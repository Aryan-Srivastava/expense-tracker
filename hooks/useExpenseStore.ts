import { expenses as mockExpenses } from '@/mocks/expenses';
import { Expense } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpenseById: (id: string) => Expense | undefined;
  
  // Filters
  filterByTag: (tag: string) => Expense[];
  filterByCategory: (category: string) => Expense[];
  filterByDateRange: (startDate: string, endDate: string) => Expense[];
  searchExpenses: (query: string) => Expense[];
  
  // Calculations
  getTotalExpenses: (startDate?: string, endDate?: string) => number;
  getExpensesByCategory: () => Record<string, number>;
  getExpensesByTag: () => Record<string, number>;
  getMonthlyExpenses: (month: number, year: number) => Expense[];
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: mockExpenses,
      isLoading: false,
      error: null,
      
      // Actions
      addExpense: (expense) => {
        const newExpense = {
          ...expense,
          id: Date.now().toString(),
        };
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }));
      },
      
      updateExpense: (id, updatedExpense) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedExpense } : expense
          ),
        }));
      },
      
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },
      
      getExpenseById: (id) => {
        return get().expenses.find((expense) => expense.id === id);
      },
      
      // Filters
      filterByTag: (tag) => {
        return get().expenses.filter((expense) => expense.tag === tag);
      },
      
      filterByCategory: (category) => {
        return get().expenses.filter((expense) => expense.category === category);
      },
      
      filterByDateRange: (startDate, endDate) => {
        return get().expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return expenseDate >= start && expenseDate <= end;
        });
      },
      
      searchExpenses: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().expenses.filter(
          (expense) =>
            expense.name.toLowerCase().includes(lowerQuery) ||
            expense.description.toLowerCase().includes(lowerQuery) ||
            expense.tag.toLowerCase().includes(lowerQuery) ||
            expense.category.toLowerCase().includes(lowerQuery)
        );
      },
      
      // Calculations
      getTotalExpenses: (startDate, endDate) => {
        let filteredExpenses = get().expenses;
        
        if (startDate) {
          const start = new Date(startDate);
          filteredExpenses = filteredExpenses.filter(
            (expense) => new Date(expense.date) >= start
          );
        }
        
        if (endDate) {
          const end = new Date(endDate);
          filteredExpenses = filteredExpenses.filter(
            (expense) => new Date(expense.date) <= end
          );
        }
        
        return filteredExpenses.reduce(
          (total, expense) => total + expense.amount,
          0
        );
      },
      
      getExpensesByCategory: () => {
        const categories: Record<string, number> = {};
        
        get().expenses.forEach((expense) => {
          if (categories[expense.category]) {
            categories[expense.category] += expense.amount;
          } else {
            categories[expense.category] = expense.amount;
          }
        });
        
        return categories;
      },
      
      getExpensesByTag: () => {
        const tags: Record<string, number> = {};
        
        get().expenses.forEach((expense) => {
          if (tags[expense.tag]) {
            tags[expense.tag] += expense.amount;
          } else {
            tags[expense.tag] = expense.amount;
          }
        });
        
        return tags;
      },
      
      getMonthlyExpenses: (month, year) => {
        return get().expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === month &&
            expenseDate.getFullYear() === year
          );
        });
      },
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
