import { CartItem, Customer, Campaign, SaleChannel } from '../types';
import { MarketingEngine } from './marketingEngine';

export interface PriceSummary {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  pointsEarned: number;
  appliedCampaigns: string[];
  breakdown: {
    base: number;
    campaignDiscount: number;
    loyaltyDiscount: number;
    manualDiscount: number;
    rounding: number;
  };
}

export const PricingEngine = {
  TAX_RATE: 0.18,

  calculate: (
    items: CartItem[],
    customer: Customer | null,
    campaigns: Campaign[],
    channel: SaleChannel,
    pointsToRedeem: number = 0,
    solPerPoint: number = 0.1,
  ): PriceSummary => {
    // 1. Cálculo Base Bruto
    const baseAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // 2. Evaluación de Campañas Automáticas
    const { discount: campaignDiscount, appliedCampaigns } =
      MarketingEngine.evaluateAutomaticCampaigns(items, campaigns, channel);

    // 3. Descuentos Manuales (Nivel de Item en POS)
    const manualDiscounts = items.reduce(
      (acc, item) => acc + (item.manualDiscount || 0) * item.quantity,
      0,
    );

    // 4. Beneficios CRM (VIP = 5% adicional después de campañas)
    let tierDiscount = 0;
    if (customer?.segment === 'vip') {
      tierDiscount = (baseAmount - manualDiscounts - campaignDiscount) * 0.05;
    }

    // 5. Redención de Puntos Athlete
    const loyaltyValue = pointsToRedeem * solPerPoint;
    const maxLoyalty = Math.max(0, baseAmount - campaignDiscount - manualDiscounts - tierDiscount);
    const actualLoyaltyDiscount = Math.min(loyaltyValue, maxLoyalty);

    const totalDiscount = campaignDiscount + tierDiscount + actualLoyaltyDiscount + manualDiscounts;

    // 6. Rounding comercial y desgloses
    const rawTotal = Math.max(0, baseAmount - totalDiscount);
    const finalTotal = Math.round(rawTotal * 10) / 10;
    const roundingDiff = finalTotal - rawTotal;

    const subtotal = finalTotal / (1 + PricingEngine.TAX_RATE);
    const tax = finalTotal - subtotal;

    return {
      subtotal,
      tax,
      discount: totalDiscount,
      total: finalTotal,
      pointsEarned: Math.floor(finalTotal), // 1 punto por sol neto
      appliedCampaigns: appliedCampaigns.map((c) => c.name),
      breakdown: {
        base: baseAmount,
        campaignDiscount,
        loyaltyDiscount: tierDiscount + actualLoyaltyDiscount,
        manualDiscount: manualDiscounts,
        rounding: roundingDiff,
      },
    };
  },
};
