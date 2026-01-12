import React from 'react';
import { RefreshCcw, ShieldAlert } from 'lucide-react';

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

const TechnicalErrorFallback: React.FC<Props> = ({ error, resetErrorBoundary }) => {
  return (
    <div className='p-12 glass-card rounded-[3rem] border-red-500/20 bg-red-500/5 space-y-8 text-center animate-in zoom-in'>
      <div className='w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto'>
        <ShieldAlert className='w-10 h-10 text-red-500' />
      </div>
      <div className='space-y-4'>
        <h2 className='text-3xl font-space font-bold text-content-primary uppercase'>
          Hubo un inconveniente
        </h2>
        <p className='text-[10px] text-content-muted font-mono bg-surface p-6 rounded-2xl border border-content-muted/10 max-w-lg mx-auto overflow-hidden text-ellipsis shadow-inner'>
          No te preocupes, el catálogo se está reiniciando para brindarte la mejor experiencia.
        </p>
      </div>
      <div className='flex justify-center gap-6'>
        <button
          onClick={() => window.location.reload()}
          className='px-8 py-4 glass text-content-primary rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-content-muted/10 transition-all'
        >
          <RefreshCcw className='w-4 h-4' /> Recargar Página
        </button>
        <button
          onClick={resetErrorBoundary}
          className='px-10 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-red-500 transition-all'
        >
          Reintentar ahora
        </button>
      </div>
    </div>
  );
};

export default TechnicalErrorFallback;
