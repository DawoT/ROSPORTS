
import React, { useMemo } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Package, 
  ArrowUpRight, Target, Activity, Zap, 
  ChevronRight, ArrowLeft, ShoppingBag, PieChart
} from 'lucide-react';
import { Product } from '../types';

interface ProductTelemetryDeepDiveProps {
  product: Product;
  onBack: () => void;
}

const ProductTelemetryDeepDive: React.FC<ProductTelemetryDeepDiveProps> = ({ product, onBack }) => {
  const margin = useMemo(() => {
    if (!product.cost) return 0;
    return ((product.price - product.cost) / product.price) * 100;
  }, [product]);

  const totalStock = useMemo(() => {
    return product.variants?.reduce((acc, v) => 
      acc + v.inventoryLevels.reduce((sum, l) => sum + l.quantity, 0), 0) || 0;
  }, [product]);

  return (
    <div className="space-y-10 animate-in slide-in-from-right-12 duration-700 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-blue-500 transition-all uppercase tracking-[0.3em]">
            <ArrowLeft className="w-4 h-4" /> VOLVER AL CATÁLOGO
          </button>
          <div className="flex items-center gap-3 text-blue-500">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-blue-500/20 shadow-xl">
               <Activity className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-60 text-slate-500">Product Lifecycle Analytics</span>
               <h2 className="font-space text-4xl font-bold dark:text-white uppercase tracking-tighter">Deep <span className="text-gradient">Dive</span></h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Resumen HUD */}
         <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Margen Bruto</p>
                     <Target className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-3xl font-space font-bold text-white">{margin.toFixed(1)}%</p>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: `${margin}%` }} />
                  </div>
               </div>
               <div className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Stock Global</p>
                     <Package className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-3xl font-space font-bold text-white">{totalStock} UN</p>
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Sincronizado</p>
               </div>
               <div className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Precio Mercado</p>
                     <DollarSign className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className="text-3xl font-space font-bold text-white">S/ {product.price.toFixed(2)}</p>
                  <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Canal Directo</p>
               </div>
            </div>

            <div className="glass-card rounded-[3rem] p-12 border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 technical-grid opacity-10" />
               <div className="flex justify-between items-center mb-12 relative z-10">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Saldos por Nodo Operativo</h4>
               </div>
               <div className="space-y-6 relative z-10">
                  {product.variants?.[0]?.inventoryLevels.map(level => (
                    <div key={level.nodeId} className="flex items-center gap-6">
                       <span className="w-32 text-[10px] font-black text-slate-500 uppercase tracking-widest">{level.nodeId}</span>
                       <div className="flex-1 h-3 glass rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${(level.quantity / 50) * 100}%` }} />
                       </div>
                       <span className="w-12 text-xs font-bold text-white">{level.quantity}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Ficha Visual */}
         <div className="space-y-8">
            <div className="glass-card rounded-[3rem] p-10 border-white/5 flex flex-col items-center text-center space-y-6">
               <div className="w-full h-48 glass rounded-2xl p-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 technical-grid opacity-10" />
                  <img src={product.image} className="w-full h-full object-contain relative z-10" />
               </div>
               <div className="space-y-2">
                  <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{product.sku_parent}</p>
                  <h3 className="font-space text-2xl font-bold text-white uppercase leading-none">{product.name}</h3>
               </div>
               <div className="w-full pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div className="p-4 glass rounded-xl text-center">
                     <p className="text-[7px] font-black text-slate-500 uppercase">Weight</p>
                     <p className="text-xs font-bold text-white">{product.weight}</p>
                  </div>
                  <div className="p-4 glass rounded-xl text-center">
                     <p className="text-[7px] font-black text-slate-500 uppercase">Traction</p>
                     <p className="text-xs font-bold text-white">{product.tractionScore}/10</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProductTelemetryDeepDive;
