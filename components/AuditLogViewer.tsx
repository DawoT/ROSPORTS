
import React, { useMemo, useState } from 'react';
import { Shield, Search, Filter, Clock, User, HardDrive, AlertCircle, FileText, ArrowDownCircle } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { ReportingService } from '../services/reportingService';

const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useGlobal();
  const [query, setQuery] = useState('');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => 
      log.userName.toLowerCase().includes(query.toLowerCase()) ||
      log.details.toLowerCase().includes(query.toLowerCase()) ||
      log.entityId.toLowerCase().includes(query.toLowerCase())
    );
  }, [auditLogs, query]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-500">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-red-500/20 shadow-xl">
               <Shield className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-60 text-slate-500">Security & Compliance</span>
               <h2 className="font-space text-4xl font-bold dark:text-white uppercase tracking-tighter">Auditoría <span className="text-red-500">Maestra</span></h2>
            </div>
          </div>
        </div>
        <button 
          onClick={() => ReportingService.exportToCSV(filteredLogs, 'AUDIT_LOG')}
          className="px-8 py-4 glass border-white/10 text-[9px] font-black text-white uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-white/5 transition-all"
        >
          <ArrowDownCircle className="w-4 h-4" /> EXPORTAR LOGS
        </button>
      </div>

      <div className="glass p-6 rounded-[2.5rem] border-white/5 relative">
        <Search className="absolute left-12 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="FILTRAR POR USUARIO, ENTIDAD O DETALLE DE ACCIÓN..." 
          className="w-full pl-16 pr-8 py-5 bg-black/40 rounded-2xl outline-none text-xs font-bold text-white uppercase tracking-widest border border-white/5 focus:border-red-500/50 transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase">Timestamp</th>
              <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase">Operador</th>
              <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase">Entidad</th>
              <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase">Acción</th>
              <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase">Detalles del Sistema</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span className="text-[10px] font-mono text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <User className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-bold text-white uppercase">{log.userName}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-3 h-3 text-purple-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.entity}: {log.entityId}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                    log.action === 'delete' ? 'border-red-500 text-red-500 bg-red-500/5' :
                    log.action === 'create' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' :
                    'border-blue-500 text-blue-500 bg-blue-500/5'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">"{log.details}"</p>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="py-24 text-center opacity-30">
                  <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="w-12 h-12" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">No hay registros de auditoría para esta consulta.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogViewer;
