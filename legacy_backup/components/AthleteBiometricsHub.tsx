import React, { useMemo } from 'react';
import { ShieldAlert, ChevronRight, Award, Footprints } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { IntelligenceEngine } from '../services/intelligenceEngine';

const AthleteBiometricsHub: React.FC = () => {
  const { user, products, setView, setSelectedProduct } = useGlobal();

  const recommendations = useMemo(() => {
    if (!user?.biometrics) return [];
    return IntelligenceEngine.recommendByBiometrics(user.biometrics, products);
  }, [user, products]);

  const activeGear = user?.gear || [];

  return (
    <div className='space-y-12 animate-in fade-in duration-700 pb-24'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-brand-blue'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-brand-blue/20 shadow-xl bg-surface'>
              <Footprints className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] text-content-muted'>
                Recomendador de Calzado
              </span>
              <h2 className='font-space text-4xl font-bold text-content-primary uppercase tracking-tighter'>
                Encuentra tu par <span className='text-gradient'>Ideal</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <div className='lg:col-span-2 space-y-10'>
          <h3 className='text-[10px] font-black text-brand-blue uppercase tracking-[0.6em] px-4'>
            Estado de tu Calzado Actual
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {activeGear.map((item) => {
              const degradation = IntelligenceEngine.calculateGearDegradation(
                item.kmUsed,
                item.maxKm,
              );
              const isCritical = degradation > 85;
              return (
                <div
                  key={item.id}
                  className={`glass-card rounded-[2.5rem] p-8 border transition-all bg-surface shadow-sm ${isCritical ? 'border-red-500/30' : 'border-content-muted/10'}`}
                >
                  <div className='flex justify-between items-start mb-6'>
                    <div className='w-16 h-16 glass rounded-2xl p-2 bg-main border-content-muted/10'>
                      <img src={item.image} alt='' className='w-full h-full object-contain' />
                    </div>
                    {isCritical && (
                      <div className='px-3 py-1 bg-red-600 text-white rounded-lg flex items-center gap-2 animate-pulse'>
                        <ShieldAlert className='w-3 h-3' />
                        <span className='text-[7px] font-black uppercase'>CAMBIO RECOMENDADO</span>
                      </div>
                    )}
                  </div>
                  <div className='space-y-4'>
                    <h4 className='font-space text-xl font-bold text-content-primary uppercase truncate'>
                      {item.name}
                    </h4>
                    <div className='space-y-2'>
                      <div className='flex justify-between text-[8px] font-black text-content-muted uppercase'>
                        <span>Vida útil del calzado</span>
                        <span className={isCritical ? 'text-red-500' : 'text-emerald-500'}>
                          {100 - Math.round(degradation)}% de Vida Restante
                        </span>
                      </div>
                      <div className='h-1.5 w-full bg-content-muted/10 rounded-full overflow-hidden'>
                        <div
                          className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-brand-blue'}`}
                          style={{ width: `${100 - degradation}%` }}
                        />
                      </div>
                    </div>
                    <p className='text-[9px] text-content-muted font-bold uppercase tracking-widest'>
                      {item.kmUsed}KM recorridos de {item.maxKm}KM sugeridos
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='space-y-10'>
          <h3 className='text-[10px] font-black text-purple-500 uppercase tracking-[0.6em] px-4'>
            Sugerencias para Tí
          </h3>
          <div className='glass-card rounded-[3rem] p-10 border-content-muted/10 bg-surface shadow-sm space-y-8'>
            <div className='flex items-center gap-4'>
              <div className='p-3 glass rounded-xl text-purple-500 bg-purple-500/5'>
                <Award className='w-5 h-5' />
              </div>
              <div>
                <p className='text-[10px] font-bold text-content-primary uppercase'>
                  Asistente de Salud Rosports
                </p>
                <p className='text-[8px] font-black text-content-muted uppercase'>
                  Análisis: Estilo de vida activo
                </p>
              </div>
            </div>
            <div className='space-y-6'>
              {recommendations.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setView('product-details');
                  }}
                  className='w-full group p-5 glass rounded-2xl border-content-muted/10 hover:border-purple-500/30 transition-all flex items-center gap-6 bg-main/40'
                >
                  <div className='w-12 h-12 glass rounded-xl p-1 bg-surface border-content-muted/10 group-hover:scale-110 transition-transform'>
                    <img src={p.image} className='h-full w-full object-contain' />
                  </div>
                  <div className='flex-1 text-left'>
                    <p className='text-[10px] font-bold text-content-primary uppercase'>{p.name}</p>
                    <p className='text-[8px] font-black text-brand-blue uppercase'>
                      Protección y Estilo Superior
                    </p>
                  </div>
                  <ChevronRight className='w-4 h-4 text-content-muted group-hover:translate-x-1 transition-all' />
                </button>
              ))}
            </div>
            <button className='w-full py-4 glass border-content-muted/10 rounded-xl text-[9px] font-black uppercase text-content-muted hover:text-content-primary'>
              Actualizar mis preferencias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteBiometricsHub;
