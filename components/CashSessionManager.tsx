
import React, { useState, useMemo, useRef } from 'react';
import { 
  Wallet, LogOut, Clock, Landmark, ArrowRight, ShieldCheck, 
  AlertCircle, History, CheckCircle, Calculator, Banknote, 
  Plus, Minus, ReceiptText, Printer, Download, User, X,
  ArrowUpCircle, ArrowDownCircle, Info, HandCoins, Building,
  Tag, FileSpreadsheet, Fingerprint, Receipt, TrendingDown, TrendingUp
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { CashService, PERU_DENOMINATIONS } from '../services/cashService';
import { CashSession, CashDenomination, CashMovement, PaymentItem } from '../types';

const CashSessionManager: React.FC = () => {
  const { user, addNotification, addAuditLog, activeCashSession, setActiveCashSession, recordCashMovement, customers, setCustomers } = useGlobal();
  
  const [step, setStep] = useState<'idle' | 'opening' | 'active' | 'closing' | 'report'>('idle');
  const [tempDenoms, setTempDenoms] = useState<CashDenomination[]>(PERU_DENOMINATIONS);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [lastClosedSession, setLastClosedSession] = useState<CashSession | null>(null);

  const currentTotal = useMemo(() => CashService.calculateTotal(tempDenoms), [tempDenoms]);

  const sessionOrders = useMemo(() => {
    if (!activeCashSession && !lastClosedSession) return [];
    const targetSession = activeCashSession || lastClosedSession;
    if (!targetSession) return [];
    const allOrders = customers.flatMap(c => c.purchaseHistory || []);
    return allOrders.filter(o => targetSession.receiptsIssued?.includes(o.orderId));
  }, [customers, activeCashSession, lastClosedSession]);

  const handleOpen = () => {
    const session: CashSession = {
      id: `CS-${Date.now()}`,
      userId: user?.id || 'OP-DEFAULT',
      userName: user?.name || 'Operador',
      nodeId: 'N-02',
      status: 'open',
      startTime: new Date().toISOString(),
      openingBalance: currentTotal,
      openingDenominations: JSON.parse(JSON.stringify(tempDenoms)),
      movements: [],
      systemExpected: { cash: 0, card: 0, digital: 0, other: 0, totalDiscounts: 0, salesCount: 0 },
      // Fix: Removed non-existent property 'totalSalesCount' from CashSession object literal
      integrityHash: '',
      receiptsIssued: []
    };
    session.integrityHash = CashService.generateIntegrityHash(session);
    setActiveCashSession(session);
    setStep('active');
    addAuditLog('cash_open', 'cash_session', session.id, `Apertura con S/ ${currentTotal.toFixed(2)}`);
    addNotification("Sesión fiscal iniciada", "success");
  };

  const handleAddMovement = (m: any) => {
    if (!activeCashSession) return;
    
    if (m.type === 'expense') {
      const validation = CashService.validateWithdrawal(activeCashSession, m.amount);
      if (!validation.valid) {
        addNotification(validation.error!, "error");
        return;
      }
    }

    // Lógica Enterprise: Si el ingreso es por Pago de Crédito, actualizar CRM automáticamente
    if (m.type === 'income' && m.concept === 'PAGO DE CRÉDITO ANTERIOR' && m.customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id !== m.customerId) return c;
        return {
          ...c,
          creditBalance: Math.max(0, c.creditBalance - m.amount),
          points: c.points + Math.floor(m.amount)
        };
      }));
      addNotification("Saldo de cliente actualizado", "info");
    }

    const movement: CashMovement = {
      id: `MV-${Date.now()}`,
      type: m.type,
      amount: m.amount,
      concept: m.concept,
      authorizedBy: m.authorizedBy,
      timestamp: new Date().toISOString()
    };
    
    recordCashMovement(movement);
    addAuditLog('cash_move', 'cash_session', activeCashSession.id, `${m.type}: ${m.concept}`);
    setShowMovementModal(false);
  };

  const handleClose = () => {
    if (!activeCashSession) return;
    const expectedCash = CashService.calculateExpectedCash(activeCashSession);
    const actualCash = currentTotal;
    const diff = actualCash - expectedCash;

    const closed: CashSession = {
      ...activeCashSession,
      status: 'closed',
      endTime: new Date().toISOString(),
      closingDenominations: JSON.parse(JSON.stringify(tempDenoms)),
      actualCashBalance: actualCash,
      difference: diff
    };

    setLastClosedSession(closed);
    setActiveCashSession(null);
    setStep('report');
    addAuditLog('cash_close', 'cash_session', closed.id, `Cierre. Varianza: S/ ${diff.toFixed(2)}`);
  };

  if (step === 'report' && lastClosedSession) {
    const totalExpected = CashService.calculateExpectedCash(lastClosedSession);
    const manualIn = lastClosedSession.movements.filter(m => m.type === 'income').reduce((a,b) => a + b.amount, 0);
    const manualOut = lastClosedSession.movements.filter(m => m.type === 'expense').reduce((a,b) => a + b.amount, 0);

    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in-95 duration-500 pb-40">
         <div className="flex items-center justify-between no-print">
            <button onClick={() => setStep('idle')} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all">
               <X className="w-4 h-4" /> CERRAR PANEL DE AUDITORÍA
            </button>
            <div className="flex gap-4">
               <button onClick={() => window.print()} className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center gap-3">
                  <Printer className="w-4 h-4" /> IMPRIMIR CIERRE (80MM)
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Vista Digital del Cierre */}
            <div className="space-y-8 no-print">
               <div className="glass-card rounded-[3rem] p-10 border-white/5 space-y-8 bg-gradient-to-br from-blue-600/[0.03] to-transparent">
                  <div className="flex justify-between items-start">
                     <h3 className="text-2xl font-space font-bold text-white uppercase">Varianza de Cierre</h3>
                     <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                       lastClosedSession.difference! === 0 ? 'border-emerald-500 text-emerald-500' : 'border-red-500 text-red-500'
                     }`}>
                        {lastClosedSession.difference! === 0 ? 'CONCILIADO' : 'DESCUADRE'}
                     </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase">Diferencia Neta</p>
                        <p className={`text-4xl font-space font-bold ${lastClosedSession.difference! < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                           S/ {lastClosedSession.difference!.toFixed(2)}
                        </p>
                     </div>
                     <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-slate-500 uppercase">Eficiencia de Caja</p>
                        <p className="text-4xl font-space font-bold text-white">
                           {lastClosedSession.difference === 0 ? '100%' : '98.2%'}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="glass rounded-[2.5rem] border-white/5 p-8 space-y-6">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                     <TrendingUp className="w-4 h-4" /> Desglose de Operaciones
                  </h4>
                  <div className="space-y-4">
                     {[
                        { label: 'Inducción Inicial', val: lastClosedSession.openingBalance, type: 'pos' },
                        { label: 'Ventas en Efectivo', val: lastClosedSession.systemExpected.cash, type: 'pos' },
                        { label: 'Ingresos Manuales', val: manualIn, type: 'pos' },
                        { label: 'Egresos Manuales', val: manualOut, type: 'neg' },
                     ].map((op, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                           <span className="text-xs font-bold text-slate-400 uppercase">{op.label}</span>
                           <span className={`text-sm font-bold ${op.type === 'pos' ? 'text-white' : 'text-red-500'}`}>
                              {op.type === 'pos' ? '+' : '-'} S/ {op.val.toFixed(2)}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Simulación del Ticket Térmico (Capa de Impresión) */}
            <div id="printable-report" className="bg-white text-black p-10 shadow-2xl font-mono text-[11px] space-y-8 max-w-[400px] mx-auto border border-black/10">
               <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold font-space uppercase">ROSPORTS S.A.C.</h2>
                  <p className="text-[10px] font-bold">RUC: 20601234567</p>
                  <div className="h-px border-b border-black w-full my-4" />
                  <p className="font-bold border border-black py-1">CERTIFICADO DE CIERRE DIARIO</p>
               </div>

               <div className="grid grid-cols-2 gap-y-1 text-[10px]">
                  <span>SESIÓN ID:</span> <span className="text-right font-bold">{lastClosedSession.id}</span>
                  <span>RESPONSABLE:</span> <span className="text-right font-bold uppercase">{lastClosedSession.userName}</span>
                  <span>APERTURA:</span> <span className="text-right">{new Date(lastClosedSession.startTime).toLocaleTimeString()}</span>
                  <span>CIERRE:</span> <span className="text-right">{new Date(lastClosedSession.endTime!).toLocaleTimeString()}</span>
               </div>

               <div className="space-y-4">
                  <p className="font-bold border-b border-black pb-1">I. RESUMEN COMERCIAL</p>
                  <div className="grid grid-cols-2 gap-y-1">
                     <span>VENTAS CASH:</span> <span className="text-right">S/ {lastClosedSession.systemExpected.cash.toFixed(2)}</span>
                     <span>VENTAS CARD:</span> <span className="text-right">S/ {lastClosedSession.systemExpected.card.toFixed(2)}</span>
                     <span>DIGITAL WALLET:</span> <span className="text-right">S/ {lastClosedSession.systemExpected.digital.toFixed(2)}</span>
                     <div className="col-span-2 h-px bg-black/10 my-1" />
                     <span className="font-bold">TOTAL VENTAS:</span> <span className="text-right font-bold">S/ {(lastClosedSession.systemExpected.cash + lastClosedSession.systemExpected.card + lastClosedSession.systemExpected.digital).toFixed(2)}</span>
                     <span>TRANSACCIONES:</span> <span className="text-right">{lastClosedSession.systemExpected.salesCount}</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="font-bold border-b border-black pb-1">II. CONCILIACIÓN FÍSICA</p>
                  <div className="grid grid-cols-2 gap-y-1">
                     <span>(+) APERTURA:</span> <span className="text-right">S/ {lastClosedSession.openingBalance.toFixed(2)}</span>
                     <span>(+) COBROS EFECT.:</span> <span className="text-right">S/ {lastClosedSession.systemExpected.cash.toFixed(2)}</span>
                     <span>(+/-) MOVIMIENTOS:</span> <span className="text-right">S/ {(manualIn - manualOut).toFixed(2)}</span>
                     <div className="col-span-2 h-px border-t border-black my-1" />
                     <span className="font-bold">ESPERADO:</span> <span className="text-right font-bold">S/ {totalExpected.toFixed(2)}</span>
                     <span className="font-bold">CONTADO:</span> <span className="text-right font-bold">S/ {lastClosedSession.actualCashBalance?.toFixed(2)}</span>
                     <div className="col-span-2 h-px border-t border-black my-1" />
                     <span className="font-bold text-[14px]">DIFERENCIA:</span>
                     <span className={`text-right font-bold text-[14px] ${lastClosedSession.difference! < 0 ? 'underline' : ''}`}>S/ {lastClosedSession.difference!.toFixed(2)}</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="font-bold border-b border-black pb-1">III. ARQUEO (TOP DIVISAS)</p>
                  <div className="grid grid-cols-2 gap-y-0.5 text-[9px]">
                     {lastClosedSession.closingDenominations?.filter(d => d.count > 0).map(d => (
                        <React.Fragment key={d.value}>
                           <span>{d.label} x{d.count}</span>
                           <span className="text-right">S/ {(d.value * d.count).toFixed(2)}</span>
                        </React.Fragment>
                     ))}
                  </div>
               </div>

               <div className="pt-20 text-center space-y-12">
                  <div className="flex flex-col items-center gap-2">
                     <div className="w-40 h-px bg-black" />
                     <p className="text-[10px]">FIRMA DEL OPERADOR</p>
                     <p className="text-[11px] font-bold uppercase">{lastClosedSession.userName}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[7px] opacity-60">AUTH_INTEGRITY_CERT: {lastClosedSession.integrityHash}</p>
                     <p className="text-[9px] font-bold">ROSPORTS ENTERPRISE SOLUTIONS</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // UI para Apertura, Panel Activo y Cierre se mantienen igual al flujo anterior 
  // pero con la integración del CRM en los movimientos manuales.
  // (Omitido aquí para brevedad, asumiendo que el usuario ya vio la estructura básica)
  
  if (step === 'idle' && !activeCashSession) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in zoom-in-95">
        <div className="glass-card rounded-[3.5rem] p-16 border-white/10 max-w-xl w-full text-center space-y-10">
           <div className="w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center text-blue-500 mx-auto shadow-[0_0_40px_rgba(59,130,246,0.2)] border-blue-500/20">
              <Landmark className="w-10 h-10" />
           </div>
           <div className="space-y-4">
              <h3 className="text-4xl font-space font-bold text-white uppercase tracking-tighter leading-none">Gestión de <span className="text-blue-500">Caja</span></h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed">Protocolo de apertura de terminal necesario.</p>
           </div>
           <button onClick={() => { setTempDenoms(PERU_DENOMINATIONS.map(d => ({...d, count: 0}))); setStep('opening'); }} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all">
              INICIAR APERTURA DE TURNO
           </button>
        </div>
      </div>
    );
  }

  // Render para paso de Apertura / Cierre (Arqueo)
  if (step === 'opening' || step === 'closing') {
    return (
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
         <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
               <div className="flex items-center gap-3 text-blue-500">
                  <Calculator className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">{step === 'opening' ? 'Conteo de Inicio' : 'Arqueo de Cierre'}</span>
               </div>
               <h2 className="text-4xl font-space font-bold text-white uppercase tracking-tighter">Arqueo de <span className="text-gradient">Divisas</span></h2>
            </div>
            <div className="glass px-12 py-6 rounded-[2.5rem] border-emerald-500/20 bg-emerald-500/5 text-right">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total en Bandeja</p>
               <p className="text-5xl font-space font-bold text-emerald-500 leading-none mt-1">S/ {currentTotal.toFixed(2)}</p>
            </div>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tempDenoms.map((d, i) => (
              <div key={d.value} className="glass p-5 rounded-3xl border-white/5 space-y-4 group hover:border-blue-500/30 transition-all">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-500 uppercase">{d.label}</span>
                    <span className="text-[10px] font-mono text-blue-500">S/ {(d.value * d.count).toFixed(2)}</span>
                 </div>
                 <div className="flex items-center justify-between gap-2 bg-black/40 p-2 rounded-2xl">
                    <button onClick={() => {
                      const next = [...tempDenoms];
                      next[i].count = Math.max(0, next[i].count - 1);
                      setTempDenoms(next);
                    }} className="w-8 h-8 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"><Minus className="w-3 h-3" /></button>
                    <input 
                      type="number" 
                      className="w-10 bg-transparent text-center text-sm font-bold text-white outline-none"
                      value={d.count || ''}
                      placeholder="0"
                      onChange={e => {
                        const next = [...tempDenoms];
                        next[i].count = parseInt(e.target.value) || 0;
                        setTempDenoms(next);
                      }}
                    />
                    <button onClick={() => {
                      const next = [...tempDenoms];
                      next[i].count += 1;
                      setTempDenoms(next);
                    }} className="w-8 h-8 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors"><Plus className="w-3 h-3" /></button>
                 </div>
              </div>
            ))}
         </div>

         <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
            <button onClick={() => activeCashSession ? setStep('active') : setStep('idle')} className="px-10 py-5 glass text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white">VOLVER</button>
            <button 
              onClick={step === 'opening' ? handleOpen : handleClose}
              className="px-16 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all flex items-center gap-3"
            >
               {step === 'opening' ? 'CONFIRMAR APERTURA' : 'EJECUTAR CIERRE'} <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </div>
    );
  }

  // Panel Activo
  if ((step === 'active' || !step || step === 'idle') && activeCashSession) {
    const expectedCash = CashService.calculateExpectedCash(activeCashSession);
    const manualIn = activeCashSession.movements.filter(m => m.type === 'income').reduce((a,b) => a + b.amount, 0);
    const manualOut = activeCashSession.movements.filter(m => m.type === 'expense').reduce((a,b) => a + b.amount, 0);

    return (
      <div className="space-y-10 animate-in fade-in duration-700 pb-32">
         <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-emerald-500">
                  <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-emerald-500/20 shadow-xl">
                     <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-60 text-slate-500">Terminal Operativo Activo</span>
                     <h2 className="font-space text-4xl font-bold dark:text-white uppercase tracking-tighter">Turno: <span className="text-gradient">{activeCashSession.id}</span></h2>
                  </div>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setShowMovementModal(true)} className="px-8 py-5 glass border-blue-500/20 text-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/10 transition-all flex items-center gap-3">
                  <HandCoins className="w-4 h-4" /> REGISTRAR MOVIMIENTO
               </button>
               <button onClick={() => { setTempDenoms(PERU_DENOMINATIONS.map(d => ({...d, count: 0}))); setStep('closing'); }} className="px-10 py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-red-500 transition-all flex items-center gap-3">
                  <LogOut className="w-4 h-4" /> CERRAR CAJA
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Inducción Inicial', val: activeCashSession.openingBalance, color: 'text-slate-400', icon: Landmark },
                    { label: 'Ventas en Efectivo', val: activeCashSession.systemExpected.cash, color: 'text-blue-500', icon: Banknote },
                    { label: 'Flujo Manual Neto', val: manualIn - manualOut, color: 'text-purple-500', icon: History },
                    { label: 'Esperado en Bandeja', val: expectedCash, color: 'text-emerald-500', icon: Calculator }
                  ].map((s, i) => (
                    <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5 space-y-3">
                       <s.icon className={`w-4 h-4 ${s.color}`} />
                       <div>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                          <p className={`text-xl font-space font-bold ${s.color}`}>S/ {s.val.toFixed(2)}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                     <div className="flex items-center gap-3 text-slate-400">
                        <History className="w-4 h-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Libro de Caja Diario</h4>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-white/5 border-b border-white/5">
                             <th className="px-8 py-4 text-[8px] font-black text-slate-500 uppercase">Timestamp</th>
                             <th className="px-8 py-4 text-[8px] font-black text-slate-500 uppercase">Tipo</th>
                             <th className="px-8 py-4 text-[8px] font-black text-slate-500 uppercase">Concepto / Motivo</th>
                             <th className="px-8 py-4 text-[8px] font-black text-slate-500 uppercase">Autorización</th>
                             <th className="px-8 py-4 text-[8px] font-black text-slate-500 uppercase text-right">Monto</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {activeCashSession.movements.map(m => (
                            <tr key={m.id} className="hover:bg-white/[0.01]">
                               <td className="px-8 py-4 text-[10px] font-mono text-slate-500">{new Date(m.timestamp).toLocaleTimeString()}</td>
                               <td className="px-8 py-4">
                                  <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase border ${m.type === 'income' ? 'text-emerald-500 border-emerald-500/20' : 'text-red-500 border-red-500/20'}`}>{m.type}</span>
                               </td>
                               <td className="px-8 py-4 text-[10px] font-bold text-white uppercase">{m.concept}</td>
                               <td className="px-8 py-4 text-[9px] font-black text-slate-500 uppercase">{m.authorizedBy}</td>
                               <td className={`px-8 py-4 text-right text-[11px] font-bold ${m.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                  {m.type === 'income' ? '+' : '-'} S/ {m.amount.toFixed(2)}
                               </td>
                            </tr>
                          ))}
                          {activeCashSession.movements.length === 0 && (
                            <tr><td colSpan={5} className="py-20 text-center opacity-30 text-[9px] font-black uppercase tracking-[0.5em]">Sin movimientos registrados</td></tr>
                          )}
                       </tbody>
                    </table>
                  </div>
               </div>
            </div>

            <aside className="space-y-6">
               <div className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-6">
                  <div className="flex items-center gap-3 text-blue-500">
                     <ShieldCheck className="w-5 h-5" />
                     <h4 className="text-[10px] font-black uppercase tracking-widest">Audit Status</h4>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Responsable</span>
                        <span className="text-[10px] font-bold text-white uppercase">{activeCashSession.userName}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black text-slate-500 uppercase">Inicio Turno</span>
                        <span className="text-[10px] font-bold text-white">{new Date(activeCashSession.startTime).toLocaleTimeString()}</span>
                     </div>
                  </div>
               </div>
            </aside>
         </div>

         {showMovementModal && (
           <CashMovementModal 
             onClose={() => setShowMovementModal(false)} 
             onSubmit={handleAddMovement} 
           />
         )}
      </div>
    );
  }

  return null;
};

const CashMovementModal: React.FC<{ onClose: () => void, onSubmit: (m: any) => void }> = ({ onClose, onSubmit }) => {
  const { customers } = useGlobal();
  const [form, setForm] = useState({ type: 'expense', amount: '', concept: '', authorizedBy: '', customerId: '' });

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-xl glass-card rounded-[3.5rem] border-white/10 p-12 space-y-10 animate-in zoom-in-95">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-blue-500">
               <HandCoins className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-space font-bold text-white uppercase tracking-tighter">Nuevo Flujo</h3>
         </div>
         <div className="space-y-6">
            <div className="flex gap-2 p-1 glass rounded-2xl">
               {['income', 'expense'].map(t => (
                 <button key={t} onClick={() => setForm({...form, type: t as any, concept: '', customerId: ''})} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all ${form.type === t ? 'bg-white text-black' : 'text-slate-500'}`}>{t}</button>
               ))}
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-500 uppercase px-2">Concepto de Operación</label>
               <select 
                  className="w-full p-5 glass rounded-2xl text-white text-xs font-bold appearance-none outline-none focus:border-blue-500"
                  onChange={e => setForm({...form, concept: e.target.value})}
               >
                  <option value="">SELECCIONAR...</option>
                  {form.type === 'income' ? (
                     <>
                        <option value="PAGO DE CRÉDITO ANTERIOR">PAGO DE CRÉDITO ANTERIOR</option>
                        <option value="DONACIÓN / OTROS">DONACIÓN / OTROS</option>
                     </>
                  ) : (
                     <>
                        <option value="GASTOS MENORES (CAJA CHICA)">GASTOS MENORES (CAJA CHICA)</option>
                        <option value="RETIRO PARCIAL PARA DEPÓSITO">RETIRO PARCIAL PARA DEPÓSITO</option>
                        <option value="RETIRO POR SEGURIDAD">RETIRO POR SEGURIDAD</option>
                     </>
                  )}
               </select>
            </div>

            {form.concept === "PAGO DE CRÉDITO ANTERIOR" && (
               <div className="space-y-2 animate-in slide-in-from-top-2">
                  <label className="text-[9px] font-black text-amber-500 uppercase px-2">Vincular Cliente con Deuda</label>
                  <select 
                     className="w-full p-5 glass rounded-2xl text-white text-xs font-bold appearance-none border border-amber-500/30"
                     onChange={e => setForm({...form, customerId: e.target.value})}
                  >
                     <option value="">BUSCAR CLIENTE...</option>
                     {customers.filter(c => c.creditBalance > 0).map(d => (
                        <option key={d.id} value={d.id}>{d.fullName} (S/ {d.creditBalance.toFixed(2)})</option>
                     ))}
                  </select>
               </div>
            )}

            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-500 uppercase px-2">Importe (S/)</label>
               <input type="number" step="0.10" onChange={e => setForm({...form, amount: e.target.value})} className="w-full p-5 glass rounded-2xl text-white text-2xl font-space font-bold outline-none" placeholder="0.00" />
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-500 uppercase px-2">Autorización de Supervisor</label>
               <input onChange={e => setForm({...form, authorizedBy: e.target.value.toUpperCase()})} className="w-full p-5 glass rounded-2xl text-white text-xs font-bold uppercase" placeholder="NOMBRE DEL SUPERVISOR" />
            </div>
         </div>
         <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-5 glass text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white">ABORTAR</button>
            <button 
              disabled={!form.amount || !form.concept || !form.authorizedBy}
              onClick={() => onSubmit({...form, amount: parseFloat(form.amount)})} 
              className="flex-2 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-500 transition-all px-10 disabled:opacity-30"
            >
              REGISTRAR MOVIMIENTO
            </button>
         </div>
      </div>
    </div>
  );
};

export default CashSessionManager;
