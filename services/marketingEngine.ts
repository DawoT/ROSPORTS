import { Campaign, CartItem, SaleChannel } from '../types';

/**
 * ROSPORTS OMNICHANNEL MARKETING ENGINE
 * Orquesta la validación y aplicación de beneficios dinámicos.
 */
export const MarketingEngine = {
  /**
   * Evalúa todas las campañas automáticas y selecciona la configuración óptima.
   */
  evaluateAutomaticCampaigns: (
    items: CartItem[],
    campaigns: Campaign[],
    channel: SaleChannel,
  ): { discount: number; appliedCampaigns: Campaign[] } => {
    const now = new Date();

    // 1. Filtrado de elegibilidad técnica
    const eligible = campaigns
      .filter(
        (c) =>
          c.status === 'active' &&
          c.isAutomatic &&
          c.channels.includes(channel) &&
          new Date(c.startsAt) <= now &&
          new Date(c.endsAt) >= now &&
          c.usageCount < c.maxGlobalUsage,
      )
      .sort((a, b) => b.priority - a.priority);

    let totalDiscount = 0;
    const applied: Campaign[] = [];

    // 2. Aplicación de lógica por prioridad
    for (const camp of eligible) {
      const discount = MarketingEngine.calculateDiscountForCampaign(items, camp);

      if (discount > 0) {
        totalDiscount += discount;
        applied.push(camp);

        // Si no es combinable, nos quedamos con el de mayor prioridad que aplicó
        if (!camp.canCombine) break;
      }
    }

    return { discount: totalDiscount, appliedCampaigns: applied };
  },

  /**
   * Calcula el ahorro bruto para una campaña específica.
   */
  calculateDiscountForCampaign: (items: CartItem[], camp: Campaign): number => {
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    if (camp.minPurchaseAmount && subtotal < camp.minPurchaseAmount) return 0;

    switch (camp.type) {
      case 'percentage':
        return subtotal * (camp.discountValue / 100);

      case 'fixed':
        return camp.discountValue;

      case 'category':
        return items
          .filter((i) => i.category === camp.targetCategory)
          .reduce((acc, i) => acc + i.price * i.quantity * (camp.discountValue / 100), 0);

      case 'brand':
        return items
          .filter((i) => i.brand === camp.targetBrand)
          .reduce((acc, i) => acc + i.price * i.quantity * (camp.discountValue / 100), 0);

      case 'bogo':
        // Lógica 2x1 o 3x2 (El producto de menor valor es el descuento)
        const relevantItems = items.flatMap((item) => Array(item.quantity).fill(item.price));
        if (camp.discountValue === 2 && relevantItems.length >= 2) {
          // 2x1
          const sorted = relevantItems.sort((a, b) => a - b);
          return sorted[0];
        }
        if (camp.discountValue === 3 && relevantItems.length >= 3) {
          // 3x2
          const sorted = relevantItems.sort((a, b) => a - b);
          return sorted[0];
        }
        return 0;

      default:
        return 0;
    }
  },

  /**
   * Verifica un cupón manual ingresado por el atleta.
   */
  verifyCouponCode: (
    code: string,
    campaigns: Campaign[],
    items: CartItem[],
  ): { valid: boolean; discount: number; campaign?: Campaign; error?: string } => {
    const camp = campaigns.find(
      (c) => c.code?.toUpperCase() === code.toUpperCase() && c.status === 'active',
    );

    if (!camp) return { valid: false, discount: 0, error: 'CÓDIGO NO VÁLIDO O EXPIRADO' };

    const discount = MarketingEngine.calculateDiscountForCampaign(items, camp);
    if (discount === 0)
      return { valid: false, discount: 0, error: 'NO SE CUMPLEN CONDICIONES DE MÍNIMO' };

    return { valid: true, discount, campaign: camp };
  },
};
