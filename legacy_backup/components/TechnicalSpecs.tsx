import React from 'react';
import { Layers, Target, Cpu, Droplets } from 'lucide-react';
import { Product } from '../types';

const TechnicalSpecs: React.FC<{ product: Product }> = ({ product }) => {
  const specs = [
    {
      label: 'Cubierta Exterior',
      val: product.material || 'Aero-Tejido Soft',
      icon: Layers,
      desc: 'Material de alta calidad que permite que tu pie respire libremente.',
    },
    {
      label: 'Amortiguación Elite',
      val: product.cushioningLevel || 'Espuma de Nube MAX',
      icon: Cpu,
      desc: 'Absorción de impacto premium para proteger tus articulaciones.',
    },
    {
      label: 'Suela Antideslizante',
      val: `Nivel ${product.tractionScore}/10`,
      icon: Target,
      desc: 'Máxima seguridad y agarre en cualquier superficie de la ciudad.',
    },
    {
      label: 'Diseño Ergonómico',
      val: 'Ajuste Natural',
      icon: Droplets,
      desc: 'Diseñadas para adaptarse a la forma de tu pie desde el primer día.',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-1000'>
      {specs.map((s, i) => (
        <div
          key={i}
          className='p-8 glass rounded-[2.5rem] border-content-muted/10 hover:border-brand-blue/20 transition-all group flex gap-6'
        >
          <div className='w-14 h-14 glass rounded-2xl flex items-center justify-center text-brand-blue shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all'>
            <s.icon className='w-6 h-6' />
          </div>
          <div className='space-y-1'>
            <p className='text-[9px] font-black text-content-muted uppercase tracking-[0.3em]'>
              {s.label}
            </p>
            <h5 className='text-lg font-bold text-content-primary uppercase font-space'>{s.val}</h5>
            <p className='text-[10px] text-content-muted leading-relaxed'>{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnicalSpecs;
