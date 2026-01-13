import { CashDenomination, CashSession } from '../types';

export const PERU_DENOMINATIONS: CashDenomination[] = [
  { value: 200, label: 'S/ 200', count: 0 },
  { value: 100, label: 'S/ 100', count: 0 },
  { value: 50, label: 'S/ 50', count: 0 },
  { value: 20, label: 'S/ 20', count: 0 },
  { value: 10, label: 'S/ 10', count: 0 },
  { value: 5, label: 'S/ 5', count: 0 },
  { value: 2, label: 'S/ 2', count: 0 },
  { value: 1, label: 'S/ 1', count: 0 },
  { value: 0.5, label: 'S/ 0.50', count: 0 },
  { value: 0.2, label: 'S/ 0.20', count: 0 },
  { value: 0.1, label: 'S/ 0.10', count: 0 },
];

export const CashService = {
  calculateTotal: (denominations: CashDenomination[]): number => {
    return denominations.reduce((acc, d) => acc + d.value * (d.count || 0), 0);
  },

  /**
   * Calcula el efectivo que DEBERÍA haber basado en apertura, ventas y flujos manuales.
   */
  calculateExpectedCash: (session: CashSession): number => {
    const netMovements = session.movements.reduce(
      (acc, m) => (m.type === 'income' ? acc + m.amount : acc - m.amount),
      0,
    );
    return session.openingBalance + (session.systemExpected?.cash || 0) + netMovements;
  },

  /**
   * Valida si un movimiento es viable (ej: no retirar más de lo que hay en efectivo).
   */
  validateWithdrawal: (
    session: CashSession,
    amount: number,
  ): { valid: boolean; error?: string } => {
    const currentEstimated = CashService.calculateExpectedCash(session);
    if (amount > currentEstimated) {
      return { valid: false, error: 'SALDO INSUFICIENTE EN EFECTIVO' };
    }
    return { valid: true };
  },

  generateIntegrityHash: (session: Partial<CashSession>): string => {
    const data = JSON.stringify({
      id: session.id,
      node: session.nodeId,
      op: session.userName,
      start: session.startTime,
      openBal: session.openingBalance,
    });
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data.charCodeAt(i);
      hash |= 0;
    }
    return 'CERT-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  },
};
