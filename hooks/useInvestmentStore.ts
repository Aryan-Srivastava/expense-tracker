import { investments as mockInvestments } from '@/mocks/investments';
import { Investment } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface InvestmentState {
  investments: Investment[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  getInvestmentById: (id: string) => Investment | undefined;
  
  // Calculations
  getTotalInvestmentValue: () => number;
  getTotalInvestmentCost: () => number;
  getTotalProfitLoss: () => number;
  getProfitLossPercentage: () => number;
  getInvestmentProfitLoss: (id: string) => number;
  getInvestmentProfitLossPercentage: (id: string) => number;
  
  // Filters
  filterByType: (type: Investment['type']) => Investment[];
  getInvestmentsByProfitability: (profitable: boolean) => Investment[];
}

export const useInvestmentStore = create<InvestmentState>()(
  persist(
    (set, get) => ({
      investments: mockInvestments,
      isLoading: false,
      error: null,
      
      // Actions
      addInvestment: (investment) => {
        const newInvestment = {
          ...investment,
          id: Date.now().toString(),
        };
        set((state) => ({
          investments: [...state.investments, newInvestment],
        }));
      },
      
      updateInvestment: (id, updatedInvestment) => {
        set((state) => ({
          investments: state.investments.map((investment) =>
            investment.id === id
              ? { ...investment, ...updatedInvestment }
              : investment
          ),
        }));
      },
      
      deleteInvestment: (id) => {
        set((state) => ({
          investments: state.investments.filter(
            (investment) => investment.id !== id
          ),
        }));
      },
      
      getInvestmentById: (id) => {
        return get().investments.find((investment) => investment.id === id);
      },
      
      // Calculations
      getTotalInvestmentValue: () => {
        return get().investments.reduce(
          (total, investment) =>
            total + investment.currentPrice * investment.quantity,
          0
        );
      },
      
      getTotalInvestmentCost: () => {
        return get().investments.reduce(
          (total, investment) =>
            total + investment.purchasePrice * investment.quantity,
          0
        );
      },
      
      getTotalProfitLoss: () => {
        return get().getTotalInvestmentValue() - get().getTotalInvestmentCost();
      },
      
      getProfitLossPercentage: () => {
        const cost = get().getTotalInvestmentCost();
        const value = get().getTotalInvestmentValue();
        
        if (cost === 0) return 0;
        
        return ((value - cost) / cost) * 100;
      },
      
      getInvestmentProfitLoss: (id) => {
        const investment = get().getInvestmentById(id);
        if (!investment) return 0;
        
        return (
          (investment.currentPrice - investment.purchasePrice) *
          investment.quantity
        );
      },
      
      getInvestmentProfitLossPercentage: (id) => {
        const investment = get().getInvestmentById(id);
        if (!investment || investment.purchasePrice === 0) return 0;
        
        return (
          ((investment.currentPrice - investment.purchasePrice) /
            investment.purchasePrice) *
          100
        );
      },
      
      // Filters
      filterByType: (type) => {
        return get().investments.filter((investment) => investment.type === type);
      },
      
      getInvestmentsByProfitability: (profitable) => {
        return get().investments.filter((investment) => {
          const profitLoss =
            (investment.currentPrice - investment.purchasePrice) *
            investment.quantity;
          return profitable ? profitLoss > 0 : profitLoss <= 0;
        });
      },
    }),
    {
      name: 'investment-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
