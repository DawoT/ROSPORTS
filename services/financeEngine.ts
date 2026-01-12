/**
 * ROSPORTS FINANCE ENGINE V3.0
 * Garantiza integridad monetaria en el Ledger Global.
 */
export const FinanceEngine = {
  TAX_RATE: 0.18, // IGV Perú
  EXCHANGE_RATE: 3.78, // PEN to USD

  /**
   * Redondeo Bancario (Round Half to Even) para evitar sesgos estadísticos.
   */
  preciseRound: (num: number, decimals: number = 2): number => {
    const m = Math.pow(10, decimals);
    const n = +(decimals ? num * m : num).toFixed(8);
    const i = Math.floor(n),
      f = n - i;
    const e = 1e-8;
    const r = f > 0.5 - e && f < 0.5 + e ? (i % 2 === 0 ? i : i + 1) : Math.round(n);
    return decimals ? r / m : r;
  },

  formatCurrency: (amount: number, currency: 'PEN' | 'USD' = 'PEN') => {
    return new Intl.NumberFormat(currency === 'PEN' ? 'es-PE' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  calculateTaxes: (total: number) => {
    const subtotal = total / (1 + FinanceEngine.TAX_RATE);
    const tax = total - subtotal;
    return {
      subtotal: FinanceEngine.preciseRound(subtotal),
      tax: FinanceEngine.preciseRound(tax),
      total: FinanceEngine.preciseRound(total),
    };
  },

  convert: (amount: number, to: 'USD' | 'PEN') => {
    return to === 'USD'
      ? amount / FinanceEngine.EXCHANGE_RATE
      : amount * FinanceEngine.EXCHANGE_RATE;
  },
};
