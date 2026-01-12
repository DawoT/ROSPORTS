import React, { useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Zap,
  Cpu,
  Target,
  Globe,
  RefreshCw,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { ReportingService } from '../services/reportingService';

const PerformanceAnalytics: React.FC = () => {
  const { customers, products } = useGlobal();

  const kpis = useMemo(() => ReportingService.getExecutiveKPIs(customers), [customers]);
  const valuation = useMemo(() => ReportingService.getInventoryValuation(products), [products]);

  const salesData = [1200, 1900, 1500, 2800, 2400, 3100, 2900];
  const maxVal = Math.max(...salesData);

  const stats = [
    {
      label: 'Ventas del Día',
      val: `S/ ${kpis.todayGMV.toFixed(2)}`,
      delta: '+12.5%',
      type: 'up',
      icon: DollarSign,
      color: 'text-emerald-500',
    },
    {
      label: 'Ticket Promedio',
      val: `S/ ${kpis.avgTicket.toFixed(2)}`,
      delta: '+2.1%',
      type: 'up',
      icon: Target,
      color: 'text-blue-500',
    },
    {
      label: 'Atletas Registrados',
      val: customers.length,
      delta: `+${kpis.newCustomersThisMonth}`,
      type: 'up',
      icon: Users,
      color: 'text-purple-500',
    },
    {
      label: 'Valorización Stock',
      val: `S/ ${(valuation / 1000).toFixed(1)}K`,
      delta: 'Global',
      type: 'info',
      icon: Package,
      color: 'text-amber-500',
    },
  ];

  return (
    <div className='space-y-12 pb-20 animate-in fade-in duration-700'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-3 text-blue-500'>
            <Activity className='w-5 h-5' />
            <span className='text-[10px] font-black uppercase tracking-[0.6em]'>
              Executive Performance Node
            </span>
          </div>
          <h2 className='text-4xl font-space font-bold text-content-primary uppercase tracking-tighter leading-none'>
            Global <span className='text-gradient'>KPIs</span>
          </h2>
        </div>
        <div className='hidden md:flex gap-4'>
          <div className='glass px-6 py-3 rounded-2xl border-content-muted/10 flex items-center gap-3 bg-surface/50'>
            <Calendar className='w-4 h-4 text-content-muted' />
            <span className='text-[10px] font-black uppercase text-content-secondary tracking-widest'>
              Periodo: Mayo 2025
            </span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((s, i) => (
          <div
            key={i}
            className='glass-card rounded-[2.5rem] p-8 border border-content-muted/10 space-y-4 hover:border-blue-500/30 transition-all group bg-surface shadow-sm'
          >
            <div className='flex justify-between items-start'>
              <div
                className={`w-12 h-12 glass rounded-2xl flex items-center justify-center ${s.color} bg-current/5 group-hover:scale-110 transition-transform`}
              >
                <s.icon className='w-6 h-6' />
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-black ${s.type === 'up' ? 'text-emerald-500' : s.type === 'info' ? 'text-blue-500' : 'text-red-500'}`}
              >
                {s.type === 'up' && <ArrowUpRight className='w-3 h-3' />}
                {s.delta}
              </div>
            </div>
            <div>
              <p className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
                {s.label}
              </p>
              <p className='text-2xl font-bold font-space text-content-primary'>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <div className='lg:col-span-2 glass-card rounded-[3rem] p-12 border-content-muted/10 relative overflow-hidden flex flex-col min-h-[500px] bg-surface shadow-sm'>
          <div className='absolute inset-0 technical-grid opacity-10' />
          <div className='flex justify-between items-center relative z-10'>
            <div className='space-y-1'>
              <h3 className='text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]'>
                Evolución Transaccional
              </h3>
              <p className='text-2xl font-space font-bold text-content-primary uppercase'>
                Revenue Mayo 2025
              </p>
            </div>
            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-blue-600 rounded-full' />
                <span className='text-[8px] font-black text-content-muted uppercase'>
                  Ingresos Reales
                </span>
              </div>
            </div>
          </div>

          <div className='flex-1 h-64 w-full relative z-10 flex items-end justify-between px-4 mt-12'>
            {salesData.map((val, i) => (
              <div key={i} className='flex flex-col items-center gap-4 w-12 group'>
                <div className='relative w-full h-full flex flex-col justify-end'>
                  <div
                    className='w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-xl transition-all duration-1000 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                    style={{ height: `${(val / maxVal) * 100}%` }}
                  />
                  <div className='absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white px-2 py-1 rounded text-[8px] font-black'>
                    S/ {val}
                  </div>
                </div>
                <span className='text-[8px] font-black text-content-muted uppercase'>
                  D-{6 - i}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-6'>
          <div className='glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-8 flex flex-col bg-surface shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className='p-3 glass rounded-xl text-emerald-500 bg-emerald-500/5'>
                <ShoppingBag className='w-5 h-5' />
              </div>
              <h4 className='text-[10px] font-black text-content-primary uppercase tracking-[0.3em]'>
                Top Performers Hoy
              </h4>
            </div>
            <div className='space-y-6'>
              {products.slice(0, 3).map((p) => (
                <div key={p.id} className='flex items-center justify-between group'>
                  <div className='flex items-center gap-4'>
                    <img
                      src={p.image}
                      className='w-10 h-10 object-contain p-1 glass rounded-lg'
                      alt=''
                    />
                    <div>
                      <p className='text-[10px] font-bold text-content-primary uppercase truncate w-32'>
                        {p.name}
                      </p>
                      <p className='text-[8px] font-black text-content-muted uppercase'>
                        12 Unidades
                      </p>
                    </div>
                  </div>
                  <span className='text-[10px] font-black text-emerald-500'>+18%</span>
                </div>
              ))}
            </div>
          </div>

          <div className='glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-8 flex flex-col bg-surface shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className='p-3 glass rounded-xl text-blue-500 bg-blue-500/5'>
                <Globe className='w-5 h-5' />
              </div>
              <h4 className='text-[10px] font-black text-content-primary uppercase tracking-[0.3em]'>
                Mix por Canal
              </h4>
            </div>
            <div className='space-y-6'>
              {[
                { label: 'E-Commerce', val: '64%', color: 'bg-blue-600' },
                { label: 'Retail Store', val: '36%', color: 'bg-emerald-600' },
              ].map((c) => (
                <div key={c.label} className='space-y-2'>
                  <div className='flex justify-between text-[9px] font-black uppercase'>
                    <span className='text-content-muted'>{c.label}</span>
                    <span className='text-content-primary'>{c.val}</span>
                  </div>
                  <div className='h-1.5 w-full bg-content-muted/10 rounded-full overflow-hidden'>
                    <div className={`h-full ${c.color}`} style={{ width: c.val }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
