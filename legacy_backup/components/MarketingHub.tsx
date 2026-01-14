import React, { useState, useMemo } from 'react';
import {
  Zap,
  Plus,
  Trash2,
  Edit3,
  Layers,
  MousePointer2,
  Percent,
  Globe,
  Store,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { Campaign } from '../types';

const MarketingHub: React.FC = () => {
  const { addNotification, addAuditLog } = useGlobal();
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'CAMP-001',
      name: 'Elite Cyber Week',
      description: '20% off en toda la categoría Running',
      type: 'category',
      targetCategory: 'Running',
      discountValue: 20,
      startsAt: '2025-05-10',
      endsAt: '2025-05-20',
      status: 'active',
      usageCount: 42,
      code: 'CYBER20',
      isAutomatic: true,
      channels: ['WEB', 'LOCAL_STORE'],
      canCombine: true,
      maxGlobalUsage: 1000,
      maxPerCustomer: 1,
      priority: 10,
    },
    {
      id: 'CAMP-002',
      name: 'Welcome Athlete',
      description: 'S/ 50 de descuento para nuevos registros',
      type: 'fixed',
      discountValue: 50,
      minPurchaseAmount: 300,
      startsAt: '2025-01-01',
      endsAt: '2025-12-31',
      status: 'active',
      usageCount: 128,
      code: 'ELITE50',
      isAutomatic: false,
      channels: ['WEB'],
      canCombine: false,
      maxGlobalUsage: 5000,
      maxPerCustomer: 1,
      priority: 5,
    },
  ]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const stats = useMemo(
    () => ({
      activeCount: campaigns.filter((c) => c.status === 'active').length,
      totalUsage: campaigns.reduce((acc, c) => acc + c.usageCount, 0),
      avgDiscount: campaigns.reduce((acc, c) => acc + c.discountValue, 0) / (campaigns.length || 1),
    }),
    [campaigns],
  );

  return (
    <div className='space-y-10 animate-in fade-in duration-700 pb-32'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-purple-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-purple-500/20 shadow-xl bg-surface'>
              <Zap className='w-6 h-6 fill-current' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] text-content-muted'>
                Growth & Loyalty Systems
              </span>
              <h2 className='font-space text-4xl font-bold text-content-primary uppercase tracking-tighter leading-none'>
                Marketing <span className='text-gradient'>Hub</span>
              </h2>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingCampaign(null);
            setIsEditorOpen(true);
          }}
          className='px-10 py-5 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-purple-500 transition-all flex items-center gap-3 min-h-[56px]'
        >
          <Plus className='w-4 h-4' /> LANZAR ESTRATEGIA
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {[
          {
            label: 'Campañas Activas',
            val: stats.activeCount,
            icon: Layers,
            color: 'text-blue-500',
          },
          {
            label: 'Redenciones Totales',
            val: stats.totalUsage,
            icon: MousePointer2,
            color: 'text-emerald-500',
          },
          {
            label: 'Valor Promedio',
            val: stats.avgDiscount.toFixed(1) + (campaigns[0]?.type === 'percentage' ? '%' : ' S/'),
            icon: Percent,
            color: 'text-amber-500',
          },
        ].map((s, i) => (
          <div
            key={i}
            className='glass-card rounded-[2.5rem] p-8 border-content-muted/10 space-y-4 bg-surface shadow-sm'
          >
            <s.icon className={`w-6 h-6 ${s.color}`} />
            <div>
              <p className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
                {s.label}
              </p>
              <p className='text-3xl font-space font-bold text-content-primary'>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className='glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-8 group hover:border-purple-500/30 transition-all bg-surface flex flex-col'
          >
            <div className='flex justify-between items-start'>
              <div className='space-y-1'>
                <div className='flex items-center gap-3'>
                  <span className='text-[8px] font-black text-purple-500 uppercase tracking-widest'>
                    ID: {camp.id}
                  </span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-[7px] font-black uppercase border ${camp.status === 'active' ? 'border-emerald-500/30 text-emerald-500' : 'border-white/10 text-slate-500'}`}
                  >
                    {camp.status}
                  </span>
                </div>
                <h3 className='text-2xl font-space font-bold text-content-primary uppercase leading-none mt-2'>
                  {camp.name}
                </h3>
              </div>
              <div className='p-4 glass rounded-2xl border-white/5 text-center min-w-[100px] bg-main/50'>
                <p className='text-[7px] font-black text-content-muted uppercase mb-1'>
                  {camp.isAutomatic ? 'AUTO_APPLY' : 'CÓDIGO'}
                </p>
                <p className='text-xs font-mono font-bold text-blue-500'>
                  {camp.isAutomatic ? 'SYSTEM' : camp.code}
                </p>
              </div>
            </div>

            <p className='text-[11px] text-content-secondary font-medium leading-relaxed italic'>
              "{camp.description}"
            </p>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-content-muted/10'>
              <div className='space-y-1'>
                <p className='text-[7px] font-black text-content-muted uppercase'>Beneficio</p>
                <p className='text-xs font-bold text-content-primary'>
                  {camp.type === 'fixed' ? `S/ ${camp.discountValue}` : `${camp.discountValue}%`}
                </p>
              </div>
              <div className='space-y-1'>
                <p className='text-[7px] font-black text-content-muted uppercase'>Canales</p>
                <div className='flex gap-1'>
                  {camp.channels.map((c) =>
                    c === 'WEB' ? (
                      <Globe key={c} className='w-3 h-3 text-blue-500' />
                    ) : (
                      <Store key={c} className='w-3 h-3 text-amber-500' />
                    ),
                  )}
                </div>
              </div>
              <div className='space-y-1 text-center'>
                <p className='text-[7px] font-black text-content-muted uppercase'>Combinable</p>
                <p
                  className={`text-[8px] font-black ${camp.canCombine ? 'text-emerald-500' : 'text-red-500'}`}
                >
                  {camp.canCombine ? 'SÍ' : 'NO'}
                </p>
              </div>
              <div className='space-y-1 text-right'>
                <p className='text-[7px] font-black text-content-muted uppercase'>Uso</p>
                <p className='text-xs font-bold text-content-primary'>
                  {camp.usageCount}/{camp.maxGlobalUsage}
                </p>
              </div>
            </div>

            <div className='flex gap-4 mt-auto'>
              <button className='flex-1 py-4 glass text-content-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all min-h-[44px]'>
                REPORTES ROI
              </button>
              <button
                onClick={() => {
                  setEditingCampaign(camp);
                  setIsEditorOpen(true);
                }}
                className='p-4 glass rounded-xl border-content-muted/10 text-content-muted hover:text-purple-500 transition-all min-h-[44px]'
              >
                <Edit3 className='w-4 h-4' />
              </button>
              <button className='p-4 glass rounded-xl border-content-muted/10 text-content-muted hover:text-red-500 transition-all min-h-[44px]'>
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditorOpen && (
        <CampaignEditor
          campaign={editingCampaign}
          onClose={() => setIsEditorOpen(false)}
          onSave={(c) => {
            setCampaigns((prev) => {
              const exists = prev.find((old) => old.id === c.id);
              if (exists) return prev.map((old) => (old.id === c.id ? c : old));
              return [c, ...prev];
            });
            addAuditLog(
              'MARKETING_DEPLOY',
              'campaign',
              c.id,
              `Estrategia ${c.name} activada en red.`,
            );
            addNotification('Estrategia comercial sincronizada', 'success');
            setIsEditorOpen(false);
          }}
        />
      )}
    </div>
  );
};

const CampaignEditor: React.FC<{
  campaign: Campaign | null;
  onClose: () => void;
  onSave: (c: Campaign) => void;
}> = ({ campaign, onClose, onSave }) => {
  const [form, setForm] = useState<Partial<Campaign>>(
    campaign || {
      type: 'percentage',
      status: 'active',
      usageCount: 0,
      isAutomatic: true,
      channels: ['WEB', 'LOCAL_STORE'],
      canCombine: false,
      priority: 1,
      maxGlobalUsage: 1000,
      maxPerCustomer: 1,
    },
  );

  return (
    <div className='fixed inset-0 z-[500] flex items-center justify-center p-6'>
      <div
        className='absolute inset-0 bg-main/95 backdrop-blur-xl animate-in fade-in'
        onClick={onClose}
      />
      <div className='relative w-full max-w-4xl glass-card rounded-[3.5rem] border-content-muted/10 p-12 space-y-10 animate-in slide-in-from-bottom-12 duration-700 bg-surface shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar'>
        <div className='flex items-center gap-4'>
          <Zap className='w-10 h-10 text-purple-500 fill-current' />
          <h3 className='text-3xl font-space font-bold text-content-primary uppercase tracking-tighter'>
            Configuración de Campaña
          </h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
                Título Interno
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
                className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-purple-500'
                placeholder='NOMBRE DE LA PROMOCIÓN'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
                Mecánica Principal
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Campaign['type'] })}
                className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold appearance-none outline-none focus:border-purple-500'
              >
                <option value='percentage'>DESCUENTO PORCENTUAL (%)</option>
                <option value='fixed'>MONTO FIJO (S/)</option>
                <option value='category'>CATEGORÍA ESPECÍFICA</option>
                <option value='brand'>MARCA ESPECÍFICA</option>
                <option value='bogo'>MECÁNICA BOGO (X x Y)</option>
              </select>
            </div>
            <div className='grid grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
                  Valor Benf.
                </label>
                <input
                  type='number'
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                  className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
                  Prioridad
                </label>
                <input
                  type='number'
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                  className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold'
                />
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='p-8 glass rounded-[2.5rem] border-content-muted/10 space-y-6 bg-main/30'>
              <h4 className='text-[10px] font-black text-blue-500 uppercase tracking-widest'>
                Reglas de Activación
              </h4>

              <button
                onClick={() => setForm({ ...form, isAutomatic: !form.isAutomatic })}
                className='w-full flex items-center justify-between p-4 glass rounded-xl group transition-all'
              >
                <span className='text-[9px] font-black text-content-muted uppercase tracking-widest group-hover:text-content-primary'>
                  Aplicación Automática
                </span>
                <div
                  className={`w-10 h-5 rounded-full transition-all relative ${form.isAutomatic ? 'bg-emerald-500' : 'bg-content-muted/20'}`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.isAutomatic ? 'left-6' : 'left-1'}`}
                  />
                </div>
              </button>

              {!form.isAutomatic && (
                <div className='space-y-2 animate-in slide-in-from-top-2'>
                  <label className='text-[9px] font-black text-content-muted uppercase px-2'>
                    Código del Cupón
                  </label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className='w-full p-4 glass border-content-muted/10 rounded-xl text-blue-500 font-mono text-sm font-bold uppercase'
                    placeholder='EJ: NEON2025'
                  />
                </div>
              )}

              <div className='grid grid-cols-2 gap-4'>
                <button
                  onClick={() => setForm({ ...form, canCombine: !form.canCombine })}
                  className={`py-4 rounded-xl text-[8px] font-black uppercase border transition-all ${form.canCombine ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'glass border-content-muted/10 text-content-muted'}`}
                >
                  COMBINABLE
                </button>
                <button className='py-4 glass border-content-muted/10 text-content-muted rounded-xl text-[8px] font-black uppercase'>
                  RESTRICCIÓN CLIENTE
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='flex gap-4'>
          <button
            onClick={onClose}
            className='flex-1 py-5 glass text-content-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-content-primary transition-all'
          >
            DESCARTAR
          </button>
          <button
            onClick={() =>
              onSave({
                ...form,
                id: form.id || `CAMP-${Date.now()}`,
                startsAt: new Date().toISOString(),
                endsAt: '2025-12-31',
              } as Campaign)
            }
            className='flex-2 py-5 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-purple-500 transition-all px-16'
          >
            DESPLEGAR ESTRATEGIA
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketingHub;
