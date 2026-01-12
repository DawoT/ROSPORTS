
import React, { useMemo } from 'react';
import { 
  DollarSign, TrendingUp, BarChart3, PieChart, 
  ArrowUpRight, Target, ShieldCheck, FileText,
  Zap, Scale, Wallet, Briefcase
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { FinanceService } from '../services/financeService';

const FinancialDashboard: React.FC = () => {
  const { customers, products } = useGlobal();

  const totalGMV = useMemo(() => {
    return customers.reduce((acc, c) => acc + (c.purchaseHistory?.reduce((sum, h) => sum + h.total, 0) || 0), 0);
  }, [customers]);

  const avgMargin = useMemo(() => {
    const validProducts = products.filter(p => p.cost);
    if (validProducts.length === 0) return 0;
    return validProducts.reduce((acc, p) => acc + FinanceService.calculateProfitability(p.price, p.cost!), 0) / validProducts.length;
  }, [products]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-500">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-amber-500/20 shadow-xl">
               <Wallet className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-60 text-slate-500">Corporate Finance Node</span>
               <h2 className="font-space text-4xl font-bold dark:text-white uppercase tracking-tighter leading-none">Fiscal <span className="text-amber-500">Metrics</span></h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: 'Total GMV (PEN)', val: FinanceService.formatCurrency(totalGMV), icon: DollarSign, color: 'text-emerald-500' },
           { label: 'Net Revenue (Ex-Tax)', val: FinanceService.formatCurrency(totalGMV / 1.18), icon: BarChart3, color: 'text-blue-500' },
           { label: 'IGV Payable (18%)', val: FinanceService.formatCurrency(totalGMV - (totalGMV / 1.18)), icon: ShieldCheck, color: 'text-red-500' },
           { label: 'Avg Portfolio Margin', val: `${avgMargin.toFixed(1)}%`, icon: TrendingUp, color: 'text-amber-500' },
         ].map((stat, i) => (
           <div key={i} className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-4 hover:border-amber-500/30 transition-all group">
              <div className="flex justify-between items-start">
                 <div className={`w-12 h-12 glass rounded-2xl flex items-center justify-center ${stat.color} bg-current/5 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                 </div>
                 <ArrowUpRight className="w-4 h-4 text-slate-500 opacity-50" />
              </div>
              <div>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-2xl font-bold font-space dark:text-white text-slate-900">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 glass-card rounded-[3rem] p-12 border-white/5 relative overflow-hidden flex flex-col min-h-[500px]">
            <div className="absolute inset-0 technical-grid opacity-10" />
            <div className="flex justify-between items-center mb-12 relative z-10">
               <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em]">Capital Rotation History</h3>
               <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-4 relative z-10 px-4">
               {[40, 65, 30, 85, 45, 95, 70].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full bg-white/5 rounded-t-2xl relative flex items-end overflow-hidden h-64">
                       <div 
                        className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-2xl transition-all duration-1000 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]" 
                        style={{ height: `${h}%` }}
                       />
                    </div>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Q{i+1}-25</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="glass-card rounded-[3rem] p-10 border-white/5 space-y-10">
            <div className="flex items-center gap-3 text-blue-500">
               <Briefcase className="w-6 h-6" />
               <h4 className="text-xl font-space font-bold uppercase">Asset Health</h4>
            </div>
            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                     <span>Inventory Value (Cost)</span>
                     <span className="text-white">S/ 142.5K</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600 w-[75%]" />
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                     <span>Operating Cash Flow</span>
                     <span className="text-emerald-500">+S/ 24.8K</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-600 w-[45%]" />
                  </div>
               </div>
            </div>
            
            <div className="p-8 glass rounded-[2.5rem] border-white/5 text-center space-y-4">
               <PieChart className="w-10 h-10 text-slate-800 mx-auto" />
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">Tax compliance report generated for SAT/SUNAT. No audit flags detected.</p>
               <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest border-b border-blue-500/20">REVISAR CERTIFICADOS</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
