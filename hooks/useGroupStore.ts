import { groups as mockGroups } from '@/mocks/groups';
import { Group, GroupExpense, Member } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface GroupState {
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  
  // Group actions
  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGroup: (id: string, group: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  getGroupById: (id: string) => Group | undefined;
  
  // Member actions
  addMember: (groupId: string, member: Omit<Member, 'id'>) => void;
  removeMember: (groupId: string, memberId: string) => void;
  
  // Expense actions
  addExpense: (
    groupId: string,
    expense: Omit<GroupExpense, 'id' | 'settled'>
  ) => void;
  updateExpense: (
    groupId: string,
    expenseId: string,
    expense: Partial<GroupExpense>
  ) => void;
  deleteExpense: (groupId: string, expenseId: string) => void;
  settleExpense: (
    groupId: string,
    expenseId: string,
    memberId: string
  ) => void;
  
  // Calculations
  getTotalOwed: (userId: string) => number;
  getTotalOwes: (userId: string) => number;
  getGroupBalance: (groupId: string, userId: string) => number;
}

export const useGroupStore = create<GroupState>()(
  persist(
    (set, get) => ({
      groups: mockGroups,
      isLoading: false,
      error: null,
      
      // Group actions
      addGroup: (group) => {
        const newGroup = {
          ...group,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          groups: [...state.groups, newGroup],
        }));
      },
      
      updateGroup: (id, updatedGroup) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id
              ? {
                  ...group,
                  ...updatedGroup,
                  updatedAt: new Date().toISOString(),
                }
              : group
          ),
        }));
      },
      
      deleteGroup: (id) => {
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
        }));
      },
      
      getGroupById: (id) => {
        return get().groups.find((group) => group.id === id);
      },
      
      // Member actions
      addMember: (groupId, member) => {
        const newMember = {
          ...member,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  members: [...group.members, newMember],
                  updatedAt: new Date().toISOString(),
                }
              : group
          ),
        }));
      },
      
      removeMember: (groupId, memberId) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  members: group.members.filter(
                    (member) => member.id !== memberId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : group
          ),
        }));
      },
      
      // Expense actions
      addExpense: (groupId, expense) => {
        const newExpense = {
          ...expense,
          id: Date.now().toString(),
          settled: false,
        };
        
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  expenses: [...group.expenses, newExpense],
                  updatedAt: new Date().toISOString(),
                }
              : group
          ),
        }));
      },
      
      updateExpense: (groupId, expenseId, updatedExpense) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  expenses: group.expenses.map((expense) =>
                    expense.id === expenseId
                      ? { ...expense, ...updatedExpense }
                      : expense
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : group
          ),
        }));
      },
      
      deleteExpense: (groupId, expenseId) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  expenses: group.expenses.filter(
                    (expense) => expense.id !== expenseId
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : group
          ),
        }));
      },
      
      settleExpense: (groupId, expenseId, memberId) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  expenses: group.expenses.map((expense) =>
                    expense.id === expenseId
                      ? {
                          ...expense,
                          splitBetween: expense.splitBetween.map((split) =>
                            split.memberId === memberId
                              ? { ...split, settled: true }
                              : split
                          ),
                          settled: expense.splitBetween
                            .filter((split) => split.memberId !== memberId)
                            .every((split) => split.settled),
                        }
                      : expense
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : group
          ),
        }));
      },
      
      // Calculations
      getTotalOwed: (userId) => {
        let totalOwed = 0;
        
        get().groups.forEach((group) => {
          group.expenses.forEach((expense) => {
            if (expense.paidBy === userId) {
              expense.splitBetween.forEach((split) => {
                if (split.memberId !== userId && !split.settled) {
                  totalOwed += split.amount;
                }
              });
            }
          });
        });
        
        return totalOwed;
      },
      
      getTotalOwes: (userId) => {
        let totalOwes = 0;
        
        get().groups.forEach((group) => {
          group.expenses.forEach((expense) => {
            if (expense.paidBy !== userId) {
              expense.splitBetween.forEach((split) => {
                if (split.memberId === userId && !split.settled) {
                  totalOwes += split.amount;
                }
              });
            }
          });
        });
        
        return totalOwes;
      },
      
      getGroupBalance: (groupId, userId) => {
        const group = get().getGroupById(groupId);
        if (!group) return 0;
        
        let balance = 0;
        
        group.expenses.forEach((expense) => {
          if (expense.paidBy === userId) {
            expense.splitBetween.forEach((split) => {
              if (split.memberId !== userId && !split.settled) {
                balance += split.amount;
              }
            });
          } else {
            expense.splitBetween.forEach((split) => {
              if (split.memberId === userId && !split.settled) {
                balance -= split.amount;
              }
            });
          }
        });
        
        return balance;
      },
    }),
    {
      name: 'group-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
