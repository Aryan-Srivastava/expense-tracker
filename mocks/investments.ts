import { Investment } from '@/types';

// Mock data for investments
export const investments: Investment[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    type: 'stock',
    purchasePrice: 150.75,
    currentPrice: 178.25,
    quantity: 10,
    purchaseDate: '2024-12-15',
    notes: 'Long-term investment',
  },
  {
    id: '2',
    name: 'Vanguard S&P 500 ETF',
    type: 'mutual_fund',
    purchasePrice: 380.50,
    currentPrice: 412.30,
    quantity: 5,
    purchaseDate: '2025-01-10',
  },
  {
    id: '3',
    name: 'Microsoft Corporation',
    type: 'stock',
    purchasePrice: 290.20,
    currentPrice: 275.80,
    quantity: 8,
    purchaseDate: '2025-02-05',
    notes: 'Tech sector investment',
  },
  {
    id: '4',
    name: 'Bitcoin',
    type: 'crypto',
    purchasePrice: 42000.00,
    currentPrice: 48500.00,
    quantity: 0.5,
    purchaseDate: '2025-03-20',
    notes: 'High risk investment',
  },
  {
    id: '5',
    name: 'Fidelity Growth Fund',
    type: 'mutual_fund',
    purchasePrice: 125.75,
    currentPrice: 132.40,
    quantity: 20,
    purchaseDate: '2025-01-25',
  },
];

// Helper function to calculate total investment value
export const calculateTotalInvestmentValue = (
  investmentList: Investment[]
): number => {
  return investmentList.reduce(
    (total, investment) => total + investment.currentPrice * investment.quantity,
    0
  );
};

// Helper function to calculate total investment cost
export const calculateTotalInvestmentCost = (
  investmentList: Investment[]
): number => {
  return investmentList.reduce(
    (total, investment) => total + investment.purchasePrice * investment.quantity,
    0
  );
};

// Helper function to calculate total profit/loss
export const calculateTotalProfitLoss = (
  investmentList: Investment[]
): number => {
  return calculateTotalInvestmentValue(investmentList) - calculateTotalInvestmentCost(investmentList);
};

// Helper function to calculate profit/loss percentage
export const calculateProfitLossPercentage = (
  investmentList: Investment[]
): number => {
  const cost = calculateTotalInvestmentCost(investmentList);
  const value = calculateTotalInvestmentValue(investmentList);
  
  if (cost === 0) return 0;
  
  return ((value - cost) / cost) * 100;
};

// Helper function to calculate individual investment profit/loss
export const calculateInvestmentProfitLoss = (
  investment: Investment
): number => {
  return (investment.currentPrice - investment.purchasePrice) * investment.quantity;
};

// Helper function to calculate individual investment profit/loss percentage
export const calculateInvestmentProfitLossPercentage = (
  investment: Investment
): number => {
  if (investment.purchasePrice === 0) return 0;
  
  return ((investment.currentPrice - investment.purchasePrice) / investment.purchasePrice) * 100;
};
