
import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, ShieldCheck, Zap, Check } from 'lucide-react';
import { Product } from '../types';
import { SIZES } from '../constants';
import { useInventory } from '../hooks/useInventory';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: number, color: string) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product?.colors?.[0] || null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(null);
      setSelectedColor(product.colors?.[0] || null);
    }
  }, [product?.id]);

  const { audit, availableSizesForColor } = useInventory(product, selectedSize, selectedColor);

  if (!product) return null;

  const handlePurchase = () => {
    if (!audit.canExecute) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }
    onAddToCart(product, selectedSize!, selectedColor!);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-main/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl glass-card rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row max-h-[95vh] md:max-h-[90vh] animate-in zoom-in-95 border border-content-muted/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] bg-surface/98">
        
        {/* Lado A: Media Showcase */}
        <div className="w-full lg:w-3/5 p-6 md:p-10 flex flex-col relative overflow-hidden border-b lg:border-b-0 lg:border-r border-content-muted/10 bg-content-muted/[0.01]">
          <div className="absolute inset-0 technical-grid opacity-20" />
          
          <div className="flex justify-between items-start relative z-10">
             <div className="space-y-1">
                <div className="flex items-center gap-2 text-brand-blue">
                   <ShieldCheck className="w-5 h-5" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">Autenticidad Certificada</span>
                </div>
             </div>
             <button onClick={onClose} className="p-3 glass rounded-xl text-content-muted hover:text-red-500 transition-all"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
             <img src={product.image} alt={product.name} className="relative z-10 w-full h-auto max-w-[420px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)]" />
          </div>
        </div>

        {/* Lado B: Configuración */}
        <div className="w-full lg:w-2/5 p-6 md:p-10 bg-main flex flex-col overflow-y-auto custom-scrollbar">
          <div className="space-y-8 flex-1">
            <div className="space-y-3">
              <span className="text-[9px] font-black text-brand-blue uppercase tracking-[0.5em]">{product.brand} // EDICIÓN EXCLUSIVA</span>
              <h2 className="font-space text-4xl font-bold text-content-primary uppercase leading-none tracking-tighter">{product.name}</h2>
              <p className="text-3xl font-space font-bold text-content-primary">S/ {product.price.toFixed(2)}</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-content-muted uppercase tracking-widest">Colorway Seleccionado</p>
                <div className="flex gap-3">
                   {product.colors?.map(color => (
                     <button 
                      key={color} 
                      onClick={() => setSelectedColor(color)} 
                      className={`w-11 h-11 rounded-xl border-2 transition-all shadow-xl relative ${selectedColor === color ? 'border-brand-blue scale-110' : 'border-content-muted/10 opacity-50'}`} 
                      style={{ backgroundColor: color }}
                      aria-label={`Seleccionar color ${color}`}
                     />
                   ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-content-muted uppercase tracking-widest">Talla Disponible (PE)</p>
                <div className="grid grid-cols-5 gap-2.5">
                   {SIZES.map(size => {
                     const available = availableSizesForColor.includes(size);
                     return (
                       <button 
                        key={size} 
                        disabled={!available} 
                        onClick={() => setSelectedSize(size)} 
                        className={`h-12 rounded-xl border text-[11px] font-black transition-all flex items-center justify-center ${
                          selectedSize === size ? 'bg-brand-blue border-brand-blue text-white shadow-2xl' : 
                          available ? 'glass border-content-muted/20 text-content-primary hover:border-brand-blue' : 
                          'opacity-10 grayscale cursor-not-allowed'
                        }`}
                       >
                         {size}
                       </button>
                     );
                   })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 relative">
            {showTooltip && (
              <div className="absolute bottom-full mb-4 w-full glass p-5 rounded-[1.5rem] border-red-500/40 text-center bg-surface/95 backdrop-blur-xl">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Define tu configuración para continuar</p>
              </div>
            )}
            <button 
              onClick={handlePurchase} 
              className={`w-full py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.5em] flex items-center justify-center gap-4 transition-all min-h-[60px] ${
                audit.canExecute ? 'bg-content-primary text-main shadow-2xl hover:bg-brand-blue hover:text-white' : 'bg-content-muted/10 text-content-muted cursor-not-allowed opacity-40'
              }`}
            >
              {isAdded ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
              {isAdded ? 'AÑADIDO' : 'AÑADIR A MI BOLSA'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
