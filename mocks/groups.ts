import { Group } from '@/types';

// Mock data for groups
export const groups: Group[] = [
  {
    id: '1',
    name: 'Roommates',
    members: [
      { id: 'user1', name: 'You', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
      { id: 'user2', name: 'Alex', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
      { id: 'user3', name: 'Jamie', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    ],
    expenses: [
      {
        id: 'g1e1',
        name: 'Rent',
        description: 'May rent payment',
        amount: 1800,
        date: '2025-05-01',
        paidBy: 'user1',
        splitBetween: [
          { memberId: 'user1', amount: 600, settled: true },
          { memberId: 'user2', amount: 600, settled: false },
          { memberId: 'user3', amount: 600, settled: true },
        ],
        settled: false,
      },
      {
        id: 'g1e2',
        name: 'Groceries',
        description: 'Weekly grocery run',
        amount: 120,
        date: '2025-05-15',
        paidBy: 'user2',
        splitBetween: [
          { memberId: 'user1', amount: 40, settled: true },
          { memberId: 'user2', amount: 40, settled: true },
          { memberId: 'user3', amount: 40, settled: false },
        ],
        settled: false,
      },
    ],
    createdAt: '2025-01-01',
    updatedAt: '2025-05-15',
  },
  {
    id: '2',
    name: 'Trip to Hawaii',
    members: [
      { id: 'user1', name: 'You', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
      { id: 'user4', name: 'Taylor', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
      { id: 'user5', name: 'Jordan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
      { id: 'user6', name: 'Morgan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    ],
    expenses: [
      {
        id: 'g2e1',
        name: 'Airbnb',
        description: 'Beach house for 5 nights',
        amount: 1250,
        date: '2025-06-01',
        paidBy: 'user1',
        splitBetween: [
          { memberId: 'user1', amount: 312.5, settled: true },
          { memberId: 'user4', amount: 312.5, settled: false },
          { memberId: 'user5', amount: 312.5, settled: true },
          { memberId: 'user6', amount: 312.5, settled: false },
        ],
        settled: false,
      },
      {
        id: 'g2e2',
        name: 'Car Rental',
        description: 'SUV for the week',
        amount: 420,
        date: '2025-06-02',
        paidBy: 'user5',
        splitBetween: [
          { memberId: 'user1', amount: 105, settled: false },
          { memberId: 'user4', amount: 105, settled: false },
          { memberId: 'user5', amount: 105, settled: true },
          { memberId: 'user6', amount: 105, settled: false },
        ],
        settled: false,
      },
    ],
    createdAt: '2025-04-15',
    updatedAt: '2025-05-20',
  },
];

// Helper function to calculate total owed to a user
export const calculateOwedToUser = (
  groupList: Group[],
  userId: string
): number => {
  let totalOwed = 0;
  
  groupList.forEach(group => {
    group.expenses.forEach(expense => {
      if (expense.paidBy === userId) {
        expense.splitBetween.forEach(split => {
          if (split.memberId !== userId && !split.settled) {
            totalOwed += split.amount;
          }
        });
      }
    });
  });
  
  return totalOwed;
};

// Helper function to calculate total user owes to others
export const calculateUserOwes = (
  groupList: Group[],
  userId: string
): number => {
  let totalOwes = 0;
  
  groupList.forEach(group => {
    group.expenses.forEach(expense => {
      if (expense.paidBy !== userId) {
        expense.splitBetween.forEach(split => {
          if (split.memberId === userId && !split.settled) {
            totalOwes += split.amount;
          }
        });
      }
    });
  });
  
  return totalOwes;
};
