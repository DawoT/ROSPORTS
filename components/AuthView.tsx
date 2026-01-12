
import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Lock, Mail, User as UserIcon, ArrowRight, Zap, 
  RefreshCw, Eye, EyeOff, Key, Shield, Star
} from 'lucide-react';
import { User } from '../types';
import { EnterpriseInput, EnterpriseButton } from './Primitives';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authStep, setAuthStep] = useState<string>('');
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const authLogs = [
    "Verificando cuenta...",
    "Validando beneficios exclusive...",
    "Preparando tu catálogo personalizado...",
    "Acceso concedido. ¡Bienvenido!"
  ];

  const handleAuth = async (isGoogle: boolean = false) => {
    setIsLoading(true);
    for (let i = 0; i < authLogs.length; i++) {
      setAuthStep(authLogs[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    const email = formData.email || (isGoogle ? "google.elite@rosports.com" : "usuario@rosports.pe");
    const isAdmin = email.toLowerCase().includes('admin');
    onAuthSuccess({
      id: 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: isGoogle ? "Miembro Google" : (formData.name || email.split('@')[0]),
      email: email,
      role: isAdmin ? 'admin' : 'customer'
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-main transition-colors duration-500 overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#020202] overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 technical-grid opacity-30" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/10 rounded-full animate-pulse" />

        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="flex items-center gap-4 text-blue-500 mb-4">
             <div className="p-3 glass border-blue-500/30 rounded-2xl"><Star className="w-6 h-6 fill-current" /></div>
             <span className="text-xs font-black uppercase tracking-[0.5em]">Club Rosports Exclusive</span>
          </div>
          <h1 className="font-space text-7xl xl:text-8xl font-bold text-white leading-[0.9] uppercase tracking-tighter">TU ESPACIO <br /><span className="text-blue-500">EXCLUSIVE.</span></h1>
          <p className="text-slate-400 font-light text-xl leading-relaxed">Tu cuenta es la llave a lanzamientos anticipados, eventos VIP y beneficios personalizados.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 relative">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-main/95 backdrop-blur-[40px] flex flex-col items-center justify-center space-y-8 animate-in fade-in" role="alert">
             <div className="relative">
                <div className="w-24 h-24 border-2 border-blue-500/20 rounded-full animate-spin border-t-blue-500" />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 animate-pulse fill-current" />
             </div>
             <div className="text-center space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Sincronizando Cuenta</h3>
                <p className="text-[11px] font-bold text-content-muted uppercase tracking-widest h-4">{authStep}</p>
             </div>
          </div>
        )}

        <button onClick={onBack} className="absolute top-10 right-10 text-[10px] font-black text-content-muted hover:text-blue-500 uppercase tracking-widest transition-colors flex items-center gap-2 group outline-none">
          VOLVER A LA TIENDA <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3">
            <h2 className="font-space text-4xl font-bold text-content-primary uppercase tracking-tight leading-none">{mode === 'login' ? 'INICIAR SESIÓN' : 'ÚNETE AL CLUB'}</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500">ACCESO SEGURO ROSPORTS</p>
          </div>

          <div className="space-y-3">
             <button onClick={() => handleAuth(true)} className="w-full py-5 glass border-content-muted/10 rounded-2xl flex items-center justify-center gap-4 hover:border-blue-500 transition-all group shadow-sm bg-surface/50">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-content-primary">Ingresar con Google</span>
             </button>
             <div className="flex items-center gap-4 py-1" aria-hidden="true">
                <div className="h-px flex-1 bg-content-muted/10" /><span className="text-[7px] font-black text-content-muted uppercase tracking-widest">O USA TU CORREO</span><div className="h-px flex-1 bg-content-muted/10" />
             </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleAuth(false); }} className="space-y-4">
            {mode === 'register' && (
              <EnterpriseInput label="Nombre Completo" placeholder="EJ: JUAN PÉREZ" icon={<UserIcon className="w-3 h-3" />} required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            )}
            <EnterpriseInput label="Correo Electrónico" type="email" placeholder="hola@ejemplo.pe" icon={<Mail className="w-3 h-3" />} required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <div className="space-y-2 relative">
              <EnterpriseInput label="Contraseña" type={showPassword ? 'text' : 'password'} icon={<Lock className="w-3 h-3" />} required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-10 text-content-muted hover:text-blue-500 transition-colors" aria-label="Ver password">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            <EnterpriseButton type="submit" size="lg" className="w-full mt-4" disabled={isLoading}>{mode === 'login' ? 'ENTRAR A MI CUENTA' : 'CREAR MI CUENTA'} <Key className="w-4 h-4" /></EnterpriseButton>
          </form>

          <div className="pt-6 border-t border-content-muted/10 text-center">
             <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-[8px] font-black uppercase tracking-[0.4em] text-content-muted hover:text-blue-500 transition-colors outline-none">{mode === 'login' ? '¿AÚN NO ERES MIEMBRO? REGÍSTRATE' : '¿YA TIENES CUENTA? INICIA SESIÓN'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
