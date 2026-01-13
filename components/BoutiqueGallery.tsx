import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface BoutiqueGalleryProps {
  images: string[];
}

const BoutiqueGallery: React.FC<BoutiqueGalleryProps> = ({ images }) => {
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
    <div className='space-y-6 animate-in fade-in duration-1000'>
      {/* Main Viewport */}
      <div
        className='relative aspect-square glass rounded-[3rem] md:rounded-[4rem] overflow-hidden cursor-zoom-in group border border-content-muted/10 bg-surface shadow-2xl'
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <div className='absolute inset-0 technical-grid opacity-10 pointer-events-none' />

        {/* Tech UI Elements Overlay */}
        <div className='absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
          <div className='absolute top-10 left-10 w-20 h-20 border-t border-l border-brand-blue/30 rounded-tl-2xl' />
          <div className='absolute bottom-10 right-10 w-20 h-20 border-b border-r border-brand-blue/30 rounded-br-2xl' />
          <div className='absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-1'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='w-1 h-1 bg-brand-blue/40 rounded-full' />
            ))}
          </div>
        </div>

        <img
          src={images[activeIdx]}
          alt='Vista de Producto Rosports'
          className={`w-full h-full object-contain transition-transform duration-300 ease-out ${isZoomed ? 'scale-[2.2]' : 'scale-100'}`}
          style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
        />

        <div className='absolute top-8 left-8 p-3.5 glass rounded-2xl border-brand-blue/20 text-brand-blue opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 shadow-lg'>
          <Search className='w-5 h-5' />
        </div>

        <div className='absolute bottom-10 left-10 flex items-center gap-4 z-30'>
          <div className='px-5 py-2 glass rounded-full border-content-muted/20 text-[9px] font-black text-content-primary uppercase tracking-[0.4em] bg-surface/60 backdrop-blur-xl shadow-sm'>
            <span className='text-brand-blue'>SELECT</span> // VIEW_0{activeIdx + 1}
          </div>
        </div>
      </div>

      {/* Thumbnails Navigation */}
      <div className='flex gap-4 overflow-x-auto pb-4 custom-scrollbar px-2'>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`w-24 h-24 shrink-0 glass rounded-2xl md:rounded-[2rem] border-2 p-2 transition-all group relative overflow-hidden ${activeIdx === i ? 'border-brand-blue scale-105 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`}
          >
            <img
              src={img}
              className='w-full h-full object-contain transition-transform group-hover:rotate-6'
              alt={`Thumbnail ${i + 1}`}
            />
            {activeIdx === i && (
              <div className='absolute bottom-0 left-0 w-full h-1 bg-brand-blue animate-pulse' />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BoutiqueGallery;
