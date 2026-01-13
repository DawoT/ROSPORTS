import { StockLevel } from '../types';

export type StockTransition =
  | 'RESERVE'
  | 'RELEASE'
  | 'FINALIZE_SALE'
  | 'ENTRY'
  | 'EXIT'
  | 'TRANSFER_OUT'
  | 'TRANSFER_IN'
  | 'WASTE'
  | 'RETURN';

export const InventoryService = {
  /**
   * Procesa una transición de stock asegurando consistencia.
   */
  applyTransition: (
    currentLevel: StockLevel,
    qty: number,
    transition: StockTransition,
  ): StockLevel => {
    const updated = { ...currentLevel };

    switch (transition) {
      case 'RESERVE':
        if (updated.quantity - updated.reserved < qty) throw new Error('INSUFFICIENT_STOCK');
        updated.reserved += qty;
        break;

      case 'RELEASE':
        updated.reserved = Math.max(0, updated.reserved - qty);
        break;

      case 'FINALIZE_SALE':
        updated.quantity -= qty;
        updated.reserved = Math.max(0, updated.reserved - qty);
        break;

      case 'ENTRY':
      case 'RETURN':
      case 'TRANSFER_IN':
        updated.quantity += qty;
        break;

      case 'EXIT':
      case 'WASTE':
      case 'TRANSFER_OUT':
        updated.quantity = Math.max(0, updated.quantity - qty);
        break;
    }

    return updated;
  },

  /**
   * Valida si un nodo tiene capacidad operativa.
   */
  checkHealth: (level: StockLevel): 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL' => {
    const available = level.quantity - level.reserved;
    if (available <= level.minStock * 0.5) return 'CRITICAL';
    if (available <= level.minStock) return 'LOW_STOCK';
    return 'OPTIMAL';
  },

  /**
   * Calcula el ajuste necesario entre el stock en sistema y el conteo físico.
   * Utilizado por el componente de conciliación de inventario.
   */
  createStockAdjustment: (current: number, actual: number) => {
    const diff = actual - current;
    if (diff === 0) return { adjustmentType: 'none', diff: 0 };
    return {
      adjustmentType: diff > 0 ? 'entry' : 'exit',
      diff: Math.abs(diff),
    };
  },
};
