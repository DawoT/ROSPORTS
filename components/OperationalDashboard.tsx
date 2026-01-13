import React, { useMemo, useState, useEffect } from 'react';
import {
  Shield,
  Terminal,
  Server,
  RefreshCw,
  Globe,
  ArrowUpRight,
  Wifi,
  Database,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { API } from '../services/apiClient';

const OperationalDashboard: React.FC = () => {
  const { user } = useGlobal();
  const [latency, setLatency] = useState(12);
  const [logs, setLogs] = useState(API.getNetworkLogs());

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency((prev) => Math.max(8, Math.min(45, prev + (Math.random() > 0.5 ? 2 : -2))));
      setLogs(API.getNetworkLogs());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='space-y-10 animate-in fade-in duration-700 pb-20'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-blue-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-blue-500/20 shadow-xl bg-surface'>
              <Shield className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] text-content-muted'>
                Estado del Sistema Rosports
              </span>
              <h2 className='font-space text-4xl font-bold text-content-primary uppercase tracking-tighter'>
                Monitoreo <span className='text-gradient'>de Tienda</span>
              </h2>
            </div>
          </div>
        </div>

        <div className='flex gap-4'>
          <div className='glass px-8 py-5 rounded-[2rem] border-content-muted/10 flex items-center gap-4 bg-surface shadow-sm'>
            <div className='flex flex-col text-right'>
              <p className='text-[8px] font-black text-content-muted uppercase tracking-widest'>
                Velocidad de Respuesta
              </p>
              <p
                className={`text-xl font-space font-bold ${latency > 30 ? 'text-amber-500' : 'text-emerald-500'}`}
              >
                {latency}ms
              </p>
            </div>
            <RefreshCw
              className={`w-5 h-5 text-content-muted ${latency > 8 ? 'animate-spin' : ''}`}
            />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {[
          { label: 'Visitas en Vivo', val: '1,242 Atletas', icon: Wifi, color: 'text-blue-500' },
          { label: 'Tiempo en Línea', val: '99.98%', icon: Globe, color: 'text-emerald-500' },
          {
            label: 'Locales Conectados',
            val: '03 Activos',
            icon: Server,
            color: 'text-purple-500',
          },
          { label: 'Sincronización', val: 'Al día', icon: Database, color: 'text-amber-500' },
        ].map((s, i) => (
          <div
            key={i}
            className='glass-card rounded-[2rem] p-8 border-content-muted/10 space-y-4 bg-surface'
          >
            <div className='flex justify-between items-start'>
              <div className={`p-3 glass rounded-xl ${s.color} bg-current/5`}>
                <s.icon className='w-5 h-5' />
              </div>
              <ArrowUpRight className='w-4 h-4 text-content-muted' />
            </div>
            <div>
              <p className='text-[10px] font-black text-content-muted uppercase tracking-widest'>
                {s.label}
              </p>
              <p className='text-2xl font-bold font-space text-content-primary'>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <div className='lg:col-span-2 glass-card rounded-[3rem] p-10 border-content-muted/10 relative overflow-hidden flex flex-col min-h-[500px] bg-surface shadow-sm'>
          <div className='absolute inset-0 technical-grid opacity-10' />
          <div className='flex items-center justify-between mb-8 relative z-10'>
            <div className='flex items-center gap-4'>
              <Terminal className='w-5 h-5 text-blue-600 dark:text-emerald-500' />
              <h4 className='text-[10px] font-black text-blue-600 dark:text-emerald-500 uppercase tracking-[0.4em]'>
                Registro de Actividad Web
              </h4>
            </div>
            <div className='flex gap-2'>
              <span className='text-[8px] font-black text-emerald-500 uppercase px-2 py-0.5 glass rounded-full border-emerald-500/20'>
                Conexión Segura
              </span>
            </div>
          </div>

          <div className='flex-1 font-mono text-[11px] space-y-4 relative z-10 bg-main/80 backdrop-blur-md p-8 rounded-2xl border border-content-muted/10 overflow-y-auto custom-scrollbar shadow-inner'>
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className='flex gap-6 animate-in slide-in-from-left-4 border-b border-content-muted/5 pb-2'
                >
                  <span className='text-content-muted/60'>
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span
                    className={`font-black w-12 ${log.status === 200 ? 'text-emerald-500' : 'text-red-500'}`}
                  >
                    {log.method}
                  </span>
                  <span className='text-content-secondary flex-1 truncate'>
                    {log.endpoint.replace('/api/v1', '/tienda')}
                  </span>
                  <span className='text-blue-500 font-bold'>{log.duration}ms</span>
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center h-full opacity-30 text-[10px] font-black uppercase tracking-widest'>
                Esperando actividad de clientes...
              </div>
            )}
          </div>
        </div>

        <div className='space-y-6'>
          <h4 className='text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] px-4'>
            Estado de Sucursales
          </h4>
          {['BOUTIQUE SAN ISIDRO', 'CONCEPT SURCO', 'TIENDA ONLINE'].map((node) => (
            <div
              key={node}
              className='glass-card rounded-[2.5rem] p-8 border-content-muted/10 flex items-center justify-between group hover:border-blue-500/30 transition-all bg-surface shadow-sm'
            >
              <div className='flex items-center gap-5'>
                <div className='w-12 h-12 glass rounded-2xl border-content-muted/10 flex items-center justify-center text-blue-500 bg-main'>
                  <Server className='w-6 h-6' />
                </div>
                <div>
                  <p className='text-xs font-bold text-content-primary uppercase'>{node}</p>
                  <p className='text-[8px] font-black text-content-muted uppercase tracking-widest'>
                    Ventas habilitadas
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse' />
                <span className='text-[10px] font-bold text-emerald-500 uppercase'>En Línea</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperationalDashboard;
