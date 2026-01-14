import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { ViewState } from '../types';

interface BreadcrumbsProps {
  path: { label: string; view?: ViewState }[];
  onNavigate: (view: ViewState) => void;
}

const TechnicalBreadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigate }) => {
  return (
    <nav className='flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mb-10'>
      <button
        onClick={() => onNavigate('home')}
        className='flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors'
      >
        <Home className='w-3.5 h-3.5' />
      </button>

      {path.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight className='w-3 h-3 text-slate-800' />
          <button
            disabled={!item.view}
            onClick={() => item.view && onNavigate(item.view)}
            className={`transition-colors ${item.view ? 'text-slate-500 hover:text-blue-500' : 'text-blue-500'}`}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default TechnicalBreadcrumbs;
