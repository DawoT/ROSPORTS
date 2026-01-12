import React, { useState, useEffect } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight, Zap, Target, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    label: 'Colección Premium 2025',
    title: 'LA NUEVA <br/> FORMA DE <span className="text-gradient">CAMINAR.</span>',
    desc: 'Diseño de vanguardia creado para quienes no se detienen. Comodidad absoluta en cada paso.',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200',
    color: 'blue',
  },
  {
    id: 2,
    label: 'Estilo Urbano Pro',
    title: 'CONQUISTA <br/> TU <span className="text-gradient">CIUDAD.</span>',
    desc: 'Zapatillas exclusivas que combinan la elegancia del lujo con el espíritu deportivo.',
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=1200',
    color: 'amber',
  },
];

interface SliderProps {
  onShopClick: () => void;
}

const PromotionalSlider: React.FC<SliderProps> = ({ onShopClick }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className='relative min-h-[75vh] md:min-h-[85vh] flex items-center overflow-hidden bg-main transition-colors duration-700'
      aria-label='Novedades de la temporada'
    >
      {/* Background Grid & Effects */}
      <div
        className='absolute inset-0 technical-grid opacity-10 pointer-events-none'
        aria-hidden='true'
      />
      <div
        className='absolute top-0 right-0 w-1/2 h-full dark:bg-brand-blue/[0.03] bg-brand-blue/[0.05] blur-[120px] animate-pulse pointer-events-none'
        aria-hidden='true'
      />

      <div className='max-w-[1920px] mx-auto w-full px-6 sm:px-16 flex relative z-10 py-12 md:py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 items-center gap-12 md:gap-20'>
          <div className='space-y-8 md:space-y-12 animate-in slide-in-from-left-10 duration-1000'>
            <div
              key={SLIDES[current].id}
              className='space-y-6 md:space-y-8 animate-in fade-in duration-700'
            >
              <div className='flex items-center gap-4'>
                <div className='w-12 h-px bg-brand-blue' />
                <span className='text-brand-blue text-[10px] font-black uppercase tracking-[0.6em]'>
                  {SLIDES[current].label}
                </span>
              </div>

              <h1
                className='font-space text-5xl md:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.85] text-content-primary uppercase'
                dangerouslySetInnerHTML={{ __html: SLIDES[current].title }}
              />

              <p className='text-content-secondary text-base md:text-xl max-w-xl leading-relaxed font-medium'>
                {SLIDES[current].desc}
              </p>

              <div className='flex flex-col sm:flex-row gap-6 pt-2'>
                <button
                  onClick={onShopClick}
                  className='px-10 md:px-14 py-5 md:py-7 bg-content-primary text-main font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-brand-blue hover:text-white transition-all shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(255,255,255,0.05)] flex items-center justify-center gap-4 group min-h-[60px]'
                >
                  EXPLORAR CATÁLOGO{' '}
                  <ArrowRight className='w-4 h-4 group-hover:translate-x-2 transition-transform' />
                </button>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className='flex items-center gap-6 pt-6 md:pt-12'>
              <div className='flex gap-3' role='tablist' aria-label='Cambiar diapositiva'>
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    role='tab'
                    aria-selected={current === i}
                    aria-label={`Ver diapositiva ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'w-12 md:w-16 bg-brand-blue' : 'w-4 bg-content-muted/20 hover:bg-content-muted/40'}`}
                  />
                ))}
              </div>
              <div className='flex gap-4 ml-auto lg:ml-0'>
                <button
                  onClick={() => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length)}
                  className='w-12 h-12 md:w-14 md:h-14 glass rounded-full flex items-center justify-center text-content-secondary hover:text-brand-blue dark:hover:text-white dark:hover:border-brand-blue border-content-muted/10 transition-all shadow-sm'
                  aria-label='Diapositiva anterior'
                >
                  <ChevronLeft className='w-5 h-5' aria-hidden='true' />
                </button>
                <button
                  onClick={() => setCurrent((p) => (p + 1) % SLIDES.length)}
                  className='w-12 h-12 md:w-14 md:h-14 glass rounded-full flex items-center justify-center text-content-secondary hover:text-brand-blue dark:hover:text-white dark:hover:border-brand-blue border-content-muted/10 transition-all shadow-sm'
                  aria-label='Siguiente diapositiva'
                >
                  <ChevronRight className='w-5 h-5' aria-hidden='true' />
                </button>
              </div>
            </div>
          </div>

          <div className='relative group hidden lg:block h-[600px] xl:h-[700px]' aria-hidden='true'>
            <div
              key={SLIDES[current].id}
              className='absolute inset-0 flex items-center justify-center animate-in zoom-in-95 fade-in duration-1000'
            >
              <div className='absolute inset-0 dark:bg-brand-blue/5 bg-brand-blue/5 blur-[150px] rounded-full scale-110' />
              <img
                src={SLIDES[current].img}
                alt=''
                className='relative z-10 w-full h-auto max-h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_50px_100px_rgba(0,0,0,0.8)] transition-transform group-hover:scale-105 duration-1000'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalSlider;
