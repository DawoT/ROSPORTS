
import React, { useState, useMemo } from 'react';
import { 
  Truck, Package, ArrowRight, Clock, Plus, 
  Search, Filter, CheckCircle, AlertCircle, FileText,
  TrendingUp, Ship, Navigation, Zap
} from 'lucide-react';
import { PurchaseOrder } from '../types';
import { FinanceService } from '../services/financeService';

const SupplyChainManager: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    { id: 'PO-2025-001', provider: 'NIKE GLOBAL DISTRIBUTION', status: 'in_transit', expectedDate: '2025-06-15', totalCost: 12500, currency: 'USD', items: [] },
    { id: 'PO-2025-002', provider: 'ADIDAS PERU S.A.C', status: 'ordered', expectedDate: '2025-06-20', totalCost: 8400, currency: 'PEN', items: [] },
  ]);

  const [query, setQuery] = useState('');

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-emerald-500">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-emerald-500/20 shadow-xl">
               <Ship className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-60 text-slate-500">Global Inbound Logistics</span>
               <h2 className="font-space text-4xl font-bold dark:text-white uppercase tracking-tighter">Supply <span className="text-emerald-500">Chain</span></h2>
            </div>
          </div>
        </div>
        <button className="px-10 py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-emerald-500 transition-all flex items-center gap-3">
           <Plus className="w-4 h-4" /> GENERAR ORDEN COMPRA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 space-y-8">
            <div className="glass p-6 rounded-[2.5rem] border-white/5 flex gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="BUSCAR PO POR ID, PROVEEDOR O PRODUCTO..." className="w-full pl-14 pr-8 py-5 bg-black/40 rounded-2xl outline-none text-xs font-bold text-white uppercase tracking-widest border border-white/5 focus:border-emerald-500/50" value={query} onChange={e => setQuery(e.target.value)} />
               </div>
            </div>

            <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden">
               <table className="w-full text-left text-[11px]">
                  <thead>
                     <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-8 py-6 font-black text-slate-500 uppercase">Orden de Compra</th>
                        <th className="px-8 py-6 font-black text-slate-500 uppercase">Proveedor Maestro</th>
                        <th className="px-8 py-6 font-black text-slate-500 uppercase text-center">Inversión</th>
                        <th className="px-8 py-6 font-black text-slate-500 uppercase text-center">Status</th>
                        <th className="px-8 py-6 font-black text-slate-500 uppercase text-right">ETA</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {orders.map(o => (
                       <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                             <div className="flex flex-col">
                                <span className="font-bold text-white uppercase">{o.id}</span>
                                <span className="text-[9px] font-mono text-emerald-500 tracking-tighter">PROTOCOLO_INBOUND_X2</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 font-bold text-slate-400 uppercase tracking-tight">{o.provider}</td>
                          <td className="px-8 py-6 text-center font-bold text-white">
                             {FinanceService.formatCurrency(o.totalCost, o.currency)}
                          </td>
                          <td className="px-8 py-6 text-center">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                               o.status === 'in_transit' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5'
                             }`}>
                                {o.status.replace('_', ' ')}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex flex-col items-end">
                                <span className="text-white font-bold">{o.expectedDate}</span>
                                <span className="text-[9px] text-slate-500 font-mono">DÍAS RESTANTES: 12</span>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <aside className="space-y-8">
            <div className="glass-card rounded-[3rem] p-10 border-white/5 space-y-8 bg-gradient-to-br from-emerald-500/[0.03] to-transparent">
               <div className="flex items-center gap-3 text-emerald-500">
                  <TrendingUp className="w-6 h-6" />
                  <h4 className="text-xl font-space font-bold uppercase">Pipeline Metrics</h4>
               </div>
               <div className="space-y-6">
                  <div className="p-5 glass rounded-2xl border-white/5 flex justify-between items-center">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">En Tránsito</span>
                     <span className="text-lg font-bold text-white">S/ 46,875.00</span>
                  </div>
                  <div className="p-5 glass rounded-2xl border-white/5 flex justify-between items-center">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Órdenes Abiertas</span>
                     <span className="text-lg font-bold text-emerald-500">02</span>
                  </div>
               </div>
               <div className="pt-6 border-t border-white/5 text-center">
                  <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] animate-pulse">Synchronizing Global Hub...</p>
               </div>
            </div>

            <div className="p-10 glass rounded-[3rem] border-white/5 space-y-6">
               <div className="flex items-center gap-3 text-blue-500">
                  <Navigation className="w-5 h-5" />
                  <h5 className="text-[10px] font-black uppercase tracking-widest">Live Node Tracking</h5>
               </div>
               <div className="relative h-24 glass rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 technical-grid opacity-20" />
                  <div className="absolute top-1/2 left-10 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <div className="absolute top-1/2 left-10 w-2 h-2 bg-emerald-500 rounded-full" />
                  <div className="absolute top-1/2 left-10 right-10 h-[1px] bg-white/10" />
                  <div className="absolute top-1/2 right-10 w-2 h-2 bg-slate-800 rounded-full" />
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default SupplyChainManager;
