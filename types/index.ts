// Common types used throughout the app

// Expense type
export interface Expense {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: string;
  tag: string;
  category: string;
}

// Group type
export interface Group {
  id: string;
  name: string;
  members: Member[];
  expenses: GroupExpense[];
  createdAt: string;
  updatedAt: string;
}

// Group member
export interface Member {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

// Group expense
export interface GroupExpense {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: string;
  paidBy: string; // Member ID
  splitBetween: SplitMember[];
  settled: boolean;
}

// Split member
export interface SplitMember {
  memberId: string;
  amount: number;
  settled: boolean;
}

// Investment
export interface Investment {
  id: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'crypto' | 'other';
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  purchaseDate: string;
  notes?: string;
}

// Subscription
export interface Subscription {
  id: string;
  name: string;
  description?: string;
  amount: number;
  cycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
  startDate: string;
  nextBillingDate: string;
  category: string;
  icon?: string;
}

// User settings
export interface UserSettings {
  monthlyExpenseLimit: number;
  currency: string;
  reminderFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}

// Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'reminder' | 'due' | 'system' | 'investment';
  relatedId?: string; // ID of related expense, group, etc.
}
