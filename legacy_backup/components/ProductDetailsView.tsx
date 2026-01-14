import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingCart,
  Heart,
  ShieldCheck,
  Zap,
  Check,
  Star,
  Truck,
  Minus,
  Plus,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { Product } from '../types';
import { SIZES } from '../constants';
import { useInventory } from '../hooks/useInventory';
import BoutiqueGallery from './BoutiqueGallery';
import ProductCard from './ProductCard';
import PremiumFeatures from './PremiumFeatures';
import ShopBreadcrumbs from './ShopBreadcrumbs';

interface ProductDetailsViewProps {
  product: Product;
  onBack: () => void;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlistItems, products, setView, setSelectedProduct } =
    useGlobal();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { audit, availableSizesForColor, getVariantStock } = useInventory(
    product,
    selectedSize,
    selectedColor,
  );

  const currentVariant = useMemo(() => {
    return (
      product.variants?.find(
        (v) => v.color === selectedColor && (selectedSize ? v.size === selectedSize : true),
      ) || product.variants?.[0]
    );
  }, [selectedSize, selectedColor, product]);

  const stockAvailable = useMemo(() => {
    if (!currentVariant) return 0;
    return getVariantStock(currentVariant);
  }, [currentVariant, getVariantStock]);

  const galleryImages = useMemo(() => {
    return currentVariant?.images && currentVariant.images.length > 0
      ? currentVariant.images
      : [product.image, product.image, product.image];
  }, [currentVariant, product.image]);

  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 3);
  }, [products, product]);

  const navigateToDetails = (p: Product) => {
    setSelectedProduct(p);
    setView('product-details');
    setQuantity(1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  const handleAddToCart = () => {
    if (audit.canExecute && selectedSize && selectedColor) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, selectedSize, selectedColor);
      }
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const hasOffer = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className='pt-8 pb-32 px-6 lg:px-16 max-w-[1440px] mx-auto animate-in fade-in duration-700'>
      <ShopBreadcrumbs
        onNavigate={setView}
        path={[
          { label: 'Colección', view: 'shop' },
          { label: product.category },
          { label: product.name },
        ]}
      />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start'>
        <div className='lg:sticky lg:top-40 space-y-10'>
          <BoutiqueGallery images={galleryImages} />

          <div className='grid grid-cols-2 gap-6'>
            <div className='p-8 glass rounded-[2.5rem] border-content-muted/10 space-y-2 bg-surface'>
              <p className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
                Tecnología de Material
              </p>
              <p className='text-sm font-bold text-content-primary uppercase font-space'>
                {product.material || 'Hybrid-Mesh Elite'}
              </p>
            </div>
            <div className='p-8 glass rounded-[2.5rem] border-content-muted/10 space-y-2 bg-surface'>
              <p className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
                Peso Certificado
              </p>
              <p className='text-sm font-bold text-content-primary uppercase font-space'>
                {product.weight}
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-12'>
          <div className='space-y-8'>
            <div className='flex justify-between items-start gap-8'>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <span className='text-brand-blue text-[11px] font-bold uppercase tracking-[0.4em]'>
                    {product.brand}
                  </span>
                  {hasOffer && (
                    <span className='px-3 py-0.5 bg-red-600 text-white text-[9px] font-black rounded uppercase tracking-widest animate-pulse'>
                      Oferta Limitada
                    </span>
                  )}
                </div>
                <h1 className='text-5xl lg:text-7xl font-space font-bold text-content-primary uppercase tracking-tighter leading-[0.9]'>
                  {product.name}
                </h1>
              </div>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-5 glass rounded-3xl transition-all shadow-md ${wishlistItems.some((w) => w.id === product.id) ? 'text-red-600 bg-red-600/5 border-red-600/20' : 'text-content-muted hover:text-content-primary hover:border-brand-blue/40'}`}
              >
                <Heart
                  className={`w-6 h-6 ${wishlistItems.some((w) => w.id === product.id) ? 'fill-current' : ''}`}
                />
              </button>
            </div>

            <div className='flex items-center gap-6'>
              <div className='flex gap-1 text-amber-500'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className='w-4 h-4 fill-current' />
                ))}
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4 text-emerald-500' />
                <span className='text-[10px] font-bold text-content-muted uppercase tracking-widest'>
                  Autenticidad Verificada
                </span>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-baseline gap-6'>
                <span className='text-5xl lg:text-6xl font-space font-bold text-brand-blue'>
                  S/ {product.price.toFixed(2)}
                </span>
                {hasOffer && (
                  <div className='flex flex-col'>
                    <span className='text-2xl font-space text-content-muted line-through'>
                      S/ {product.originalPrice!.toFixed(2)}
                    </span>
                    <span className='text-[10px] font-black text-red-600 uppercase tracking-widest mt-1'>
                      Ahorras S/ {(product.originalPrice! - product.price).toFixed(0)}
                    </span>
                  </div>
                )}
              </div>
              <p className='text-content-secondary text-sm leading-relaxed max-w-xl font-medium'>
                {product.description}
              </p>
            </div>
          </div>

          <div className='space-y-12 pt-10 border-t border-content-muted/10'>
            <div className='space-y-5'>
              <p className='text-[10px] font-black text-content-primary uppercase tracking-widest flex items-center gap-3'>
                Colorway:{' '}
                <span className='text-brand-blue font-bold'>
                  {selectedColor || 'Sin selección'}
                </span>
              </p>
              <div className='flex flex-wrap gap-5'>
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-14 h-14 rounded-2xl border-2 transition-all relative group ${selectedColor === color ? 'border-brand-blue scale-110 shadow-2xl shadow-blue-500/20' : 'border-content-muted/10 opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]' />
                      </div>
                    )}
                    <div className='absolute inset-1 border border-black/10 rounded-xl' />
                  </button>
                ))}
              </div>
            </div>

            <div className='space-y-5'>
              <div className='flex justify-between items-center'>
                <p className='text-[10px] font-black text-content-primary uppercase tracking-widest'>
                  Talla (Perú):
                </p>
                <button className='text-[9px] font-bold text-brand-blue uppercase border-b border-brand-blue/20 pb-0.5 hover:text-brand-blue/70 transition-all'>
                  Explorar guía de tallas
                </button>
              </div>
              <div className='grid grid-cols-4 sm:grid-cols-6 gap-3'>
                {SIZES.map((size) => {
                  const isAvailable = availableSizesForColor.includes(size);
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(size)}
                      className={`h-16 rounded-2xl font-bold text-sm transition-all border flex items-center justify-center outline-none ${
                        isSelected
                          ? 'bg-slate-950 text-white dark:bg-white dark:text-black border-transparent shadow-2xl scale-105'
                          : isAvailable
                            ? 'glass border-content-muted/10 text-content-primary hover:border-brand-blue'
                            : 'opacity-10 grayscale cursor-not-allowed border-content-muted/5'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {selectedSize && stockAvailable > 0 && stockAvailable <= 3 && (
                <div className='flex items-center gap-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl w-fit'>
                  <Zap className='w-3 h-3 text-amber-600 dark:text-amber-500 fill-current animate-pulse' />
                  <p className='text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest'>
                    Unidades Críticas: Solo {stockAvailable} disponibles
                  </p>
                </div>
              )}
            </div>

            <div className='space-y-8 pt-6'>
              <div className='flex flex-col sm:flex-row gap-6'>
                <div className='flex items-center glass border-content-muted/10 rounded-3xl p-1.5 shrink-0 bg-surface/50 shadow-sm'>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='w-14 h-14 flex items-center justify-center text-content-muted hover:text-brand-blue transition-colors'
                  >
                    <Minus className='w-5 h-5' />
                  </button>
                  <input
                    type='number'
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Math.min(stockAvailable || 99, parseInt(e.target.value) || 1)),
                      )
                    }
                    className='w-14 text-center bg-transparent font-bold text-lg outline-none text-content-primary font-space'
                  />
                  <button
                    onClick={() => setQuantity(Math.min(stockAvailable || 99, quantity + 1))}
                    className='w-14 h-14 flex items-center justify-center text-content-muted hover:text-brand-blue transition-colors'
                  >
                    <Plus className='w-5 h-5' />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!audit.canExecute}
                  className={`flex-1 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] flex items-center justify-center gap-5 transition-all shadow-2xl relative overflow-hidden group ${
                    audit.canExecute
                      ? 'bg-content-primary text-main hover:bg-brand-blue hover:text-white'
                      : 'bg-content-muted/10 text-content-muted cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000' />
                  {isAdded ? (
                    <Check className='w-6 h-6 animate-in zoom-in' />
                  ) : (
                    <ShoppingCart className='w-6 h-6' />
                  )}
                  {isAdded ? 'AÑADIDO CON ÉXITO' : 'CONFIRMAR DESPLIEGUE'}
                </button>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className='flex items-center gap-5 p-6 glass rounded-[2.5rem] border-content-muted/10 bg-surface/40 hover:border-brand-blue/20 transition-all group'>
                  <div className='w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform'>
                    <Truck className='w-6 h-6' />
                  </div>
                  <div>
                    <p className='text-[10px] font-black text-content-primary uppercase tracking-widest'>
                      Despacho Priority
                    </p>
                    <p className='text-[9px] text-content-muted font-bold uppercase mt-1'>
                      LIMA 24H / NACIÓN 72H
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-5 p-6 glass rounded-[2.5rem] border-content-muted/10 bg-surface/40 hover:border-brand-blue/20 transition-all group'>
                  <div className='w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform'>
                    <ShieldCheck className='w-6 h-6' />
                  </div>
                  <div>
                    <p className='text-[10px] font-black text-content-primary uppercase tracking-widest'>
                      Garantía Certificada
                    </p>
                    <p className='text-[9px] text-content-muted font-bold uppercase mt-1'>
                      PRODUCTO 100% ORIGINAL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-8 pt-10'>
            <h4 className='text-[10px] font-black text-content-primary uppercase tracking-[0.6em] px-2 flex items-center gap-3'>
              <Sparkles className='w-4 h-4 text-brand-blue fill-current' /> Atributos Premium
            </h4>
            <PremiumFeatures product={product} />
          </div>
        </div>
      </div>

      <section className='mt-40 space-y-16'>
        <div className='flex items-end justify-between border-b border-content-muted/10 pb-8'>
          <div className='space-y-2'>
            <h3 className='text-[10px] font-black text-brand-blue uppercase tracking-[0.5em]'>
              Curaduría Rosports
            </h3>
            <h2 className='text-4xl lg:text-5xl font-space font-bold text-content-primary uppercase tracking-tighter'>
              También te <span className='text-gradient'>recomendaos</span>
            </h2>
          </div>
          <button
            onClick={() => setView('shop')}
            className='text-[11px] font-black text-brand-blue uppercase flex items-center gap-2 hover:opacity-70 transition-opacity'
          >
            Ver catálogo completo <ArrowRight className='w-4 h-4' />
          </button>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12'>
          {relatedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              onViewDetails={() => navigateToDetails(p)}
              onQuickView={() => {}}
              onToggleWishlist={toggleWishlist}
              isWishlisted={wishlistItems.some((w) => w.id === p.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsView;
