
import React from 'react';
import { X, BarChart2, Trash2, ArrowRight, Zap, Target, Scale } from 'lucide-react';
import { Product } from '../types';

interface ComparisonSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (product: Product) => void;
  onViewComparison: () => void;
}

const ComparisonSidebar: React.FC<ComparisonSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove,
  onViewComparison
}) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-main/60 backdrop-blur-sm z-[80] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-md glass border-l border-content-muted/10 z-[90] transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full bg-main transition-colors duration-500">
          <div className="p-8 border-b border-content-muted/10 flex items-center justify-between bg-content-muted/[0.01]">
            <div className="flex items-center gap-4">
              <BarChart2 className="w-6 h-6 text-brand-blue" />
              <h2 className="text-2xl font-space font-bold text-content-primary uppercase tracking-tighter">COMPARADOR</h2>
            </div>
            <button onClick={onClose} className="p-3 glass rounded-2xl hover:text-red-500 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            <div className="p-8 glass rounded-[2.5rem] border border-brand-blue/20 bg-brand-blue/5 space-y-4">
               <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.4em]">Tu Guía de Elección</p>
               <p className="text-[11px] text-content-secondary font-medium leading-relaxed">Selecciona hasta 3 modelos para encontrar el balance perfecto entre estilo y comodidad.</p>
               <div className="flex gap-3">
                  <div className="flex items-center gap-1.5">
                     <Scale className="w-3 h-3 text-brand-blue opacity-50" />
                     <span className="text-[8px] font-black text-content-muted uppercase">Peso</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Target className="w-3 h-3 text-brand-blue opacity-50" />
                     <span className="text-[8px] font-black text-content-muted uppercase">Agarre</span>
                  </div>
               </div>
            </div>

            {items.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-8 py-20 opacity-30">
                <BarChart2 className="w-12 h-12 text-content-muted" />
                <div className="space-y-2">
                   <p className="text-content-primary font-black uppercase tracking-[0.4em] text-xs">Comparador Vacío</p>
                   <p className="text-[9px] font-medium text-content-secondary uppercase max-w-[180px] mx-auto">Añade modelos desde el catálogo para iniciar la comparativa.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-[9px] font-black text-content-muted uppercase tracking-[0.4em]">Modelos a Contrastar ({items.length}/3)</p>
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 p-5 glass rounded-[2rem] border border-content-muted/10 group animate-in slide-in-from-right-4 duration-300 hover:border-brand-blue/30 transition-all bg-surface/50">
                    <div className="w-20 h-20 bg-main rounded-2xl p-2 shrink-0 border border-content-muted/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="font-bold text-[11px] text-content-primary uppercase tracking-tight truncate font-space">{item.name}</h4>
                      <p className="text-[9px] font-black text-brand-blue uppercase mt-1 tracking-widest">{item.brand} // Elite Edition</p>
                      <p className="text-xs font-bold text-content-secondary mt-1">S/ {item.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => onRemove(item)}
                      className="p-2.5 glass rounded-xl text-content-muted hover:text-red-500 transition-all self-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-8 glass border-t border-content-muted/10 bg-gradient-to-t from-content-muted/[0.04] to-transparent">
              <button 
                onClick={onViewComparison}
                disabled={items.length < 2}
                className={`w-full py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)] group ${
                  items.length >= 2 
                  ? 'bg-brand-blue text-white hover:bg-blue-600 shadow-blue-500/20' 
                  : 'bg-surface text-content-muted cursor-not-allowed grayscale'
                }`}
              >
                {items.length < 2 ? 'SELECCIONA OTRO PAR' : 'INICIAR COMPARATIVA'} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              {items.length < 2 && (
                <p className="text-[8px] text-content-muted font-black uppercase tracking-[0.3em] text-center mt-5">Agrega un modelo más para visualizar las diferencias</p>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default ComparisonSidebar;
