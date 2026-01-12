
import { Customer, PointMovement, SystemConfig } from '../types';

/**
 * ROSPORTS ATHLETE REWARDS ENGINE
 * Gestiona el ciclo de vida de los puntos de fidelidad.
 */
export const LoyaltyService = {
  
  /**
   * Calcula puntos ganados ignorando fletes.
   */
  calculateEarnedPoints: (netAmount: number, config: SystemConfig): number => {
    return Math.floor(netAmount * config.marketing.pointsPerSol);
  },

  /**
   * Valor monetario de los puntos acumulados.
   */
  getPointsValue: (points: number, config: SystemConfig): number => {
    return points * config.marketing.solPerPointRedeemed;
  },

  /**
   * Genera una entrada en el Ledger de Puntos.
   */
  createMovement: (
    type: PointMovement['type'], 
    points: number, 
    ref: string, 
    currentBalance: number
  ): PointMovement => {
    const delta = type === 'redeemed' || type === 'expired' ? -points : points;
    return {
      id: `PM-${Date.now()}`,
      date: new Date().toISOString(),
      type,
      points: Math.abs(points),
      reference: ref,
      balanceBefore: currentBalance,
      balanceAfter: currentBalance + delta
    };
  },

  /**
   * Verifica si los puntos han expirado (Simulado).
   */
  checkExpirations: (customer: Customer, config: SystemConfig): PointMovement[] => {
    const expirationLimit = new Date();
    expirationLimit.setMonth(expirationLimit.getMonth() - config.marketing.pointsExpirationMonths);
    
    // En un sistema real, buscaríamos movimientos "earned" más viejos que el límite
    // que no hayan sido "consumidos" por un "redeemed".
    return [];
  }
};
