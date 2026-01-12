
import { Command, CommandResult } from '../types';

type CommandHandler = (cmd: Command) => Promise<string[]>;

class CommandBusService {
  private handlers: Map<string, CommandHandler> = new Map();

  /**
   * Registra un handler para un tipo de comando específico.
   */
  register(type: string, handler: CommandHandler) {
    this.handlers.set(type, handler);
  }

  /**
   * Ejecuta un comando atómico enviándolo al handler correspondiente.
   */
  async execute(cmd: Command): Promise<CommandResult> {
    const handler = this.handlers.get(cmd.type);
    const transactionId = `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    console.debug(`[COMMAND_BUS] Dispatching ${cmd.type}:${cmd.entityId}`, cmd);

    if (!handler) {
      return { 
        success: false, 
        transactionId, 
        timestamp: new Date().toISOString(), 
        effects: [], 
        error: `No handler registered for type: ${cmd.type}` 
      };
    }

    try {
      const effects = await handler(cmd);
      return { success: true, transactionId, timestamp: new Date().toISOString(), effects };
    } catch (err: any) {
      return { 
        success: false, 
        transactionId, 
        timestamp: new Date().toISOString(), 
        effects: [], 
        error: err.message || "Execution fault" 
      };
    }
  }
}

export const CommandBus = new CommandBusService();
