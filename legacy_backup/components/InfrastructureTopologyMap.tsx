import React from 'react';
import { Server } from 'lucide-react';

const InfrastructureTopologyMap: React.FC = () => {
  return (
    <div className='glass-card rounded-[3rem] p-12 border-content-muted/10 relative overflow-hidden flex flex-col min-h-[500px] bg-surface shadow-sm'>
      <div className='absolute inset-0 technical-grid opacity-10' />

      <div className='flex justify-between items-center relative z-10 mb-12'>
        <div className='flex items-center gap-4'>
          <Server className='w-5 h-5 text-blue-500' />
          <h4 className='text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]'>
            Active Node Topology
          </h4>
        </div>
        <div className='flex items-center gap-2 px-4 py-2 glass rounded-full border-emerald-500/20 bg-emerald-500/5'>
          <div className='w-2 h-2 bg-emerald-500 rounded-full animate-ping' />
          <span className='text-[8px] font-black text-emerald-500 uppercase tracking-widest'>
            LIVE_MAP_SYNC
          </span>
        </div>
      </div>

      <div className='flex-1 relative z-10 flex items-center justify-center'>
        <svg className='w-full h-full max-w-lg overflow-visible' viewBox='0 0 400 300'>
          {/* Líneas de Conexión */}
          <path
            d='M200 50 L100 200 M200 50 L300 200 M100 200 L300 200'
            fill='none'
            stroke='currentColor'
            strokeWidth='1'
            className='text-blue-500/20'
            strokeDasharray='5,5'
          />

          {/* Nodo Central */}
          <circle cx='200' cy='50' r='10' className='fill-blue-600 animate-pulse shadow-lg' />
          <text
            x='200'
            y='30'
            textAnchor='middle'
            className='fill-content-primary text-[8px] font-black uppercase'
          >
            LIM_MASTER_HQ
          </text>

          {/* Nodos Periféricos */}
          <g className='group'>
            <circle
              cx='100'
              cy='200'
              r='8'
              className='fill-emerald-500 hover:scale-125 transition-transform cursor-pointer'
            />
            <text
              x='100'
              y='225'
              textAnchor='middle'
              className='fill-content-muted text-[7px] font-black uppercase'
            >
              NODE_SOUTH_S1
            </text>
          </g>

          <g className='group'>
            <circle
              cx='300'
              cy='200'
              r='8'
              className='fill-emerald-500 hover:scale-125 transition-transform cursor-pointer'
            />
            <text
              x='300'
              y='225'
              textAnchor='middle'
              className='fill-content-muted text-[7px] font-black uppercase'
            >
              NODE_NORTH_N1
            </text>
          </g>

          {/* Data Packets (Animación) */}
          <circle r='2' className='fill-blue-400'>
            <animateMotion dur='3s' repeatCount='indefinite' path='M200 50 L100 200' />
          </circle>
          <circle r='2' className='fill-blue-400'>
            <animateMotion dur='4s' repeatCount='indefinite' path='M200 50 L300 200' />
          </circle>
        </svg>
      </div>

      <div className='absolute bottom-10 left-10 text-[7px] font-mono text-content-muted opacity-40 uppercase space-y-1'>
        <p>Protocol: gRPC / HTTP3</p>
        <p>Encryption: ChaCha20-Poly1305</p>
        <p>Topology: Mesh-Bypass</p>
      </div>
    </div>
  );
};

export default InfrastructureTopologyMap;
