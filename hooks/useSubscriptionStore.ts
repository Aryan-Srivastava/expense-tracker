import { subscriptions as mockSubscriptions } from '@/mocks/subscriptions';
import { Subscription } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SubscriptionState {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  getSubscriptionById: (id: string) => Subscription | undefined;
  
  // Calculations
  getMonthlyTotal: () => number;
  getYearlyTotal: () => number;
  getSubscriptionsByCategory: () => Record<string, number>;
  getUpcomingSubscriptions: (days: number) => Subscription[];
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: mockSubscriptions,
      isLoading: false,
      error: null,
      
      // Actions
      addSubscription: (subscription) => {
        const newSubscription = {
          ...subscription,
          id: Date.now().toString(),
        };
        set((state) => ({
          subscriptions: [...state.subscriptions, newSubscription],
        }));
      },
      
      updateSubscription: (id, updatedSubscription) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((subscription) =>
            subscription.id === id
              ? { ...subscription, ...updatedSubscription }
              : subscription
          ),
        }));
      },
      
      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter(
            (subscription) => subscription.id !== id
          ),
        }));
      },
      
      getSubscriptionById: (id) => {
        return get().subscriptions.find((subscription) => subscription.id === id);
      },
      
      // Calculations
      getMonthlyTotal: () => {
        return get().subscriptions.reduce((total, subscription) => {
          if (subscription.cycle === 'monthly') {
            return total + subscription.amount;
          } else if (subscription.cycle === 'yearly') {
            return total + subscription.amount / 12;
          } else if (subscription.cycle === 'weekly') {
            return total + (subscription.amount * 52) / 12;
          } else if (subscription.cycle === 'quarterly') {
            return total + subscription.amount / 3;
          }
          return total;
        }, 0);
      },
      
      getYearlyTotal: () => {
        return get().subscriptions.reduce((total, subscription) => {
          if (subscription.cycle === 'monthly') {
            return total + subscription.amount * 12;
          } else if (subscription.cycle === 'yearly') {
            return total + subscription.amount;
          } else if (subscription.cycle === 'weekly') {
            return total + subscription.amount * 52;
          } else if (subscription.cycle === 'quarterly') {
            return total + subscription.amount * 4;
          }
          return total;
        }, 0);
      },
      
      getSubscriptionsByCategory: () => {
        const categories: Record<string, number> = {};
        
        get().subscriptions.forEach((subscription) => {
          const monthlyAmount =
            subscription.cycle === 'monthly'
              ? subscription.amount
              : subscription.cycle === 'yearly'
              ? subscription.amount / 12
              : subscription.cycle === 'weekly'
              ? (subscription.amount * 52) / 12
              : subscription.cycle === 'quarterly'
              ? subscription.amount / 3
              : 0;
          
          if (categories[subscription.category]) {
            categories[subscription.category] += monthlyAmount;
          } else {
            categories[subscription.category] = monthlyAmount;
          }
        });
        
        return categories;
      },
      
      getUpcomingSubscriptions: (days) => {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        
        return get().subscriptions.filter((subscription) => {
          const nextBillingDate = new Date(subscription.nextBillingDate);
          return nextBillingDate >= today && nextBillingDate <= futureDate;
        });
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
