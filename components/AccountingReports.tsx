import React, { useState, useMemo } from 'react';
import {
  FileText,
  Landmark,
  Users,
  TrendingUp,
  Download,
  Search,
  Filter,
  Calendar,
  Zap,
  DollarSign,
  PieChart,
  ArrowUpRight,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { EnterpriseDataTable, TechnicalBadge } from './Primitives';
import { TechnicalFormatter } from '../utils/formatter';
import { ReportingService } from '../services/reportingService';
import { OrderHistoryItem } from '../types';

type AccountTab = 'sales-book' | 'cash-audit' | 'commissions';

/**
 * Interface for Sales Book report entries
 */
interface SalesBookEntry {
  id: string;
  fecha: string;
  tipo: string;
  serie: string;
  numero: string;
  docTipo: string;
  docNum: string;
  cliente: string;
  base: number;
  igv: number;
  total: number;
  status: string;
}

/**
 * Interface for Cash Audit report entries
 */
interface CashAuditEntry {
  id: string;
  operator: string;
  date: string;
  open: number;
  cash: number;
  card: number;
  other: number;
  expected: number;
  actual: number;
  diff: number;
}

/**
 * Interface for Commission report entries
 */
interface CommissionEntry {
  id: string;
  seller: string;
  totalSales: number;
  orderCount: number;
  commission: number;
  status: string;
}

const AccountingReports: React.FC = () => {
  const { customers, auditLogs, activeCashSession } = useGlobal();
  const [activeTab, setActiveTab] = useState<AccountTab>('sales-book');
  const [dateRange, setDateRange] = useState('MAY_2025');

  // Integración de todas las órdenes de los clientes para el Libro de Ventas
  // Fix: Explicitly typed salesBookData to help with EnterpriseDataTable generic inference
  const salesBookData = useMemo<SalesBookEntry[]>(() => {
    const all: SalesBookEntry[] = [];
    customers.forEach((c) => {
      c.purchaseHistory?.forEach((h) => {
        all.push({
          id: h.orderId,
          fecha: new Date(h.date).toLocaleDateString(),
          tipo: h.billing.type === 'BOLETA' ? '03' : '01',
          serie: h.orderId.split('-')[0],
          numero: h.orderId.split('-')[1],
          docTipo: c.docType === 'DNI' ? '1' : '6',
          docNum: c.docNumber,
          cliente: c.fullName,
          base: h.subtotal,
          igv: h.tax,
          total: h.total,
          status: h.status,
        });
      });
    });
    return all.sort((a, b) => b.id.localeCompare(a.id));
  }, [customers]);

  // Auditoría de Sesiones de Caja (Histórico simulado + sesión activa)
  // Fix: Explicitly typed cashAuditData to help with EnterpriseDataTable generic inference
  const cashAuditData = useMemo<CashAuditEntry[]>(() => {
    const historical: CashAuditEntry[] = [
      {
        id: 'CS-PREV-01',
        operator: 'Admin User',
        date: '2025-05-10',
        open: 500,
        cash: 1200,
        card: 850,
        other: 120,
        expected: 2670,
        actual: 2670,
        diff: 0,
      },
      {
        id: 'CS-PREV-02',
        operator: 'Sales Pro',
        date: '2025-05-09',
        open: 500,
        cash: 980,
        card: 420,
        other: 50,
        expected: 1950,
        actual: 1948.5,
        diff: -1.5,
      },
    ];
    return historical;
  }, []);

  // Cálculo de Comisiones por Vendedor
  // Fix: Explicitly typed commissionData to help with EnterpriseDataTable generic inference
  const commissionData = useMemo<CommissionEntry[]>(() => {
    const sellers: Record<string, { total: number; count: number }> = {};
    customers.forEach((c) => {
      c.purchaseHistory?.forEach((h) => {
        const sid = h.sellerId || 'SISTEMA_WEB';
        if (!sellers[sid]) sellers[sid] = { total: 0, count: 0 };
        if (h.status !== 'voided') {
          sellers[sid].total += h.total;
          sellers[sid].count += 1;
        }
      });
    });

    return Object.entries(sellers).map(([id, data]) => ({
      id,
      seller: id,
      totalSales: data.total,
      orderCount: data.count,
      commission: data.total * 0.025, // 2.5% de comisión técnica
      status: 'CALCULATED',
    }));
  }, [customers]);

  const totalTaxPayable = salesBookData.reduce((acc, i) => acc + i.igv, 0);

  return (
    <div className='space-y-10 animate-in fade-in duration-700 pb-32'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-emerald-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-emerald-500/20 shadow-xl bg-surface'>
              <FileText className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] text-content-muted'>
                Financial Integrity Node
              </span>
              <h2 className='font-space text-4xl font-bold text-content-primary uppercase tracking-tighter leading-none'>
                Reportes <span className='text-gradient'>Contables</span>
              </h2>
            </div>
          </div>
        </div>

        <div className='flex gap-4'>
          <button
            onClick={() =>
              ReportingService.exportToCSV(salesBookData, `LIBRO_VENTAS_SUNAT_${dateRange}`)
            }
            className='px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-500 transition-all shadow-xl'
          >
            <Download className='w-4 h-4' /> EXPORTAR LIBRO (CSV)
          </button>
        </div>
      </div>

      <div className='flex glass p-2 rounded-[2.5rem] border-content-muted/10 gap-2 bg-surface/50 overflow-x-auto'>
        {[
          { id: 'sales-book', label: 'Libro de Ventas', icon: FileText },
          { id: 'cash-audit', label: 'Auditoría Cajas', icon: Landmark },
          { id: 'commissions', label: 'Comisiones', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-3 py-5 rounded-[2rem] text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-content-muted hover:bg-content-muted/5'}`}
          >
            <tab.icon className='w-4 h-4' />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'sales-book' && (
        <div className='space-y-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='glass-card p-8 rounded-[2.5rem] border-content-muted/10 bg-surface space-y-2'>
              <p className='text-[8px] font-black text-content-muted uppercase tracking-widest'>
                Base Imponible Mayo
              </p>
              <p className='text-2xl font-space font-bold text-content-primary'>
                S/ {(totalTaxPayable / 0.18).toLocaleString()}
              </p>
            </div>
            <div className='glass-card p-8 rounded-[2.5rem] border-content-muted/10 bg-surface space-y-2'>
              <p className='text-[8px] font-black text-content-muted uppercase tracking-widest'>
                IGV a Pagar (18%)
              </p>
              <p className='text-2xl font-space font-bold text-emerald-500'>
                S/ {totalTaxPayable.toLocaleString()}
              </p>
            </div>
            <div className='glass-card p-8 rounded-[2.5rem] border-content-muted/10 bg-surface space-y-2'>
              <p className='text-[8px] font-black text-content-muted uppercase tracking-widest'>
                Estado OSE/SUNAT
              </p>
              <div className='flex items-center gap-3'>
                <span className='text-xl font-bold text-emerald-500 uppercase'>SINCRONIZADO</span>
                <ShieldCheck className='w-5 h-5 text-emerald-500' />
              </div>
            </div>
          </div>

          {/* Fix: Explicitly provided SalesBookEntry generic to EnterpriseDataTable */}
          <EnterpriseDataTable<SalesBookEntry>
            data={salesBookData}
            columns={[
              { key: 'fecha', label: 'Emisión' },
              {
                key: 'tipo',
                label: 'Tipo',
                render: (i) => (
                  <span className='text-[10px] font-bold text-blue-500'>{i.tipo}</span>
                ),
              },
              {
                key: 'id',
                label: 'Documento ID',
                render: (i) => <span className='text-[10px] font-mono font-bold'>{i.id}</span>,
              },
              { key: 'docNum', label: 'Doc Cliente' },
              {
                key: 'cliente',
                label: 'Razón Social',
                render: (i) => (
                  <span className='text-[10px] font-bold uppercase truncate max-w-[150px]'>
                    {i.cliente}
                  </span>
                ),
              },
              {
                key: 'base',
                label: 'Base',
                render: (i) => <span className='text-xs font-bold'>S/ {i.base.toFixed(2)}</span>,
              },
              {
                key: 'igv',
                label: 'IGV',
                render: (i) => (
                  <span className='text-xs font-bold text-emerald-500'>S/ {i.igv.toFixed(2)}</span>
                ),
              },
              {
                key: 'total',
                label: 'Total',
                render: (i) => (
                  <span className='text-sm font-bold text-content-primary'>
                    S/ {i.total.toFixed(2)}
                  </span>
                ),
              },
            ]}
          />
        </div>
      )}

      {activeTab === 'cash-audit' && (
        /* Fix: Explicitly provided CashAuditEntry generic to EnterpriseDataTable */
        <EnterpriseDataTable<CashAuditEntry>
          data={cashAuditData}
          columns={[
            { key: 'date', label: 'Fecha Turno' },
            {
              key: 'operator',
              label: 'Operador',
              render: (i) => <span className='text-xs font-bold uppercase'>{i.operator}</span>,
            },
            {
              key: 'cash',
              label: 'Ventas Cash',
              render: (i) => <span className='text-xs font-bold'>S/ {i.cash.toFixed(2)}</span>,
            },
            {
              key: 'expected',
              label: 'Sistema',
              render: (i) => (
                <span className='text-xs font-bold text-blue-500'>S/ {i.expected.toFixed(2)}</span>
              ),
            },
            {
              key: 'actual',
              label: 'Contado',
              render: (i) => (
                <span className='text-xs font-bold text-content-primary'>
                  S/ {i.actual.toFixed(2)}
                </span>
              ),
            },
            {
              key: 'diff',
              label: 'Diferencia',
              render: (i) => (
                <span
                  className={`text-xs font-black ${i.diff < 0 ? 'text-red-500' : 'text-emerald-500'}`}
                >
                  {i.diff === 0 ? 'CONCILIADO' : `S/ ${i.diff.toFixed(2)}`}
                </span>
              ),
            },
          ]}
        />
      )}

      {activeTab === 'commissions' && (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
          <div className='lg:col-span-2 space-y-8'>
            {/* Fix: Explicitly provided CommissionEntry generic to EnterpriseDataTable */}
            <EnterpriseDataTable<CommissionEntry>
              data={commissionData}
              columns={[
                {
                  key: 'seller',
                  label: 'Operador Comercial',
                  render: (i) => <span className='text-xs font-bold uppercase'>{i.seller}</span>,
                },
                {
                  key: 'orderCount',
                  label: 'Volumen',
                  render: (i) => <span className='text-xs font-bold'>{i.orderCount} OP.</span>,
                },
                {
                  key: 'totalSales',
                  label: 'Ventas Netas',
                  render: (i) => (
                    <span className='text-xs font-bold text-content-primary'>
                      S/ {i.totalSales.toFixed(2)}
                    </span>
                  ),
                },
                {
                  key: 'commission',
                  label: 'Comisión (2.5%)',
                  render: (i) => (
                    <span className='text-sm font-black text-emerald-600 dark:text-emerald-500'>
                      S/ {i.commission.toFixed(2)}
                    </span>
                  ),
                },
                {
                  key: 'actions',
                  label: 'Estado Pago',
                  render: () => <TechnicalBadge variant='amber'>PENDING_SETTLE</TechnicalBadge>,
                },
              ]}
            />
          </div>

          <div className='glass-card rounded-[3rem] p-10 border-content-muted/10 bg-surface shadow-sm space-y-10'>
            <div className='flex items-center gap-3 text-emerald-500'>
              <Users className='w-6 h-6' />
              <h4 className='text-xl font-space font-bold uppercase'>Sales Policy</h4>
            </div>
            <p className='text-xs text-content-secondary leading-relaxed font-medium italic'>
              Las comisiones se calculan sobre el total neto de ventas confirmadas (no anuladas). El
              factor de incentivo actual está fijado en 2.5% para el Nodo Lima HQ.
            </p>
            <div className='pt-6 border-t border-content-muted/10'>
              <button className='w-full py-5 bg-content-primary text-main rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-xl'>
                Cerrar Planilla Mensual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingReports;
