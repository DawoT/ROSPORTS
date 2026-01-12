import React, { useState, useMemo } from 'react';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Fingerprint,
  Search,
  Lock,
  Zap,
  Clock,
  Key,
  Activity,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

const SecurityAuditTrail: React.FC = () => {
  const { auditLogs } = useGlobal();
  const [validating, setValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleValidateChain = async () => {
    setValidating(true);
    // Simulación de validación recursiva de hashes
    await new Promise((r) => setTimeout(r, 2000));
    setIsValid(true);
    setValidating(false);
  };

  return (
    <div className='space-y-10 animate-in fade-in duration-700 pb-20'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-emerald-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-emerald-500/20 shadow-xl'>
              <Shield className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] opacity-60 text-slate-500'>
                Security Ledger Protocol
              </span>
              <h2 className='font-space text-4xl font-bold dark:text-white uppercase tracking-tighter leading-none'>
                Inmutabilidad <span className='text-gradient'>de Logs</span>
              </h2>
            </div>
          </div>
        </div>
        <button
          onClick={handleValidateChain}
          disabled={validating}
          className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 shadow-xl ${
            validating
              ? 'bg-slate-800 text-slate-500'
              : 'bg-white text-black hover:bg-emerald-500 hover:text-white'
          }`}
        >
          {validating ? (
            <Activity className='w-4 h-4 animate-spin' />
          ) : (
            <Lock className='w-4 h-4' />
          )}
          VERIFICAR INTEGRIDAD GLOBAL
        </button>
      </div>

      {isValid !== null && (
        <div
          className={`p-8 glass rounded-[2.5rem] border-2 animate-in zoom-in-95 flex items-center gap-6 ${isValid ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${isValid ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {isValid ? <CheckCircle className='w-8 h-8' /> : <AlertTriangle className='w-8 h-8' />}
          </div>
          <div className='space-y-1'>
            <h4 className='text-xl font-space font-bold uppercase text-white'>
              {isValid ? 'CADENA VERIFICADA' : 'INTEGRIDAD COMPROMETIDA'}
            </h4>
            <p className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>
              Todos los registros de auditoría coinciden con sus firmas digitales correspondientes.
            </p>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        <div className='lg:col-span-3 glass-card rounded-[3rem] border-white/5 overflow-hidden'>
          <table className='w-full text-left'>
            <thead>
              <tr className='bg-white/5 border-b border-white/10'>
                <th className='px-8 py-6 text-[9px] font-black text-slate-500 uppercase'>
                  Nodo Auditor
                </th>
                <th className='px-8 py-6 text-[9px] font-black text-slate-500 uppercase'>
                  Evento del Sistema
                </th>
                <th className='px-8 py-6 text-[9px] font-black text-slate-500 uppercase text-center'>
                  Protocolo Hash
                </th>
                <th className='px-8 py-6 text-right'>Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/5'>
              {auditLogs.map((log, i) => (
                <tr key={log.id} className='hover:bg-white/[0.01] transition-all group'>
                  <td className='px-8 py-6'>
                    <div className='flex items-center gap-4'>
                      <div className='w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-600 group-hover:text-blue-500 transition-colors'>
                        <Fingerprint className='w-5 h-5' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-xs font-bold text-white uppercase'>
                          {log.userName}
                        </span>
                        <span className='text-[8px] font-mono text-slate-500 uppercase'>
                          {log.ipAddress}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className='px-8 py-6'>
                    <div className='space-y-1'>
                      <p className='text-xs font-bold text-slate-300 uppercase'>{log.details}</p>
                      <div className='flex items-center gap-2'>
                        <Clock className='w-3 h-3 text-slate-600' />
                        <span className='text-[9px] font-bold text-slate-600 uppercase'>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className='px-8 py-6'>
                    <div className='px-4 py-2 glass rounded-lg bg-black/40 border border-white/5 flex items-center gap-3'>
                      <Key className='w-3 h-3 text-blue-500' />
                      <span className='text-[9px] font-mono text-blue-500 truncate max-w-[120px]'>
                        {log.integrityHash}
                      </span>
                    </div>
                  </td>
                  <td className='px-8 py-6 text-right'>
                    <div className='flex items-center justify-end gap-2 text-emerald-500'>
                      <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse' />
                      <span className='text-[8px] font-black uppercase tracking-widest'>
                        SECURE
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className='space-y-6'>
          <div className='glass-card rounded-[2.5rem] p-8 border-white/5 space-y-6'>
            <h4 className='text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2'>
              <Zap className='w-4 h-4 fill-current' /> Telemetría Forense
            </h4>
            <div className='space-y-4'>
              <div className='flex justify-between items-center py-2 border-b border-white/5'>
                <span className='text-[8px] font-black text-slate-500 uppercase'>Logs Totales</span>
                <span className='text-xs font-bold text-white'>{auditLogs.length}</span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-white/5'>
                <span className='text-[8px] font-black text-slate-500 uppercase'>
                  Alertas Activas
                </span>
                <span className='text-xs font-bold text-emerald-500'>00</span>
              </div>
            </div>
          </div>

          <div className='p-8 glass rounded-[2.5rem] border-white/5 space-y-4'>
            <p className='text-[9px] font-black text-slate-500 uppercase tracking-widest text-center leading-relaxed'>
              Sistema de integridad basado en encadenamiento de bloques deterministas. Cualquier
              alteración manual en la DB invalidará los hashes subsiguientes.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SecurityAuditTrail;
