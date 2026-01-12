import { ModuleHealth, HealthStatus } from '../types';
import { EventBus } from './eventBusService';

class SystemMonitorService {
  private modules: Map<string, ModuleHealth> = new Map();

  constructor() {
    this.initModules();
  }

  private initModules() {
    const defaultModules = [
      { id: 'AUTH_GATEWAY', label: 'Auth Gateway', status: 'NOMINAL', latency: 12, errors: 0 },
      { id: 'INV_NODE', label: 'Inventory Master', status: 'NOMINAL', latency: 45, errors: 0 },
      { id: 'FISCAL_CORE', label: 'Fiscal Engine', status: 'NOMINAL', latency: 28, errors: 0 },
      { id: 'CRM_CLOUD', label: 'CRM Cloud Sync', status: 'NOMINAL', latency: 110, errors: 0 },
    ];
    defaultModules.forEach((m) =>
      this.modules.set(m.id, { ...m, lastSync: new Date().toISOString() } as ModuleHealth),
    );
  }

  getHealthReport(): ModuleHealth[] {
    return Array.from(this.modules.values());
  }

  recordError(moduleId: string, error: string) {
    const mod = this.modules.get(moduleId);
    if (mod) {
      mod.errors += 1;
      mod.status = mod.errors > 5 ? 'CRITICAL' : 'DEGRADED';
      this.modules.set(moduleId, { ...mod });
      EventBus.publish('MODULE_FAILURE', { moduleId, error, status: mod.status }, 'SystemMonitor');
    }
  }

  ping(moduleId: string, latency: number) {
    const mod = this.modules.get(moduleId);
    if (mod) {
      mod.latency = latency;
      mod.lastSync = new Date().toISOString();
      this.modules.set(moduleId, { ...mod });
    }
  }

  getOverallStatus(): HealthStatus {
    const statuses = Array.from(this.modules.values()).map((m) => m.status);
    if (statuses.includes('CRITICAL')) return 'CRITICAL';
    if (statuses.includes('DEGRADED')) return 'DEGRADED';
    return 'NOMINAL';
  }
}

export const SystemMonitor = new SystemMonitorService();
