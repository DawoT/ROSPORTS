import React, { useState, useMemo } from 'react';
import {
  Scan,
  ShoppingCart,
  Trash2,
  Banknote,
  Smartphone,
  AlertCircle,
  CreditCard as CardIcon,
  RefreshCw,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import {
  Product,
  Customer,
  CartItem,
  BillingData,
  OrderHistoryItem,
  PaymentMethod,
  PaymentItem,
} from '../types';
import { SalesEngine } from '../utils/salesEngine';
import { FiscalEngine } from '../services/fiscalEngine';
import ReceiptPreview from './ReceiptPreview';

const POSInterface: React.FC = () => {
  const { products, finalizeOrder, addNotification, user, activeCashSession } = useGlobal();

  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderHistoryItem | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku_parent?.toLowerCase().includes(q) ||
        p.variants?.some((v) => v.barcode === searchQuery)
      );
    });
  }, [products, searchQuery]);

  const breakdown = useMemo(() => SalesEngine.calculateBreakdown(posCart, 0, 0), [posCart]);

  const addToCart = (product: Product, size: number, color: string) => {
    const variant = product.variants?.find((v) => v.size === size && v.color === color);
    if (!variant) return;

    setPosCart((prev) => {
      const exists = prev.find((i) => i.selectedVariantSku === variant.sku);
      if (exists)
        return prev.map((i) =>
          i.selectedVariantSku === variant.sku ? { ...i, quantity: i.quantity + 1 } : i,
        );
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          selectedSize: size,
          selectedColor: color,
          selectedVariantSku: variant.sku,
          reservationExpiresAt: Date.now() + 3600000,
          reservationNodeId: 'N-02',
        } as CartItem,
      ];
    });
  };

  const handleFinalizePOS = async (
    method: string,
    billing: BillingData,
    payments: PaymentItem[],
  ) => {
    const order: OrderHistoryItem = {
      orderId: `BOL-${Date.now()}`,
      date: new Date().toISOString(),
      total: breakdown.total,
      subtotal: breakdown.subtotal,
      tax: breakdown.tax,
      discount: breakdown.discount,
      channel: 'LOCAL_STORE',
      nodeId: 'N-02',
      sellerId: user?.name || 'Vendedor_Elite',
      items: posCart.map((i) => ({
        name: i.name,
        qty: i.quantity,
        price: i.price,
        sku: i.selectedVariantSku,
      })),
      status: 'delivered',
      pointsEarned: breakdown.pointsEarned,
      billing,
      payments,
    };

    const metadata = await FiscalEngine.processEmission(order);
    order.billing.fiscalMetadata = metadata;

    finalizeOrder({
      selectedCustomerId: activeCustomer?.id,
      channel: 'LOCAL_STORE',
      billing: order.billing,
      payments: order.payments,
    });

    setPosCart([]);
    setActiveCustomer(null);
    setShowPaymentModal(false);
    setLastOrder(order);
    addNotification('Venta finalizada con éxito', 'success');
  };

  if (!activeCashSession) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in'>
        <div className='w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center'>
          <AlertCircle className='w-12 h-12 text-red-500' />
        </div>
        <div className='space-y-2'>
          <h3 className='text-2xl font-space font-bold text-content-primary uppercase'>
            Caja Cerrada
          </h3>
          <p className='text-[10px] font-black text-content-muted uppercase tracking-widest'>
            Inicia el proceso de Apertura de Caja para comenzar a vender.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='pb-48 px-4 md:px-10 max-w-[1920px] mx-auto h-[calc(100vh-140px)] flex flex-col gap-8 animate-in fade-in duration-700'>
      <div className='flex flex-col xl:flex-row gap-6 items-stretch'>
        <div className='flex-1 glass p-4 md:p-6 rounded-3xl border-content-muted/10 flex items-center gap-6'>
          <div className='bg-brand-blue/10 p-4 rounded-2xl border border-brand-blue/20'>
            <Scan className='w-6 h-6 text-brand-blue animate-pulse' />
          </div>
          <input
            type='text'
            placeholder='BUSCAR MODELO O ESCANEAR CÓDIGO...'
            className='w-full bg-surface/60 rounded-2xl outline-none text-sm font-bold text-content-primary uppercase tracking-widest border border-content-muted/10 p-5 focus:border-brand-blue transition-all'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className='flex-1 flex flex-col lg:flex-row gap-10 overflow-hidden'>
        <div className='flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 pr-4'>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className='glass-card rounded-[2.5rem] p-6 border-content-muted/10 flex flex-col group hover:border-brand-blue/30 transition-all bg-surface'
            >
              <div className='h-40 glass rounded-2xl p-4 flex items-center justify-center mb-4 bg-main'>
                <img src={p.image} className='h-full object-contain' alt='' />
              </div>
              <div className='flex-1 space-y-1 mb-4'>
                <h4 className='text-sm font-bold text-content-primary uppercase truncate'>
                  {p.name}
                </h4>
                <p className='text-lg font-space font-bold text-brand-blue'>
                  S/ {p.price.toFixed(2)}
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                {p.variants?.slice(0, 3).map((v) => (
                  <button
                    key={v.sku}
                    onClick={() => addToCart(p, v.size, v.color)}
                    className='flex-1 py-3 glass rounded-xl text-[10px] font-black text-content-muted hover:bg-brand-blue hover:text-white transition-all min-h-[44px]'
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className='w-full lg:w-[480px] flex flex-col gap-6'>
          <div className='flex-1 glass-card rounded-[3rem] border-content-muted/10 flex flex-col overflow-hidden bg-surface shadow-xl'>
            <div className='p-8 border-b border-content-muted/10 bg-content-muted/[0.02] flex items-center justify-between'>
              <h3 className='font-space text-xl font-bold text-content-primary uppercase flex items-center gap-3'>
                <ShoppingCart className='w-5 h-5 text-brand-blue' /> Venta Actual
              </h3>
              <span className='px-4 py-1.5 glass rounded-full text-[9px] font-black text-brand-blue uppercase'>
                {posCart.length} PRODUCTOS
              </span>
            </div>
            <div className='flex-1 overflow-y-auto p-6 space-y-4'>
              {posCart.map((item) => (
                <div
                  key={item.selectedVariantSku}
                  className='glass p-4 rounded-3xl border-content-muted/10 flex gap-4 bg-main/40'
                >
                  <div className='w-16 h-16 glass rounded-2xl p-2 shrink-0 bg-surface'>
                    <img src={item.image} className='h-full object-contain' alt='' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h5 className='text-[11px] font-bold text-content-primary uppercase truncate'>
                      {item.name}
                    </h5>
                    <div className='flex justify-between items-center mt-2'>
                      <span className='text-xs font-bold text-content-muted'>
                        Cant: {item.quantity}
                      </span>
                      <span className='text-xs font-bold text-content-primary'>
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setPosCart((p) =>
                        p.filter((x) => x.selectedVariantSku !== item.selectedVariantSku),
                      )
                    }
                    className='p-2 text-content-muted hover:text-red-500 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center transition-transform active:scale-90'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              ))}
              {posCart.length === 0 && (
                <div className='h-full flex flex-col items-center justify-center text-center opacity-30'>
                  <ShoppingCart className='w-12 h-12 mb-4' />
                  <p className='text-[10px] font-black uppercase tracking-widest'>Caja en Espera</p>
                </div>
              )}
            </div>
            <div className='p-8 bg-surface/90 border-t border-content-muted/10 space-y-6'>
              <div className='flex justify-between text-[11px] font-black text-brand-blue uppercase'>
                <span>Total a Pagar</span>
                <span className='text-content-primary text-3xl font-space'>
                  S/ {breakdown.total.toFixed(2)}
                </span>
              </div>
              <button
                disabled={posCart.length === 0}
                onClick={() => setShowPaymentModal(true)}
                className='w-full py-6 bg-slate-950 dark:bg-white text-white dark:text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.5em] shadow-xl hover:bg-brand-blue hover:text-white transition-all min-h-[60px] disabled:opacity-20 disabled:grayscale'
              >
                REGISTRAR PAGO
              </button>
            </div>
          </div>
        </aside>
      </div>

      {showPaymentModal && (
        <POSPaymentOrchestrator
          total={breakdown.total}
          customer={activeCustomer}
          onClose={() => setShowPaymentModal(false)}
          onComplete={handleFinalizePOS}
        />
      )}

      {lastOrder && <ReceiptPreview order={lastOrder} onClose={() => setLastOrder(null)} />}
    </div>
  );
};

interface POSPaymentOrchestratorProps {
  total: number;
  customer: Customer | null;
  onClose: () => void;
  onComplete: (method: string, billing: BillingData, payments: PaymentItem[]) => Promise<void>;
}

const POSPaymentOrchestrator: React.FC<POSPaymentOrchestratorProps> = ({
  total,
  onClose,
  onComplete,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [received, setReceived] = useState<string>('');
  const change = Math.max(0, (parseFloat(received) || total) - total);

  const handleFinish = async () => {
    const billing: BillingData = {
      type: 'BOLETA',
      docType: 'DNI',
      docNumber: '00000000',
      nameOrSocialReason: 'CLIENTE BOUTIQUE',
    };
    const payments: PaymentItem[] = [
      {
        id: 'P-1',
        method,
        amount: total,
        receivedAmount: parseFloat(received) || total,
        changeAmount: change,
      },
    ];
    await onComplete(method, billing, payments);
  };

  return (
    <div className='fixed inset-0 z-[400] flex items-center justify-center p-6'>
      <div
        className='absolute inset-0 bg-main/95 backdrop-blur-2xl animate-in fade-in'
        onClick={onClose}
      />
      <div className='relative w-full max-w-4xl glass-card rounded-[3.5rem] border-content-muted/10 p-10 space-y-8 flex flex-col h-[70vh] shadow-2xl bg-surface'>
        <div className='flex justify-between items-center'>
          <h3 className='text-2xl font-space font-bold text-content-primary uppercase'>
            Procesar Cobro
          </h3>
          <span className='text-4xl font-space font-bold text-emerald-500'>
            S/ {total.toFixed(2)}
          </span>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 flex-1'>
          <div className='space-y-4'>
            {[
              { id: 'CASH', label: 'Efectivo', icon: Banknote },
              { id: 'CREDIT_CARD', label: 'Tarjeta Bancaria', icon: CardIcon },
              { id: 'DIGITAL_WALLET', label: 'Yape / Plin', icon: Smartphone },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as PaymentMethod)}
                className={`w-full p-6 rounded-2xl border text-left flex items-center gap-4 transition-all min-h-[60px] ${method === m.id ? 'bg-brand-blue border-brand-blue text-white shadow-lg' : 'glass border-content-muted/10 text-content-muted hover:border-brand-blue/40'}`}
              >
                <m.icon className='w-5 h-5' />
                <span className='text-[10px] font-black uppercase tracking-widest'>{m.label}</span>
              </button>
            ))}
          </div>
          {method === 'CASH' ? (
            <div className='glass-card p-8 rounded-3xl border-emerald-500/20 bg-emerald-500/5 space-y-6 flex flex-col justify-center'>
              <label className='text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center'>
                Efectivo Recibido
              </label>
              <input
                type='number'
                autoFocus
                className='w-full p-5 glass border-emerald-500/10 rounded-2xl text-4xl font-space font-bold text-emerald-500 outline-none bg-surface/50 text-center'
                value={received}
                onChange={(e) => setReceived(e.target.value)}
              />
              <div className='flex justify-between items-end pt-4'>
                <span className='text-[11px] font-black text-content-muted uppercase'>
                  Vuelto a entregar:
                </span>
                <span className='text-3xl font-space font-bold text-content-primary'>
                  S/ {change.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className='glass-card p-8 rounded-3xl border-brand-blue/20 bg-brand-blue/5 flex flex-col items-center justify-center text-center space-y-4'>
              <RefreshCw className='w-12 h-12 text-brand-blue animate-spin' />
              <p className='text-[10px] font-black text-content-muted uppercase tracking-widest'>
                Esperando confirmación del terminal de pago...
              </p>
            </div>
          )}
        </div>
        <div className='flex justify-end gap-4'>
          <button
            onClick={onClose}
            className='px-10 py-5 glass text-content-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-content-primary'
          >
            CANCELAR
          </button>
          <button
            onClick={handleFinish}
            className='px-16 py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] shadow-xl hover:bg-emerald-500 transition-all'
          >
            EMITIR BOLETA
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSInterface;
