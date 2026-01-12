import React, { useState, useEffect, useMemo } from 'react';
import { useGlobal } from '../context/GlobalContext';
import {
  CreditCard,
  Truck,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Zap,
  CheckCircle,
  Lock,
  Smartphone,
  PackageCheck,
  UserCheck,
  RefreshCw,
  Landmark,
  Info,
} from 'lucide-react';
import { Customer, SaleChannel, BillingData, PaymentItem, Campaign, Address } from '../types';
import { PricingEngine } from '../services/pricingEngine';
import { IntegrationService } from '../services/integrationService';
import { MarketingEngine } from '../services/marketingEngine';

const PERU_DISTRICTS = [
  'Miraflores',
  'San Isidro',
  'Santiago de Surco',
  'La Molina',
  'San Borja',
  'Lince',
  'Magdalena del Mar',
  'Pueblo Libre',
  'Barranco',
  'Chorrillos',
  'Los Olivos',
  'San Miguel',
  'Surquillo',
  'Callao',
  'Otras Provincias',
];

interface CheckoutViewProps {
  onBack: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ onBack }) => {
  const { cartItems, finalizeOrder, customers, addNotification, systemConfig, activePromos, user } =
    useGlobal();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [saleChannel] = useState<SaleChannel>('WEB');
  const [searchDni, setSearchDni] = useState('');

  // Datos del Cliente (Pre-llenados si hay sesión)
  const [billingForm, setBillingForm] = useState<BillingData>({
    type: 'BOLETA',
    docType: 'DNI',
    docNumber: user?.id?.startsWith('USR-') ? '' : '', // Simulado
    nameOrSocialReason: user?.name || '',
    email: user?.email || '',
    fiscalAddress: '',
  });

  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    fullName: user?.name || '',
    district: 'Miraflores',
    city: 'Lima',
    street: '',
    phone: '',
    reference: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'yape'>('card');
  const [shippingInfo, setShippingInfo] = useState({
    district: 'Lima',
    cost: 0,
    carrier: 'Olva Express',
  });

  // Marketing & Loyalty
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Campaign | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  useEffect(() => {
    const fetchShipping = async () => {
      const res = await IntegrationService.calculateShipping(
        shippingAddress.district || 'Lima',
        1.5,
      );
      setShippingInfo({
        district: shippingAddress.district || 'Lima',
        cost: res.cost,
        carrier: res.carrier,
      });
    };
    fetchShipping();
  }, [shippingAddress.district]);

  const allPossibleCampaigns = useMemo(() => {
    return appliedCoupon ? [...activePromos, appliedCoupon] : activePromos;
  }, [activePromos, appliedCoupon]);

  const pricing = useMemo(() => {
    const base = PricingEngine.calculate(
      cartItems,
      null, // Se podría pasar el cliente si está logueado para beneficios VIP
      allPossibleCampaigns,
      saleChannel,
      pointsToRedeem,
      systemConfig.marketing.solPerPointRedeemed,
    );
    // Envío gratis sobre S/ 499
    const shippingCost = base.subtotal * 1.18 >= 499 ? 0 : shippingInfo.cost;
    return { ...base, total: base.total + shippingCost, shipping: shippingCost };
  }, [
    cartItems,
    allPossibleCampaigns,
    pointsToRedeem,
    shippingInfo.cost,
    saleChannel,
    systemConfig,
  ]);

  const handleApplyCoupon = () => {
    const res = MarketingEngine.verifyCouponCode(couponCode, activePromos, cartItems);
    if (res.valid && res.campaign) {
      setAppliedCoupon(res.campaign);
      addNotification(`Cupón aplicado: S/ ${res.discount.toFixed(2)} de descuento`, 'success');
    } else {
      addNotification(res.error || 'Código no válido', 'error');
    }
  };

  const handleFinishCheckout = async () => {
    setIsProcessing(true);
    // Simulación de pasarela de pago peruana
    await new Promise((r) => setTimeout(r, 2000));

    finalizeOrder({
      selectedCustomerId: user?.id,
      channel: saleChannel,
      billing: billingForm,
      shipping: shippingAddress,
      payments: [{ id: `PAY-${Date.now()}`, method: 'CREDIT_CARD', amount: pricing.total }],
      pointsEarned: pricing.pointsEarned,
    });

    setIsSuccess(true);
    setIsProcessing(false);
    addNotification('¡Pedido realizado con éxito!', 'success');
  };

  if (isSuccess) {
    return (
      <div className='pt-48 pb-32 px-10 flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in duration-500'>
        <div className='w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]'>
          <PackageCheck className='w-16 h-16 text-emerald-500' />
        </div>
        <div className='space-y-4'>
          <h2 className='text-5xl font-space text-content-primary font-bold uppercase tracking-tighter'>
            ¡Gracias por tu compra!
          </h2>
          <p className='text-content-secondary font-medium text-sm uppercase tracking-widest max-w-lg mx-auto leading-relaxed'>
            Tu pedido ha sido procesado. Te hemos enviado un correo de confirmación con los detalles
            del envío y tu comprobante electrónico.
          </p>
          <div className='pt-4'>
            <span className='px-6 py-2 glass rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20'>
              Has ganado {pricing.pointsEarned} Puntos Rosports
            </span>
          </div>
        </div>
        <button
          onClick={onBack}
          className='px-12 py-6 bg-slate-950 dark:bg-white text-white dark:text-black rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-brand-blue hover:text-white transition-all'
        >
          VOLVER AL INICIO
        </button>
      </div>
    );
  }

  return (
    <div className='pt-24 md:pt-40 pb-32 px-6 sm:px-10 lg:px-16 max-w-[1440px] mx-auto min-h-screen animate-in slide-in-from-bottom-10 duration-700'>
      <div className='flex flex-col lg:flex-row gap-16'>
        <div className='flex-1 space-y-12'>
          <button
            onClick={onBack}
            className='flex items-center gap-3 text-[10px] font-black text-content-muted hover:text-brand-blue uppercase tracking-widest transition-all'
          >
            <ArrowLeft className='w-4 h-4' /> VOLVER A LA BOLSA
          </button>

          <div className='space-y-10'>
            {/* Sección 1: Datos Personales */}
            <section className='space-y-8'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 glass rounded-2xl flex items-center justify-center text-brand-blue border border-brand-blue/20'>
                  <UserCheck className='w-5 h-5' />
                </div>
                <h2 className='text-2xl font-space font-bold text-content-primary uppercase tracking-tight'>
                  1. Tus Datos
                </h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-content-muted uppercase tracking-widest px-2'>
                    Nombres Completos
                  </label>
                  <input
                    value={billingForm.nameOrSocialReason}
                    onChange={(e) =>
                      setBillingForm({ ...billingForm, nameOrSocialReason: e.target.value })
                    }
                    className='w-full p-5 glass rounded-2xl text-xs font-bold bg-surface/50 border border-content-muted/10 outline-none focus:border-brand-blue'
                    placeholder='Ej: Juan Pérez'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-content-muted uppercase tracking-widest px-2'>
                    Correo Electrónico
                  </label>
                  <input
                    value={billingForm.email}
                    onChange={(e) => setBillingForm({ ...billingForm, email: e.target.value })}
                    className='w-full p-5 glass rounded-2xl text-xs font-bold bg-surface/50 border border-content-muted/10 outline-none focus:border-brand-blue'
                    placeholder='juan@email.com'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-content-muted uppercase tracking-widest px-2'>
                    Documento (DNI/RUC)
                  </label>
                  <input
                    value={billingForm.docNumber}
                    onChange={(e) => setBillingForm({ ...billingForm, docNumber: e.target.value })}
                    className='w-full p-5 glass rounded-2xl text-xs font-bold bg-surface/50 border border-content-muted/10 outline-none focus:border-brand-blue'
                    placeholder='########'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-content-muted uppercase tracking-widest px-2'>
                    Celular de Contacto
                  </label>
                  <input
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, phone: e.target.value })
                    }
                    className='w-full p-5 glass rounded-2xl text-xs font-bold bg-surface/50 border border-content-muted/10 outline-none focus:border-brand-blue'
                    placeholder='999 000 000'
                  />
                </div>
              </div>
            </section>

            {/* Sección 2: Envío */}
            <section className='space-y-8 pt-8 border-t border-content-muted/10'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 glass rounded-2xl flex items-center justify-center text-brand-blue border border-brand-blue/20'>
                  <MapPin className='w-5 h-5' />
                </div>
                <h2 className='text-2xl font-space font-bold text-content-primary uppercase tracking-tight'>
                  2. Entrega
                </h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='md:col-span-2 space-y-2'>
                  <label className='text-[10px] font-black text-content-muted uppercase tracking-widest px-2'>
                    Dirección de Entrega
                  </label>
                  <input
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, street: e.target.value })
                    }
                    className='w-full p-5 glass rounded-2xl text-xs font-bold bg-surface/50 border border-content-muted/10 outline-none focus:border-brand-blue'
                    placeholder='Av. / Calle / Nro / Dpto'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-content-muted uppercase tracking-widest px-2'>
                    Distrito (Lima)
                  </label>
                  <select
                    value={shippingAddress.district}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, district: e.target.value })
                    }
                    className='w-full p-5 glass rounded-2xl text-xs font-bold bg-surface/50 border border-content-muted/10 outline-none focus:border-brand-blue appearance-none'
                  >
                    {PERU_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black text-content-muted uppercase tracking-widest px-2'>
                    Referencia de Ubicación
                  </label>
                  <input
                    value={shippingAddress.reference}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, reference: e.target.value })
                    }
                    className='w-full p-5 glass rounded-2xl text-xs font-bold bg-surface/50 border border-content-muted/10 outline-none focus:border-brand-blue'
                    placeholder='Ej: Frente al parque...'
                  />
                </div>
              </div>
            </section>

            {/* Sección 3: Pago */}
            <section className='space-y-8 pt-8 border-t border-content-muted/10'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 glass rounded-2xl flex items-center justify-center text-brand-blue border border-brand-blue/20'>
                  <CreditCard className='w-5 h-5' />
                </div>
                <h2 className='text-2xl font-space font-bold text-content-primary uppercase tracking-tight'>
                  3. Método de Pago
                </h2>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {[
                  { id: 'card', label: 'Tarjeta de Crédito / Débito', icon: CreditCard },
                  { id: 'yape', label: 'Yape / Plin', icon: Smartphone },
                  { id: 'transfer', label: 'Transferencia BCP/BBVA', icon: Landmark },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-6 rounded-3xl border flex flex-col items-center gap-4 text-center transition-all ${
                      paymentMethod === m.id
                        ? 'bg-brand-blue border-brand-blue text-white shadow-xl'
                        : 'glass border-content-muted/10 text-content-muted hover:border-brand-blue/40'
                    }`}
                  >
                    <m.icon className='w-6 h-6' />
                    <span className='text-[10px] font-black uppercase tracking-widest leading-tight'>
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Resumen Lateral */}
        <aside className='lg:w-[450px]'>
          <div className='glass-card rounded-[3.5rem] p-10 border-content-muted/10 bg-surface shadow-2xl sticky top-40 space-y-10'>
            <div className='space-y-6'>
              <h4 className='text-[11px] font-black text-brand-blue uppercase tracking-[0.4em]'>
                Resumen de tu Orden
              </h4>
              <div className='space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2'>
                {cartItems.map((item) => (
                  <div
                    key={item.selectedVariantSku}
                    className='flex justify-between items-center gap-4'
                  >
                    <div className='flex items-center gap-4 flex-1 min-w-0'>
                      <div className='w-12 h-12 glass rounded-xl p-1 bg-main shrink-0 border border-content-muted/10'>
                        <img src={item.image} className='w-full h-full object-contain' alt='' />
                      </div>
                      <div className='truncate'>
                        <p className='text-[10px] font-bold text-content-primary uppercase truncate'>
                          {item.name}
                        </p>
                        <p className='text-[8px] font-bold text-content-muted uppercase'>
                          Talla: {item.selectedSize} x{item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className='text-xs font-bold text-content-primary shrink-0'>
                      S/ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className='space-y-4 pt-6 border-t border-content-muted/10'>
                <div className='flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-content-secondary'>
                  <span>Subtotal (Inc. IGV)</span>
                  <span>S/ {(pricing.total - pricing.shipping).toFixed(2)}</span>
                </div>
                <div className='flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-content-secondary'>
                  {/* Added missing Info icon import from lucide-react */}
                  <div className='flex items-center gap-2'>
                    <span>Envío a {shippingAddress.district}</span>{' '}
                    <Info className='w-3 h-3 opacity-50' />
                  </div>
                  <span className={pricing.shipping === 0 ? 'text-emerald-500' : ''}>
                    {pricing.shipping === 0 ? 'GRATIS' : `S/ ${pricing.shipping.toFixed(2)}`}
                  </span>
                </div>
                {pricing.discount > 0 && (
                  <div className='flex justify-between items-center text-[10px] font-black text-red-500 uppercase tracking-widest'>
                    <span>Descuentos</span>
                    <span>- S/ {pricing.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Cupones */}
              <div className='space-y-3 pt-2'>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    placeholder='CÓDIGO DE DESCUENTO'
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className='flex-1 p-4 glass bg-main/50 rounded-2xl text-[10px] font-bold outline-none border border-content-muted/10 uppercase'
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className='px-6 py-4 glass border-brand-blue/30 text-brand-blue rounded-2xl text-[10px] font-black hover:bg-brand-blue hover:text-white transition-all uppercase'
                  >
                    Aplicar
                  </button>
                </div>
                {appliedCoupon && (
                  <div className='flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-emerald-500 text-[8px] font-black uppercase'>
                    <CheckCircle className='w-3 h-3' /> Beneficio "{appliedCoupon.name}" activo
                  </div>
                )}
              </div>

              <div className='pt-6 border-t-2 border-dashed border-content-muted/20 flex justify-between items-end'>
                <div className='space-y-1'>
                  <p className='text-[11px] font-black text-content-primary uppercase tracking-[0.2em]'>
                    Total a Pagar
                  </p>
                  <p className='text-[8px] font-bold text-emerald-500 uppercase flex items-center gap-1'>
                    <Zap className='w-3 h-3 fill-current' /> Ganas {pricing.pointsEarned} Puntos
                  </p>
                </div>
                <span className='text-4xl font-space font-bold text-brand-blue'>
                  S/ {pricing.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              disabled={isProcessing}
              onClick={handleFinishCheckout}
              className='w-full py-8 bg-slate-950 dark:bg-white text-white dark:text-black rounded-3xl font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-4 relative overflow-hidden group'
            >
              {isProcessing ? (
                <RefreshCw className='w-6 h-6 animate-spin' />
              ) : (
                <>
                  <Lock className='w-5 h-5' /> CONFIRMAR Y PAGAR
                </>
              )}
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000' />
            </button>

            <div className='flex items-center justify-center gap-6 opacity-30'>
              <ShieldCheck className='w-4 h-4' />
              <span className='text-[8px] font-black uppercase tracking-widest'>
                Pago 100% Seguro // Certificado SSL
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutView;
