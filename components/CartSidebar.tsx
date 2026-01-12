
import React from 'react';
import { X, Trash2, ShoppingBag, Truck, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, removeFromCart, updateCartQuantity } = useGlobal();
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeShippingThreshold = 499;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <>
      {/* Backdrop con Z estandarizado */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[800] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Sidebar con Z superior al Backdrop */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md glass border-l border-content-muted/10 z-[810] transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full bg-main transition-colors duration-500">
          <div className="p-8 border-b border-content-muted/10 flex items-center justify-between bg-content-muted/[0.01]">
            <div className="flex items-center gap-4">
              <ShoppingBag className="w-6 h-6 text-brand-blue" />
              <h2 className="text-2xl font-space font-bold text-content-primary uppercase tracking-tighter">MI BOLSA</h2>
            </div>
            <button onClick={onClose} className="p-3 glass rounded-2xl hover:text-red-500 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {cartItems.length > 0 && (
              <div className="p-8 glass rounded-[2.5rem] border-brand-blue/20 bg-brand-blue/5 space-y-5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-blue">
                  <div className="flex items-center gap-3"><Truck className="w-4 h-4" /> Envío Express</div>
                  <span>{progressToFreeShipping >= 100 ? 'ACTIVO' : `Faltan S/ ${(freeShippingThreshold - subtotal).toFixed(0)}`}</span>
                </div>
                <div className="h-1.5 w-full bg-content-muted/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${progressToFreeShipping}%` }} />
                </div>
                {progressToFreeShipping >= 100 && (
                  <p className="text-[10px] font-bold text-emerald-500 uppercase text-center flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Envío gratuito desbloqueado.
                  </p>
                )}
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20 opacity-40">
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center border border-content-muted/10">
                   <ShoppingBag className="w-12 h-12 text-content-muted" />
                </div>
                <p className="text-content-primary font-black uppercase tracking-[0.4em] text-xs">Tu bolsa está vacía</p>
              </div>
            ) : (
              <div className="space-y-8">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-6 group">
                    <div className="w-24 h-24 bg-surface rounded-2xl border border-content-muted/10 p-2 shrink-0 overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm text-content-primary uppercase truncate font-space tracking-tight">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} className="p-1 text-content-muted hover:text-red-500" aria-label="Eliminar ítem">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-5 bg-surface rounded-xl p-1.5 px-4 border border-content-muted/10">
                          <button onClick={() => updateCartQuantity(item.id, item.selectedSize, -1, item.selectedColor)} className="hover:text-brand-blue min-h-[30px] min-w-[30px]" aria-label="Disminuir">-</button>
                          <span className="text-[11px] font-black">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.selectedSize, 1, item.selectedColor)} className="hover:text-brand-blue min-h-[30px] min-w-[30px]" aria-label="Aumentar">+</button>
                        </div>
                        <span className="font-space font-bold">S/ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-8 glass border-t border-content-muted/10 space-y-8 bg-gradient-to-t from-content-muted/[0.04] to-transparent">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-brand-blue font-black uppercase tracking-[0.4em] text-[10px]">Inversión Total</span>
                  <p className="text-4xl font-space font-bold text-content-primary tracking-tighter">S/ {subtotal.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1 justify-end"><Zap className="w-3 h-3 fill-current" /> +{Math.floor(subtotal)} Puntos</p>
                </div>
              </div>
              <button 
                onClick={onCheckout} 
                className="w-full py-6 bg-content-primary text-main font-black text-xs uppercase tracking-[0.6em] rounded-3xl flex items-center justify-center gap-6 hover:bg-brand-blue hover:text-white transition-all shadow-xl min-h-[60px]"
              >
                FINALIZAR COMPRA <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;
