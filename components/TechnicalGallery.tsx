import React, { useState } from 'react';
import { Maximize2, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface TechnicalGalleryProps {
  images: string[];
}

const TechnicalGallery: React.FC<TechnicalGalleryProps> = ({ images }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-6">
      {/* Main Viewport */}
      <div 
        className="relative aspect-square glass rounded-[3rem] overflow-hidden cursor-zoom-in group border border-content-muted/10 bg-content-muted/[0.01] shadow-sm"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 technical-grid opacity-10" />
        
        <img 
          src={images[activeIdx]} 
          alt="Product View"
          className={`w-full h-full object-contain transition-transform duration-200 ${isZoomed ? 'scale-[2.5]' : 'scale-100'}`}
          style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
        />

        <div className="absolute top-6 left-6 p-3 glass rounded-2xl border-blue-500/20 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
           <Maximize2 className="w-5 h-5" />
        </div>

        <div className="absolute bottom-8 right-8 flex items-center gap-3">
           <div className="px-4 py-2 glass rounded-full border-content-muted/20 text-[8px] font-black text-content-primary uppercase tracking-widest bg-main/40 backdrop-blur-md">
              HD_RENDER // 0{activeIdx + 1}
           </div>
        </div>
      </div>

      {/* Thumbnails Navigation */}
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
         {images.map((img, i) => (
           <button 
            key={i} 
            onClick={() => setActiveIdx(i)}
            className={`w-24 h-24 shrink-0 glass rounded-2xl border-2 p-2 transition-all ${activeIdx === i ? 'border-blue-600' : 'border-transparent opacity-50 hover:opacity-100'}`}
           >
              <img src={img} className="w-full h-full object-contain" alt="" />
           </button>
         ))}
      </div>
    </div>
  );
};

export default TechnicalGallery;