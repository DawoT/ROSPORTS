import React, { useState, useMemo } from 'react';
import { Plus, Search, Database, Trash2, Edit3, X, Activity } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface AdminProductManagerProps {
  centralProducts: Product[];
  onSave: (p: Product) => void;
  onDelete: (id: string) => void;
  onTelemetry: (p: Product) => void;
}

const AdminProductManager: React.FC<AdminProductManagerProps> = ({
  centralProducts,
  onSave,
  onDelete,
  onTelemetry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProducts = useMemo(() => {
    return centralProducts.filter((p) => {
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku_parent && p.sku_parent.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, centralProducts]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className='space-y-8 animate-in fade-in duration-700'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-blue-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-blue-500/20 shadow-xl bg-surface'>
              <Database className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] text-content-muted'>
                Inventory Systems
              </span>
              <h2 className='font-space text-4xl font-bold text-content-primary uppercase tracking-tighter leading-none'>
                Gestión de <span className='text-gradient'>Catálogo</span>
              </h2>
            </div>
          </div>
        </div>
        <div className='flex flex-wrap gap-4'>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsEditorOpen(true);
            }}
            className='flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all min-h-[56px]'
          >
            <Plus className='w-4 h-4' /> CREAR PRODUCTO MAESTRO
          </button>
        </div>
      </div>

      <div className='glass p-6 rounded-[2.5rem] border-content-muted/10 flex flex-col md:flex-row gap-6 bg-surface shadow-sm'>
        <div className='flex-1 relative group'>
          <Search className='absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted group-focus-within:text-blue-500 transition-colors' />
          <input
            type='text'
            placeholder='BUSCAR POR NOMBRE, SKU, MARCA...'
            className='w-full pl-14 pr-8 py-5 glass border-content-muted/10 bg-main/40 rounded-2xl outline-none text-xs font-bold text-content-primary uppercase tracking-widest focus:border-blue-500/50 transition-all'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className='glass-card rounded-[3rem] border-content-muted/10 overflow-hidden bg-surface shadow-sm'>
        <table className='w-full text-left'>
          <thead>
            <tr className='border-b border-content-muted/10 bg-content-muted/[0.03]'>
              <th className='px-8 py-5 text-[9px] font-black text-content-muted uppercase tracking-widest'>
                Producto Base
              </th>
              <th className='px-8 py-5 text-[9px] font-black text-content-muted uppercase tracking-widest text-center'>
                SKU Maestro
              </th>
              <th className='px-8 py-5 text-[9px] font-black text-content-muted uppercase tracking-widest text-center'>
                Pricing
              </th>
              <th className='px-8 py-5 text-[9px] font-black text-content-muted uppercase tracking-widest text-center'>
                Variantes
              </th>
              <th className='px-8 py-5 text-[9px] font-black text-content-muted uppercase tracking-widest text-right'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-content-muted/10'>
            {paginatedProducts.map((p) => (
              <tr key={p.id} className='hover:bg-content-muted/[0.02] transition-colors group'>
                <td className='px-8 py-5'>
                  <div className='flex items-center gap-6'>
                    <div className='w-14 h-14 glass rounded-xl p-2 bg-main flex items-center justify-center border border-content-muted/10 overflow-hidden'>
                      <img
                        src={p.image}
                        className='w-full h-full object-contain group-hover:scale-110 transition-transform'
                        alt=''
                      />
                    </div>
                    <div className='flex flex-col'>
                      <h4 className='text-sm font-bold text-content-primary uppercase truncate max-w-[200px]'>
                        {p.name}
                      </h4>
                      <span className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
                        {p.category}
                      </span>
                    </div>
                  </div>
                </td>
                <td className='px-8 py-5 text-center'>
                  <span className='text-[10px] font-mono font-bold text-blue-600 dark:text-blue-500'>
                    {p.sku_parent}
                  </span>
                </td>
                <td className='px-8 py-5 text-center'>
                  <span className='text-xs font-bold text-content-primary'>
                    S/ {p.price.toFixed(2)}
                  </span>
                </td>
                <td className='px-8 py-5 text-center'>
                  <span className='px-4 py-2 glass rounded-xl text-[10px] font-black text-content-secondary uppercase border border-content-muted/10'>
                    {p.variants?.length || 0} VAR
                  </span>
                </td>
                <td className='px-8 py-5 text-right'>
                  <div className='flex items-center justify-end gap-3'>
                    <button
                      onClick={() => onTelemetry(p)}
                      className='p-2.5 glass rounded-xl border-content-muted/10 text-content-muted hover:text-emerald-500 transition-all shadow-sm'
                    >
                      <Activity className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setIsEditorOpen(true);
                      }}
                      className='p-2.5 glass rounded-xl border-content-muted/10 text-content-muted hover:text-blue-500 transition-all shadow-sm'
                    >
                      <Edit3 className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className='p-2.5 glass rounded-xl border-content-muted/10 text-content-muted hover:text-red-500 transition-all shadow-sm'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditorOpen && (
        <ProductEditor
          product={editingProduct}
          onClose={() => setIsEditorOpen(false)}
          onSave={(p) => {
            onSave(p);
            setIsEditorOpen(false);
          }}
        />
      )}
    </div>
  );
};

const ProductEditor: React.FC<{
  product: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}> = ({ product, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'variants' | 'media'>('info');
  const [formData, setFormData] = useState<Product>(() =>
    product
      ? JSON.parse(JSON.stringify(product))
      : {
          id: Date.now().toString(),
          name: '',
          brand: 'ROSPORTS',
          price: 0,
          cost: 0,
          image: '',
          gallery: [],
          description: '',
          category: 'Running',
          weight: '0kg',
          status: 'active',
          sku_parent: '',
          variants: [],
        },
  );

  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: ProductVariant[keyof ProductVariant],
  ) => {
    setFormData((prev) => {
      const newVariants = [...(prev.variants || [])];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      sku: `${formData.sku_parent}-${(formData.variants?.length || 0) + 1}`,
      barcode: `BC-${Date.now()}`,
      size: 40,
      color: '#000000',
      colorName: 'Pure Black',
      images: [],
      inventoryLevels: [
        { nodeId: 'N-01', quantity: 0, minStock: 5, reserved: 0 },
        { nodeId: 'N-02', quantity: 0, minStock: 5, reserved: 0 },
        { nodeId: 'N-03', quantity: 0, minStock: 5, reserved: 0 },
      ],
      status: 'active',
    };
    setFormData((prev) => ({ ...prev, variants: [...(prev.variants || []), newVariant] }));
  };

  return (
    <div className='fixed inset-0 z-[200] flex items-center justify-center p-6'>
      <div
        className='absolute inset-0 bg-main/90 backdrop-blur-xl animate-in fade-in'
        onClick={onClose}
      />
      <div className='relative w-full max-w-6xl h-[85vh] glass-card rounded-[3rem] border-content-muted/10 flex flex-col overflow-hidden animate-in zoom-in-95 bg-surface shadow-2xl'>
        <div className='p-8 border-b border-content-muted/10 flex items-center justify-between bg-content-muted/[0.02]'>
          <h3 className='text-2xl font-space font-bold text-content-primary uppercase tracking-tight'>
            {product ? 'EDITAR ENTIDAD' : 'NUEVO DESPLIEGUE'}
          </h3>
          <button
            onClick={onClose}
            className='p-3 glass rounded-xl border-content-muted/10 text-content-muted hover:text-red-500 transition-colors shadow-sm'
          >
            <X />
          </button>
        </div>

        <div className='px-8 py-4 border-b border-content-muted/10 flex gap-8 bg-surface/50'>
          {(['info', 'variants', 'media'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`text-[10px] font-black uppercase tracking-[0.3em] pb-2 transition-all min-h-[40px] ${activeTab === t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-content-muted hover:text-content-primary'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className='flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar'>
          {activeTab === 'info' && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-2'>
                <label className='text-[9px] font-black text-content-muted uppercase px-2'>
                  Nombre Comercial
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='w-full p-5 glass bg-main/50 rounded-2xl text-content-primary outline-none focus:border-blue-500/50 text-xs font-bold border border-content-muted/10 shadow-sm'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-[9px] font-black text-content-muted uppercase px-2'>
                  SKU Maestro
                </label>
                <input
                  value={formData.sku_parent}
                  onChange={(e) =>
                    setFormData({ ...formData, sku_parent: e.target.value.toUpperCase() })
                  }
                  className='w-full p-5 glass bg-main/50 rounded-2xl text-content-primary outline-none focus:border-blue-500/50 text-xs font-mono font-bold border border-content-muted/10 shadow-sm'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-[9px] font-black text-content-muted uppercase px-2'>
                  Precio PVP (S/)
                </label>
                <input
                  type='number'
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className='w-full p-5 glass bg-main/50 rounded-2xl text-blue-600 dark:text-blue-400 outline-none focus:border-blue-500/50 text-xs font-bold border border-content-muted/10 shadow-sm'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-[9px] font-black text-content-muted uppercase px-2'>
                  Costo (S/)
                </label>
                <input
                  type='number'
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                  className='w-full p-5 glass bg-main/50 rounded-2xl text-content-muted outline-none focus:border-blue-500/50 text-xs font-bold border border-content-muted/10 shadow-sm'
                />
              </div>
            </div>
          )}

          {activeTab === 'variants' && (
            <div className='space-y-8'>
              <div className='flex justify-between items-center'>
                <h4 className='text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest'>
                  Matriz de Tallas y Colores
                </h4>
                <button
                  onClick={addVariant}
                  className='px-6 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-md'
                >
                  <Plus className='w-4 h-4' /> AÑADIR VARIANTE
                </button>
              </div>
              <div className='glass rounded-[2rem] overflow-hidden border border-content-muted/10 bg-main shadow-sm'>
                <table className='w-full text-left'>
                  <thead className='bg-content-muted/[0.03]'>
                    <tr>
                      <th className='px-8 py-4 text-[9px] font-black text-content-muted uppercase'>
                        Talla PE
                      </th>
                      <th className='px-8 py-4 text-[9px] font-black text-content-muted uppercase'>
                        Colorway
                      </th>
                      <th className='px-8 py-4 text-[9px] font-black text-content-muted uppercase'>
                        SKU T&eacute;cnico
                      </th>
                      <th className='px-8 py-4 text-right' />
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-content-muted/10'>
                    {formData.variants?.map((v, i) => (
                      <tr key={i} className='hover:bg-content-muted/[0.01]'>
                        <td className='px-8 py-4'>
                          <input
                            type='number'
                            value={v.size}
                            onChange={(e) => updateVariant(i, 'size', Number(e.target.value))}
                            className='w-16 bg-transparent text-content-primary font-bold outline-none border-b border-transparent focus:border-blue-500'
                          />
                        </td>
                        <td className='px-8 py-4'>
                          <div className='flex items-center gap-4'>
                            <input
                              type='color'
                              value={v.color}
                              onChange={(e) => updateVariant(i, 'color', e.target.value)}
                              className='w-8 h-8 rounded-lg bg-transparent cursor-pointer border-content-muted/20'
                            />
                            <input
                              value={v.colorName}
                              onChange={(e) => updateVariant(i, 'colorName', e.target.value)}
                              className='bg-transparent text-xs text-content-muted outline-none border-b border-transparent focus:border-blue-500'
                            />
                          </div>
                        </td>
                        <td className='px-8 py-4'>
                          <input
                            value={v.sku}
                            onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                            className='bg-transparent font-mono text-blue-600 dark:text-blue-500 text-xs outline-none border-b border-transparent focus:border-blue-500'
                          />
                        </td>
                        <td className='px-8 py-4 text-right'>
                          <button
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                variants: p.variants?.filter((_, idx) => idx !== i),
                              }))
                            }
                            className='text-red-500 opacity-50 hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className='p-8 border-t border-content-muted/10 flex justify-end gap-4 bg-content-muted/[0.02]'>
          <button
            onClick={onClose}
            className='px-8 py-4 glass text-content-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-content-primary hover:bg-main shadow-sm'
          >
            DESCARTAR
          </button>
          <button
            onClick={() => onSave(formData)}
            className='px-12 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all min-h-[56px]'
          >
            SINCRONIZAR NODO
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductManager;
