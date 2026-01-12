
import React from 'react';
import { useGlobal } from '../context/GlobalContext';
import { Capability } from '../types';
import { AuthService } from '../services/authService';
import { Lock } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  capability: Capability;
  fallback?: React.ReactNode;
  hideOnDeny?: boolean;
}

/**
 * Componente Enterprise para control de acceso a nivel de componente.
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({ children, capability, fallback, hideOnDeny }) => {
  const { user } = useGlobal();

  const hasAccess = user && AuthService.hasCapability(user.capabilities, capability);

  if (!hasAccess) {
    if (hideOnDeny) return null;
    return fallback || (
      <div className="p-6 glass rounded-2xl border-amber-500/20 bg-amber-500/5 flex items-center gap-4">
         <Lock className="w-5 h-5 text-amber-500" />
         <p className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest">Capacidad Requerida: {capability}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
