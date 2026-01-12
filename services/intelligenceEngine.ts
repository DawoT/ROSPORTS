import { Product, User, AthleteBiometrics } from '../types';

export const IntelligenceEngine = {
  /**
   * Calcula el estado de degradación del equipo basado en Km y tiempo.
   */
  calculateGearDegradation: (kmUsed: number, maxKm: number): number => {
    return Math.min(100, (kmUsed / maxKm) * 100);
  },

  /**
   * Sugiere el calzado ideal basado en biometría.
   */
  recommendByBiometrics: (biometrics: AthleteBiometrics, catalog: Product[]): Product[] => {
    return catalog
      .filter((p) => {
        if (biometrics.gaitType === 'pronator' && p.tractionScore > 9) return true;
        if (biometrics.weeklyVolumeKm > 50 && p.cushioningLevel === 'Plush') return true;
        return false;
      })
      .slice(0, 3);
  },

  /**
   * Motor de Precios Dinámicos (Yield Management)
   * Ajusta precios basándose en la velocidad de venta (simulado).
   */
  calculateDynamicPrice: (basePrice: number, demandVelocity: number): number => {
    // Si la velocidad es > 0.8 (alta demanda), subir 5%
    if (demandVelocity > 0.8) return basePrice * 1.05;
    // Si la velocidad es < 0.2 (baja demanda), bajar 10% (Oferta Automática)
    if (demandVelocity < 0.2) return basePrice * 0.9;
    return basePrice;
  },
};
