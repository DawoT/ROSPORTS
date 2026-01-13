import React, { useState } from 'react';
import {
  Printer,
  X,
  CheckCircle,
  FileCode,
  Mail,
  Zap,
  RefreshCw,
  Scissors,
} from 'lucide-react';
import { OrderHistoryItem } from '../types';
import { FiscalService } from '../utils/fiscalService';

interface ReceiptPreviewProps {
  order: OrderHistoryItem;
  onClose: () => void;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ order, onClose }) => {
  const thermalText = FiscalService.getThermalTemplate(order);
  const [printing, setPrinting] = useState(false);
  const [paperCut, setPaperCut] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    setPaperCut(false);

    // Simulación de pipeline de hardware ESC/POS
    console.info('[ESC/POS] Inyectando datos en buffer serial...');

    setTimeout(() => {
      setPrinting(false);
      setPaperCut(true);
      window.print();
    }, 1200);
  };

  return (
    <div className='fixed inset-0 z-[500] flex items-center justify-center p-6 animate-in fade-in duration-300'>
      <div className='absolute inset-0 bg-black/95 backdrop-blur-3xl' onClick={onClose} />

      <div className='relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
        {/* Lado Izquierdo: Estado del Nodo Fiscal */}
        <div className='space-y-6 hidden lg:block'>
          <div className='flex items-center gap-4 text-emerald-500'>
            <CheckCircle className='w-8 h-8' />
            <h3 className='font-space text-3xl font-bold uppercase tracking-tighter text-white'>
              EMISIÓN COMPLETADA
            </h3>
          </div>

          <div className='grid grid-cols-1 gap-4'>
            <div className='p-6 glass rounded-3xl border-emerald-500/20 bg-emerald-500/5 space-y-4'>
              <div className='flex items-center gap-3'>
                <FileCode className='w-5 h-5 text-emerald-500' />
                <span className='text-[10px] font-black text-white uppercase tracking-widest'>
                  Protocolo UBL 2.1 Sunat
                </span>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-[9px] font-mono text-slate-400 break-all leading-tight'>
                  CPE_HASH: {order.billing.hashCPE || 'GENERANDO...'}
                </p>
                <p className='text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2'>
                  <Zap className='w-3 h-3 fill-current' /> TRANSACCIÓN ACEPTADA POR OSE
                </p>
              </div>
            </div>

            <div className='p-6 glass rounded-3xl border-blue-500/20 bg-blue-500/5 space-y-4'>
              <div className='flex items-center gap-3'>
                <Mail className='w-5 h-5 text-blue-500' />
                <span className='text-[10px] font-black text-white uppercase tracking-widest'>
                  Enterprise Notifier
                </span>
              </div>
              <p className='text-[10px] text-slate-400 leading-relaxed'>
                {order.billing.email
                  ? `Documentación digital enviada automáticamente a: ${order.billing.email}`
                  : 'Sin correo vinculado. Se recomienda impresión física obligatoria.'}
              </p>
            </div>
          </div>

          <div className='p-6 glass rounded-3xl border-white/5 space-y-4'>
            <p className='text-[9px] font-black text-slate-500 uppercase tracking-widest'>
              Hardware Info
            </p>
            <div className='flex justify-between items-center text-[10px] font-bold text-white uppercase'>
              <span>Cajón de Dinero:</span>
              <span className='text-emerald-500'>ABIERTOS VÍA RJ11</span>
            </div>
            <div className='flex justify-between items-center text-[10px] font-bold text-white uppercase'>
              <span>Papel Térmico:</span>
              <span className='text-blue-500'>80MM READY</span>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Simulador Físico de Ticket */}
        <div className='relative w-full max-w-md mx-auto'>
          <div className='w-full flex justify-end mb-4 no-print'>
            <button
              onClick={onClose}
              className='p-3 glass rounded-2xl text-white hover:text-red-500 transition-all'
            >
              <X />
            </button>
          </div>

          <div
            className={`w-full bg-[#f8f8f8] p-10 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden relative transition-transform duration-700 ${paperCut ? 'translate-y-8' : ''}`}
          >
            {/* Paper Jagged Edge Effect */}
            <div className='absolute top-0 left-0 w-full h-3 bg-[radial-gradient(circle,transparent_50%,#f8f8f8_50%)] bg-[length:12px_12px]' />
            <div className='absolute bottom-0 left-0 w-full h-3 bg-[radial-gradient(circle,transparent_50%,#f8f8f8_50%)] bg-[length:12px_12px]' />

            <pre className='font-mono text-[11px] leading-tight text-slate-900 whitespace-pre-wrap'>
              {thermalText}
            </pre>

            {paperCut && (
              <div className='absolute top-0 left-0 w-full h-full flex items-start justify-center pt-2'>
                <div className='flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white text-[8px] font-black rounded-full animate-bounce'>
                  <Scissors className='w-3 h-3' /> PAPER CUT SUCCESSFUL
                </div>
              </div>
            )}

            <div className='mt-10 flex justify-center opacity-30'>
              <div className='w-24 h-24 border-2 border-slate-300 p-2'>
                <div className='w-full h-full flex flex-col gap-1'>
                  <div className='h-1.5 bg-black w-full' />
                  <div className='h-1.5 bg-black w-[80%]' />
                  <div className='h-1.5 bg-black w-[90%]' />
                  <div className='h-1.5 bg-black w-full' />
                </div>
              </div>
            </div>
          </div>

          <div className='flex gap-4 w-full mt-10 no-print'>
            <button
              onClick={handlePrint}
              disabled={printing}
              className='flex-1 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-2xl group'
            >
              {printing ? (
                <RefreshCw className='animate-spin w-4 h-4' />
              ) : (
                <Printer className='w-4 h-4 group-hover:scale-110' />
              )}
              LANZAR IMPRESIÓN FÍSICA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreview;
