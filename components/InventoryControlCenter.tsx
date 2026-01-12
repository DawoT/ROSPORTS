
import React, { useState, useMemo } from 'react';
import { 
  Database, ArrowRightLeft, History, Activity, Truck, 
  PlusCircle, Trash2, Info, ChevronRight, Search, 
  ArrowUpCircle, QrCode, AlertCircle, RefreshCw,
  TrendingUp, Layers, Box, Store, Sparkles, Map,
  CheckCircle, ShieldAlert, Navigation, FileCheck
} from 'lucide-react';
import { InventoryNode, StockMovement, Product, ProductVariant, StockTransfer } from '../types';
import { useGlobal } from '../context/GlobalContext';
import { EnterpriseDataTable, TechnicalBadge, EnterpriseButton } from './Primitives';

const InventoryControlCenter: React.FC<any> = ({ 
  centralProducts, nodes, movements, onStockAction 
}) => {
  const { addNotification, executeCommand, rebalanceSuggestions, runRebalanceAudit, addAuditLog, user } = useGlobal();
  const [activeTab, setActiveTab] = useState<'realtime' | 'movements' | 'manual' | 'transfers' | 'rebalance'>('realtime');
  const [selectedNode, setSelectedNode] = useState(nodes[0].id);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Mock de traspasos existentes
  const [transfers, setTransfers] = useState<StockTransfer[]>([
    { id: 'TR-1001', originNodeId: 'N-01', targetNodeId: 'N-02', items: [{ sku: 'RS-VEL-X1-38-RED', quantity: 5, name: 'Velocity X-1 Pro' }], status: 'shipped', createdAt: '2025-05-12 10:00', authorizedBy: 'ADMIN MASTER' },
    { id: 'TR-1002', originNodeId: 'N-01', targetNodeId: 'N-03', items: [{ sku: 'RS-GRA-K2-41-BLK', quantity: 2, name: 'Gravity King' }], status: 'pending', createdAt: '2025-05-12 14:30', authorizedBy: 'ADMIN MASTER' }
  ]);

  const flattenStock = useMemo(() => {
    return centralProducts.flatMap((p: Product) => p.variants?.map(v => {
      const level = v.inventoryLevels.find(l => l.nodeId === selectedNode);
      if (!level) return null;
      return {
        id: v.sku,
        name: p.name,
        image: p.image,
        sku: v.sku,
        quantity: level.quantity,
        reserved: level.reserved,
        available: level.quantity - level.reserved,
        isLow: (level.quantity - level.reserved) < level.minStock
      };
    })).filter(Boolean);
  }, [centralProducts, selectedNode]);

  const handleConfirmReception = (transferId: string) => {
    const tr = transfers.find(t => t.id === transferId);
    if (!tr) return;

    tr.items.forEach(item => {
      onStockAction(
        '', // El ID del producto se resolvería internamente en el contexto global
        item.sku,
        item.quantity,
        'transfer',
        `Recepción de Traspaso ${transferId}`,
        tr.originNodeId,
        tr.targetNodeId
      );
    });

    setTransfers(prev => prev.map(t => t.id === transferId ? { ...t, status: 'received', receivedAt: new Date().toISOString(), receivedBy: user?.name } : t));
    addAuditLog('transfer_receive', 'transfer', transferId, `Stock recibido en Nodo ${tr.targetNodeId}`);
    addNotification("Carga auditada e integrada al inventario", "success");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-emerald-500">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center border-emerald-500/20 shadow-xl bg-surface">
               <Database className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-content-muted">Logistics Control Hub</span>
               <h2 className="font-space text-4xl font-bold text-content-primary uppercase tracking-tighter leading-none">Inventario <span className="text-gradient">Distribuido</span></h2>
            </div>
          </div>
        </div>
      </div>

      <div className="flex glass p-2 rounded-[2.5rem] border-content-muted/10 overflow-x-auto gap-2 bg-surface/50">
         {[
           { id: 'realtime', label: 'Monitor Stock', icon: Activity },
           { id: 'rebalance', label: 'Smart Rebalance', icon: Map },
           { id: 'transfers', label: 'Traspasos', icon: ArrowRightLeft },
           { id: 'movements', label: 'Libro Mayor', icon: History },
         ].map(tab => (
           <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[180px] flex items-center justify-center gap-3 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-content-muted hover:bg-content-muted/5'}`}
           >
              <tab.icon className="w-4 h-4" />
              {tab.label}
           </button>
         ))}
      </div>

      <div className="min-h-[600px]">
         {activeTab === 'realtime' && (
            <div className="space-y-8">
               <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {nodes.map((n: any) => (
                    <button key={n.id} onClick={() => setSelectedNode(n.id)} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 min-h-[48px] ${selectedNode === n.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'glass text-content-muted hover:text-content-primary'}`}>{n.name}</button>
                  ))}
               </div>
               
               <EnterpriseDataTable<any> 
                data={flattenStock}
                columns={[
                  { key: 'name', label: 'Entidad Técnica', render: (item: any) => (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 glass rounded-xl p-1 bg-main flex items-center justify-center border border-content-muted/10">
                        <img src={item.image} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-content-primary uppercase">{item.name}</span>
                         <span className="text-[9px] font-mono text-blue-500">{item.sku}</span>
                      </div>
                    </div>
                  )},
                  { key: 'quantity', label: 'Stock Total', render: (item: any) => <span className="text-xs font-bold text-content-secondary">{item.quantity} UN</span> },
                  { key: 'available', label: 'Disponible', render: (item: any) => (
                    <span className={`text-sm font-bold ${item.isLow ? 'text-amber-500' : 'text-emerald-500'}`}>{item.available} UN</span>
                  )},
                  { key: 'actions', label: 'Status Hub', render: (item: any) => (
                    <div className="flex items-center justify-end gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.available > 0 ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${item.available > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {item.available > 0 ? 'ACTIVE_SYNC' : 'DEPLETED'}
                      </span>
                    </div>
                  )}
                ]}
               />
            </div>
         )}

         {activeTab === 'transfers' && (
           <div className="space-y-10">
              <div className="flex justify-between items-center">
                 <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Pipeline de Transferencias</h3>
                 <button onClick={() => setIsTransferModalOpen(true)} className="px-8 py-4 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg flex items-center gap-3">
                    <PlusCircle className="w-4 h-4" /> SOLICITAR TRASPASO
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {transfers.map(tr => (
                   <div key={tr.id} className="glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-8 group hover:border-blue-500/30 transition-all bg-surface flex flex-col">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">TRANSACTION_ID: {tr.id}</span>
                            <div className="flex items-center gap-3">
                               <span className="text-xl font-space font-bold text-content-primary uppercase">{tr.originNodeId}</span>
                               <ChevronRight className="w-5 h-5 text-blue-500" />
                               <span className="text-xl font-space font-bold text-content-primary uppercase">{tr.targetNodeId}</span>
                            </div>
                         </div>
                         <TechnicalBadge variant={tr.status === 'received' ? 'emerald' : tr.status === 'shipped' ? 'amber' : 'blue'}>
                            {tr.status}
                         </TechnicalBadge>
                      </div>

                      <div className="p-6 glass rounded-2xl bg-main/50 space-y-4">
                         {tr.items.map((item, i) => (
                           <div key={i} className="flex justify-between items-center">
                              <div>
                                 <p className="text-[10px] font-bold text-content-primary uppercase">{item.name}</p>
                                 <p className="text-[8px] font-mono text-content-muted">{item.sku}</p>
                              </div>
                              <span className="text-sm font-black text-blue-600 dark:text-blue-500">x{item.quantity}</span>
                           </div>
                         ))}
                      </div>

                      <div className="pt-4 grid grid-cols-2 gap-6 text-[9px] font-black text-content-muted uppercase tracking-widest">
                         <div className="space-y-1">
                            <p>Despacho</p>
                            <p className="text-content-secondary font-bold">{tr.createdAt}</p>
                         </div>
                         <div className="text-right space-y-1">
                            <p>Responsable</p>
                            <p className="text-content-secondary font-bold">{tr.authorizedBy}</p>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-content-muted/10 flex gap-4 mt-auto">
                         {tr.status === 'shipped' ? (
                           <button onClick={() => handleConfirmReception(tr.id)} className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl flex items-center justify-center gap-3">
                              <FileCheck className="w-4 h-4" /> CONFIRMAR RECEPCIÓN
                           </button>
                         ) : (
                           <button className="w-full py-4 glass text-content-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">VER MANIFIESTO</button>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         )}

         {activeTab === 'rebalance' && (
           <div className="space-y-10">
              <div className="glass-card rounded-[3rem] p-12 border-blue-500/20 bg-blue-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-12 bg-surface">
                 <div className="space-y-6">
                    <h3 className="text-3xl font-space font-bold text-content-primary uppercase tracking-tighter flex items-center gap-4">
                       <Sparkles className="text-blue-500 fill-current" /> Balanceo Cognitivo
                    </h3>
                    <p className="text-sm text-content-secondary leading-relaxed max-w-xl font-medium">
                       El motor de IA analiza la velocidad de venta por nodo y sugiere transferencias de stock para evitar quiebres de inventario locales sin necesidad de nuevas compras.
                    </p>
                    <EnterpriseButton onClick={runRebalanceAudit} className="px-12 py-5 bg-blue-600">INICIAR ESCANEO DE RED</EnterpriseButton>
                 </div>
                 <div className="w-48 h-48 glass rounded-full border-blue-500/30 flex items-center justify-center animate-slow-spin">
                    <Map className="w-16 h-16 text-blue-500 opacity-20" />
                 </div>
              </div>

              {rebalanceSuggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {rebalanceSuggestions.map((s, i) => (
                     <div key={i} className="glass-card rounded-[2.5rem] p-8 border-content-muted/10 space-y-6 group hover:border-emerald-500/40 transition-all bg-surface shadow-sm">
                        <div className="flex justify-between items-start">
                           <TechnicalBadge variant={s.priority === 'high' ? 'red' : 'blue'}>
                              {s.priority} PRIORITY
                           </TechnicalBadge>
                           <Truck className="w-5 h-5 text-content-muted" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{s.productName}</p>
                           <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-content-primary uppercase">{s.sourceNode}</span>
                              <ChevronRight className="w-4 h-4 text-blue-500" />
                              <span className="text-xs font-bold text-content-primary uppercase">{s.targetNode}</span>
                           </div>
                        </div>
                        <div className="p-4 glass rounded-2xl bg-main/50 space-y-2">
                           <p className="text-[8px] font-black text-content-muted uppercase">Qty Sugerida</p>
                           <p className="text-xl font-bold text-emerald-500">+{s.quantity} UN</p>
                        </div>
                        <button className="w-full py-4 glass border-content-muted/10 rounded-xl text-[9px] font-black text-content-primary uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">EJECUTAR TRASPASO</button>
                     </div>
                   ))}
                </div>
              )}
           </div>
         )}
      </div>

      {isTransferModalOpen && (
        <TransferModal 
          nodes={nodes} 
          onClose={() => setIsTransferModalOpen(false)} 
          onSubmit={(data) => {
            setTransfers([{ ...data, id: `TR-${Date.now()}`, authorizedBy: user?.name || 'ADMIN' } as StockTransfer, ...transfers]);
            addAuditLog('transfer_create', 'transfer', 'new', `Solicitud de traspaso generada de ${data.originNodeId} a ${data.targetNodeId}`);
            addNotification("Orden de traspaso sincronizada", "info");
            setIsTransferModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

const TransferModal: React.FC<any> = ({ nodes, onClose, onSubmit }) => {
  const [form, setForm] = useState<Partial<StockTransfer>>({ originNodeId: nodes[0].id, targetNodeId: nodes[1].id, items: [], status: 'pending', createdAt: new Date().toLocaleTimeString() });

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-main/95 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-3xl glass-card rounded-[3.5rem] border-content-muted/10 p-12 space-y-10 animate-in slide-in-from-bottom-12 duration-700 bg-surface shadow-2xl">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-blue-500">
               <ArrowRightLeft className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-space font-bold text-content-primary uppercase tracking-tighter">Nueva Orden de Traspaso</h3>
         </div>

         <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[9px] font-black text-content-muted uppercase px-2">Origen (Hub)</label>
               <select value={form.originNodeId} onChange={e => setForm({...form, originNodeId: e.target.value})} className="w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-blue-500 appearance-none">
                  {nodes.map((n: any) => <option key={n.id} value={n.id}>{n.name}</option>)}
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-content-muted uppercase px-2">Destino (Retail)</label>
               <select value={form.targetNodeId} onChange={e => setForm({...form, targetNodeId: e.target.value})} className="w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-blue-500 appearance-none">
                  {nodes.map((n: any) => <option key={n.id} value={n.id}>{n.name}</option>)}
               </select>
            </div>
         </div>

         <div className="space-y-4">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Añadir Items (Búsqueda por SKU)</p>
            <div className="flex gap-4">
               <input type="text" placeholder="RS-VEL-X1-38..." className="flex-1 p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-mono outline-none" />
               <button onClick={() => setForm({...form, items: [...(form.items || []), { sku: 'RS-VEL-X1-38-RED', quantity: 1, name: 'Velocity X-1 Pro' }]})} className="px-8 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg">AGREGAR</button>
            </div>
            <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-2">
               {form.items?.map((item, i) => (
                 <div key={i} className="p-4 glass rounded-xl border border-content-muted/10 flex justify-between items-center bg-main/40">
                    <span className="text-[10px] font-bold text-content-primary">{item.name} [{item.sku}]</span>
                    <div className="flex items-center gap-4">
                       <input type="number" value={item.quantity} className="w-12 bg-transparent text-center font-bold text-blue-500" readOnly />
                       <button onClick={() => setForm({...form, items: form.items?.filter((_, idx) => idx !== i)})} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-5 glass text-content-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-content-primary transition-all">CANCELAR</button>
            <button 
              disabled={!form.items?.length || form.originNodeId === form.targetNodeId}
              onClick={() => onSubmit(form as StockTransfer)}
              className="flex-2 px-12 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all min-h-[56px] disabled:opacity-20"
            >
              DESPACHAR CARGA
            </button>
         </div>
      </div>
    </div>
  );
};

export default InventoryControlCenter;
