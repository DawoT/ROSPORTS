
import { SyncJob, DatabaseHealth } from '../types';
import { API } from './apiClient';
import { EventBus } from './eventBusService';

class DataOrchestrator {
  private static instance: DataOrchestrator;
  private syncQueue: SyncJob[] = [];
  private health: DatabaseHealth = {
    localChanges: 0,
    lastGlobalSync: new Date().toISOString(),
    integrityScore: 100,
    status: 'SYNCHRONIZED'
  };

  private constructor() {
    this.syncQueue = JSON.parse(localStorage.getItem('rosports-sync-queue') || '[]');
  }

  public static getInstance(): DataOrchestrator {
    if (!DataOrchestrator.instance) DataOrchestrator.instance = new DataOrchestrator();
    return DataOrchestrator.instance;
  }

  /**
   * Encola un cambio para ser sincronizado.
   */
  public enqueue(job: Omit<SyncJob, 'id' | 'timestamp' | 'retries'>) {
    const newJob: SyncJob = {
      ...job,
      id: `JOB-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      retries: 0
    };
    this.syncQueue.push(newJob);
    this.health.localChanges = this.syncQueue.length;
    this.health.status = 'PENDING_PUSH';
    this.saveQueue();
    this.processQueue();
  }

  private async processQueue() {
    if (this.syncQueue.length === 0) return;

    const job = this.syncQueue[0];
    try {
      const response = await API.post(`/sync/${job.entity}/${job.action}`, job.payload);
      
      if (response.status === 200) {
        this.syncQueue.shift();
        this.health.localChanges = this.syncQueue.length;
        if (this.syncQueue.length === 0) {
          this.health.status = 'SYNCHRONIZED';
          this.health.lastGlobalSync = new Date().toISOString();
        }
        this.saveQueue();
        EventBus.publish('DATA_SYNC_SUCCESS', { jobId: job.id }, 'DataOrchestrator');
        this.processQueue(); // Procesar el siguiente
      }
    } catch (err) {
      console.warn(`[SYNC_FAILURE] Job ${job.id} failed. Retrying later...`);
      job.retries += 1;
      this.health.status = 'PENDING_PUSH'; // O 'CONFLICT' si retries > 5
      this.saveQueue();
    }
  }

  private saveQueue() {
    localStorage.setItem('rosports-sync-queue', JSON.stringify(this.syncQueue));
  }

  public getHealth(): DatabaseHealth {
    return this.health;
  }

  /**
   * Forzar una descarga masiva de datos (Full Rehydration)
   */
  public async forceRehydrate() {
    console.debug("[DATA_ORCHESTRATOR] Initializing Node Rehydration...");
    const products = await API.get('/catalog/full');
    const customers = await API.get('/crm/full');
    return { products: products.data, customers: customers.data };
  }
}

export const SyncManager = DataOrchestrator.getInstance();
