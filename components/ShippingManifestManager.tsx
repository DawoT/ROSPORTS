import React, { useState } from 'react';
import {
  Truck,
  ArrowRight,
  Clock,
  ExternalLink,
  Globe,
  Navigation,
  Box,
} from 'lucide-react';
import { ShipmentManifest } from '../types';

const ShippingManifestManager: React.FC = () => {
  const [manifests] = useState<ShipmentManifest[]>([
    {
      id: 'SM-101',
      orderId: 'RS-WEB-2291',
      originNode: 'N-01',
      destinationAddress: 'Av. Larco 456, Miraflores',
      carrier: 'URBANO ELITE',
      trackingCode: 'UB-9920-X',
      status: 'shipped',
      dispatchedAt: '2025-05-12T10:30:00Z',
    },
    {
      id: 'SM-102',
      orderId: 'RS-SOC-1102',
      originNode: 'N-02',
      destinationAddress: 'Calle Las Orquídeas 123, San Isidro',
      carrier: 'ROSPORTS DIRECT',
      trackingCode: 'RD-0012-A',
      status: 'pending',
    },
  ]);

  const [filter, setFilter] = useState('all');

  return (
    <div className='space-y-10 animate-in fade-in duration-700 pb-20'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-emerald-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-emerald-500/20 shadow-xl'>
              <Truck className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] opacity-60 text-slate-500'>
                Outbound Logistics
              </span>
              <h2 className='font-space text-4xl font-bold dark:text-white text-slate-900 uppercase tracking-tighter leading-none'>
                Manifiesto de <span className='text-gradient'>Despacho</span>
              </h2>
            </div>
          </div>
        </div>

        <div className='flex gap-4 overflow-x-auto pb-2'>
          {['all', 'pending', 'shipped', 'delivered'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-emerald-600 text-white shadow-lg' : 'glass text-slate-500 hover:text-white'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {manifests
          .filter((m) => filter === 'all' || m.status === filter)
          .map((m) => (
            <div
              key={m.id}
              className='glass-card rounded-[3rem] p-10 border-white/5 space-y-8 group hover:border-emerald-500/30 transition-all flex flex-col relative overflow-hidden'
            >
              <div className='absolute top-0 right-0 p-8 opacity-5'>
                <Globe className='w-32 h-32 text-white' />
              </div>

              <div className='flex justify-between items-start relative z-10'>
                <div className='space-y-1'>
                  <span className='text-[8px] font-black text-emerald-500 uppercase tracking-widest'>
                    MANIFEST_ID: {m.id}
                  </span>
                  <h3 className='text-2xl font-space font-bold text-white uppercase'>
                    Orden: {m.orderId}
                  </h3>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    m.status === 'delivered'
                      ? 'text-emerald-500 border-emerald-500/20'
                      : m.status === 'shipped'
                        ? 'text-blue-500 border-blue-500/20'
                        : 'text-amber-500 border-amber-500/20'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <div className='grid grid-cols-2 gap-8 relative z-10'>
                <div className='space-y-4'>
                  <div className='flex items-start gap-4'>
                    <Navigation className='w-4 h-4 text-slate-500 mt-1' />
                    <div>
                      <p className='text-[7px] font-black text-slate-500 uppercase tracking-widest'>
                        Destino Final
                      </p>
                      <p className='text-[11px] font-bold text-white uppercase leading-tight'>
                        {m.destinationAddress}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4'>
                    <Box className='w-4 h-4 text-slate-500 mt-1' />
                    <div>
                      <p className='text-[7px] font-black text-slate-500 uppercase tracking-widest'>
                        Carrier / Currier
                      </p>
                      <p className='text-[11px] font-bold text-slate-300 uppercase'>{m.carrier}</p>
                    </div>
                  </div>
                </div>
                <div className='space-y-4'>
                  <div className='flex items-start gap-4'>
                    <Clock className='w-4 h-4 text-slate-500 mt-1' />
                    <div>
                      <p className='text-[7px] font-black text-slate-500 uppercase tracking-widest'>
                        Time Logs
                      </p>
                      <p className='text-[11px] font-bold text-white'>
                        {m.dispatchedAt ? new Date(m.dispatchedAt).toLocaleString() : 'PENDIENTE'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-4'>
                    <ExternalLink className='w-4 h-4 text-blue-500 mt-1' />
                    <div>
                      <p className='text-[7px] font-black text-slate-500 uppercase tracking-widest'>
                        Tracking Code
                      </p>
                      <p className='text-[11px] font-mono font-bold text-blue-500 uppercase'>
                        {m.trackingCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='pt-6 border-t border-white/5 flex gap-4 relative z-10'>
                <button className='flex-1 py-4 glass text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all'>
                  IMPRIMIR GUÍA
                </button>
                <button className='flex-1 py-4 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2'>
                  {m.status === 'pending' ? 'DESPACHAR CARGA' : 'VER RUTA GPS'}{' '}
                  <ArrowRight className='w-3 h-3' />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShippingManifestManager;
