
import React, { useState } from 'react';
import { Lock, ShieldAlert, Key, ArrowRight, User, LogOut } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { EnterpriseInput } from './Primitives';

const SessionLockOverlay: React.FC = () => {
  const { user, setUser, addAuditLog } = useGlobal();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!user || !user.isLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 4) {
      setUser({ ...user, isLocked: false });
      addAuditLog('auth', 'system', user.id, 'Terminal Desbloqueado exitosamente');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-main transition-colors duration-500">
      <div className="absolute inset-0 technical-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-red-600/5" />
      
      <div className="relative w-full max-w-xl p-12 text-center space-y-12 animate-in zoom-in-95">
         <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 border-2 border-blue-500/20 rounded-[2.5rem] animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-2 border border-blue-500/10 rounded-[2rem] animate-reverse-spin" style={{ animationDuration: '6s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
               <Lock className="w-12 h-12 text-blue-500" />
            </div>
         </div>

         <div className="space-y-4">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Terminal de Seguridad ROSPORTS</h2>
            <h3 className="text-4xl font-space font-bold text-content-primary uppercase tracking-tighter leading-none">TERMINAL <span className="text-red-500">BLOQUEADO</span></h3>
            <div className="flex items-center justify-center gap-3 py-2 glass rounded-full border-content-muted/10 max-w-[280px] mx-auto bg-surface/50">
               <User className="w-4 h-4 text-content-muted" />
               <span className="text-[10px] font-bold text-content-secondary uppercase">{user.name} // {user.role}</span>
            </div>
         </div>

         <form onSubmit={handleUnlock} className="space-y-6 max-w-sm mx-auto">
            <EnterpriseInput 
              label="Llave Operador"
              type="password"
              autoFocus
              placeholder="INGRESAR LLAVE..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={error ? "LLAVE INVÁLIDA" : ""}
              icon={<Key className="w-3 h-3" />}
              className="text-center text-xl tracking-[0.5em]"
            />

            <button 
              type="submit"
              className="w-full py-6 bg-content-primary text-main rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 group min-h-[60px]"
            >
              DESBLOQUEAR NODO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
         </form>

         <div className="pt-8 border-t border-content-muted/10 flex flex-col items-center gap-6">
            <button onClick={handleLogout} className="text-[10px] font-black text-content-muted hover:text-red-500 uppercase tracking-widest flex items-center gap-3 transition-colors outline-none focus-visible:text-red-500">
               <LogOut className="w-4 h-4" /> ABORTAR SESIÓN ACTUAL
            </button>
            <div className="flex items-center gap-4 opacity-20 grayscale">
               <ShieldAlert className="w-4 h-4 text-content-primary" />
               <span className="text-[8px] font-black text-content-primary uppercase tracking-widest">Protocolo de seguridad AES-256 Activo</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SessionLockOverlay;
