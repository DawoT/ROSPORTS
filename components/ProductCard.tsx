import React, { useState, useCallback } from 'react';
import { ShoppingCart, Heart, Eye, Check, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { SIZES } from '../constants';
import { useInventory } from '../hooks/useInventory';
import { DealBadge, EnterpriseIconButton } from './Primitives';

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onAddToCart: (product: Product, size: number, color: string) => void;
  onViewDetails: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onAddToCart,
  onViewDetails,
  onQuickView,
  onToggleWishlist,
}) => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { audit, availableSizesForColor } = useInventory(product, selectedSize, selectedColor);

  const handlePurchase = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (audit.canExecute && selectedSize && selectedColor) {
        onAddToCart(product, selectedSize, selectedColor);
        setIsAddedFeedback(true);
        setTimeout(() => setIsAddedFeedback(false), 2000);
      } else {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
      }
    },
    [audit, selectedSize, selectedColor, onAddToCart, product],
  );

  const hasOffer = product.originalPrice && product.originalPrice > product.price;
  const isOutOfStock = product.status === 'out_of_stock';

  return (
    <article
      className={`group relative glass rounded-[2.5rem] overflow-hidden transition-all duration-700 shadow-sm border border-content-muted/10 flex flex-col h-full ${
        isOutOfStock
          ? 'opacity-80 grayscale'
          : 'hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] hover:border-brand-blue/30'
      }`}
    >
      {/* Strategic Offer Badge */}
      {hasOffer && (
        <div className='absolute top-0 left-0 z-40'>
          <DealBadge
            label={`-${Math.round((1 - product.price / product.originalPrice) * 100)}% RED ALERT`}
          />
        </div>
      )}

      {/* Floating System Controls */}
      <div className='absolute top-6 right-6 z-40 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500'>
        <EnterpriseIconButton
          icon={<Eye className='w-5 h-5' />}
          label='Quick View'
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className='bg-main/90 border-brand-blue/20 text-brand-blue hover:bg-brand-blue hover:text-white shadow-xl'
        />
        <EnterpriseIconButton
          icon={
            <Heart
              className={`w-5 h-5 ${isWishlisted ? 'fill-brand-offer text-brand-offer border-brand-offer' : ''}`}
            />
          }
          label='Favorites'
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product);
          }}
          className='bg-main/90 border-brand-blue/20 shadow-xl'
        />
      </div>

      {/* Media Showcase */}
      <div
        className='relative h-72 md:h-80 cursor-pointer flex items-center justify-center p-12 overflow-hidden bg-gradient-to-b from-brand-blue/[0.04] to-transparent'
        onClick={() => onViewDetails(product)}
      >
        <div className='absolute inset-0 technical-grid opacity-10' />
        <img
          src={product.image}
          alt={product.name}
          className='relative w-full h-full object-contain transition-all duration-1000 group-hover:scale-115 group-hover:rotate-[-5deg] drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-10'
        />

        {isOutOfStock && (
          <div className='absolute inset-0 z-20 flex items-center justify-center bg-main/60 backdrop-blur-md'>
            <span className='bg-content-primary text-main px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl border border-white/10'>
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Body Metadata */}
      <div className='p-8 space-y-8 flex-1 flex flex-col relative z-20'>
        <div className='space-y-1.5'>
          <div className='flex items-center justify-between text-[9px] font-black uppercase tracking-[0.4em] text-brand-blue'>
            <span>{product.brand}</span>
            <div className='flex items-center gap-1.5'>
              <ShieldCheck className='w-3 h-3' />
              <span className='opacity-70'>Authentic Hub</span>
            </div>
          </div>
          <h2 className='text-2xl font-bold font-space text-content-primary uppercase tracking-tighter leading-tight group-hover:text-brand-blue transition-colors'>
            {product.name}
          </h2>
        </div>

        {/* Technical Selectors */}
        <div className='space-y-6'>
          <div className='flex gap-2.5'>
            {product.colors?.map((color) => (
              <button
                key={color}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                className={`w-9 h-9 rounded-xl border-2 transition-all shadow-md relative group ${
                  selectedColor === color
                    ? 'border-brand-blue scale-110 shadow-blue-500/30'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && (
                  <div className='absolute inset-1 border border-white/30 rounded-lg' />
                )}
              </button>
            ))}
          </div>

          <div className='grid grid-cols-6 gap-2'>
            {SIZES.slice(0, 6).map((size) => {
              const available = availableSizesForColor.includes(size) && !isOutOfStock;
              return (
                <button
                  key={size}
                  disabled={!available}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`h-10 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center ${
                    selectedSize === size
                      ? 'bg-brand-blue border-brand-blue text-white shadow-xl'
                      : available
                        ? 'glass border-content-muted/20 text-content-primary hover:border-brand-blue'
                        : 'opacity-10 grayscale cursor-not-allowed'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing & Deployment */}
        <div className='mt-auto pt-8 border-t border-content-muted/10 flex items-center justify-between'>
          <div className='flex flex-col'>
            <div className='flex items-baseline gap-3'>
              <span className='text-3xl font-bold font-space text-content-primary tracking-tighter'>
                S/ {product.price.toFixed(2)}
              </span>
              {hasOffer && (
                <span className='text-sm font-bold text-content-muted line-through opacity-40'>
                  S/ {product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            {hasOffer && (
              <span className='text-[10px] font-black text-brand-offer uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2'>
                <div className='w-1.5 h-1.5 bg-brand-offer rounded-full animate-pulse' />
                Ahorro de S/ {(product.originalPrice! - product.price).toFixed(0)}
              </span>
            )}
          </div>

          <div className='relative'>
            <button
              onClick={handlePurchase}
              disabled={isOutOfStock}
              className={`w-16 h-16 flex items-center justify-center rounded-[1.5rem] transition-all shadow-2xl active:scale-95 group/buy ${
                isAddedFeedback
                  ? 'bg-emerald-600 text-white scale-110 shadow-emerald-500/20'
                  : isOutOfStock
                    ? 'bg-content-muted/10 text-content-muted cursor-not-allowed opacity-50'
                    : 'bg-content-primary text-main hover:bg-brand-blue hover:text-white'
              }`}
            >
              {isAddedFeedback ? (
                <Check className='w-7 h-7 animate-in zoom-in' />
              ) : (
                <ShoppingCart className='w-7 h-7 group-hover/buy:scale-110 transition-transform' />
              )}
            </button>

            {showTooltip && (
              <div className='absolute bottom-full mb-6 right-0 w-48 glass p-5 rounded-[1.5rem] border-brand-offer/40 text-center animate-in slide-in-from-bottom-4 shadow-2xl'>
                <p className='text-[9px] font-black text-brand-offer uppercase tracking-widest leading-tight'>
                  Configuración Técnica Requerida
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
