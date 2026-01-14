import React from 'react';
import { Home, Globe } from 'lucide-react';
import { ViewState } from '../types';

interface BreadcrumbsProps {
  path: { label: string; view?: ViewState }[];
  onNavigate: (view: ViewState) => void;
}

const ShopBreadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigate }) => {
  return (
    <nav
      className='flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] mb-12 animate-in slide-in-from-left-4 duration-700'
      aria-label='Navegación secundaria'
    >
      <button
        onClick={() => onNavigate('home')}
        className='flex items-center gap-2 text-content-muted hover:text-brand-blue transition-all group'
      >
        <Home className='w-4 h-4 transition-transform group-hover:scale-110' />
      </button>

      {path.map((item, i) => (
        <React.Fragment key={i}>
          <div className='w-1 h-1 bg-content-muted/30 rounded-full' />
          <button
            disabled={!item.view}
            onClick={() => item.view && onNavigate(item.view)}
            className={`transition-all ${item.view ? 'text-content-muted hover:text-brand-blue' : 'text-brand-blue'}`}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}

      <div className='flex-1 h-px bg-gradient-to-r from-content-muted/10 to-transparent ml-4 hidden md:block' />

      <div className='hidden lg:flex items-center gap-3 text-content-muted opacity-40'>
        <Globe className='w-3.5 h-3.5' />
        <span className='text-[8px] font-black uppercase'>Red Rosports Central</span>
      </div>
    </nav>
  );
};

export default ShopBreadcrumbs;
