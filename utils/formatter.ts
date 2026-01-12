export const TechnicalFormatter = {
  price: (amount: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  },

  date: (dateStr: string): string => {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  },

  weight: (w: string): string => {
    return w.toUpperCase().includes('G') ? w : `${w}G`;
  },

  sku: (sku: string): string => {
    return sku.toUpperCase().replace(/\s+/g, '_');
  },
};
