import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import CartSidebar from './CartSidebar';
import WishlistSidebar from './WishlistSidebar';
import { useGlobal } from '../context/GlobalContext';
import { ViewState } from '../types';
import {
  CheckCircle,
  Info,
  X,
  Zap,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  setView,
  isCartOpen,
  setIsCartOpen,
  isWishlistOpen,
  setIsWishlistOpen,
}) => {
  const { notifications, removeNotification, activePromos } = useGlobal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPromo, setShowPromo] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isCheckout = currentView === 'checkout';

  return (
    <div className='min-h-screen bg-main transition-colors duration-500 overflow-x-hidden'>
      {!isCheckout && (
        <header className='fixed top-0 left-0 w-full z-[400] transition-all duration-700 ease-in-out'>
          {/* Global Enterprise Promo Banner */}
          {showPromo && activePromos.length > 0 && (
            <div
              className={`relative h-11 md:h-14 bg-slate-950 text-white overflow-hidden border-b border-white/5 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isScrolled ? 'h-0 opacity-0 -translate-y-full' : 'h-11 md:h-14 opacity-100 translate-y-0'}`}
            >
              <div className='absolute inset-0 technical-grid opacity-20' />
              <div className='relative h-full px-6 flex items-center justify-center gap-12'>
                <div className='flex items-center gap-4'>
                  <Sparkles className='w-4 h-4 text-brand-blue fill-current animate-pulse' />
                  <p className='text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] whitespace-nowrap'>
                    MEMBRESÍA EXCLUSIVE ACTIVA:{' '}
                    <span className='text-brand-blue'>ENVÍO GRATUITO</span> EN TODA LA RED LIMA
                  </p>
                </div>
                <button
                  onClick={() => setShowPromo(false)}
                  className='hover:text-brand-blue transition-colors ml-4 p-1'
                  aria-label='Cerrar promo'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
            </div>
          )}

          <Navbar
            currentView={currentView}
            setView={setView}
            toggleCart={() => setIsCartOpen(!isCartOpen)}
            toggleWishlist={() => setIsWishlistOpen(!isWishlistOpen)}
            isScrolled={isScrolled}
          />
        </header>
      )}

      {/* Notification Mesh - Prioridad sobre el Header */}
      <div className='fixed top-28 right-8 z-[500] flex flex-col gap-5 w-full max-w-sm pointer-events-none'>
        {notifications.map((n) => (
          <div
            key={n.id}
            className='pointer-events-auto glass-card p-7 rounded-[2.5rem] enterprise-border shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center gap-6 animate-in slide-in-from-right-full duration-500'
          >
            <div
              className={`p-4 rounded-2xl ${
                n.type === 'error'
                  ? 'bg-red-500/10 text-red-500'
                  : n.type === 'warning'
                    ? 'bg-amber-500/10 text-amber-500'
                    : n.type === 'info'
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'bg-emerald-500/10 text-emerald-500'
              }`}
            >
              {n.type === 'success' ? (
                <CheckCircle className='w-6 h-6' />
              ) : (
                <Info className='w-6 h-6' />
              )}
            </div>
            <div className='flex-1 space-y-1'>
              <p className='text-[11px] font-black uppercase tracking-[0.2em] text-content-primary leading-tight'>
                {n.message}
              </p>
              <p className='text-[8px] font-bold text-content-muted uppercase tracking-widest'>
                System_Notify
              </p>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className='text-content-muted hover:text-red-500 transition-all'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        ))}
      </div>

      <main
        className={`relative transition-all duration-700 ${isCheckout ? 'pt-0' : isScrolled ? 'pt-24 md:pt-28' : 'pt-44 md:pt-52'}`}
      >
        {children}
      </main>

      {!isCheckout && (
        <footer className='py-40 px-10 border-t border-content-muted/10 bg-surface relative overflow-hidden'>
          <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent' />
          <div className='max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24'>
            <div className='md:col-span-2 space-y-12'>
              <div className='flex items-center gap-4'>
                <Zap className='w-8 h-8 text-brand-blue fill-current' />
                <h2 className='font-space font-bold text-5xl uppercase tracking-tighter text-content-primary'>
                  RO<span className='text-brand-blue'>SPORTS</span>
                </h2>
              </div>
              <p className='text-content-secondary font-medium text-lg leading-relaxed max-w-md'>
                Llevando el diseño futurista y la ingeniería de calzado al siguiente nivel. Tu
                victoria comienza con tu estilo.
              </p>
            </div>
            <div className='space-y-10'>
              <h4 className='text-[11px] font-black uppercase tracking-[0.5em] text-brand-blue'>
                Canales de Asistencia
              </h4>
              <ul className='space-y-5 text-sm font-bold text-content-secondary uppercase tracking-widest'>
                <li className='hover:text-brand-blue cursor-pointer transition-colors flex items-center gap-2'>
                  <ChevronRight className='w-4 h-4' /> Seguimiento de Orden
                </li>
                <li className='hover:text-brand-blue cursor-pointer transition-colors flex items-center gap-2'>
                  <ChevronRight className='w-4 h-4' /> Garantía Rosports
                </li>
              </ul>
            </div>
            <div className='space-y-10'>
              <h4 className='text-[11px] font-black uppercase tracking-[0.5em] text-brand-blue'>
                Nodo Newsletter
              </h4>
              <div className='space-y-6'>
                <p className='text-xs text-content-muted uppercase tracking-widest font-medium'>
                  Recibe acceso a preventas exclusivas.
                </p>
                <div className='relative'>
                  <input
                    type='email'
                    placeholder='TU EMAIL CORPORATIVO'
                    className='w-full bg-main border border-content-muted/10 p-6 rounded-[1.5rem] text-[10px] font-black outline-none focus:border-brand-blue shadow-inner'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-40 pt-10 border-t border-content-muted/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40'>
            <p className='text-[10px] font-black uppercase tracking-widest'>
              © 2025 ROSPORTS // Global Enterprise Solutions
            </p>
            <div className='flex items-center gap-8'>
              <ShieldCheck className='w-5 h-5' />
              <span className='text-[9px] font-black uppercase tracking-widest'>
                Protocolo de seguridad activo
              </span>
            </div>
          </div>
        </footer>
      )}

      {/* Sidebars con Z-INDEX superior al Header y Notifications */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setView('checkout');
        }}
      />
      <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};

export default Layout;
