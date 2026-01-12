
import React from 'react';
import { useGlobal } from '../context/GlobalContext';
import { UserRole } from '../types';
import { Lock, ShieldAlert, Fingerprint, EyeOff, ShieldCheck } from 'lucide-react';

interface IdentityGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

const IdentityGate: React.FC<IdentityGateProps> = ({ children, allowedRoles, fallback }) => {
  const { user } = useGlobal();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="p-16 glass-card rounded-[3.5rem] border-red-500/20 bg-surface text-center space-y-10 animate-in zoom-in-95 shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 technical-grid opacity-5 pointer-events-none" />
           <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600/20" />
           
           <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 border-2 border-red-500/20 rounded-[2rem] animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                 <ShieldAlert className="w-12 h-12 text-red-600" />
              </div>
           </div>

           <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-center gap-3 text-red-600">
                 <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                 <h3 className="text-2xl font-space font-bold uppercase tracking-tighter">Acceso de Red Restringido</h3>
              </div>
              <p className="text-[10px] font-black text-content-muted uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
                 Tu credencial actual no cuenta con privilegios de nivel <span className="text-content-primary">{allowedRoles.join(' / ').toUpperCase()}</span>.
              </p>
           </div>

           <div className="pt-8 border-t border-content-muted/10 flex flex-col items-center gap-6">
              <div className="flex items-center gap-3 px-6 py-3 glass rounded-full border-content-muted/20">
                 <Fingerprint className="w-4 h-4 text-content-muted" />
                 <span className="text-[9px] font-black text-content-muted uppercase tracking-widest">Protocolo de Identidad Rosports</span>
              </div>
              <button className="text-[10px] font-black text-brand-blue uppercase border-b border-brand-blue/30 pb-0.5 hover:text-brand-blue/70 transition-all">Solicitar Escalación de Privilegios</button>
           </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default IdentityGate;
