import { BillingType } from '../types';

export const FinanceService = {
  EXCHANGE_RATE: 3.75, // PEN per USD

  calculateTaxes: (total: number, _billingType: BillingType) => {
    // En Perú el IGV es 18% incluido en el PVP
    const base = total / 1.18;
    const tax = total - base;
    return { base, tax, total };
  },

  convertToUSD: (penAmount: number) => {
    return penAmount / FinanceService.EXCHANGE_RATE;
  },

  formatCurrency: (amount: number, currency: 'PEN' | 'USD' = 'PEN') => {
    return new Intl.NumberFormat(currency === 'PEN' ? 'es-PE' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  calculateProfitability: (price: number, cost: number) => {
    if (!cost) return 0;
    const profit = price - cost;
    return (profit / price) * 100;
  },
};
