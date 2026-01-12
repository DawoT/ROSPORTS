import { BillingData, OrderHistoryItem, PaymentItem } from '../types';

export const FiscalService = {
  generateOrderId: (type: 'BOLETA' | 'FACTURA', channel: string): string => {
    const prefix = type === 'BOLETA' ? 'B' : 'F';
    const series = channel === 'LOCAL_STORE' ? '001' : 'W01';
    const random = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, '0');
    return `${prefix}${series}-${random}`;
  },

  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  },

  validateDoc: (docType: string, docNumber: string): { valid: boolean; error?: string } => {
    if (docType === 'DNI') {
      if (!/^\d{8}$/.test(docNumber)) return { valid: false, error: 'DNI DEBE TENER 8 DÍGITOS' };
    }
    if (docType === 'RUC') {
      if (!/^\d{11}$/.test(docNumber)) return { valid: false, error: 'RUC DEBE TENER 11 DÍGITOS' };
      if (!['10', '20', '15', '17'].includes(docNumber.substring(0, 2)))
        return { valid: false, error: 'RUC INVÁLIDO (PREFIJO)' };
    }
    return { valid: true };
  },

  /**
   * Pipeline de Emisión Electrónica SUNAT
   */
  emitElectronicReceipt: async (order: OrderHistoryItem): Promise<BillingData> => {
    // 1. Generación de XML (Simulado)
    console.info(`[FISCAL] Generando XML UBL 2.1 para ${order.orderId}...`);
    await new Promise((r) => setTimeout(r, 500));

    // 2. Firma Digital (Simulado)
    const mockHash = Math.random().toString(36).substring(2, 15).toUpperCase();
    console.info(`[FISCAL] Comprobante firmado digitalmente. HASH: ${mockHash}`);
    await new Promise((r) => setTimeout(r, 400));

    // 3. Envío a OSE / SUNAT (Simulado)
    console.info(`[FISCAL] Enviando a OSE para validación...`);
    await new Promise((r) => setTimeout(r, 800));

    // 4. Envío de Email si existe
    if (order.billing.email) {
      console.info(`[FISCAL] Comprobante enviado a: ${order.billing.email}`);
    }

    return {
      ...order.billing,
      hashCPE: mockHash,
      oseStatus: 'ACCEPTED',
    };
  },

  calculateTotals: (items: { price: number; qty: number }[]) => {
    const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const subtotal = total / 1.18;
    const igv = total - subtotal;
    return { total, subtotal, igv };
  },

  getThermalTemplate: (order: OrderHistoryItem): string => {
    const line = '--------------------------------';

    const paymentsSection = order.payments
      ? order.payments
          .map((p) => {
            const label = p.method.replace('_', ' ').padEnd(16);
            const val = FiscalService.formatCurrency(p.amount).padStart(15);
            let extra = '';
            if (p.method === 'CASH' && p.receivedAmount) {
              extra = `\n  RECIBIDO: ${FiscalService.formatCurrency(p.receivedAmount).padStart(15)}\n  VUELTO:   ${FiscalService.formatCurrency(p.changeAmount || 0).padStart(15)}`;
            }
            return `${label}${val}${extra}`;
          })
          .join('\n')
      : `TOTAL PAGADO:   ${FiscalService.formatCurrency(order.total).padStart(15)}`;

    return `
      ROSPORTS S.A.C.
      RUC: 20601234567
      AV. JAVIER PRADO 1234
      ${order.billing.type} ELECTRÓNICA
      ${order.orderId}
      ${line}
      FECHA: ${new Date(order.date).toLocaleString()}
      CANAL: ${order.channel}
      VENDEDOR: ${order.sellerId}
      CLIENTE: ${order.billing.nameOrSocialReason}
      DOC: ${order.billing.docType} ${order.billing.docNumber}
      ${line}
      CANT  DESCRIPCIÓN      TOTAL
      ${order.items.map((i) => `${i.qty.toString().padEnd(5)} ${i.name.substring(0, 15).padEnd(16)} ${FiscalService.formatCurrency(i.price * i.qty).padStart(8)}`).join('\n')}
      ${line}
      SUBTOTAL:     ${FiscalService.formatCurrency(order.subtotal)}
      DESCUENTO:    ${FiscalService.formatCurrency(order.discount)}
      IGV (18%):    ${FiscalService.formatCurrency(order.tax)}
      TOTAL:        ${FiscalService.formatCurrency(order.total)}
      ${line}
      DETALLE DE PAGOS:
      ${paymentsSection}
      ${line}
      PUNTOS GANADOS: ${order.pointsEarned}
      ¡GRACIAS POR TU COMPRA!
      Representación impresa de la ${order.billing.type}
      HASH: ${order.billing.hashCPE || 'N/A'}
      Autorizado por SUNAT
    `;
  },
};
