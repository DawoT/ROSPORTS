import React, { useState } from 'react';
import {
  ShoppingBag,
  Zap,
  Heart,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  Activity,
  User,
  LayoutGrid,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { ViewState } from '../types';
import { EnterpriseIconButton } from './Primitives';

const Navbar: React.FC<{
  currentView: ViewState;
  setView: (view: ViewState) => void;
  toggleCart: () => void;
  toggleWishlist: () => void;
  isScrolled: boolean;
}> = ({ currentView, setView, toggleCart, toggleWishlist, isScrolled }) => {
  const { user, cartItems, wishlistItems, theme, toggleTheme } = useGlobal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <nav
      className={`w-full transition-all duration-500 px-6 lg:px-12 ${isScrolled ? 'py-3' : 'py-6'}`}
    >
      <div
        className={`max-w-[1800px] mx-auto transition-all duration-700 ${isScrolled ? 'glass rounded-[2rem] shadow-2xl py-3 px-8' : 'bg-transparent py-2 px-0'} flex items-center justify-between`}
      >
        {/* Brand Section */}
        <div className='flex items-center gap-12'>
          <div
            onClick={() => setView('home')}
            className='flex items-center gap-3 cursor-pointer group'
          >
            <div className='w-10 h-10 bg-brand-blue flex items-center justify-center rounded-xl shadow-lg group-hover:scale-110 transition-transform'>
              <Zap className='text-white w-5 h-5 fill-current' />
            </div>
            <span className='font-space font-bold text-2xl tracking-tighter text-content-primary uppercase'>
              RO<span className='text-brand-blue'>SPORTS</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className='hidden lg:flex items-center gap-10'>
            {['HOMBRES', 'MUJERES', 'COLECCIONES'].map((label) => (
              <button
                key={label}
                className='text-[10px] font-black uppercase tracking-[0.3em] text-content-secondary hover:text-brand-blue transition-colors flex items-center gap-2'
              >
                {label} <ChevronDown className='w-3 h-3 opacity-50' />
              </button>
            ))}
            <div className='h-4 w-px bg-content-muted/20' />
            <button
              onClick={() => setView('shop')}
              className='text-[10px] font-black uppercase tracking-[0.3em] text-brand-offer flex items-center gap-2 animate-pulse'
            >
              <Activity className='w-3.5 h-3.5' /> LANZAMIENTOS
            </button>
          </div>
        </div>

        {/* Action Section */}
        <div className='flex items-center gap-3'>
          <div className='hidden xl:flex items-center gap-3 px-4 py-2 bg-content-muted/5 rounded-full border border-content-muted/10 mr-4'>
            <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse' />
            <span className='text-[8px] font-black text-content-muted uppercase tracking-widest'>
              Lima Node Online
            </span>
          </div>

          <div className='flex items-center gap-1'>
            <EnterpriseIconButton
              onClick={toggleTheme}
              icon={theme === 'dark' ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
              label='Cambiar tema'
              variant='simple'
            />
            <div className='relative'>
              <EnterpriseIconButton
                onClick={toggleWishlist}
                icon={
                  <Heart
                    className={`w-4 h-4 ${wishlistItems.length > 0 ? 'fill-brand-offer text-brand-offer' : ''}`}
                  />
                }
                label='Favoritos'
                variant='simple'
              />
              {wishlistItems.length > 0 && (
                <span className='absolute top-1 right-1 w-2 h-2 bg-brand-offer rounded-full border border-main' />
              )}
            </div>

            <button
              onClick={toggleCart}
              className='group relative flex items-center gap-3 ml-2 px-5 py-2.5 bg-content-primary text-main rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all shadow-xl'
            >
              <ShoppingBag className='w-4 h-4' />
              <span>{cartCount}</span>
            </button>
          </div>

          <div className='h-8 w-px bg-content-muted/10 mx-4 hidden md:block' />

          {user ? (
            <button
              onClick={() => setView('dashboard')}
              className='w-10 h-10 rounded-full border-2 border-brand-blue p-0.5 hover:scale-110 transition-transform overflow-hidden'
            >
              <div className='w-full h-full rounded-full bg-content-muted/10 flex items-center justify-center text-brand-blue'>
                {user.avatar ? (
                  <img src={user.avatar} className='w-full h-full object-cover' />
                ) : (
                  <User className='w-5 h-5' />
                )}
              </div>
            </button>
          ) : (
            <button
              onClick={() => setView('auth')}
              className='hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-content-primary hover:text-brand-blue transition-colors px-4 py-2'
            >
              ACCESO <LayoutGrid className='w-4 h-4' />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(true)}
            className='lg:hidden p-2 text-content-primary'
          >
            <Menu className='w-6 h-6' />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Z-INDEX 250 para asegurar visibilidad sobre el header pero bajo sidebars críticos */}
      {mobileMenuOpen && (
        <div className='fixed inset-0 z-[250] lg:hidden animate-in fade-in duration-300'>
          <div
            className='absolute inset-0 bg-black/60 backdrop-blur-md'
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className='absolute top-0 right-0 h-full w-full max-w-xs bg-surface p-10 flex flex-col gap-8 shadow-2xl animate-in slide-in-from-right duration-500'>
            <div className='flex justify-between items-center mb-6'>
              <span className='font-space font-bold text-xl uppercase'>Menú</span>
              <button onClick={() => setMobileMenuOpen(false)} className='p-3 glass rounded-xl'>
                <X className='w-6 h-6' />
              </button>
            </div>
            <div className='flex flex-col gap-6'>
              {['HOMBRES', 'MUJERES', 'COLECCIONES', 'TIENDAS'].map((label) => (
                <button
                  key={label}
                  onClick={() => setMobileMenuOpen(false)}
                  className='text-left text-xl font-bold uppercase tracking-tighter hover:text-brand-blue transition-colors'
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => {
                  setView('shop');
                  setMobileMenuOpen(false);
                }}
                className='text-left text-xl font-bold uppercase tracking-tighter text-brand-offer'
              >
                Lanzamientos
              </button>
            </div>
            <div className='mt-auto pt-10 border-t border-content-muted/10'>
              <button
                onClick={() => {
                  setView('auth');
                  setMobileMenuOpen(false);
                }}
                className='w-full py-4 bg-brand-blue text-white rounded-xl font-black text-[10px] uppercase tracking-widest'
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
