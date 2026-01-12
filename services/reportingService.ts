
import { OrderHistoryItem, Product, Customer } from '../types';

export const ReportingService = {
  /**
   * Calcula KPIs principales para el dashboard ejecutivo.
   */
  getExecutiveKPIs: (customers: Customer[]) => {
    const allOrders = customers.flatMap(c => c.purchaseHistory || []);
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const todaySales = allOrders.filter(o => o.date.startsWith(today) && o.status !== 'voided');
    const monthSales = allOrders.filter(o => {
      const d = new Date(o.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear && o.status !== 'voided';
    });

    const totalRevenue = monthSales.reduce((acc, o) => acc + o.total, 0);
    const avgTicket = monthSales.length > 0 ? totalRevenue / monthSales.length : 0;

    return {
      todayGMV: todaySales.reduce((acc, o) => acc + o.total, 0),
      todayCount: todaySales.length,
      monthGMV: totalRevenue,
      monthCount: monthSales.length,
      avgTicket,
      newCustomersThisMonth: customers.filter(c => {
        const d = new Date(c.registrationDate);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      }).length
    };
  },

  /**
   * Calcula la valorización total del inventario.
   */
  getInventoryValuation: (products: Product[]) => {
    return products.reduce((acc, p) => {
      const cost = p.cost || p.price * 0.6; // Fallback si no hay costo registrado
      const qty = p.variants?.reduce((vAcc, v) => 
        vAcc + v.inventoryLevels.reduce((lAcc, l) => lAcc + l.quantity, 0), 0) || 0;
      return acc + (qty * cost);
    }, 0);
  },

  /**
   * Analiza productos críticos (Agotados o Bajo Stock)
   */
  getCriticalStock: (products: Product[]) => {
    return products.flatMap(p => 
      p.variants?.flatMap(v => 
        v.inventoryLevels
          .filter(l => (l.quantity - l.reserved) <= l.minStock)
          .map(l => ({
            sku: v.sku,
            name: p.name,
            node: l.nodeId,
            available: l.quantity - l.reserved,
            min: l.minStock,
            status: l.quantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK'
          }))
      ) || []
    ).filter(Boolean);
  },

  exportToCSV: (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${val}"`).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
