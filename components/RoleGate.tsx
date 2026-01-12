import React from 'react';
import { useGlobal } from '../context/GlobalContext';
import { UserRole } from '../types';
import { Lock } from 'lucide-react';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

const RoleGate: React.FC<RoleGateProps> = ({ children, allowedRoles, fallback }) => {
  const { user } = useGlobal();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="p-12 glass-card rounded-[3rem] border-red-500/20 bg-red-500/5 text-center space-y-6">
           <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-red-500" />
           </div>
           <div className="space-y-2">
              <h3 className="text-xl font-space font-bold text-content-primary uppercase tracking-tight">Acceso Restringido</h3>
              <p className="text-[10px] font-black text-content-muted uppercase tracking-widest">Se requiere autorización de Nivel: {allowedRoles.join(', ').toUpperCase()}</p>
           </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default RoleGate;