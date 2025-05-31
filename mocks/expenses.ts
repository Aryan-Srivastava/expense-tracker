import { Expense } from '@/types';

// Mock data for expenses
export const expenses: Expense[] = [
  {
    id: '1',
    name: 'Grocery Shopping',
    description: 'Weekly groceries from Whole Foods',
    amount: 87.45,
    date: '2025-05-20',
    tag: 'food',
    category: 'essentials',
  },
  {
    id: '2',
    name: 'Electricity Bill',
    description: 'May electricity bill',
    amount: 65.20,
    date: '2025-05-15',
    tag: 'utilities',
    category: 'bills',
  },
  {
    id: '3',
    name: 'Movie Tickets',
    description: 'Tickets for Avengers 5',
    amount: 32.50,
    date: '2025-05-18',
    tag: 'entertainment',
    category: 'leisure',
  },
  {
    id: '4',
    name: 'Dinner with Friends',
    description: 'Italian restaurant downtown',
    amount: 78.90,
    date: '2025-05-17',
    tag: 'food',
    category: 'social',
  },
  {
    id: '5',
    name: 'Uber Ride',
    description: 'From home to office',
    amount: 12.75,
    date: '2025-05-21',
    tag: 'transport',
    category: 'travel',
  },
  {
    id: '6',
    name: 'Coffee',
    description: 'Morning coffee at Starbucks',
    amount: 5.25,
    date: '2025-05-22',
    tag: 'food',
    category: 'daily',
  },
  {
    id: '7',
    name: 'Gym Membership',
    description: 'Monthly gym subscription',
    amount: 49.99,
    date: '2025-05-01',
    tag: 'health',
    category: 'subscriptions',
  },
  {
    id: '8',
    name: 'New Headphones',
    description: 'Sony WH-1000XM5',
    amount: 349.99,
    date: '2025-05-10',
    tag: 'electronics',
    category: 'shopping',
  },
];

// Helper function to calculate total expenses for a given period
export const calculateTotalExpenses = (
  expenseList: Expense[],
  startDate?: string,
  endDate?: string
): number => {
  let filteredExpenses = [...expenseList];
  
  if (startDate) {
    filteredExpenses = filteredExpenses.filter(
      expense => new Date(expense.date) >= new Date(startDate)
    );
  }
  
  if (endDate) {
    filteredExpenses = filteredExpenses.filter(
      expense => new Date(expense.date) <= new Date(endDate)
    );
  }
  
  return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
};

// Helper function to get expenses by category
export const getExpensesByCategory = (
  expenseList: Expense[]
): Record<string, number> => {
  const categories: Record<string, number> = {};
  
  expenseList.forEach(expense => {
    if (categories[expense.category]) {
      categories[expense.category] += expense.amount;
    } else {
      categories[expense.category] = expense.amount;
    }
  });
  
  return categories;
};

// Helper function to get expenses by tag
export const getExpensesByTag = (
  expenseList: Expense[]
): Record<string, number> => {
  const tags: Record<string, number> = {};
  
  expenseList.forEach(expense => {
    if (tags[expense.tag]) {
      tags[expense.tag] += expense.amount;
    } else {
      tags[expense.tag] = expense.amount;
    }
  });
  
  return tags;
};
