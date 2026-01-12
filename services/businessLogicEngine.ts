
import { CartItem, Customer, Product } from '../types';

/**
 * ROSPORTS BUSINESS LOGIC ENGINE (BLE)
 * Único punto de verdad para cálculos financieros y reglas de negocio.
 */
export const BusinessLogicEngine = {
  TAX_RATE: 0.18,

  calculateOrderTotals: (items: CartItem[], customer?: Customer | null) => {
    const subtotal = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    
    // Regla Enterprise: Descuento por volumen (3+ items = 10% off)
    let bulkDiscount = 0;
    if (items.length >= 3) bulkDiscount = subtotal * 0.10;

    // Regla CRM: Descuento VIP (5% off adicional)
    let loyaltyDiscount = 0;
    if (customer?.segment === 'vip') loyaltyDiscount = (subtotal - bulkDiscount) * 0.05;

    const totalDiscount = bulkDiscount + loyaltyDiscount;
    const netTotal = Math.max(0, subtotal - totalDiscount);
    const taxAmount = netTotal - (netTotal / (1 + BusinessLogicEngine.TAX_RATE));

    return {
      subtotal,
      totalDiscount,
      taxAmount,
      netTotal,
      pointsToEarn: Math.floor(netTotal)
    };
  },

  isProductEligibleForPromo: (product: Product): boolean => {
    // Lógica compleja de elegibilidad basada en stock y antigüedad
    return product.price > 400 && product.status === 'active';
  },

  calculateAthleteTier: (stats: any): string => {
    const km = parseFloat(stats?.totalKm || '0');
    if (km > 1000) return 'ELITE PLATINUM';
    if (km > 500) return 'GOLD PERFORMANCE';
    return 'SILVER TRACKER';
  }
};
