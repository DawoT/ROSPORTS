
import React, { useMemo } from 'react';
import { 
  Activity, Shield, Terminal, Zap, Globe, 
  Cpu, Server, Users, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle, AlertTriangle, Fingerprint, RefreshCw,
  TrendingUp, DollarSign, Package, Map as MapIcon, ShieldCheck
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

const CommandCenter: React.FC = () => {
  const { customers, products, movements, auditLogs } = useGlobal();

  const totalGMV = useMemo(() => 
    customers.reduce((acc, c) => acc + (c.purchaseHistory?.reduce((sum, h) => sum + h.total, 0) || 0), 0)
  , [customers]);

  const activeReserves = useMemo(() => 
    products.reduce((acc, p) => acc + (p.variants?.reduce((sum, v) => 
      sum + v.inventoryLevels.reduce((s, l) => s + l.reserved, 0), 0) || 0), 0)
  , [products]);

  const lastIntegrityHash = auditLogs.length > 0 ? auditLogs[0].integrityHash : 'ESTABLE';

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-500">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-blue-500/20 shadow-xl bg-surface">
               <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-content-muted">Centro de Control Global</span>
               <h2 className="font-space text-4xl font-bold text-content-primary uppercase tracking-tighter leading-none">Panel <span className="text-gradient">Maestro</span></h2>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="glass px-8 py-5 rounded-[2rem] border-content-muted/10 space-y-1 bg-surface shadow-sm">
              <p className="text-[8px] font-black text-content-muted uppercase tracking-widest">Estado de Integridad de Datos</p>
              <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-500 truncate max-w-[200px]">{lastIntegrityHash}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: 'Ingresos Totales', val: `S/ ${totalGMV.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500' },
           { label: 'Pares Reservados', val: `${activeReserves} UN`, icon: Package, color: 'text-blue-500' },
           { label: 'Tiendas Activas', val: '03 / 03', icon: Globe, color: 'text-purple-500' },
           { label: 'Disponibilidad Web', val: '99.99%', icon: Activity, color: 'text-amber-500' },
         ].map((stat, i) => (
           <div key={i} className="glass-card rounded-[2.5rem] p-8 border-content-muted/10 space-y-4 group hover:border-blue-500/20 transition-all bg-surface shadow-sm">
              <div className="flex justify-between items-start">
                 <div className={`w-12 h-12 glass rounded-2xl flex items-center justify-center ${stat.color} bg-current/5 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                 </div>
                 <span className="text-[8px] font-black text-content-muted uppercase tracking-widest">En Vivo</span>
              </div>
              <div>
                 <p className="text-[9px] font-black text-content-muted uppercase tracking-widest">{stat.label}</p>
                 <p className="text-2xl font-bold font-space text-content-primary">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 glass-card rounded-[3rem] p-12 border-content-muted/10 relative overflow-hidden flex flex-col min-h-[500px] bg-surface shadow-sm">
            <div className="absolute inset-0 technical-grid opacity-10" />
            <div className="flex justify-between items-center mb-12 relative z-10">
               <div className="flex items-center gap-4">
                  <MapIcon className="w-5 h-5 text-blue-500" />
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Distribución Geográfica de Ventas</h4>
               </div>
            </div>

            <div className="flex-1 relative z-10 flex items-center justify-center">
               <div className="w-full max-w-lg aspect-video glass rounded-[3rem] border-content-muted/10 relative overflow-hidden group bg-main/20">
                  <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                  <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-30" />
                  <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-emerald-500 rounded-full" />
                  <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-30" />
                  <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-30" />
                  <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <p className="text-[8px] font-black text-content-muted uppercase tracking-[1em] opacity-40">Actualizando Mapa de Tiendas...</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-10 bg-surface shadow-sm">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-500">
               <ShieldCheck className="w-6 h-6" />
               <h4 className="text-xl font-space font-bold uppercase text-content-primary">Seguridad de Datos</h4>
            </div>
            <div className="space-y-4">
               {auditLogs.slice(0, 5).map(log => (
                 <div key={log.id} className="p-4 glass rounded-2xl border-content-muted/10 flex gap-4 items-center bg-main/40 hover:border-emerald-500/30 transition-all">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div className="flex-1 min-w-0">
                       <p className="text-[10px] font-bold text-content-primary uppercase truncate">{log.details}</p>
                       <p className="text-[8px] font-mono text-content-muted truncate">{log.integrityHash}</p>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full py-4 glass border-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-[9px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
               VALIDAR REGISTRO DE VENTAS
            </button>
         </div>
      </div>
    </div>
  );
};

export default CommandCenter;
