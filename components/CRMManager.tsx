import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  User as UserIcon,
  Edit3,
  X,
  AlertCircle,
  Fingerprint,
  Activity,
  Clock,
  CreditCard,
  Award,
  ShoppingBag,
  MapPin,
  RefreshCw,
  CheckCircle,
  Database,
  Info,
  ExternalLink,
  Globe,
  Instagram,
  MessageCircle,
  Store,
  Zap,
  SearchCode,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { Customer, DocType, CustomerSegment, OrderHistoryItem, SaleChannel } from '../types';
import { IntegrationService } from '../services/integrationService';

// Added missing CustomerDetailView component to fix 'Cannot find name' error
const CustomerDetailView: React.FC<{ customer: Customer; onClose: () => void }> = ({
  customer,
  onClose,
}) => {
  return (
    <div className='fixed inset-0 z-[300] flex items-center justify-center p-6'>
      <div
        className='absolute inset-0 bg-main/95 backdrop-blur-xl animate-in fade-in'
        onClick={onClose}
      />
      <div className='relative w-full max-w-4xl h-[80vh] glass-card rounded-[3.5rem] border-content-muted/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-700 bg-surface shadow-2xl'>
        <div className='p-8 sm:p-10 border-b border-content-muted/10 flex items-center justify-between bg-content-muted/[0.02]'>
          <div className='flex items-center gap-6'>
            <div className='w-16 h-16 glass rounded-2xl flex items-center justify-center text-purple-500 border border-purple-500/20 shadow-sm bg-main'>
              <Fingerprint className='w-8 h-8' />
            </div>
            <div className='space-y-1'>
              <h3 className='text-3xl font-space font-bold text-content-primary uppercase tracking-tighter'>
                {customer.fullName}
              </h3>
              <p className='text-[10px] font-black text-purple-500 uppercase tracking-widest'>
                {customer.segment} ATHLETE // ID: {customer.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-4 glass border-content-muted/10 rounded-2xl hover:text-red-500 transition-all shadow-sm'
          >
            <X />
          </button>
        </div>

        <div className='p-10 overflow-y-auto custom-scrollbar flex-1 space-y-12'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='p-6 glass rounded-2xl border-content-muted/10 space-y-2'>
              <p className='text-[8px] font-black text-content-muted uppercase'>Digital Wallet</p>
              <p className='text-xl font-bold text-emerald-500'>
                S/ {customer.creditBalance.toFixed(2)}
              </p>
            </div>
            <div className='p-6 glass rounded-2xl border-content-muted/10 space-y-2'>
              <p className='text-[8px] font-black text-content-muted uppercase'>
                Performance Points
              </p>
              <p className='text-xl font-bold text-amber-500'>{customer.points} PTS</p>
            </div>
            <div className='p-6 glass rounded-2xl border-content-muted/10 space-y-2'>
              <p className='text-[8px] font-black text-content-muted uppercase'>
                Registration Date
              </p>
              <p className='text-xs font-bold text-content-primary'>
                {new Date(customer.registrationDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='flex items-center gap-3'>
              <Activity className='w-5 h-5 text-purple-500' />
              <h4 className='text-[10px] font-black text-content-primary uppercase tracking-[0.4em]'>
                Historial de Despliegues
              </h4>
            </div>
            <div className='glass rounded-[2rem] overflow-hidden border border-content-muted/10'>
              <table className='w-full text-left'>
                <thead className='bg-content-muted/[0.03]'>
                  <tr className='border-b border-content-muted/10'>
                    <th className='px-8 py-4 text-[9px] font-black text-content-muted uppercase'>
                      Orden
                    </th>
                    <th className='px-8 py-4 text-[9px] font-black text-content-muted uppercase'>
                      Timestamp
                    </th>
                    <th className='px-8 py-4 text-[9px] font-black text-content-muted uppercase text-right'>
                      Monto
                    </th>
                    <th className='px-8 py-4 text-[9px] font-black text-content-muted uppercase text-center'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-content-muted/10'>
                  {customer.purchaseHistory?.length ? (
                    customer.purchaseHistory.map((h) => (
                      <tr key={h.orderId} className='hover:bg-content-muted/[0.01]'>
                        <td className='px-8 py-4 text-[10px] font-mono font-bold text-blue-500'>
                          {h.orderId}
                        </td>
                        <td className='px-8 py-4 text-[10px] text-content-secondary'>
                          {new Date(h.date).toLocaleString()}
                        </td>
                        <td className='px-8 py-4 text-right text-[10px] font-bold'>
                          S/ {h.total.toFixed(2)}
                        </td>
                        <td className='px-8 py-4 text-center'>
                          <span
                            className={`px-3 py-1 rounded-full text-[7px] font-black uppercase border ${
                              h.status === 'delivered'
                                ? 'border-emerald-500/30 text-emerald-500'
                                : h.status === 'voided'
                                  ? 'border-red-500/30 text-red-500'
                                  : 'border-amber-500/30 text-amber-500'
                            }`}
                          >
                            {h.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className='py-12 text-center text-[9px] font-black text-content-muted uppercase tracking-widest opacity-30'
                      >
                        Sin transacciones registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CRMManager: React.FC = () => {
  const { customers, setCustomers, addNotification } = useGlobal();
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<CustomerSegment | 'all'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.docNumber.includes(searchQuery);
      const matchesSegment = segmentFilter === 'all' || c.segment === segmentFilter;
      return matchesSearch && matchesSegment;
    });
  }, [customers, searchQuery, segmentFilter]);

  const onSaveCustomer = (c: Customer) => {
    setCustomers((prev) => {
      const exists = prev.find((old) => old.id === c.id);
      if (exists) return prev.map((old) => (old.id === c.id ? c : old));
      return [c, ...prev];
    });
    setIsEditorOpen(false);
  };

  return (
    <div className='space-y-10 pb-20 px-4 md:px-0 animate-in fade-in duration-700'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-purple-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)] bg-surface'>
              <Users className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] text-content-muted'>
                Customer Relationship Hub
              </span>
              <h2 className='font-space text-4xl font-bold text-content-primary uppercase tracking-tighter leading-none'>
                Base de Datos <span className='text-gradient'>Omnicanal</span>
              </h2>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setIsEditorOpen(true);
          }}
          className='px-10 py-5 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl flex items-center gap-3 hover:bg-purple-500 transition-all min-h-[56px]'
        >
          <UserPlus className='w-4 h-4' /> REGISTRAR ATHLETE
        </button>
      </div>

      <div className='glass p-6 rounded-[2.5rem] border-content-muted/10 flex flex-col lg:flex-row gap-6 bg-surface'>
        <div className='flex-1 relative'>
          <Search className='absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted' />
          <input
            type='text'
            placeholder='BUSCAR POR DNI, RUC, NOMBRE...'
            className='w-full pl-14 pr-8 py-5 glass border-content-muted/10 bg-main/40 rounded-2xl outline-none text-xs font-bold text-content-primary uppercase tracking-widest focus:border-purple-500/50 transition-all'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='flex gap-2 overflow-x-auto custom-scrollbar pb-2 lg:pb-0'>
          {['all', 'vip', 'frequent', 'new', 'inactive'].map((seg) => (
            <button
              key={seg}
              onClick={() => setSegmentFilter(seg as any)}
              className={`px-6 py-5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 min-h-[48px] ${segmentFilter === seg ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'glass border-content-muted/10 text-content-muted hover:text-content-primary hover:bg-main'}`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      <div className='glass-card rounded-[3rem] border-content-muted/10 overflow-hidden bg-surface shadow-sm'>
        <table className='w-full text-left'>
          <thead>
            <tr className='bg-content-muted/[0.03] border-b border-content-muted/10'>
              <th className='px-8 py-6 text-[9px] font-black text-content-muted uppercase tracking-widest'>
                Identidad Técnica
              </th>
              <th className='px-8 py-6 text-[9px] font-black text-content-muted uppercase tracking-widest text-center'>
                Nivel Athlete
              </th>
              <th className='px-8 py-6 text-[9px] font-black text-content-muted uppercase tracking-widest text-center'>
                Wallet Status
              </th>
              <th className='px-8 py-6 text-right uppercase text-[9px] font-black text-content-muted tracking-widest'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-content-muted/10'>
            {filteredCustomers.map((c) => (
              <tr key={c.id} className='hover:bg-content-muted/[0.02] transition-colors group'>
                <td className='px-8 py-6'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-all bg-main border border-content-muted/10 shadow-sm'>
                      <Fingerprint className='w-6 h-6' />
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-xs font-bold text-content-primary uppercase'>
                        {c.fullName}
                      </span>
                      <span className='text-[9px] text-content-muted font-mono tracking-widest uppercase'>
                        {c.docType}: {c.docNumber}
                      </span>
                    </div>
                  </div>
                </td>
                <td className='px-8 py-6 text-center'>
                  <span
                    className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${
                      c.segment === 'vip'
                        ? 'text-amber-600 dark:text-amber-500 border-amber-500/30 bg-amber-500/5'
                        : c.segment === 'frequent'
                          ? 'text-blue-600 dark:text-blue-500 border-blue-500/30 bg-blue-500/5'
                          : 'text-content-muted border-content-muted/20'
                    }`}
                  >
                    {c.segment} elite
                  </span>
                </td>
                <td className='px-8 py-6'>
                  <div className='flex justify-center gap-8'>
                    <div className='flex flex-col items-center'>
                      <p className='text-[8px] font-black text-content-muted uppercase tracking-widest'>
                        Points
                      </p>
                      <p className='text-xs font-bold text-amber-500'>{c.points}</p>
                    </div>
                    <div className='flex flex-col items-center'>
                      <p className='text-[8px] font-black text-content-muted uppercase tracking-widest'>
                        Balance
                      </p>
                      <p className='text-xs font-bold text-emerald-500'>
                        S/ {c.creditBalance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className='px-8 py-6 text-right'>
                  <div className='flex justify-end gap-3'>
                    <button
                      onClick={() => setViewingCustomer(c)}
                      className='p-3 glass rounded-xl border-content-muted/10 text-content-muted hover:text-blue-500 transition-all shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center'
                      aria-label='Ver detalles'
                    >
                      <ExternalLink className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => {
                        setEditingCustomer(c);
                        setIsEditorOpen(true);
                      }}
                      className='p-3 glass rounded-xl border-content-muted/10 text-content-muted hover:text-purple-500 transition-all shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center'
                      aria-label='Editar'
                    >
                      <Edit3 className='w-4 h-4' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditorOpen && (
        <CustomerEditor
          customer={editingCustomer}
          onClose={() => setIsEditorOpen(false)}
          onSave={onSaveCustomer}
        />
      )}

      {viewingCustomer && (
        <CustomerDetailView customer={viewingCustomer} onClose={() => setViewingCustomer(null)} />
      )}
    </div>
  );
};

const CustomerEditor: React.FC<{
  customer: Customer | null;
  onClose: () => void;
  onSave: (c: Customer) => void;
}> = ({ customer, onClose, onSave }) => {
  const { addNotification } = useGlobal();
  const [formData, setFormData] = useState<Partial<Customer>>(
    customer || {
      docType: 'DNI',
      docNumber: '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      district: 'LIMA',
      city: 'LIMA',
      points: 0,
      creditBalance: 0,
      status: 'active',
      segment: 'new',
    },
  );
  const [isValidating, setIsValidating] = useState(false);

  const handleExternalLookup = async () => {
    if (!formData.docNumber || formData.docNumber.length < 8) {
      addNotification('Ingrese un documento válido', 'error');
      return;
    }

    setIsValidating(true);
    try {
      if (formData.docType === 'DNI') {
        const res = await IntegrationService.validateDNI(formData.docNumber);
        if (res.success) {
          setFormData({ ...formData, fullName: res.data.fullName });
          addNotification('Identidad sincronizada con RENIEC', 'success');
        } else {
          addNotification(res.message!, 'error');
        }
      } else if (formData.docType === 'RUC') {
        const res = await IntegrationService.validateRUC(formData.docNumber);
        if (res.success) {
          setFormData({ ...formData, fullName: res.data.razonSocial, address: res.data.direccion });
          addNotification('Contribuyente verificado con SUNAT', 'success');
        } else {
          addNotification(res.message!, 'error');
        }
      }
    } catch (e) {
      addNotification('Falla en enlace con API externa', 'error');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className='fixed inset-0 z-[300] flex items-center justify-center p-6'>
      <div
        className='absolute inset-0 bg-main/95 backdrop-blur-xl animate-in fade-in'
        onClick={onClose}
      />
      <div className='relative w-full max-w-4xl glass-card rounded-[3.5rem] border-content-muted/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-700 bg-surface shadow-2xl'>
        <div className='p-8 sm:p-10 border-b border-content-muted/10 flex items-center justify-between bg-content-muted/[0.02]'>
          <h3 className='text-2xl font-space font-bold text-content-primary uppercase tracking-tighter'>
            {customer ? 'Actualizar Ficha Athlete' : 'Nuevo Registro'}
          </h3>
          <button
            onClick={onClose}
            className='p-4 glass border-content-muted/10 rounded-2xl hover:text-red-500 transition-all'
          >
            <X />
          </button>
        </div>

        <div className='p-8 sm:p-12 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-4'>
              <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
                Documento de Identidad
              </label>
              <div className='flex gap-3'>
                <select
                  value={formData.docType}
                  onChange={(e) => setFormData({ ...formData, docType: e.target.value as any })}
                  className='w-24 p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-purple-500 appearance-none'
                >
                  <option>DNI</option>
                  <option>RUC</option>
                </select>
                <div className='flex-1 relative'>
                  <input
                    value={formData.docNumber}
                    onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                    className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-purple-500 pr-14'
                    placeholder='########'
                  />
                  <button
                    onClick={handleExternalLookup}
                    disabled={isValidating}
                    className='absolute right-3 top-1/2 -translate-y-1/2 p-2.5 glass rounded-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all'
                  >
                    {isValidating ? (
                      <RefreshCw className='w-4 h-4 animate-spin' />
                    ) : (
                      <SearchCode className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
                Nombre / Razón Social
              </label>
              <input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value.toUpperCase() })
                }
                className={`w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-purple-500 shadow-sm ${isValidating ? 'opacity-50' : ''}`}
              />
            </div>

            <div className='space-y-2'>
              <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
                Email
              </label>
              <input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-purple-500 shadow-sm'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
                Celular
              </label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-purple-500 shadow-sm'
              />
            </div>

            <div className='md:col-span-2 space-y-2'>
              <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
                Dirección Operativa
              </label>
              <input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value.toUpperCase() })
                }
                className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-purple-500 shadow-sm'
              />
            </div>
          </div>
        </div>

        <div className='p-8 sm:p-10 border-t border-content-muted/10 bg-content-muted/[0.04] flex justify-end gap-6'>
          <button
            onClick={onClose}
            className='px-10 py-5 glass border-content-muted/10 text-content-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-content-primary hover:bg-main transition-all shadow-sm'
          >
            CANCELAR
          </button>
          <button
            onClick={() =>
              onSave({
                ...formData,
                id: formData.id || `C-${Date.now()}`,
                registrationDate: formData.registrationDate || new Date().toISOString(),
              } as Customer)
            }
            className='px-16 py-5 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-purple-500 transition-all min-h-[56px]'
          >
            SINCRONIZAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default CRMManager;
