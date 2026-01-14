import React, { useMemo } from 'react';
import { Zap, PieChart, Activity, Target } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

const InventoryVelocityRadar: React.FC = () => {
  const { movements, products } = useGlobal();

  const turnoverStats = useMemo(() => {
    const recentSales = movements.filter((m) => m.type === 'sale_finalize' || m.type === 'exit');
    const categories: Record<string, { sales: number; stock: number }> = {
      Running: { sales: 0, stock: 0 },
      Basketball: { sales: 0, stock: 0 },
      Lifestyle: { sales: 0, stock: 0 },
      Training: { sales: 0, stock: 0 },
    };

    products.forEach((p) => {
      const stock =
        p.variants?.reduce(
          (acc, v) => acc + v.inventoryLevels.reduce((sum, l) => sum + l.quantity, 0),
          0,
        ) || 0;
      if (categories[p.category]) categories[p.category].stock += stock;
    });

    recentSales.forEach((m) => {
      const sku = m.items[0].sku;
      const product = products.find((p) => p.variants?.some((v) => v.sku === sku));
      if (product && categories[product.category]) {
        categories[product.category].sales += m.items[0].quantity;
      }
    });

    return Object.entries(categories).map(([name, data]) => ({
      name,
      ...data,
      velocity: data.stock > 0 ? (data.sales / data.stock) * 100 : 0,
    }));
  }, [movements, products]);

  return (
    <div className='space-y-10 animate-in fade-in duration-700'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h3 className='text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]'>
            Analizador de Rotación de Calzado
          </h3>
          <h2 className='text-3xl font-space font-bold text-content-primary uppercase'>
            Demanda <span className='text-gradient'>por Categoría</span>
          </h2>
        </div>
        <div className='px-6 py-3 glass rounded-2xl border-content-muted/10 flex items-center gap-3 bg-surface'>
          <Zap className='w-4 h-4 text-amber-500 fill-current' />
          <span className='text-[9px] font-black text-content-secondary uppercase tracking-widest'>
            Análisis de Tendencias
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {turnoverStats.map((cat, i) => (
          <div
            key={i}
            className='glass-card rounded-[2.5rem] p-8 border-content-muted/10 space-y-6 group hover:border-blue-500/30 transition-all bg-surface'
          >
            <div className='flex justify-between items-start'>
              <div className='p-3 glass rounded-xl text-blue-500 bg-blue-500/5 group-hover:scale-110 transition-transform'>
                <Activity className='w-5 h-5' />
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${cat.velocity > 15 ? 'text-emerald-500' : 'text-red-500'}`}
              >
                {cat.velocity > 15 ? 'ALTA DEMANDA' : 'ROTACIÓN BAJA'}
              </span>
            </div>
            <div>
              <p className='text-[8px] font-black text-content-muted uppercase tracking-[0.2em] mb-1'>
                {cat.name}
              </p>
              <p className='text-2xl font-bold font-space text-content-primary'>
                {cat.velocity.toFixed(1)}%
              </p>
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between text-[7px] font-black text-content-muted uppercase'>
                <span>Pares Vendidos</span>
                <span>Stock en Tiendas</span>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex-1 h-1.5 bg-content-muted/10 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-blue-600'
                    style={{ width: `${Math.min(cat.velocity * 2, 100)}%` }}
                  />
                </div>
                <span className='text-[9px] font-bold text-content-secondary'>
                  {cat.sales} / {cat.stock}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='glass-card rounded-[3rem] p-10 border-content-muted/10 bg-gradient-to-br from-blue-600/[0.03] to-transparent flex flex-col md:flex-row items-center gap-12 bg-surface'>
        <div className='w-48 h-48 relative flex items-center justify-center shrink-0'>
          <div className='absolute inset-0 border-4 border-blue-600/10 rounded-full' />
          <div
            className='absolute inset-4 border-2 border-dashed border-blue-500/30 rounded-full animate-spin'
            style={{ animationDuration: '10s' }}
          />
          <PieChart className='w-16 h-16 text-blue-500 opacity-20' />
          <div className='absolute flex flex-col items-center'>
            <span className='text-[8px] font-black text-content-muted uppercase'>Rendimiento</span>
            <span className='text-3xl font-space font-bold text-content-primary'>82%</span>
          </div>
        </div>
        <div className='space-y-6'>
          <h4 className='text-xl font-space font-bold uppercase flex items-center gap-3 text-content-primary'>
            <Target className='text-blue-500' /> Optimización de Inventario
          </h4>
          <p className='text-sm text-content-secondary leading-relaxed max-w-2xl font-medium'>
            El análisis comercial indica que la categoría{' '}
            <span className='text-blue-500 font-bold'>Running</span> tiene una velocidad de rotación
            muy superior al promedio nacional. Se recomienda priorizar la reposición de estos
            modelos para evitar quiebres de stock.
          </p>
          <div className='flex gap-4'>
            <button className='px-8 py-4 bg-content-primary text-main rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all'>
              Exportar Reporte de Ventas
            </button>
            <button className='px-8 py-4 glass text-content-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-content-muted/10 transition-all'>
              Ver Sugerencias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryVelocityRadar;
