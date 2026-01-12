import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Scan,
  Package,
  ArrowRight,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { InventoryService } from '../services/inventoryService';

const InventoryConciliation: React.FC = () => {
  const { products, handleStockUpdate, addNotification } = useGlobal();
  const [selectedNode, setSelectedNode] = useState('N-02');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isApplying, setIsApplying] = useState(false);

  const flatVariants = useMemo(() => {
    return products.flatMap(
      (p) =>
        p.variants?.map((v) => ({
          productId: p.id,
          productName: p.name,
          variant: v,
          currentQty: v.inventoryLevels.find((l) => l.nodeId === selectedNode)?.quantity || 0,
        })) || [],
    );
  }, [products, selectedNode]);

  const differences = useMemo(() => {
    return flatVariants
      .map((v) => {
        const actual = counts[v.variant.sku] ?? v.currentQty;
        const diff = actual - v.currentQty;
        return { ...v, actual, diff };
      })
      .filter((v) => v.diff !== 0);
  }, [flatVariants, counts]);

  const handleApplyAdjustments = async () => {
    setIsApplying(true);
    // Simulamos proceso de auditoría
    await new Promise((r) => setTimeout(r, 2000));

    differences.forEach((d) => {
      const { adjustmentType, diff } = InventoryService.createStockAdjustment(
        d.currentQty,
        d.actual,
        'Ajuste por Conteo Cíclico',
      );
      if (adjustmentType !== 'none') {
        handleStockUpdate(
          d.productId,
          d.variant.sku,
          diff,
          adjustmentType as any,
          'Conteo Cíclico Verificado',
          selectedNode,
        );
      }
    });

    addNotification(`${differences.length} Ajustes aplicados correctamente`, 'success');
    setCounts({});
    setIsApplying(false);
  };

  return (
    <div className='space-y-10 animate-in fade-in duration-700 pb-20'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-amber-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-amber-500/20 shadow-xl'>
              <ClipboardCheck className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] opacity-60 text-slate-500'>
                Cyclic Inventory Control
              </span>
              <h2 className='font-space text-4xl font-bold dark:text-white uppercase tracking-tighter'>
                Conciliación de <span className='text-amber-500'>Saldos</span>
              </h2>
            </div>
          </div>
        </div>

        <div className='flex gap-4'>
          {differences.length > 0 && (
            <button
              onClick={handleApplyAdjustments}
              disabled={isApplying}
              className='px-10 py-5 bg-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-amber-500 transition-all flex items-center gap-3 disabled:opacity-50'
            >
              {isApplying ? (
                <RefreshCw className='w-4 h-4 animate-spin' />
              ) : (
                <CheckCircle className='w-4 h-4' />
              )}
              APLICAR {differences.length} AJUSTES
            </button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <div className='lg:col-span-2 space-y-8'>
          <div className='glass p-6 rounded-[2.5rem] border-white/5 flex gap-4'>
            <div className='flex-1 relative'>
              <Scan className='absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
              <input
                type='text'
                placeholder='ESCANEAR SKU O BARCODE PARA CONTAR...'
                className='w-full pl-14 pr-8 py-5 bg-black/40 rounded-2xl outline-none text-xs font-bold text-white uppercase tracking-widest border border-white/5 focus:border-amber-500/50'
              />
            </div>
          </div>

          <div className='glass-card rounded-[3rem] border-white/5 overflow-hidden'>
            <table className='w-full text-left text-[11px]'>
              <thead>
                <tr className='bg-white/5 border-b border-white/10'>
                  <th className='px-8 py-6 font-black text-slate-500 uppercase'>
                    Referencia Talla/Color
                  </th>
                  <th className='px-8 py-6 font-black text-slate-500 uppercase text-center'>
                    En Sistema
                  </th>
                  <th className='px-8 py-6 font-black text-slate-500 uppercase text-center'>
                    Físico Actual
                  </th>
                  <th className='px-8 py-6 font-black text-slate-500 uppercase text-right'>
                    Variación
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/5'>
                {flatVariants.map((v) => (
                  <tr key={v.variant.sku} className='hover:bg-white/[0.02] transition-colors'>
                    <td className='px-8 py-6'>
                      <div className='flex flex-col'>
                        <span className='font-bold text-white uppercase'>{v.productName}</span>
                        <span className='text-[9px] font-mono text-blue-500'>
                          {v.variant.sku} // T{v.variant.size}
                        </span>
                      </div>
                    </td>
                    <td className='px-8 py-6 text-center font-bold text-slate-500'>
                      {v.currentQty} UN
                    </td>
                    <td className='px-8 py-6 text-center'>
                      <input
                        type='number'
                        value={counts[v.variant.sku] ?? v.currentQty}
                        onChange={(e) =>
                          setCounts({ ...counts, [v.variant.sku]: Number(e.target.value) })
                        }
                        className='w-20 px-3 py-2 glass rounded-lg text-center font-bold text-white focus:border-amber-500 outline-none'
                      />
                    </td>
                    <td className='px-8 py-6 text-right'>
                      {counts[v.variant.sku] !== undefined &&
                      counts[v.variant.sku] !== v.currentQty ? (
                        <span
                          className={`font-black uppercase tracking-widest ${counts[v.variant.sku] > v.currentQty ? 'text-emerald-500' : 'text-red-500'}`}
                        >
                          {counts[v.variant.sku] > v.currentQty
                            ? `+${counts[v.variant.sku] - v.currentQty}`
                            : counts[v.variant.sku] - v.currentQty}
                        </span>
                      ) : (
                        <span className='text-slate-800'>0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className='space-y-8'>
          <div className='glass-card rounded-[3rem] p-10 border-white/5 space-y-8 bg-gradient-to-br from-amber-500/[0.03] to-transparent'>
            <div className='flex items-center gap-3 text-amber-500'>
              <AlertTriangle className='w-6 h-6' />
              <h4 className='text-xl font-space font-bold uppercase'>Resumen Fiscal</h4>
            </div>
            <div className='space-y-6'>
              <div className='p-5 glass rounded-2xl border-white/5 flex justify-between items-center'>
                <span className='text-[9px] font-black text-slate-500 uppercase tracking-widest'>
                  Ajustes Totales
                </span>
                <span className='text-lg font-bold text-white'>{differences.length}</span>
              </div>
              <div className='p-5 glass rounded-2xl border-white/5 flex justify-between items-center'>
                <span className='text-[9px] font-black text-slate-500 uppercase tracking-widest'>
                  Faltantes Críticos
                </span>
                <span className='text-lg font-bold text-red-500'>
                  {differences.filter((d) => d.diff < 0).length}
                </span>
              </div>
            </div>
            <p className='text-[9px] text-slate-500 leading-relaxed italic'>
              Al aplicar estos cambios, se generará una póliza de ajuste contable vinculada a tu ID
              de usuario.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default InventoryConciliation;
