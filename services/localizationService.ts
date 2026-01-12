const DICTIONARY = {
  es: {
    system: {
      syncing: 'Actualizando catálogo de temporada...',
      secure_gateway: 'CONEXIÓN SEGURA // ROSPORTS',
      terminal_locked: 'SESIÓN PROTEGIDA',
      integrity_verified: 'PRODUCTO 100% ORIGINAL',
    },
    inventory: {
      control_hub: 'Centro de Logística',
      distributed_stock: 'Stock en Tiendas',
      low_stock_alert: '¡Últimos pares disponibles!',
      replenish_action: 'Solicitar reingreso de talla',
    },
    pos: {
      terminal_title: 'Caja Rosports',
      finalize_sale: 'Proceder al pago',
      issue_receipt: 'Emitir Comprobante',
    },
    auth: {
      access_denied: 'Acceso Restringido: Inicia sesión para continuar',
      request_access: 'Crear mi cuenta Exclusive',
    },
  },
};

export const LocalizationService = {
  t: (path: string, lang: 'es' = 'es'): string => {
    const keys = path.split('.');
    let result: any = DICTIONARY[lang];
    for (const key of keys) {
      if (result && result[key]) result = result[key];
      else return path;
    }
    return result;
  },
};
