
import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, Box, LayoutGrid, Search, Zap, Activity } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { useCatalog } from '../hooks/useCatalog';
import FilterSidebar from './FilterSidebar';
import ProductCard from './ProductCard';
import ComparisonHub from './ComparisonHub';
import { Product } from '../types';

const ShopView: React.FC = () => {
  const { products: allProducts, addToCart, toggleWishlist, wishlistItems, setView, setSelectedProduct } = useGlobal();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCompareHubOpen, setIsCompareHubOpen] = useState(false);
  const [comparisonItems, setComparisonItems] = useState<any[]>([]);

  const {
    products,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sortOption,
    setSortOption,
    stats
  } = useCatalog(allProducts);

  const uniqueBrands = useMemo(() => Array.from(new Set(allProducts.map(p => p.brand))), [allProducts]);
  const uniqueCategories = useMemo(() => Array.from(new Set(allProducts.map(p => p.category))), [allProducts]);

  const handleToggleCompare = (p: any) => {
    setComparisonItems(prev => {
      const exists = prev.find(i => i.id === p.id);
      if (exists) return prev.filter(i => i.id !== p.id);
      if (prev.length >= 3) return prev;
      return [...prev, p];
    });
  };

  const navigateToDetails = (p: Product) => {
    setSelectedProduct(p);
    setView('product-details');
  };

  return (
    <div className="pt-8 md:pt-12 pb-32 px-6 sm:px-10 lg:px-16 max-w-[1920px] mx-auto animate-in fade-in duration-700">
      {/* Header HUD */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 mb-16">
        <div className="space-y-4">
           <div className="flex items-center gap-3 text-blue-500">
              <Box className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">Nueva Colección</span>
           </div>
           <h2 className="font-space text-5xl md:text-6xl font-bold text-content-primary uppercase tracking-tighter">Nuestra <span className="text-gradient">Colección</span></h2>
           <p className="text-content-secondary text-sm font-medium uppercase tracking-widest max-w-xl leading-relaxed">
             Descubre <span className="text-content-primary font-bold">{stats.visible}</span> modelos exclusivos seleccionados para los amantes de las zapatillas originales.
           </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
           <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="BUSCAR MODELO..."
                className="pl-14 pr-8 py-5 glass border-content-muted/10 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500/50 w-full md:w-64 transition-all text-content-primary"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
           </div>

           <button 
            onClick={() => setIsFilterOpen(true)}
            className="px-8 py-5 glass border-content-muted/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 hover:border-blue-500 transition-all shadow-xl text-content-secondary"
           >
              <SlidersHorizontal className="w-4 h-4 text-blue-500" /> FILTRAR
           </button>

           {comparisonItems.length > 0 && (
             <button 
              onClick={() => setIsCompareHubOpen(true)}
              className="px-8 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 hover:bg-blue-500 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] animate-bounce-subtle"
             >
                <Zap className="w-4 h-4 fill-current" /> COMPARAR ({comparisonItems.length})
             </button>
           )}

           <div className="relative group">
              <select 
                value={sortOption}
                onChange={e => setSortOption(e.target.value as any)}
                className="appearance-none bg-surface backdrop-blur-xl border border-content-muted/10 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 cursor-pointer pr-16 text-content-primary"
              >
                 <option value="relevance">RECOMENDADOS</option>
                 <option value="price_low">MENOR PRECIO</option>
                 <option value="price_high">MAYOR PRECIO</option>
                 <option value="newest">RECIÉN LLEGADOS</option>
                 <option value="best_sellers">MÁS VENDIDOS</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted pointer-events-none" />
           </div>
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10">
          {products.map(p => (
            <div key={p.id} className="relative group">
              <ProductCard 
                product={p} 
                onAddToCart={addToCart} 
                onViewDetails={() => navigateToDetails(p)} 
                onQuickView={() => {}} 
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlistItems.some(w => w.id === p.id)}
              />
              <button 
                onClick={() => handleToggleCompare(p)}
                className={`absolute top-20 right-5 z-20 p-3 glass rounded-2xl transition-all ${comparisonItems.some(i => i.id === p.id) ? 'bg-blue-600 text-white border-blue-600' : 'text-content-muted hover:text-blue-500'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 glass rounded-[4rem] border-content-muted/10 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-8">
           <Search className="w-16 h-16 text-content-muted opacity-20" />
           <p className="text-[10px] font-black text-content-muted uppercase tracking-[0.5em]">No encontramos lo que buscas</p>
           <button onClick={() => setFilters({ categories: [], brands: [], priceRange: [0, 2000], sizes: [], colors: [], inStock: false })} className="px-10 py-4 glass text-blue-500 border-blue-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">LIMPIAR FILTROS</button>
        </div>
      )}

      <FilterSidebar 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        filters={filters} 
        setFilters={setFilters}
        brands={uniqueBrands}
        categories={uniqueCategories}
      />

      {isCompareHubOpen && (
        <ComparisonHub 
          items={comparisonItems} 
          onClose={() => setIsCompareHubOpen(false)} 
          onAddToCart={(p) => { addToCart(p, 40, p.colors?.[0] || '#000'); setIsCompareHubOpen(false); }}
        />
      )}

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite; }
      `}</style>
    </div>
  );
};

export default ShopView;
