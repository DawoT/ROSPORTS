
import React from 'react';
import { Layers, Target, Cpu, Droplets, Sparkles, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

const PremiumFeatures: React.FC<{ product: Product }> = ({ product }) => {
  const specs = [
    { label: 'Estructura Exterior', val: product.material || 'Tejido Pro-Tech', icon: Layers, desc: 'Ingeniería de materiales transpirables con acabado aero-dinámico.' },
    { label: 'Núcleo de Absorción', val: product.cushioningLevel || 'Cámara Air-Max V3', icon: Cpu, desc: 'Sistema de amortiguación reactiva diseñado para alto impacto urbano.' },
    { label: 'Tracción Omnidireccional', val: `Nivel ${product.tractionScore}/10`, icon: Target, desc: 'Suela de goma vulcanizada con patrones de agarre de precisión.' },
    { label: 'Ergonomía Elite', val: 'Active Fit', icon: Droplets, desc: 'Moldeado anatómico que asegura estabilidad total en movimiento.' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {specs.map((s, i) => (
        <div key={i} className="group relative p-8 glass-card rounded-[2.5rem] border border-content-muted/10 hover:border-brand-blue/30 transition-all duration-500 overflow-hidden bg-surface shadow-lg">
           {/* Decorative background accent */}
           <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl group-hover:bg-brand-blue/10 transition-colors" />
           
           <div className="flex gap-6 relative z-10">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-brand-blue shrink-0 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-md">
                 <s.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <p className="text-[9px] font-black text-content-muted uppercase tracking-[0.3em]">{s.label}</p>
                    <Sparkles className="w-3 h-3 text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <h5 className="text-xl font-bold text-content-primary uppercase font-space tracking-tight">{s.val}</h5>
                 <p className="text-[10px] text-content-secondary leading-relaxed max-w-[200px] font-medium">{s.desc}</p>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
};

export default PremiumFeatures;
