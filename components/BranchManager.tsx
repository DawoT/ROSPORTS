
import React, { useState } from 'react';
import { 
  Store, Warehouse, MapPin, Phone, User, 
  Clock, Plus, Edit3, Trash2, X, Search,
  CheckCircle, Globe, ShieldCheck, Activity
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { InventoryNode } from '../types';
import { EnterpriseInput, TechnicalBadge, EnterpriseButton } from './Primitives';

const BranchManager: React.FC = () => {
  const { inventoryNodes, addAuditLog, addNotification } = useGlobal();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<InventoryNode | null>(null);

  const handleSave = (branch: InventoryNode) => {
    addAuditLog('branch_change', 'branch', branch.id, `Nodo actualizado: ${branch.name}`);
    addNotification(`Sucursal ${branch.name} sincronizada`, 'success');
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-500">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-blue-500/20 shadow-xl bg-surface">
               <MapPin className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-content-muted">Global Mesh Topology</span>
               <h2 className="font-space text-4xl font-bold text-content-primary uppercase tracking-tighter">Ubicaciones & <span className="text-gradient">Sucursales</span></h2>
            </div>
          </div>
        </div>
        <button onClick={() => { setEditingBranch(null); setIsEditorOpen(true); }} className="px-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all flex items-center gap-3 min-h-[56px]">
           <Plus className="w-4 h-4" /> REGISTRAR NODO
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {inventoryNodes.map(node => (
           <div key={node.id} className="glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-8 flex flex-col bg-surface hover:border-blue-500/30 transition-all group shadow-sm">
              <div className="flex justify-between items-start">
                 <div className={`w-16 h-16 glass rounded-2xl flex items-center justify-center ${node.type === 'store' ? 'text-blue-500' : 'text-purple-500'} bg-main border border-content-muted/10 shadow-xl group-hover:scale-110 transition-transform`}>
                    {node.type === 'store' ? <Store className="w-8 h-8" /> : <Warehouse className="w-8 h-8" />}
                 </div>
                 <TechnicalBadge variant={node.status === 'online' ? 'emerald' : 'red'}>
                   {node.status}
                 </TechnicalBadge>
              </div>

              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-[9px] font-black text-content-muted uppercase tracking-widest">
                    <span>ID_NODE: {node.id}</span>
                    <div className="w-1 h-1 bg-content-muted/30 rounded-full" />
                    <span>{node.type === 'store' ? 'PUNTO_RETAIL' : 'HUB_LOGISTICO'}</span>
                 </div>
                 <h3 className="text-2xl font-space font-bold text-content-primary uppercase leading-none tracking-tighter">{node.name}</h3>
              </div>

              <div className="space-y-4 pt-6 border-t border-content-muted/10">
                 <div className="flex items-start gap-4">
                    <MapPin className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                    <p className="text-[11px] font-bold text-content-secondary uppercase leading-relaxed">{node.address}</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <p className="text-[10px] font-black text-content-primary uppercase tracking-widest">{node.responsible || 'ASIGNANDO...'}</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <p className="text-[10px] font-bold text-content-muted uppercase">{node.workingHours || 'L-S 09:00 - 21:00'}</p>
                 </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 ${node.allowsPublicSales ? 'text-emerald-500' : 'text-red-500'}`} />
                    <span className="text-[8px] font-black text-content-muted uppercase tracking-widest">{node.allowsPublicSales ? 'VENTA PÚBLICO' : 'SOLO ALMACÉN'}</span>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => { setEditingBranch(node); setIsEditorOpen(true); }} className="p-3 glass rounded-xl border-content-muted/10 text-content-muted hover:text-blue-500 transition-all shadow-sm"><Edit3 className="w-4 h-4" /></button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {isEditorOpen && (
        <BranchEditor 
          branch={editingBranch} 
          onClose={() => setIsEditorOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

const BranchEditor: React.FC<{ branch: InventoryNode | null, onClose: () => void, onSave: (b: InventoryNode) => void }> = ({ branch, onClose, onSave }) => {
  const [form, setForm] = useState<Partial<InventoryNode>>(branch || {
    name: '', type: 'store', address: '', status: 'online', allowsPublicSales: true, responsible: '', workingHours: ''
  });

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-main/95 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass-card rounded-[3.5rem] border-content-muted/10 p-12 space-y-10 animate-in slide-in-from-bottom-12 duration-700 bg-surface shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
              <MapPin className="w-8 h-8" />
           </div>
           <h3 className="text-3xl font-space font-bold text-content-primary uppercase tracking-tighter">{branch ? 'Actualizar Nodo' : 'Nuevo Nodo Físico'}</h3>
        </div>

        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-content-muted uppercase px-2 tracking-widest">Nombre del Nodo</label>
                 <input value={form.name} onChange={e => setForm({...form, name: e.target.value.toUpperCase()})} className="w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-blue-500 shadow-sm" placeholder="EJ: NODO SUR JOCKEY" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-content-muted uppercase px-2 tracking-widest">Tipo de Ubicación</label>
                 <select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})} className="w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-blue-500 appearance-none">
                    <option value="store">TIENDA (RETAIL)</option>
                    <option value="warehouse">ALMACÉN (LOGÍSTICA)</option>
                 </select>
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[9px] font-black text-content-muted uppercase px-2 tracking-widest">Dirección Operativa</label>
              <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-blue-500 shadow-sm" placeholder="Av. / Calle / Distrito" />
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-content-muted uppercase px-2 tracking-widest">Responsable del Nodo</label>
                 <input value={form.responsible} onChange={e => setForm({...form, responsible: e.target.value.toUpperCase()})} className="w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-blue-500 shadow-sm" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-content-muted uppercase px-2 tracking-widest">Horario de Atención</label>
                 <input value={form.workingHours} onChange={e => setForm({...form, workingHours: e.target.value})} className="w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-blue-500 shadow-sm" placeholder="L-V 10-20, S 10-18" />
              </div>
           </div>
           
           <button 
             onClick={() => setForm({...form, allowsPublicSales: !form.allowsPublicSales})}
             className="w-full flex items-center justify-between p-5 glass rounded-2xl group transition-all"
           >
              <div className="flex items-center gap-3">
                 <ShieldCheck className={`w-5 h-5 ${form.allowsPublicSales ? 'text-emerald-500' : 'text-content-muted'}`} />
                 <span className="text-[10px] font-black text-content-muted uppercase tracking-widest group-hover:text-content-primary transition-colors">Permite Venta al Público Directa</span>
              </div>
              <div className={`w-10 h-5 rounded-full transition-all relative ${form.allowsPublicSales ? 'bg-emerald-500' : 'bg-content-muted/20'}`}>
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.allowsPublicSales ? 'left-6' : 'left-1'}`} />
              </div>
           </button>
        </div>

        <div className="flex gap-4">
           <button onClick={onClose} className="flex-1 py-5 glass text-content-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-content-primary hover:bg-main transition-all shadow-sm">CANCELAR</button>
           <button 
             onClick={() => onSave({ ...form, id: branch?.id || `NODE-${Date.now()}` } as InventoryNode)}
             className="flex-2 px-12 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all min-h-[56px]"
           >
             SINCRONIZAR NODO
           </button>
        </div>
      </div>
    </div>
  );
};

export default BranchManager;
