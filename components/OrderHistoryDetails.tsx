import React from 'react';
import {
  X,
  Receipt,
  Package,
  CheckCircle,
  User,
  FileText,
  Smartphone,
  Printer,
  Download,
} from 'lucide-react';
import { OrderHistoryItem } from '../types';

interface OrderHistoryDetailsProps {
  order: OrderHistoryItem;
  onClose: () => void;
}

const OrderHistoryDetails: React.FC<OrderHistoryDetailsProps> = ({ order, onClose }) => {
  const steps = [
    { label: 'Recibido', desc: 'Pedido confirmado por el sistema', icon: Smartphone, active: true },
    { label: 'Facturado', desc: 'Comprobante emitido correctamente', icon: FileText, active: true },
    {
      label: 'Preparación',
      desc: 'Producto seleccionado en almacén',
      icon: Package,
      active: order.status !== 'cancelled',
    },
    {
      label: 'Completado',
      desc: 'Producto entregado al cliente',
      icon: CheckCircle,
      active: order.status === 'delivered',
    },
  ];

  return (
    <div className='fixed inset-0 z-[400] flex items-center justify-center p-6'>
      <div className='absolute inset-0 bg-black/95 backdrop-blur-2xl' onClick={onClose} />
      <div className='relative w-full max-w-5xl h-[85vh] glass-card rounded-[3.5rem] border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 bg-surface'>
        {/* Cabecera Comercial */}
        <div className='p-10 border-b border-content-muted/10 flex flex-col md:flex-row justify-between items-center gap-8 bg-content-muted/[0.02]'>
          <div className='flex items-center gap-6'>
            <div className='w-16 h-16 glass rounded-2xl flex items-center justify-center text-brand-blue border border-brand-blue/20'>
              <Receipt className='w-8 h-8' />
            </div>
            <div className='space-y-1'>
              <h3 className='text-3xl font-space font-bold text-content-primary uppercase tracking-tighter'>
                {order.orderId}
              </h3>
              <div className='flex items-center gap-3'>
                <span className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
                  Tienda: {order.channel === 'WEB' ? 'Online' : 'Boutique Física'}
                </span>
                <div className='w-1 h-1 bg-content-muted/30 rounded-full' />
                <span className='text-[9px] font-bold text-brand-blue uppercase'>
                  {new Date(order.date).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <button className='p-4 glass rounded-2xl text-content-muted hover:text-content-primary transition-all'>
              <Printer className='w-5 h-5' />
            </button>
            <button className='p-4 glass rounded-2xl text-content-muted hover:text-content-primary transition-all'>
              <Download className='w-5 h-5' />
            </button>
            <button
              onClick={onClose}
              className='p-4 glass rounded-2xl text-content-muted hover:text-red-500 transition-all'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-10 custom-scrollbar grid grid-cols-1 lg:grid-cols-3 gap-12'>
          {/* Columna 1: Seguimiento */}
          <div className='space-y-10'>
            <div className='space-y-6'>
              <h4 className='text-[10px] font-black text-brand-blue uppercase tracking-[0.5em]'>
                Estado del Envío
              </h4>
              <div className='space-y-8'>
                {steps.map((step, idx) => (
                  <div key={idx} className='flex gap-6 group'>
                    <div className='flex flex-col items-center gap-2'>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${step.active ? 'bg-brand-blue border-brand-blue text-white shadow-xl' : 'glass border-content-muted/10 text-content-muted/20'}`}
                      >
                        <step.icon className='w-5 h-5' />
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`w-px h-10 ${step.active ? 'bg-brand-blue' : 'bg-content-muted/10'}`}
                        />
                      )}
                    </div>
                    <div className='pt-1'>
                      <p
                        className={`text-xs font-bold uppercase tracking-tight ${step.active ? 'text-content-primary' : 'text-content-muted'}`}
                      >
                        {step.label}
                      </p>
                      <p className='text-[9px] font-medium text-content-muted uppercase'>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='p-8 glass rounded-[2.5rem] border-content-muted/10 space-y-6 bg-content-muted/[0.01]'>
              <h4 className='text-[10px] font-black text-brand-blue uppercase tracking-widest'>
                Información del Cliente
              </h4>
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <User className='w-4 h-4 text-content-muted' />
                  <span className='text-[11px] font-bold text-content-primary uppercase'>
                    {order.billing.nameOrSocialReason}
                  </span>
                </div>
                <div className='flex items-center gap-4'>
                  <FileText className='w-4 h-4 text-content-muted' />
                  <span className='text-[11px] font-mono text-content-secondary'>
                    {order.billing.docType}: {order.billing.docNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 2: Resumen de Artículos */}
          <div className='lg:col-span-2 space-y-10'>
            <div className='space-y-6'>
              <h4 className='text-[10px] font-black text-purple-500 uppercase tracking-[0.5em]'>
                Detalle de los Modelos
              </h4>
              <div className='glass-card rounded-[2.5rem] border-content-muted/10 overflow-hidden'>
                <table className='w-full text-left'>
                  <thead className='bg-content-muted/[0.03]'>
                    <tr className='border-b border-content-muted/10'>
                      <th className='px-8 py-4 text-[9px] font-black text-content-muted uppercase'>
                        Referencia y Talla
                      </th>
                      <th className='px-8 py-4 text-[9px] font-black text-content-muted uppercase text-center'>
                        Cant.
                      </th>
                      <th className='px-8 py-4 text-[9px] font-black text-content-muted uppercase text-right'>
                        Precio
                      </th>
                      <th className='px-8 py-4 text-[9px] font-black text-content-muted uppercase text-right'>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-content-muted/10'>
                    {order.items.map((item, i) => (
                      <tr key={i} className='hover:bg-content-muted/[0.01] transition-colors'>
                        <td className='px-8 py-6'>
                          <div className='flex flex-col'>
                            <span className='text-xs font-bold text-content-primary uppercase'>
                              {item.name}
                            </span>
                            <span className='text-[9px] font-mono text-brand-blue uppercase'>
                              {item.sku}
                            </span>
                          </div>
                        </td>
                        <td className='px-8 py-6 text-center text-xs font-bold text-content-primary'>
                          x{item.qty}
                        </td>
                        <td className='px-8 py-6 text-right text-xs font-bold text-content-secondary'>
                          S/ {item.price.toFixed(2)}
                        </td>
                        <td className='px-8 py-6 text-right text-sm font-bold text-content-primary'>
                          S/ {(item.price * item.qty).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='p-8 glass rounded-[2.5rem] border-content-muted/10 space-y-6 bg-surface shadow-sm'>
                <h4 className='text-[10px] font-black text-emerald-500 uppercase tracking-widest'>
                  Resumen de Pago
                </h4>
                <div className='space-y-3'>
                  {order.payments?.map((p) => (
                    <div key={p.id} className='flex justify-between items-center text-[11px]'>
                      <span className='text-content-muted font-bold uppercase'>
                        {p.method.replace('_', ' ')}
                      </span>
                      <span className='text-content-primary font-bold'>
                        S/ {p.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='p-8 glass rounded-[2.5rem] border-brand-blue/20 bg-brand-blue/[0.02] space-y-4 shadow-sm'>
                <div className='flex justify-between items-center'>
                  <span className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
                    Subtotal (Neto)
                  </span>
                  <span className='text-xs font-bold text-content-primary'>
                    S/ {order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
                    Impuestos (IGV 18%)
                  </span>
                  <span className='text-xs font-bold text-content-primary'>
                    S/ {order.tax.toFixed(2)}
                  </span>
                </div>
                <div className='pt-4 border-t border-content-muted/10 flex justify-between items-end'>
                  <span className='text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]'>
                    Total de Compra
                  </span>
                  <span className='text-3xl font-space font-bold text-content-primary leading-none'>
                    S/ {order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='p-8 border-t border-content-muted/10 bg-content-muted/[0.04] flex justify-between items-center'>
          <div className='flex items-center gap-4 text-emerald-500'>
            <CheckCircle className='w-5 h-5' />
            <span className='text-[10px] font-black uppercase tracking-widest'>
              Comprobante validado por SUNAT
            </span>
          </div>
          <button
            onClick={onClose}
            className='px-10 py-4 bg-content-primary text-main rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all shadow-md'
          >
            SALIR DE DETALLES
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryDetails;
