
import { APIResponse, NetworkLog, NetworkStatus } from '../types';
import { EventBus } from './eventBusService';

class APIClient {
  private static instance: APIClient;
  private baseURL: string = '/api/v1';
  private networkLogs: NetworkLog[] = [];
  private consecutiveErrors: number = 0;
  private circuitStatus: NetworkStatus = 'ONLINE';
  private breakThreshold: number = 3;

  private constructor() {}

  public static getInstance(): APIClient {
    if (!APIClient.instance) APIClient.instance = new APIClient();
    return APIClient.instance;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: any
  ): Promise<APIResponse<T>> {
    if (this.circuitStatus === 'CIRCUIT_OPEN') {
      console.warn("[CIRCUIT_BREAKER] Request blocked to prevent cascade failure.");
      return { data: null, status: 503, message: "CIRCUIT_BREAKER_OPEN", traceId: "ERR", timestamp: new Date().toISOString() };
    }

    const start = performance.now();
    const traceId = `TR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    try {
      // Inyección de Token Simulada (Enterprise Security)
      const token = localStorage.getItem('rosports-jwt');
      if (token) {
         console.debug(`[AUTH] Attaching Bearer: ${token.substring(0, 10)}...`);
      }

      const latency = Math.floor(Math.random() * 500) + 50;
      await new Promise(r => setTimeout(r, latency));

      // Simulación de error aleatorio para probar resiliencia (1% de probabilidad)
      if (Math.random() < 0.01) throw new Error("UPSTREAM_TIMEOUT");

      this.consecutiveErrors = 0;
      const duration = performance.now() - start;
      this.logNetwork(method, endpoint, duration, 200, "0.4KB");

      return { data: null, status: 200, message: "OK", traceId, timestamp: new Date().toISOString() };
    } catch (err: any) {
      this.consecutiveErrors++;
      if (this.consecutiveErrors >= this.breakThreshold) {
        this.circuitStatus = 'CIRCUIT_OPEN';
        EventBus.publish('MODULE_FAILURE', { moduleId: 'GATEWAY', error: 'Circuit Open' }, 'APIClient');
        setTimeout(() => { this.circuitStatus = 'ONLINE'; this.consecutiveErrors = 0; }, 10000);
      }

      const duration = performance.now() - start;
      this.logNetwork(method, endpoint, duration, 500, "0KB");
      return { data: null, status: 500, message: err.message, traceId, timestamp: new Date().toISOString() };
    }
  }

  private logNetwork(method: NetworkLog['method'], endpoint: string, duration: number, status: number, size: string) {
    const log: NetworkLog = {
      id: `NET-${Date.now()}`,
      method,
      endpoint,
      duration: Math.round(duration),
      status,
      timestamp: new Date().toISOString(),
      size
    };
    this.networkLogs = [log, ...this.networkLogs].slice(0, 50);
  }

  public getNetworkLogs() { return this.networkLogs; }
  public getStatus() { return this.circuitStatus; }

  public async get<T>(endpoint: string) { return this.request<T>('GET', endpoint); }
  public async post<T>(endpoint: string, body: any) { return this.request<T>('POST', endpoint, body); }
}

export const API = APIClient.getInstance();
