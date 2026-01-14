import React from 'react';
import { X, Zap, Target, Scale, Droplets, Info, ArrowRight, BarChart3 } from 'lucide-react';
import { Product } from '../types';
import { TechnicalFormatter } from '../utils/formatter';

interface ComparisonHubProps {
  items: Product[];
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const ComparisonHub: React.FC<ComparisonHubProps> = ({ items, onClose, onAddToCart }) => {
  if (items.length === 0) return null;

  return (
    <div className='fixed inset-0 z-[700] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500'>
      <div className='absolute inset-0 bg-main/95 backdrop-blur-3xl' onClick={onClose} />

      <div className='relative w-full max-w-[1800px] h-[90vh] glass-card rounded-[3rem] md:rounded-[4rem] border-content-muted/10 flex flex-col overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-surface/98'>
        {/* Header - Boutique Style */}
        <div className='p-8 md:p-10 border-b border-content-muted/10 flex items-center justify-between bg-content-muted/[0.01]'>
          <div className='flex items-center gap-4 md:gap-6'>
            <div className='w-12 h-12 md:w-14 md:h-14 glass rounded-2xl flex items-center justify-center text-brand-blue border-brand-blue/20'>
              <BarChart3 className='w-6 h-6 md:w-7 md:h-7' />
            </div>
            <div>
              <h3 className='text-xl md:text-3xl font-space font-bold text-content-primary uppercase tracking-tighter'>
                Comparador de Estilos
              </h3>
              <p className='text-[8px] md:text-[10px] font-black text-content-muted uppercase tracking-[0.5em]'>
                Encuentra el par perfecto para tu ritmo de vida
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-4 md:p-5 glass rounded-3xl text-content-muted hover:text-red-500 transition-all'
          >
            <X className='w-5 h-5 md:w-6 md:h-6' />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className='flex-1 overflow-x-auto overflow-y-auto custom-scrollbar'>
          <div
            className='min-w-[1000px] md:min-w-[1200px] h-full grid'
            style={{ gridTemplateColumns: `280px repeat(${items.length}, minmax(300px, 1fr))` }}
          >
            {/* Sidebar de Atributos - Lenguaje Amigable */}
            <div className='border-r border-content-muted/10 bg-content-muted/[0.01] pt-40 md:pt-48 space-y-16 md:space-y-20'>
              {[
                { label: 'Ligereza y Peso', icon: Scale },
                { label: 'Comodidad y Pisada', icon: Droplets },
                { label: 'Seguridad y Agarre', icon: Target },
                { label: 'Inversión Rosports', icon: Zap },
                { label: 'Detalles Premium', icon: Info },
              ].map((attr) => (
                <div
                  key={attr.label}
                  className='px-8 md:px-10 flex items-center gap-4 text-content-muted'
                >
                  <attr.icon className='w-4 h-4' />
                  <span className='text-[9px] md:text-[10px] font-black uppercase tracking-widest'>
                    {attr.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Columnas de Productos */}
            {items.map((p, idx) => (
              <div
                key={p.id}
                className={`p-8 md:p-10 space-y-10 md:space-y-12 border-r border-content-muted/10 transition-colors hover:bg-content-muted/[0.01] ${idx === 0 ? 'bg-brand-blue/[0.02]' : ''}`}
              >
                <div className='space-y-6 text-center'>
                  <div className='h-40 md:h-48 flex items-center justify-center relative'>
                    <div className='absolute inset-0 technical-grid opacity-10' />
                    <img
                      src={p.image}
                      className='h-full object-contain drop-shadow-2xl relative z-10'
                      alt={p.name}
                    />
                  </div>
                  <div className='space-y-1'>
                    <span className='text-[8px] font-black text-brand-blue uppercase tracking-widest'>
                      {p.brand}
                    </span>
                    <h4 className='text-lg md:text-xl font-space font-bold text-content-primary uppercase truncate'>
                      {p.name}
                    </h4>
                  </div>
                </div>

                {/* Datos Comparativos - Menos técnico, más beneficios */}
                <div className='space-y-16 md:space-y-20 pt-4 md:pt-8'>
                  <div className='text-center'>
                    <span className='text-xl md:text-2xl font-bold text-content-primary'>
                      {TechnicalFormatter.weight(p.weight)}
                    </span>
                    <p className='text-[7px] md:text-[8px] font-black text-content-muted uppercase tracking-tighter'>
                      Casi imperceptibles
                    </p>
                  </div>
                  <div className='text-center'>
                    <span className='text-xl md:text-2xl font-bold text-content-primary'>
                      {p.drop}
                    </span>
                    <p className='text-[7px] md:text-[8px] font-black text-content-muted uppercase tracking-tighter'>
                      Postura Ideal
                    </p>
                  </div>
                  <div className='px-6 md:px-10'>
                    <div className='flex justify-between mb-2'>
                      <span className='text-[8px] md:text-[9px] font-bold text-content-muted'>
                        Nivel de Tracción: {p.tractionScore}/10
                      </span>
                    </div>
                    <div className='h-1.5 w-full bg-content-muted/10 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-brand-blue rounded-full'
                        style={{ width: `${p.tractionScore * 10}%` }}
                      />
                    </div>
                  </div>
                  <div className='text-center'>
                    <span className='text-2xl md:text-3xl font-space font-bold text-brand-blue'>
                      S/ {p.price.toFixed(2)}
                    </span>
                  </div>
                  <div className='flex flex-wrap gap-2 justify-center px-4'>
                    {p.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className='px-2 md:px-3 py-1 glass rounded-lg text-[6px] md:text-[7px] font-black text-content-muted uppercase border border-content-muted/10'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='pt-8'>
                  <button
                    onClick={() => onAddToCart(p)}
                    className='w-full py-4 md:py-5 bg-content-primary text-main rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-3 group min-h-[44px]'
                  >
                    AÑADIR A LA BOLSA{' '}
                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonHub;
