
import React from 'react';
import { Star, CheckCircle, TrendingUp, ThumbsUp, MessageSquare, ShieldCheck } from 'lucide-react';
import { Review } from '../types';
import { TechnicalFormatter } from '../utils/formatter';

interface ReviewSystemProps {
  reviews: Review[];
  avgRating: number;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({ reviews, avgRating }) => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        <div className="space-y-4 text-center lg:text-left">
           <div className="space-y-1">
              <h4 className="text-[9px] font-black text-brand-blue uppercase tracking-[0.5em]">Experiencia de Comunidad</h4>
              <h3 className="text-3xl md:text-4xl font-space font-bold text-content-primary uppercase tracking-tighter">Lo que dicen nuestros clientes</h3>
           </div>
           <div className="flex items-center justify-center lg:justify-start gap-5">
              <span className="text-6xl md:text-7xl font-space font-bold text-content-primary leading-none">{avgRating.toFixed(1)}</span>
              <div className="space-y-1">
                 <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(avgRating) ? 'text-amber-500 fill-current' : 'text-content-muted opacity-20'}`} />
                    ))}
                 </div>
                 <p className="text-[8px] font-black text-content-secondary uppercase tracking-widest">{reviews.length} Comentarios verificados</p>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
           {[
             { label: 'Máxima Comodidad', val: 92 },
             { label: 'Calidad de Material', val: 88 },
             { label: 'Fiel a su Talla', val: 95 },
           ].map(stat => (
             <div key={stat.label} className="p-5 md:p-6 glass rounded-[2rem] border-content-muted/10 space-y-3 bg-content-muted/[0.01]">
                <div className="flex justify-between items-end">
                   <p className="text-[8px] font-black text-content-secondary uppercase tracking-widest">{stat.label}</p>
                   <span className="text-lg font-bold text-content-primary">{stat.val}%</span>
                </div>
                <div className="h-1 w-full bg-content-muted/10 rounded-full overflow-hidden">
                   <div className="h-full bg-brand-blue rounded-full" style={{ width: `${stat.val}%` }} />
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-4">
         {reviews.map(review => (
           <div key={review.id} className="p-5 md:p-6 glass rounded-[2rem] border-content-muted/10 flex flex-col md:flex-row gap-6 group hover:border-brand-blue/20 transition-all bg-content-muted/[0.01]">
              <div className="flex-1 space-y-4">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center font-bold text-brand-blue border border-brand-blue/20 text-xs">
                          {review.userName[0]}
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-content-primary uppercase">{review.userName}</span>
                          <div className="w-1 h-1 bg-content-muted/30 rounded-full" />
                          <span className="text-[8px] font-black text-content-muted uppercase tracking-widest">{TechnicalFormatter.date(review.date)}</span>
                       </div>
                    </div>
                    {review.verifiedPurchase && (
                      <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/20 w-fit">
                         <ShieldCheck className="w-3 h-3" />
                         <span className="text-[7px] font-black uppercase tracking-widest">Compra Verificada</span>
                      </div>
                    )}
                 </div>

                 <div className="space-y-3">
                    <div className="flex gap-1">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-500 fill-current' : 'text-content-muted opacity-20'}`} />
                       ))}
                    </div>
                    <p className="text-content-secondary text-sm leading-relaxed font-medium">"{review.comment}"</p>
                 </div>
                 
                 <div className="flex flex-wrap gap-6 pt-2">
                    <div className="flex items-center gap-2">
                       <span className="text-[7px] font-black text-content-muted uppercase tracking-widest">Ajuste de Talla:</span>
                       <span className="text-[9px] font-bold text-content-primary uppercase">Perfecto</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[7px] font-black text-content-muted uppercase tracking-widest">Confort General:</span>
                       <span className="text-[9px] font-bold text-content-primary uppercase">{review.metrics.comfort}/10</span>
                    </div>
                 </div>
              </div>

              <div className="flex md:flex-col justify-center items-center gap-3 border-t md:border-t-0 md:border-l border-content-muted/10 pt-4 md:pt-0 md:pl-6 shrink-0">
                 <button className="flex-1 md:flex-none p-3 glass rounded-xl text-content-muted hover:text-brand-blue hover:border-brand-blue/50 transition-all flex items-center justify-center gap-2 min-h-[40px] min-w-[80px]">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-black uppercase">Es Útil</span>
                 </button>
                 <button className="flex-1 md:flex-none p-3 glass rounded-xl text-content-muted hover:text-content-primary transition-all flex items-center justify-center min-h-[40px]">
                    <MessageSquare className="w-3.5 h-3.5" />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default ReviewSystem;
