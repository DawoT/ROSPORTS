
import { Product } from '../../types';
import { API } from '../apiClient';
import { SyncManager } from '../dataOrchestrator';

export const ProductRepository = {
  /**
   * Obtiene todos los productos de la fuente más fiable disponible.
   */
  getAll: async (): Promise<Product[]> => {
    // 1. Intentar Backend
    const response = await API.get<Product[]>('/products');
    if (response.status === 200 && response.data) return response.data;
    
    // 2. Fallback a local storage (Caché Enterprise)
    const cached = localStorage.getItem('rosports-v21-central-products');
    return cached ? JSON.parse(cached) : [];
  },

  /**
   * Actualiza un producto de forma optimista.
   */
  save: async (product: Product) => {
    // 1. Encolar para el backend
    SyncManager.enqueue({
      entity: 'product',
      action: 'update',
      payload: product
    });

    // 2. Retornar el producto con estado pendiente (UI Optimista)
    return { ...product, _syncStatus: 'pending' as const };
  }
};
