
import { AppEvent, AppEventType } from '../types';

type EventHandler = (event: AppEvent) => void;

class EventBusService {
  private subscribers: Map<AppEventType, Set<EventHandler>> = new Map();

  /**
   * Suscribe un handler a un tipo de evento específico.
   */
  subscribe(type: AppEventType, handler: EventHandler) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)?.add(handler);
    return () => this.subscribers.get(type)?.delete(handler);
  }

  /**
   * Despacha un evento a todos los suscriptores interesados.
   */
  publish(type: AppEventType, payload: any, source: string = 'system') {
    const event: AppEvent = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      source
    };
    
    console.debug(`[EVENT_BUS] Publishing: ${type}`, event);
    this.subscribers.get(type)?.forEach(handler => handler(event));
  }
}

export const EventBus = new EventBusService();
