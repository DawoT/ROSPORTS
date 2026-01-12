import React from 'react';
import { MapPin, Clock, Navigation, Globe, Activity, Store, Zap } from 'lucide-react';

const TIENDAS = [
  {
    id: 'ST-01',
    name: 'BOUTIQUE SAN ISIDRO',
    address: 'Av. Javier Prado Este 1234',
    dist: 'Principal',
    status: 'ABIERTO',
    stock: '98%',
    horario: '10:00 AM - 9:00 PM',
  },
  {
    id: 'ST-02',
    name: 'CONCEPT SURCO',
    address: 'C.C. Jockey Plaza, Tda 204',
    dist: 'Tienda Oficial',
    status: 'ABIERTO',
    stock: '92%',
    horario: '11:00 AM - 10:00 PM',
  },
  {
    id: 'ST-03',
    name: 'EXPRESS INDEPENDENCIA',
    address: 'C.C. Mega Plaza, L-22',
    dist: 'Punto de Retiro',
    status: 'ABIERTO',
    stock: '85%',
    horario: '10:00 AM - 10:00 PM',
  },
];

const StoreLocator: React.FC = () => {
  return (
    <section className='py-16 md:py-24 max-w-[1920px] mx-auto px-6 md:px-10 space-y-12 md:space-y-16 animate-in fade-in duration-1000 bg-main'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8 md:gap-12'>
        <div className='space-y-4 md:space-y-6'>
          <div className='flex items-center gap-4 text-blue-500'>
            <Globe className='w-5 h-5 md:w-6 md:h-6' />
            <span className='text-[10px] font-black uppercase tracking-[0.8em]'>
              Donde encontrarnos
            </span>
          </div>
          <h2 className='font-space text-5xl md:text-7xl font-bold text-content-primary uppercase tracking-tighter leading-none'>
            Nuestras <span className='text-gradient'>Tiendas</span>
          </h2>
          <p className='text-xs md:text-sm font-medium text-content-secondary uppercase tracking-widest max-w-2xl leading-relaxed'>
            Visítanos y vive la experiencia Rosports en persona. Prueba tus modelos favoritos y
            recibe asesoría experta de nuestros especialistas.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10'>
        {TIENDAS.map((tienda) => (
          <div
            key={tienda.id}
            className='glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 space-y-8 md:space-y-10 group hover:border-blue-500/40 transition-all border border-content-muted/10 relative overflow-hidden bg-surface shadow-sm'
          >
            <div
              className='absolute inset-0 technical-grid opacity-5 pointer-events-none'
              aria-hidden='true'
            />

            <div className='flex justify-between items-start relative z-10'>
              <div className='w-12 h-12 md:w-16 md:h-16 glass rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl'>
                <Store className='w-6 h-6 md:w-8 md:h-8' />
              </div>
              <div className='text-right'>
                <span className='text-[8px] md:text-[9px] font-bold text-content-muted tracking-widest uppercase'>
                  {tienda.dist}
                </span>
                <p className='text-[9px] md:text-[10px] font-black text-blue-500 uppercase mt-1'>
                  CÓDIGO: {tienda.id}
                </p>
              </div>
            </div>

            <div className='space-y-3 md:space-y-4 relative z-10'>
              <h3 className='font-space text-2xl md:text-3xl font-bold text-content-primary uppercase leading-none tracking-tighter'>
                {tienda.name}
              </h3>
              <p className='text-[9px] md:text-[10px] font-black text-content-muted uppercase tracking-widest border-l-2 border-blue-600 pl-4'>
                {tienda.address}
              </p>
            </div>

            <div className='grid grid-cols-2 gap-4 md:gap-6 pt-6 md:pt-10 border-t border-content-muted/10 relative z-10'>
              <div className='space-y-1 md:space-y-2'>
                <p className='text-[7px] md:text-[8px] font-black text-content-muted uppercase tracking-widest'>
                  Estado
                </p>
                <div className='flex items-center gap-2 md:gap-3'>
                  <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse' />
                  <span className='text-xs md:text-sm font-bold text-emerald-500'>
                    {tienda.status}
                  </span>
                </div>
              </div>
              <div className='space-y-1 md:space-y-2'>
                <p className='text-[7px] md:text-[8px] font-black text-content-muted uppercase tracking-widest'>
                  Stock Disponible
                </p>
                <div className='flex items-center gap-2 md:gap-3'>
                  <Zap className='w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 fill-current' />
                  <span className='text-xs md:text-sm font-bold text-content-primary'>
                    {tienda.stock}
                  </span>
                </div>
              </div>
            </div>

            <button className='w-full py-5 md:py-6 glass text-content-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl md:rounded-[1.5rem] hover:bg-blue-600 hover:text-white transition-all shadow-xl group relative overflow-hidden min-h-[50px] md:min-h-[60px]'>
              VER EN GOOGLE MAPS
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoreLocator;
