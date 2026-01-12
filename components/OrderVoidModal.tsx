
import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { OrderHistoryItem } from '../types';
import { useGlobal } from '../context/GlobalContext';
import { FiscalEngine } from '../services/fiscalEngine';

interface OrderVoidModalProps {
  order: OrderHistoryItem;
  onClose: () => void;
  onSuccess: () => void;
}

const OrderVoidModal: React.FC<OrderVoidModalProps> = ({ order, onClose, onSuccess }) => {
  const { addAuditLog, handleStockUpdate, setCustomers, addNotification } = useGlobal();
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoid = async () => {
    if (reason.length < 10) {
      addNotification("La justificación debe tener al menos 10 caracteres", "error");
      return;
    }

    setIsProcessing(true);
    
    // 1. Pipeline Fiscal de Baja
    const success = await FiscalEngine.processVoid(order, reason);
    
    if (success) {
      // 2. Reversar Stock en todos los ítems
      order.items.forEach(item => {
        // Buscamos el nodo original de la venta
        handleStockUpdate(
          '', // Necesitaríamos el ID real del producto, asumimos mapeo vía SKU
          item.sku, 
          item.qty, 
          'return', 
          `Anulación de Orden ${order.orderId}`, 
          order.nodeId
        );
      });

      // 3. Actualizar CRM (Remover puntos, devolver crédito si aplica)
      setCustomers(prev => prev.map(c => {
        const hasOrder = c.purchaseHistory?.some(h => h.orderId === order.orderId);
        if (!hasOrder) return c;
        
        return {
          ...c,
          points: Math.max(0, c.points - order.pointsEarned),
          purchaseHistory: c.purchaseHistory.map(h => 
            h.orderId === order.orderId ? { ...h, status: 'voided', voidReason: reason, voidDate: new Date().toISOString() } : h
          )
        };
      }));

      addAuditLog('void_sale', 'sale', order.orderId, `Venta anulada. Motivo: ${reason}`);
      addNotification(`Orden ${order.orderId} anulada fiscalmente`, "warning");
      onSuccess();
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-xl glass-card rounded-[3rem] border-red-500/20 p-12 space-y-10 animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center space-y-4">
           <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <ShieldAlert className="w-10 h-10 text-red-500" />
           </div>
           <div className="space-y-2">
              <h3 className="text-3xl font-space font-bold text-white uppercase tracking-tighter">ANULACIÓN FISCAL</h3>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Protocolo de Comunicación de Baja</p>
           </div>
        </div>

        <div className="p-6 glass rounded-2xl border-white/5 space-y-4">
           <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>ORDEN A DAR DE BAJA:</span>
              <span className="text-white">{order.orderId}</span>
           </div>
           <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>TOTAL TRANSACCIÓN:</span>
              <span className="text-red-500">S/ {order.total.toFixed(2)}</span>
           </div>
        </div>

        <div className="space-y-4">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">JUSTIFICACIÓN TÉCNICA (Obligatorio SUNAT)</label>
           <textarea 
            value={reason}
            onChange={e => setReason(e.target.value.toUpperCase())}
            placeholder="EJ: ERROR EN MÉTODO DE PAGO / DEVOLUCIÓN DE MERCANCÍA..."
            className="w-full p-6 glass rounded-2xl text-xs font-bold text-white outline-none focus:border-red-500 min-h-[120px] transition-all"
           />
        </div>

        <div className="grid grid-cols-2 gap-6">
           <button onClick={onClose} className="py-5 glass text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white">DESCARTAR</button>
           <button 
            disabled={isProcessing || reason.length < 10}
            onClick={handleVoid}
            className="py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-red-500 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
           >
              {isProcessing ? <RefreshCw className="animate-spin" /> : <>CONFIRMAR BAJA</>}
           </button>
        </div>

        <p className="text-[8px] text-slate-600 text-center uppercase tracking-widest leading-relaxed">Esta acción es irreversible y notificará automáticamente a los servicios electrónicos vinculados.</p>
      </div>
    </div>
  );
};

export default OrderVoidModal;
