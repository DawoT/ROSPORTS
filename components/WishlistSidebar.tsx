
import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistSidebar: React.FC<WishlistSidebarProps> = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist, addToCart } = useGlobal();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-md glass border-l border-content-muted/10 z-[210] transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full bg-main transition-colors duration-500">
          <div className="p-8 border-b border-content-muted/10 flex items-center justify-between bg-content-muted/[0.01]">
            <div className="flex items-center gap-4">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              <h2 className="text-2xl font-space font-bold text-content-primary uppercase tracking-tighter">MIS FAVORITOS</h2>
            </div>
            <button onClick={onClose} className="p-3 glass rounded-2xl hover:text-red-500 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20 opacity-40">
                <Heart className="w-12 h-12 text-content-muted" />
                <p className="text-content-primary font-black uppercase tracking-[0.4em] text-xs">No has guardado nada aún</p>
              </div>
            ) : (
              <div className="space-y-8">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 h-24 bg-surface rounded-[1.5rem] overflow-hidden border border-content-muted/10 p-3 shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-3">
                        <h4 className="font-bold text-xs text-content-primary uppercase font-space tracking-tight truncate">{item.name}</h4>
                        <button onClick={() => removeFromWishlist(item.id)} className="p-1 text-content-muted hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <button 
                        onClick={() => {
                          const defaultVariant = item.variants?.[0] || { size: 40, color: item.colors?.[0] || '#000' };
                          addToCart(item, defaultVariant.size, defaultVariant.color);
                        }}
                        className="mt-3 w-full py-3 bg-content-primary text-main text-[9px] font-black uppercase tracking-[0.3em] hover:bg-brand-blue hover:text-white transition-all rounded-xl flex items-center justify-center gap-3 shadow-lg"
                      >
                        AÑADIR A BOLSA <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default WishlistSidebar;
