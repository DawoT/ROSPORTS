import { CartItem, BillingData } from '../types';

export const TAX_RATE = 0.18; // IGV Perú

export interface PriceBreakdown {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  pointsEarned: number;
}

export const SalesEngine = {
  calculateBreakdown: (
    items: CartItem[],
    couponDiscount: number = 0,
    loyaltyDiscount: number = 0,
  ): PriceBreakdown => {
    const rawSubtotal = items.reduce((acc, item) => {
      const price = item.price - (item.manualDiscount || 0);
      return acc + price * item.quantity;
    }, 0);

    // Lógica de Promoción Automática: "Elite Bundle"
    // Si llevas 3 o más productos, 10% de descuento adicional al subtotal
    let promoDiscount = 0;
    const totalQty = items.reduce((acc, i) => acc + i.quantity, 0);
    if (totalQty >= 3) {
      promoDiscount = rawSubtotal * 0.1;
    }

    const totalDiscount = couponDiscount + loyaltyDiscount + promoDiscount;
    const finalTotal = Math.max(0, rawSubtotal - totalDiscount);

    // En Perú el precio ya incluye IGV, por lo que desglosamos:
    const subtotalBase = finalTotal / (1 + TAX_RATE);
    const taxAmount = finalTotal - subtotalBase;

    return {
      subtotal: subtotalBase,
      tax: taxAmount,
      discount: totalDiscount,
      total: finalTotal,
      pointsEarned: Math.floor(finalTotal),
    };
  },

  validateCoupon: (code: string): number => {
    const validCoupons: Record<string, number> = {
      ROPOS2025: 50,
      NEON10: 10, // 10% logic can be added
      ELITE_PASS: 100,
    };
    return validCoupons[code.toUpperCase()] || 0;
  },
};
