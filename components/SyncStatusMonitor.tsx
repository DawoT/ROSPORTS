
import React from 'react';
import { Database, RefreshCw, CheckCircle, CloudSync } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

const SyncStatusMonitor: React.FC = () => {
  const { dbHealth, isSyncing, triggerCloudSync } = useGlobal();

  return (
    <div className="fixed bottom-10 left-10 z-[100] group">
       <div className="glass px-6 py-4 rounded-[2rem] border-content-muted/10 bg-surface/90 backdrop-blur-xl shadow-2xl flex items-center gap-5 transition-all hover:pr-8 hover:border-blue-500/30">
          <div className="relative">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
               dbHealth.status === 'SYNCHRONIZED' ? 'bg-emerald-500/10 text-emerald-500' : 
               dbHealth.status === 'PENDING_PUSH' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
             }`}>
                {isSyncing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
             </div>
             {dbHealth.localChanges > 0 && (
               <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-surface animate-in zoom-in">
                  {dbHealth.localChanges}
               </span>
             )}
          </div>

          <div className="flex flex-col">
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-content-primary">Tienda Sincronizada</span>
                {dbHealth.status === 'SYNCHRONIZED' ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <CloudSync className="w-3 h-3 text-blue-500 animate-pulse" />}
             </div>
             <p className="text-[7px] font-bold text-content-muted uppercase tracking-tighter">Última actualización: {new Date(dbHealth.lastGlobalSync).toLocaleTimeString()}</p>
          </div>

          <button 
            onClick={triggerCloudSync}
            className="hidden group-hover:block ml-4 p-2 glass rounded-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            title="Actualizar Catálogo"
          >
             <RefreshCw className="w-4 h-4" />
          </button>
       </div>
    </div>
  );
};

export default SyncStatusMonitor;
