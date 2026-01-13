import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Ship,
  TrendingUp,
  AlertCircle,
  Mail,
  Star,
} from 'lucide-react';
import { Vendor } from '../types';

const VendorPortal: React.FC = () => {
  const { vendors, addAuditLog, addNotification } = useGlobal();
  const [query, setQuery] = useState('');

  return (
    <div className='space-y-10 animate-in fade-in duration-700 pb-20'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-emerald-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-emerald-500/20 shadow-xl'>
              <Briefcase className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] opacity-60 text-slate-500'>
                Inbound Supply Management
              </span>
              <h2 className='font-space text-4xl font-bold dark:text-white uppercase tracking-tighter leading-none'>
                Portal de <span className='text-emerald-500'>Proveedores</span>
              </h2>
            </div>
          </div>
        </div>
        <button className='px-10 py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-emerald-500 transition-all flex items-center gap-3'>
          <Plus className='w-4 h-4' /> REGISTRAR VENDOR
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        <div className='lg:col-span-3 space-y-8'>
          <div className='glass p-6 rounded-[2.5rem] border-white/5 relative'>
            <Search className='absolute left-12 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
            <input
              type='text'
              placeholder='BUSCAR VENDOR POR NOMBRE, RUC O CATEGORÍA...'
              className='w-full pl-16 pr-8 py-5 bg-black/40 rounded-2xl outline-none text-xs font-bold text-white uppercase tracking-widest border border-white/5 focus:border-emerald-500/50 transition-all'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {vendors
              .filter((v) => v.name.toLowerCase().includes(query.toLowerCase()))
              .map((v) => (
                <div
                  key={v.id}
                  className='glass-card rounded-[3rem] p-10 border-white/5 space-y-8 group hover:border-emerald-500/30 transition-all'
                >
                  <div className='flex justify-between items-start'>
                    <div className='space-y-1'>
                      <span className='text-[8px] font-black text-emerald-500 uppercase tracking-widest'>
                        {v.id} // {v.category}
                      </span>
                      <h3 className='text-2xl font-space font-bold text-white uppercase leading-none'>
                        {v.name}
                      </h3>
                      <p className='text-[9px] font-bold text-slate-500 uppercase tracking-tight'>
                        RUC: {v.ruc}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${v.status === 'active' ? 'text-emerald-500 border-emerald-500/20' : 'text-amber-500 border-amber-500/20'}`}
                    >
                      {v.status}
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-8 pt-6 border-t border-white/5'>
                    <div className='space-y-4'>
                      <div className='flex items-center gap-3'>
                        <TrendingUp className='w-4 h-4 text-emerald-500' />
                        <div>
                          <p className='text-[7px] font-black text-slate-500 uppercase'>
                            Performance Score
                          </p>
                          <p className='text-xl font-bold text-white'>{v.performanceScore}%</p>
                        </div>
                      </div>
                    </div>
                    <div className='space-y-4'>
                      <div className='flex items-center gap-3'>
                        <Mail className='w-4 h-4 text-blue-500' />
                        <div>
                          <p className='text-[7px] font-black text-slate-500 uppercase'>
                            Supply Contact
                          </p>
                          <p className='text-[11px] font-bold text-slate-300 truncate'>
                            {v.contactName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex gap-4 pt-4'>
                    <button className='flex-1 py-4 glass text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all'>
                      LISTA DE PRECIOS
                    </button>
                    <button className='flex-1 py-4 glass text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2'>
                      ANALIZAR KPI <TrendingUp className='w-3 h-3' />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <aside className='space-y-8'>
          <div className='glass-card rounded-[3rem] p-10 border-white/5 space-y-8 bg-gradient-to-br from-emerald-500/[0.03] to-transparent'>
            <h4 className='text-xl font-space font-bold uppercase text-white flex items-center gap-3'>
              <Star className='text-emerald-500' /> Top Performer
            </h4>
            <div className='space-y-6'>
              <div className='p-8 glass rounded-[2.5rem] border-white/5 text-center space-y-4'>
                <div className='w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20'>
                  <Ship className='w-10 h-10 text-emerald-500' />
                </div>
                <p className='text-[9px] font-black text-slate-500 uppercase tracking-widest'>
                  Maersk Global
                </p>
                <p className='text-xs font-bold text-white uppercase'>Socio Estratégico A+</p>
              </div>
            </div>
          </div>

          <div className='p-8 glass rounded-[2.5rem] border-white/5 space-y-4'>
            <div className='flex items-center gap-3 text-amber-500'>
              <AlertCircle className='w-5 h-5' />
              <span className='text-[10px] font-black uppercase tracking-widest'>
                Vendor Alerts
              </span>
            </div>
            <p className='text-[10px] text-slate-500 leading-relaxed italic'>
              Nike Global reporta retrasos de 48h en el puerto de Chancay por protocolo sanitario.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VendorPortal;
