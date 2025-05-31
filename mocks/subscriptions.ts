import { Subscription } from '@/types';

// Mock data for subscriptions
export const subscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    description: 'Premium plan',
    amount: 19.99,
    cycle: 'monthly',
    startDate: '2024-12-10',
    nextBillingDate: '2025-06-10',
    category: 'entertainment',
    icon: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Spotify',
    description: 'Family plan',
    amount: 14.99,
    cycle: 'monthly',
    startDate: '2025-01-15',
    nextBillingDate: '2025-06-15',
    category: 'entertainment',
    icon: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    description: 'All apps plan',
    amount: 52.99,
    cycle: 'monthly',
    startDate: '2025-02-01',
    nextBillingDate: '2025-06-01',
    category: 'productivity',
    icon: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    name: 'Amazon Prime',
    description: 'Annual subscription',
    amount: 119.00,
    cycle: 'yearly',
    startDate: '2025-03-10',
    nextBillingDate: '2026-03-10',
    category: 'shopping',
    icon: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    name: 'Gym Membership',
    description: 'Gold\'s Gym',
    amount: 49.99,
    cycle: 'monthly',
    startDate: '2025-01-05',
    nextBillingDate: '2025-06-05',
    category: 'health',
    icon: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    name: 'iCloud Storage',
    description: '200GB plan',
    amount: 2.99,
    cycle: 'monthly',
    startDate: '2024-11-20',
    nextBillingDate: '2025-06-20',
    category: 'technology',
    icon: 'https://images.unsplash.com/photo-1529661197280-63dc545366c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

// Helper function to calculate total monthly subscription cost
export const calculateMonthlySubscriptionCost = (
  subscriptionList: Subscription[]
): number => {
  return subscriptionList.reduce((total, subscription) => {
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
};

// Helper function to calculate total yearly subscription cost
export const calculateYearlySubscriptionCost = (
  subscriptionList: Subscription[]
): number => {
  return subscriptionList.reduce((total, subscription) => {
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
};

// Helper function to get subscriptions by category
export const getSubscriptionsByCategory = (
  subscriptionList: Subscription[]
): Record<string, number> => {
  const categories: Record<string, number> = {};
  
  subscriptionList.forEach(subscription => {
    const monthlyAmount = 
      subscription.cycle === 'monthly' ? subscription.amount :
      subscription.cycle === 'yearly' ? subscription.amount / 12 :
      subscription.cycle === 'weekly' ? (subscription.amount * 52) / 12 :
      subscription.cycle === 'quarterly' ? subscription.amount / 3 : 0;
    
    if (categories[subscription.category]) {
      categories[subscription.category] += monthlyAmount;
    } else {
      categories[subscription.category] = monthlyAmount;
    }
  });
  
  return categories;
};
