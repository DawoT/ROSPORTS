import React, { useState, useMemo } from 'react';
import {
  Package,
  TrendingDown,
  DollarSign,
  Download,
  AlertTriangle,
  Layers,
  Activity,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { EnterpriseDataTable, TechnicalBadge } from './Primitives';
import { ReportingService } from '../services/reportingService';

const InventoryReports: React.FC = () => {
  const { products } = useGlobal();
  const [activeTab, setActiveTab] = useState<'current' | 'critical' | 'valuation'>('current');

  const valuation = useMemo(() => ReportingService.getInventoryValuation(products), [products]);
  const criticalItems = useMemo(() => ReportingService.getCriticalStock(products), [products]);

  const stockData = useMemo(() => {
    return products.flatMap(
      (p) =>
        p.variants?.map((v) => ({
          id: v.sku,
          sku: v.sku,
          name: p.name,
          category: p.category,
          qty: v.inventoryLevels.reduce((acc, l) => acc + l.quantity, 0),
          val:
            v.inventoryLevels.reduce((acc, l) => acc + l.quantity, 0) * (p.cost || p.price * 0.6),
          dos: Math.floor(Math.random() * 30) + 5, // Simulación Días de Stock
        })) || [],
    );
  }, [products]);

  return (
    <div className='space-y-10 animate-in fade-in duration-700 pb-32'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-blue-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-blue-500/20 shadow-xl bg-surface'>
              <Package className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] text-content-muted'>
                Global Stock Intelligence
              </span>
              <h2 className='font-space text-4xl font-bold text-content-primary uppercase tracking-tighter leading-none'>
                Reportes de <span className='text-gradient'>Inventario</span>
              </h2>
            </div>
          </div>
        </div>

        <div className='flex gap-4'>
          <button
            onClick={() => ReportingService.exportToCSV(stockData, 'REPORTE_STOCK_MASTER')}
            className='px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-500 transition-all shadow-xl'
          >
            <Download className='w-4 h-4' /> EXPORTAR CSV
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='glass-card p-8 rounded-[2.5rem] border-content-muted/10 bg-surface flex items-center gap-6'>
          <div className='p-4 glass rounded-2xl text-emerald-500 bg-emerald-500/5'>
            <DollarSign className='w-6 h-6' />
          </div>
          <div>
            <p className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
              Valorización Total
            </p>
            <p className='text-3xl font-space font-bold text-content-primary'>
              S/ {valuation.toLocaleString()}
            </p>
          </div>
        </div>
        <div className='glass-card p-8 rounded-[2.5rem] border-content-muted/10 bg-surface flex items-center gap-6'>
          <div className='p-4 glass rounded-2xl text-red-500 bg-red-500/5'>
            <AlertTriangle className='w-6 h-6' />
          </div>
          <div>
            <p className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
              Items Críticos
            </p>
            <p className='text-3xl font-space font-bold text-content-primary'>
              {criticalItems.length} SKUs
            </p>
          </div>
        </div>
        <div className='glass-card p-8 rounded-[2.5rem] border-content-muted/10 bg-surface flex items-center gap-6'>
          <div className='p-4 glass rounded-2xl text-blue-500 bg-blue-500/5'>
            <Layers className='w-6 h-6' />
          </div>
          <div>
            <p className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
              Unidades Totales
            </p>
            <p className='text-3xl font-space font-bold text-content-primary'>
              {stockData.reduce((acc, i) => acc + i.qty, 0)} UN
            </p>
          </div>
        </div>
      </div>

      <div className='flex glass p-2 rounded-[2.5rem] border-content-muted/10 gap-2 bg-surface/50 overflow-x-auto'>
        {[
          { id: 'current', label: 'Stock Actual', icon: Layers },
          { id: 'critical', label: 'Rupturas & Bajas', icon: TrendingDown },
          { id: 'valuation', label: 'Análisis de Valor', icon: DollarSign },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[180px] flex items-center justify-center gap-3 py-5 rounded-[2rem] text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-content-muted hover:bg-content-muted/5'}`}
          >
            <tab.icon className='w-4 h-4' />
            {tab.label}
          </button>
        ))}
      </div>

      <div className='min-h-[500px]'>
        {activeTab === 'current' && (
          <EnterpriseDataTable<{
            id: string;
            sku: string;
            name: string;
            category: string;
            qty: number;
            val: number;
            dos: number;
          }>
            data={stockData}
            columns={[
              {
                key: 'sku',
                label: 'SKU Técnico',
                render: (i) => (
                  <span className='text-[10px] font-mono font-bold text-blue-500'>{i.sku}</span>
                ),
              },
              {
                key: 'name',
                label: 'Nombre Producto',
                render: (i) => (
                  <span className='text-xs font-bold uppercase truncate max-w-[200px]'>
                    {i.name}
                  </span>
                ),
              },
              { key: 'category', label: 'Categoría' },
              {
                key: 'qty',
                label: 'Cantidad',
                render: (i) => <span className='text-xs font-bold'>{i.qty} UN</span>,
              },
              {
                key: 'dos',
                label: 'DOS (Días)',
                render: (i) => (
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black border ${i.dos < 7 ? 'text-red-500 border-red-500/20' : 'text-emerald-500 border-emerald-500/20'}`}
                  >
                    {i.dos} DÍAS
                  </span>
                ),
              },
            ]}
          />
        )}

        {activeTab === 'critical' && (
          <EnterpriseDataTable<{
            id: string;
            sku: string;
            name: string;
            node: string;
            available: number;
            min: number;
            status: string;
          }>
            data={criticalItems}
            columns={[
              {
                key: 'node',
                label: 'Nodo',
                render: (i) => <TechnicalBadge variant='blue'>{i.node}</TechnicalBadge>,
              },
              {
                key: 'sku',
                label: 'SKU',
                render: (i) => <span className='text-[10px] font-mono font-bold'>{i.sku}</span>,
              },
              {
                key: 'name',
                label: 'Producto',
                render: (i) => <span className='text-xs font-bold uppercase'>{i.name}</span>,
              },
              {
                key: 'available',
                label: 'Stock Disp.',
                render: (i) => (
                  <span className='text-xs font-bold text-red-500'>{i.available} UN</span>
                ),
              },
              {
                key: 'min',
                label: 'Mínimo',
                render: (i) => (
                  <span className='text-xs font-bold text-content-muted'>{i.min} UN</span>
                ),
              },
              {
                key: 'status',
                label: 'Severidad',
                render: (i) => (
                  <TechnicalBadge variant={i.available === 0 ? 'red' : 'amber'}>
                    {i.status}
                  </TechnicalBadge>
                ),
              },
            ]}
          />
        )}

        {activeTab === 'valuation' && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
            <div className='lg:col-span-2'>
              <EnterpriseDataTable<{
                id: string;
                sku: string;
                name: string;
                category: string;
                qty: number;
                val: number;
                dos: number;
              }>
                data={stockData.sort((a, b) => b.val - a.val)}
                columns={[
                  {
                    key: 'name',
                    label: 'Producto Maestro',
                    render: (i) => <span className='text-xs font-bold uppercase'>{i.name}</span>,
                  },
                  { key: 'qty', label: 'Cantidad Total' },
                  {
                    key: 'val',
                    label: 'Valorización (Costo)',
                    render: (i) => (
                      <span className='text-sm font-black text-content-primary'>
                        S/ {i.val.toFixed(2)}
                      </span>
                    ),
                  },
                  {
                    key: 'id',
                    label: '% Mix',
                    render: (i) => (
                      <span className='text-[10px] font-black text-blue-500'>
                        {((i.val / valuation) * 100).toFixed(1)}%
                      </span>
                    ),
                  },
                ]}
              />
            </div>
            <div className='glass-card rounded-[3rem] p-10 border-content-muted/10 bg-surface shadow-sm space-y-10'>
              <div className='flex items-center gap-3 text-blue-500'>
                <Activity className='w-6 h-6' />
                <h4 className='text-xl font-space font-bold uppercase'>Health Analytics</h4>
              </div>
              <p className='text-xs text-content-secondary leading-relaxed font-medium italic'>
                El inventario actual presenta una concentración del 42% en la categoría Running
                Elite. La valorización global se mantiene dentro de los parámetros de riesgo
                aceptables del Q2.
              </p>
              <div className='pt-6 border-t border-content-muted/10'>
                <button className='w-full py-5 bg-content-primary text-main rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-xl'>
                  Cerrar Auditoría de Valor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryReports;
