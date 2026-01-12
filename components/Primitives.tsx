
import React from 'react';

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-main";
const TOUCH_TARGET = "min-h-[44px] min-w-[44px]";

export const TechnicalBadge: React.FC<{ children: React.ReactNode, variant?: 'blue' | 'emerald' | 'amber' | 'red' | 'purple' }> = ({ children, variant = 'blue' }) => {
  const styles = {
    blue: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10',
    emerald: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    amber: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    red: 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-500/10',
    purple: 'border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/10',
  };
  return (
    <span role="status" className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${styles[variant]} transition-all animate-in fade-in shadow-sm`}>
      {children}
    </span>
  );
};

export const DealBadge: React.FC<{ label: string }> = ({ label }) => (
  <div 
    role="status" 
    aria-live="polite"
    className="bg-red-600 text-white px-5 py-2 rounded-br-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-[0_10px_30px_rgba(220,38,38,0.4)] animate-in slide-in-from-left-4 duration-500"
    style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)' }}
  >
    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
    {label}
  </div>
);

// Fix de sintaxis genérica para TSX
export const EnterpriseDataTable = <T extends { id: string | number }>({ columns, data, onRowClick }: {
  columns: { key: keyof T | 'actions'; label: string; render?: (item: T) => React.ReactNode }[];
  data: T[];
  onRowClick?: (item: T) => void;
}) => (
  <div className="glass-card rounded-[2.5rem] border-content-muted/10 overflow-hidden bg-surface shadow-sm">
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-content-muted/[0.03] border-b border-content-muted/10">
            {columns.map((col, idx) => (
              <th key={idx} className="px-8 py-6 text-[9px] font-black text-content-muted uppercase tracking-widest whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-content-muted/10">
          {data.map((item) => (
            <tr 
              key={item.id} 
              onClick={() => onRowClick?.(item)}
              className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-content-muted/[0.04]' : 'hover:bg-content-muted/[0.02]'}`}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-8 py-6 whitespace-nowrap">
                  {col.render ? col.render(item) : String(item[col.key as keyof T] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const EnterpriseButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'offer', size?: 'sm' | 'md' | 'lg' }> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const base = `font-black uppercase tracking-[0.3em] transition-all rounded-2xl flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale relative overflow-hidden group ${FOCUS_RING} ${TOUCH_TARGET}`;
  const variants = {
    primary: "dark:bg-blue-600 bg-slate-950 text-white hover:bg-blue-500 shadow-xl",
    ghost: "glass border-content-muted/20 text-content-secondary hover:text-content-primary",
    offer: "bg-red-600 text-white hover:bg-red-500 shadow-xl"
  };
  const sizes = { sm: "px-6 py-3 text-[8px]", md: "px-10 py-5 text-[9px]", lg: "px-12 py-6 text-[10px]" };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export const EnterpriseIconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode, label: string, variant?: 'glass' | 'blue' | 'simple' }> = ({ icon, label, variant = 'glass', className, ...props }) => {
  const variants = {
    glass: "glass border-content-muted/10 text-content-muted hover:text-brand-blue hover:border-brand-blue",
    blue: "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
    simple: "text-content-muted hover:text-brand-blue"
  };
  return (
    <button className={`p-3.5 rounded-2xl transition-all flex items-center justify-center ${variants[variant]} ${FOCUS_RING} ${TOUCH_TARGET} ${className}`} aria-label={label} title={label} {...props}>
      {icon}
    </button>
  );
};

export const EnterpriseInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, error?: string, icon?: React.ReactNode }> = ({ label, error, icon, className, ...props }) => {
  const id = React.useId();
  return (
    <div className="space-y-2 group w-full">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-content-secondary px-2 flex items-center gap-2 group-focus-within:text-blue-500 transition-colors">
        {icon}{label}
      </label>
      <input id={id} className={`w-full px-6 py-5 glass border-content-muted/20 rounded-2xl outline-none focus:border-blue-500/50 transition-all font-bold text-sm ${error ? 'border-red-500/50' : ''} ${className}`} {...props} />
      {error && <p className="text-[9px] font-black text-red-600 uppercase tracking-widest px-2">{error}</p>}
    </div>
  );
};
