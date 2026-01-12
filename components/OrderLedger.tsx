import React, { useMemo, useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  ArrowUpRight,
  Download,
  Globe,
  Store,
  Instagram,
  MessageCircle,
  TrendingUp,
  Calendar,
  Hash,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  ShieldCheck,
  Printer,
  Mail,
  Clock,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { OrderHistoryItem, SaleChannel } from '../types';
import OrderHistoryDetails from './OrderHistoryDetails';
import OrderVoidModal from './OrderVoidModal';

const OrderLedger: React.FC = () => {
  const { customers } = useGlobal();
  const [filterChannel, setFilterChannel] = useState<SaleChannel | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);
  const [voidingOrder, setVoidingOrder] = useState<OrderHistoryItem | null>(null);

  const allOrders = useMemo(() => {
    const orders: (OrderHistoryItem & { customerName: string })[] = [];
    customers.forEach((c) => {
      c.purchaseHistory?.forEach((h) => {
        orders.push({ ...h, customerName: c.fullName });
      });
    });
    return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [customers]);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      const matchesChannel = filterChannel === 'ALL' || o.channel === filterChannel;
      const matchesSearch =
        o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChannel && matchesSearch;
    });
  }, [allOrders, filterChannel, searchQuery]);

  const totalRevenue = filteredOrders
    .filter((o) => o.status !== 'voided')
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className='space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-6 md:gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-blue-500'>
            <div className='w-10 h-10 md:w-12 md:h-12 glass rounded-2xl flex items-center justify-center border-blue-500/20 shadow-xl'>
              <FileSpreadsheet className='w-5 h-5 md:w-6 md:h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[8px] md:text-[9px] font-black uppercase tracking-[0.5em] text-content-muted'>
                Tax Transaction Ledger
              </span>
              <h2 className='font-space text-2xl md:text-4xl font-bold text-content-primary uppercase tracking-tighter'>
                Libro de <span className='text-gradient'>Ventas</span>
              </h2>
            </div>
          </div>
        </div>

        <div className='flex gap-4'>
          <div className='flex-1 md:flex-none glass px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-[2rem] border-content-muted/10 space-y-1 bg-surface'>
            <p className='text-[7px] md:text-[8px] font-black text-content-muted uppercase tracking-widest'>
              Revenue Neto
            </p>
            <p className='text-lg md:text-2xl font-space font-bold text-content-primary'>
              S/ {totalRevenue.toLocaleString()}
            </p>
          </div>
          <button className='p-4 md:p-5 glass border-content-muted/10 rounded-2xl hover:bg-blue-600 transition-all text-blue-500 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm'>
            <Download className='w-5 h-5' />
          </button>
        </div>
      </div>

      <div className='glass p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border-content-muted/10 flex flex-col md:flex-row gap-4 md:gap-6 bg-surface'>
        <div className='flex-1 relative'>
          <Search className='absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted' />
          <input
            type='text'
            placeholder='BUSCAR ORDEN O CLIENTE...'
            className='w-full pl-14 pr-8 py-4 md:py-5 glass bg-main/40 rounded-xl md:rounded-2xl outline-none text-[10px] md:text-xs font-bold text-content-primary uppercase tracking-widest border border-content-muted/10 focus:border-blue-500'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='flex gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0'>
          {['ALL', 'WEB', 'LOCAL_STORE', 'WHATSAPP'].map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch as any)}
              className={`px-6 md:px-8 py-3 md:py-5 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all shrink-0 min-h-[44px] ${filterChannel === ch ? 'bg-blue-600 text-white shadow-lg' : 'glass border-content-muted/10 text-content-muted hover:text-content-primary hover:bg-main'}`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className='hidden lg:block glass-card rounded-[3rem] border-content-muted/10 overflow-hidden bg-surface'>
        <table className='w-full text-left'>
          <thead>
            <tr className='bg-content-muted/[0.03] border-b border-content-muted/10'>
              <th className='px-8 py-6 text-[9px] font-black text-content-muted uppercase'>
                Timestamp / Status
              </th>
              <th className='px-8 py-6 text-[9px] font-black text-content-muted uppercase'>
                Documento / Nodo
              </th>
              <th className='px-8 py-6 text-[9px] font-black text-content-muted uppercase text-center'>
                Desglose Fiscal
              </th>
              <th className='px-8 py-6 text-[9px] font-black text-content-muted uppercase text-right'>
                Total Neto
              </th>
              <th className='px-8 py-6 text-right'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-content-muted/10'>
            {filteredOrders.map((o) => (
              <tr
                key={o.orderId}
                className={`hover:bg-content-muted/[0.02] transition-colors group ${o.status === 'voided' ? 'opacity-40 grayscale bg-red-500/[0.02]' : ''}`}
              >
                <td className='px-8 py-6'>
                  <div className='flex items-center gap-4'>
                    <div className='flex flex-col'>
                      <span className='text-xs font-bold text-content-primary'>
                        {new Date(o.date).toLocaleDateString()}
                      </span>
                      <span className='text-[9px] font-mono text-content-muted uppercase'>
                        {new Date(o.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                        o.status === 'voided'
                          ? 'border-red-500 text-red-600 dark:text-red-400 bg-red-500/10'
                          : 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                      }`}
                    >
                      {o.status}
                    </div>
                  </div>
                </td>
                <td className='px-8 py-6'>
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 glass border-content-muted/10 rounded-xl flex items-center justify-center text-blue-500 bg-surface'>
                      {o.channel === 'WEB' ? (
                        <Globe className='w-5 h-5' />
                      ) : (
                        <Store className='w-5 h-5' />
                      )}
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-xs font-mono font-bold text-blue-600 dark:text-blue-500'>
                        {o.orderId}
                      </span>
                      <span className='text-[8px] font-black text-content-muted uppercase tracking-widest'>
                        {o.customerName}
                      </span>
                    </div>
                  </div>
                </td>
                <td className='px-8 py-6 text-center'>
                  <div className='flex flex-col gap-1'>
                    <span className='text-[10px] text-content-secondary font-bold'>
                      Base: S/ {o.subtotal.toFixed(2)}
                    </span>
                    <span className='text-[9px] font-black text-blue-600 dark:text-blue-500 tracking-widest uppercase'>
                      IGV 18%: S/ {o.tax.toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className='px-8 py-6 text-right'>
                  <span className='text-xl font-space font-bold text-content-primary leading-none'>
                    S/ {o.total.toFixed(2)}
                  </span>
                </td>
                <td className='px-8 py-6 text-right'>
                  <div className='flex justify-end gap-3'>
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className='p-3 glass rounded-xl border-content-muted/10 text-content-muted hover:text-blue-500 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm'
                    >
                      <Eye className='w-4 h-4' />
                    </button>
                    {o.status !== 'voided' && (
                      <button
                        onClick={() => setVoidingOrder(o)}
                        className='p-3 glass rounded-xl border-content-muted/10 text-content-muted hover:text-red-500 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm'
                      >
                        <XCircle className='w-4 h-4' />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stack View */}
      <div className='lg:hidden space-y-4'>
        {filteredOrders.map((o) => (
          <div
            key={o.orderId}
            className={`p-6 rounded-2xl glass border border-content-muted/10 space-y-6 bg-surface ${o.status === 'voided' ? 'opacity-50 grayscale' : ''}`}
          >
            <div className='flex justify-between items-start'>
              <div className='space-y-1'>
                <p className='text-[10px] font-mono font-bold text-blue-600 dark:text-blue-500'>
                  {o.orderId}
                </p>
                <p className='text-xs font-bold text-content-primary uppercase'>{o.customerName}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                  o.status === 'voided'
                    ? 'border-red-500 text-red-600'
                    : 'border-emerald-500 text-emerald-600'
                }`}
              >
                {o.status}
              </span>
            </div>

            <div className='grid grid-cols-2 gap-4 pt-4 border-t border-content-muted/10'>
              <div className='flex items-center gap-3'>
                <Clock className='w-4 h-4 text-content-muted' />
                <div>
                  <p className='text-[7px] font-black text-content-muted uppercase'>Timestamp</p>
                  <p className='text-[9px] font-bold text-content-primary'>
                    {new Date(o.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-[7px] font-black text-content-muted uppercase'>Total Neto</p>
                <p className='text-xl font-space font-bold text-content-primary'>
                  S/ {o.total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className='flex gap-3 pt-2'>
              <button
                onClick={() => setSelectedOrder(o)}
                className='flex-1 py-4 glass border-content-muted/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all min-h-[44px]'
              >
                VER DETALLES
              </button>
              {o.status !== 'voided' && (
                <button
                  onClick={() => setVoidingOrder(o)}
                  className='p-4 glass border-content-muted/10 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all min-h-[44px] min-w-[44px] flex items-center justify-center'
                >
                  <XCircle className='w-5 h-5' />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <OrderHistoryDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
      {voidingOrder && (
        <OrderVoidModal
          order={voidingOrder}
          onClose={() => setVoidingOrder(null)}
          onSuccess={() => setVoidingOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderLedger;
