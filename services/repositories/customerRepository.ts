
import { Customer } from '../../types';
import { API } from '../apiClient';
import { SyncManager } from '../dataOrchestrator';

export const CustomerRepository = {
  getAll: async (): Promise<Customer[]> => {
    const res = await API.get<Customer[]>('/customers');
    if (res.status === 200 && res.data) return res.data;
    const cached = localStorage.getItem('rosports-v21-customers');
    return cached ? JSON.parse(cached) : [];
  },

  save: async (customer: Customer) => {
    SyncManager.enqueue({
      entity: 'customer',
      action: customer.id.includes('new') ? 'create' : 'update',
      payload: customer
    });
    return { ...customer, _syncStatus: 'pending' as const };
  }
};
