import React, { useState, useMemo } from 'react';
import {
  History,
  RotateCcw,
  ShieldAlert,
  CheckCircle,
  Search,
  Filter,
  Plus,
  X,
  MessageSquare,
  AlertCircle,
  HardDrive,
  ClipboardList,
  PenTool,
  Camera,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { RMACase } from '../types';
import { AIAssistantService } from '../services/aiAssistantService';
import { TechnicalBadge, EnterpriseButton } from './Primitives';

const ReturnsManager: React.FC = () => {
  const { rmaCases, setRMACases, addAuditLog, addNotification } = useGlobal();
  const [filterStatus, setFilterStatus] = useState<RMACase['status'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredCases = useMemo(() => {
    return rmaCases.filter((c) => {
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchesQuery = c.orderId.includes(searchQuery) || c.id.includes(searchQuery);
      return matchesStatus && matchesQuery;
    });
  }, [rmaCases, filterStatus, searchQuery]);

  const runAIDiagnostic = async (c: RMACase) => {
    if (!c.productImage) return;
    setIsAnalyzing(true);
    const diagnostic = await AIAssistantService.diagnoseProductFault(c.productImage, c.reason);

    setRMACases((prev) =>
      prev.map((item) =>
        item.id === c.id
          ? {
              ...item,
              visualDiagnostic: diagnostic,
              status: diagnostic.recommendation === 'approve' ? 'approved' : 'under_review',
              technicianNote: `ANÁLISIS INTELIGENTE: ${diagnostic.aiAnalysis}`,
            }
          : item,
      ),
    );

    addAuditLog('quality_check', 'returns', c.id, `Evaluación visual completada para cambio.`);
    setIsAnalyzing(false);
  };

  return (
    <div className='space-y-10 animate-in fade-in duration-700 pb-20'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-red-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-red-500/20 shadow-xl bg-surface'>
              <RotateCcw className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] text-content-muted'>
                Customer Satisfaction Hub
              </span>
              <h2 className='font-space text-4xl font-bold text-content-primary uppercase tracking-tighter leading-none'>
                Gestión de <span className='text-red-500'>Garantías y Cambios</span>
              </h2>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className='px-10 py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-red-500 transition-all flex items-center gap-3 min-h-[56px]'
        >
          <Plus className='w-4 h-4' /> REGISTRAR SOLICITUD
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {filteredCases.map((c) => (
          <div
            key={c.id}
            className='glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-8 group hover:border-red-500/30 transition-all flex flex-col bg-surface shadow-sm'
          >
            <div className='flex justify-between items-start'>
              <div className='space-y-1'>
                <span className='text-[8px] font-black text-red-500 uppercase tracking-widest'>
                  TICKET: {c.id}
                </span>
                <h3 className='text-xl font-space font-bold text-content-primary uppercase'>
                  Pedido: {c.orderId}
                </h3>
                <p className='text-[9px] font-bold text-content-muted uppercase'>
                  Ingreso: {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
              <TechnicalBadge
                variant={
                  c.status === 'approved' ? 'emerald' : c.status === 'rejected' ? 'red' : 'amber'
                }
              >
                {c.status === 'approved'
                  ? 'Aprobado'
                  : c.status === 'rejected'
                    ? 'Rechazado'
                    : 'En Revisión'}
              </TechnicalBadge>
            </div>

            {c.productImage && (
              <div className='relative h-48 glass rounded-2xl overflow-hidden border border-content-muted/10'>
                <img
                  src={`data:image/jpeg;base64,${c.productImage}`}
                  className='w-full h-full object-cover'
                  alt='Estado del producto'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                {c.visualDiagnostic ? (
                  <div className='absolute bottom-4 left-4 right-4 flex justify-between items-center'>
                    <span className='text-[10px] font-black text-white uppercase tracking-widest'>
                      PRECISIÓN DE EVALUACIÓN: {(c.visualDiagnostic.confidence * 100).toFixed(0)}%
                    </span>
                    <CheckCircle className='w-4 h-4 text-emerald-500' />
                  </div>
                ) : (
                  <button
                    onClick={() => runAIDiagnostic(c)}
                    disabled={isAnalyzing}
                    className='absolute inset-0 flex items-center justify-center bg-blue-600/20 group-hover:bg-blue-600/40 transition-all'
                  >
                    {isAnalyzing ? (
                      <RefreshCw className='w-6 h-6 text-white animate-spin' />
                    ) : (
                      <Sparkles className='w-8 h-8 text-white fill-current' />
                    )}
                  </button>
                )}
              </div>
            )}

            <div className='p-6 glass rounded-2xl border-content-muted/10 space-y-4 bg-main/50'>
              <div className='flex items-center gap-3 text-content-muted'>
                <AlertCircle className='w-4 h-4' />
                <span className='text-[9px] font-black uppercase'>
                  Motivo:{' '}
                  {c.reason === 'defective'
                    ? 'Defecto de Fábrica'
                    : c.reason === 'wrong_size'
                      ? 'Talla Incorrecta'
                      : 'No es lo esperado'}
                </span>
              </div>
              <p className='text-[10px] text-content-secondary leading-relaxed font-medium italic'>
                "{c.technicianNote || 'Nuestros especialistas están evaluando el caso...'}"
              </p>
            </div>

            <div className='pt-6 border-t border-content-muted/10 flex gap-4 mt-auto'>
              <button className='flex-1 py-4 glass text-content-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all min-h-[44px]'>
                VER EVIDENCIA
              </button>
              <button className='flex-1 py-4 bg-content-primary text-main rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all min-h-[44px]'>
                RESOLVER CASO
              </button>
            </div>
          </div>
        ))}
      </div>

      {isCreating && (
        <RMANewCaseModal
          onClose={() => setIsCreating(false)}
          onSubmit={(data) => {
            setRMACases((prev) => [data, ...prev]);
            addNotification('Solicitud de cambio registrada', 'success');
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
};

const RMANewCaseModal: React.FC<{ onClose: () => void; onSubmit: (data: RMACase) => void }> = ({
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<Partial<RMACase>>({ reason: 'defective' });
  const [base64, setBase64] = useState<string | null>(null);

  const handleCapture = () => {
    const mockImage =
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAAAP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AVf/Z';
    setBase64(mockImage);
  };

  return (
    <div className='fixed inset-0 z-[300] flex items-center justify-center p-6'>
      <div
        className='absolute inset-0 bg-main/95 backdrop-blur-xl animate-in fade-in'
        onClick={onClose}
      />
      <div className='relative w-full max-w-xl glass-card rounded-[3.5rem] border-content-muted/10 p-12 space-y-10 animate-in zoom-in-95 bg-surface shadow-2xl'>
        <div className='flex items-center gap-4'>
          <RotateCcw className='w-8 h-8 text-red-500' />
          <h3 className='text-3xl font-space font-bold text-content-primary uppercase tracking-tighter'>
            Nueva Garantía
          </h3>
        </div>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <label className='text-[9px] font-black text-content-muted uppercase px-2'>
              Código de Pedido (RS-XXXX)
            </label>
            <input
              onChange={(e) => setForm({ ...form, orderId: e.target.value.toUpperCase() })}
              placeholder='Ej: RS-12345678'
              className='w-full p-5 glass rounded-2xl text-content-primary bg-main/50 text-xs font-bold border border-content-muted/10 outline-none focus:border-blue-500'
            />
          </div>

          <button
            onClick={handleCapture}
            className={`w-full py-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 transition-all ${base64 ? 'border-emerald-500 bg-emerald-500/5' : 'border-content-muted/20 hover:border-blue-500'}`}
          >
            {base64 ? (
              <CheckCircle className='w-8 h-8 text-emerald-500' />
            ) : (
              <Camera className='w-8 h-8 text-content-muted' />
            )}
            <span className='text-[10px] font-black uppercase tracking-widest text-content-muted'>
              {base64 ? 'IMAGEN DEL PRODUCTO LISTA' : 'CAPTURAR EVIDENCIA DEL ESTADO'}
            </span>
          </button>
        </div>
        <div className='flex gap-4'>
          <button
            onClick={onClose}
            className='flex-1 py-5 glass text-content-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-content-primary transition-all'
          >
            CANCELAR
          </button>
          <button
            disabled={!form.orderId || !base64}
            onClick={() =>
              onSubmit({
                ...form,
                id: `GAR-${Date.now()}`,
                status: 'open',
                createdAt: new Date().toISOString(),
                customerId: 'C-UNK',
                productImage: base64!,
              } as RMACase)
            }
            className='flex-2 py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-red-500 transition-all px-10 disabled:opacity-30'
          >
            CREAR TICKET DE CAMBIO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnsManager;
