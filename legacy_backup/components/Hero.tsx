import React from 'react';
import {
  ShoppingCart,
  ChevronRight,
  Zap,
  ShieldCheck,
  Globe,
  Activity,
  Star,
  Target,
} from 'lucide-react';

const Hero: React.FC<{ onShopClick: () => void }> = ({ onShopClick }) => {
  return (
    <section className='relative min-h-screen flex items-center pt-20 pb-32 overflow-hidden px-6 lg:px-20 bg-main'>
      {/* Cinematic Background */}
      <div className='absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-blue/5 blur-[150px] rounded-full animate-pulse pointer-events-none' />
      <div className='absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-brand-cyan/5 blur-[120px] rounded-full pointer-events-none' />

      <div className='max-w-[1800px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center relative z-10'>
        {/* Left Side: Technical Messaging */}
        <div className='flex flex-col gap-10 animate-in slide-in-from-left-12 duration-1000'>
          <div className='flex items-center gap-4'>
            <div className='h-px w-16 bg-gradient-to-r from-brand-blue to-transparent' />
            <span className='text-brand-blue text-[11px] font-black uppercase tracking-[0.6em] flex items-center gap-2'>
              <Globe className='w-3.5 h-3.5' /> Lima // Exclusive HQ
            </span>
          </div>

          <div className='space-y-4'>
            <h1 className='font-space text-[80px] lg:text-[140px] font-bold tracking-tighter leading-[0.75] text-content-primary uppercase'>
              HYPER <br />
              <span className='text-gradient italic'>URBAN.</span>
            </h1>
            <p className='text-content-secondary text-lg lg:text-2xl max-w-xl leading-relaxed font-medium'>
              Zapatillas de alto desempeño. Ingeniería aplicada a la cultura urbana, disponible
              exclusivamente para la red ROSPORTS.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-6 pt-6'>
            <button
              onClick={onShopClick}
              className='group relative px-14 py-8 bg-content-primary text-main font-black text-xs uppercase tracking-[0.4em] hover:bg-brand-blue hover:text-white transition-all transform hover:-translate-y-1 shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center gap-6 rounded-[2.5rem]'
            >
              EXPLORAR NODO
              <div className='bg-brand-blue group-hover:bg-white/20 p-2.5 rounded-full transition-colors'>
                <ShoppingCart className='w-4 h-4' />
              </div>
            </button>

            <div className='flex items-center gap-6 px-8 py-5 glass rounded-[2.5rem] enterprise-border'>
              <div className='flex -space-x-4'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='w-12 h-12 rounded-full border-4 border-main bg-surface flex items-center justify-center shadow-xl'
                  >
                    <Star className='w-4 h-4 text-amber-500 fill-current' />
                  </div>
                ))}
              </div>
              <div>
                <p className='text-content-primary text-[10px] font-black uppercase tracking-widest leading-none'>
                  Certificado
                </p>
                <p className='text-content-muted text-[8px] font-bold uppercase tracking-widest mt-1'>
                  100% Original
                </p>
              </div>
            </div>
          </div>

          {/* System Telemetry */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-12 mt-16 py-12 border-t border-content-muted/10 w-full opacity-60'>
            {[
              { label: 'SYNC', val: '24/7 LIVE', icon: Activity },
              { label: 'AUTHENTIC', val: 'VERIFIED', icon: ShieldCheck },
              { label: 'NETWORK', val: 'LIMA_NODE', icon: Globe },
              { label: 'DROPS', val: 'SEASON_25', icon: Zap },
            ].map((item, idx) => (
              <div key={idx} className='space-y-3 group cursor-default'>
                <item.icon className='w-4 h-4 text-brand-blue group-hover:animate-pulse transition-all' />
                <p className='text-content-muted text-[9px] font-black uppercase tracking-widest'>
                  {item.label}
                </p>
                <p className='text-content-primary text-[10px] font-bold uppercase'>{item.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Product HUD Visualization */}
        <div className='relative group animate-in zoom-in-95 duration-1000 hidden lg:block'>
          {/* Floating UI Elements */}
          <div className='absolute -top-10 -right-5 z-20 p-6 glass rounded-[2.5rem] enterprise-border animate-float shadow-2xl'>
            <div className='flex flex-col items-center gap-3'>
              <div className='w-14 h-1.5 bg-brand-blue rounded-full mb-1' />
              <span className='text-[10px] font-black text-brand-blue uppercase tracking-widest'>
                STATUS: IN_STOCK
              </span>
              <span className='text-[8px] font-mono text-content-muted'>REF_CODE: RS_25_ULTRA</span>
            </div>
          </div>

          <div className='absolute bottom-10 -left-10 z-20 p-8 glass rounded-[2.5rem] enterprise-border shadow-2xl'>
            <div className='space-y-2'>
              <span className='text-[9px] font-black text-brand-cyan uppercase tracking-widest flex items-center gap-2'>
                <Target className='w-3.5 h-3.5 fill-current' /> Performance Tag
              </span>
              <p className='text-sm font-bold text-content-primary uppercase'>Cámara React V3.1</p>
            </div>
          </div>

          <div className='relative p-12 lg:p-24 glass rounded-[5rem] enterprise-border overflow-hidden group shadow-[0_100px_100px_rgba(0,0,0,0.2)] bg-surface/30'>
            <div className='absolute inset-0 technical-grid opacity-10' />
            <img
              src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200'
              alt='Showcase Product'
              className='relative z-10 w-full h-auto drop-shadow-[0_50px_50px_rgba(0,0,0,0.5)] transition-all duration-1000 group-hover:scale-110 group-hover:rotate-[-8deg]'
            />

            {/* Dynamic Price Overlay */}
            <div className='absolute bottom-0 left-0 w-full p-16 bg-gradient-to-t from-main/80 to-transparent flex justify-between items-end'>
              <div className='space-y-2'>
                <h4 className='text-4xl font-space font-bold text-content-primary uppercase tracking-tighter'>
                  AIR MAX ELITE
                </h4>
                <div className='flex items-center gap-4'>
                  <p className='text-xs font-black text-brand-blue uppercase tracking-[0.4em]'>
                    Desde S/ 489.90
                  </p>
                  <span className='px-3 py-1 bg-brand-offer/10 text-brand-offer text-[9px] font-black rounded-lg border border-brand-offer/20 uppercase'>
                    -25% EXCLUSIVE
                  </span>
                </div>
              </div>
              <button
                onClick={onShopClick}
                className='w-20 h-20 bg-brand-blue text-white rounded-[2rem] flex items-center justify-center hover:scale-110 transition-all shadow-2xl shadow-blue-500/40 group/btn'
              >
                <ChevronRight className='w-10 h-10 group-hover/btn:translate-x-1 transition-transform' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
