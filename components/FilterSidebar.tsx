import React from 'react';
import {
  Filter,
  X,
  Check,
  Zap,
  DollarSign,
  Ruler,
} from 'lucide-react';
import { FilterState } from '../services/catalogEngine';
import { SIZES } from '../constants';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  brands: string[];
  categories: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  brands,
  categories,
}) => {
  const toggleItem = (list: any[], item: any) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  return (
    <>
      <div
        className={`fixed inset-0 z-[150] bg-main/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-full max-w-xs glass border-r border-content-muted/10 z-[160] transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col bg-main shadow-2xl`}
      >
        <div className='p-8 border-b border-content-muted/10 flex items-center justify-between bg-content-muted/[0.01]'>
          <div className='flex items-center gap-4'>
            <Filter className='w-5 h-5 text-brand-blue' />
            <h2 className='text-xl font-space font-bold text-content-primary uppercase tracking-tighter'>
              REFINAR
            </h2>
          </div>
          <button
            onClick={onClose}
            className='p-3 glass rounded-2xl text-content-muted hover:text-red-500 transition-all'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar pb-32'>
          {/* Categorías de Estilo */}
          <div className='space-y-5'>
            <p className='text-[9px] font-black text-content-primary uppercase tracking-[0.4em] flex items-center gap-3'>
              <Zap className='w-3.5 h-3.5 text-brand-blue fill-current' /> POR ESTILO
            </p>
            <div className='flex flex-col gap-2.5'>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setFilters({ ...filters, categories: toggleItem(filters.categories, cat) })
                  }
                  className={`flex justify-between items-center px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.categories.includes(cat) ? 'bg-brand-blue text-white shadow-xl shadow-blue-500/20' : 'glass border-transparent text-content-secondary hover:bg-brand-blue/5 hover:text-brand-blue'}`}
                >
                  {cat}
                  {filters.categories.includes(cat) ? (
                    <Check className='w-3.5 h-3.5' />
                  ) : (
                    <div className='w-4 h-4 rounded-full border-2 border-content-muted/20' />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Presupuesto */}
          <div className='space-y-6 pt-6 border-t border-content-muted/10'>
            <p className='text-[9px] font-black text-content-primary uppercase tracking-[0.4em] flex items-center gap-3'>
              <DollarSign className='w-3.5 h-3.5 text-emerald-500' /> PRESUPUESTO (S/)
            </p>
            <div className='px-2'>
              <div className='flex justify-between text-[11px] font-space text-content-primary mb-5 font-bold'>
                <span className='glass px-3 py-1 rounded-lg'>S/ {filters.priceRange[0]}</span>
                <span className='glass px-3 py-1 rounded-lg'>S/ {filters.priceRange[1]}</span>
              </div>
              <div className='relative h-1.5 w-full bg-content-muted/10 rounded-full overflow-hidden'>
                <div
                  className='absolute h-full bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                  style={{ left: '0%', width: `${(filters.priceRange[1] / 2000) * 100}%` }}
                />
                <input
                  type='range'
                  min='0'
                  max='2000'
                  step='50'
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                    })
                  }
                  className='absolute inset-0 w-full opacity-0 cursor-pointer z-10'
                />
              </div>
            </div>
          </div>

          {/* Tu Medida */}
          <div className='space-y-5 pt-6 border-t border-content-muted/10'>
            <p className='text-[9px] font-black text-content-primary uppercase tracking-[0.4em] flex items-center gap-3'>
              <Ruler className='w-3.5 h-3.5 text-purple-500' /> TU TALLA (PE)
            </p>
            <div className='grid grid-cols-4 gap-2.5'>
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilters({ ...filters, sizes: toggleItem(filters.sizes, s) })}
                  className={`h-11 rounded-xl text-[10px] font-black transition-all border ${filters.sizes.includes(s) ? 'bg-slate-950 text-white dark:bg-white dark:text-black border-transparent shadow-xl' : 'glass border-transparent text-content-muted hover:text-content-primary'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Exclusividad en Stock */}
          <div className='pt-8 border-t border-content-muted/10'>
            <button
              onClick={() => setFilters({ ...filters, inStock: !filters.inStock })}
              className='w-full flex items-center justify-between p-5 glass rounded-[1.5rem] group transition-all'
            >
              <span className='text-[10px] font-black text-content-muted uppercase tracking-widest group-hover:text-emerald-500 transition-colors'>
                Disponibilidad Inmediata
              </span>
              <div
                className={`w-11 h-6 rounded-full transition-all relative ${filters.inStock ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-content-muted/20'}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${filters.inStock ? 'left-6' : 'left-1'}`}
                />
              </div>
            </button>
          </div>
        </div>

        <div className='p-8 border-t border-content-muted/10 bg-content-muted/[0.04] flex gap-4'>
          <button
            onClick={() =>
              setFilters({
                categories: [],
                brands: [],
                priceRange: [0, 2000],
                sizes: [],
                colors: [],
                inStock: false,
              })
            }
            className='flex-1 py-4 glass text-[9px] font-black text-content-muted uppercase tracking-widest rounded-2xl hover:text-content-primary transition-all'
          >
            LIMPIAR
          </button>
          <button
            onClick={onClose}
            className='flex-1 py-4 bg-brand-blue text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-blue-600 transition-all'
          >
            VER RESULTADOS
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
