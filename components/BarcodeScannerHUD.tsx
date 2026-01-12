import React, { useState, useEffect, useRef } from 'react';
import { Zap, Target, Binary, ShieldAlert } from 'lucide-react';

interface BarcodeScannerHUDProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScannerHUD: React.FC<BarcodeScannerHUDProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [, setIsScanning] = useState(true);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setHasError(true);
      }
    }
    setupCamera();
    const currentVideo = videoRef.current;
    return () => {
      const stream = currentVideo?.srcObject as MediaStream;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const simulateScan = () => {
    // Simulación de escaneo para propósitos de demo si no hay cámara real o para agilizar tests
    setIsScanning(false);
    setTimeout(() => {
      onScan('BC-001'); // Velocity X-1 Pro barcode
      onClose();
    }, 1000);
  };

  return (
    <div className='fixed inset-0 z-[600] flex items-center justify-center p-6'>
      <div className='absolute inset-0 bg-black/95 backdrop-blur-3xl' />

      <div className='relative w-full max-w-2xl aspect-square glass-card rounded-[3.5rem] border-white/20 overflow-hidden flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.4)]'>
        {/* HUD UI Elements */}
        <div className='absolute inset-0 z-10 pointer-events-none'>
          <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-laser-scan' />

          <div className='absolute top-12 left-12 p-4 glass rounded-2xl border-white/10'>
            <Binary className='w-5 h-5 text-blue-500' />
          </div>

          <div className='absolute top-12 right-12 flex gap-4'>
            <div className='px-4 py-2 glass rounded-full border-emerald-500/20 flex items-center gap-3'>
              <div className='w-2 h-2 bg-emerald-500 rounded-full animate-ping' />
              <span className='text-[8px] font-black text-emerald-500 uppercase tracking-widest'>
                Sincronizado
              </span>
            </div>
          </div>

          {/* Corner Brackets */}
          <div className='absolute top-24 left-24 w-12 h-12 border-t-2 border-l-2 border-blue-500 rounded-tl-3xl opacity-50' />
          <div className='absolute top-24 right-24 w-12 h-12 border-t-2 border-r-2 border-blue-500 rounded-tr-3xl opacity-50' />
          <div className='absolute bottom-24 left-24 w-12 h-12 border-b-2 border-l-2 border-blue-500 rounded-bl-3xl opacity-50' />
          <div className='absolute bottom-24 right-24 w-12 h-12 border-b-2 border-r-2 border-blue-500 rounded-br-3xl opacity-50' />
        </div>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className='absolute inset-0 w-full h-full object-cover grayscale opacity-40 mix-blend-screen'
        />

        <div className='flex-1 flex flex-col items-center justify-center space-y-8 relative z-20'>
          <div className='w-48 h-48 border-2 border-dashed border-blue-500/30 rounded-[3rem] flex items-center justify-center animate-pulse'>
            <Target className='w-16 h-16 text-blue-500 opacity-50' />
          </div>

          <div className='text-center space-y-4'>
            <h3 className='text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] animate-pulse'>
              Detectando Código...
            </h3>
            <p className='text-[8px] text-slate-500 font-mono tracking-widest max-w-xs uppercase'>
              Asegure el SKU dentro del visor térmico para validación instantánea.
            </p>
          </div>
        </div>

        <div className='p-12 border-t border-white/10 bg-white/[0.02] flex justify-between items-center relative z-20'>
          <button
            onClick={onClose}
            className='px-8 py-4 glass text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white'
          >
            ABORTAR
          </button>
          <button
            onClick={simulateScan}
            className='px-12 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 flex items-center gap-3'
          >
            <Zap className='w-4 h-4 fill-current' /> CAPTURAR MANUAL
          </button>
        </div>

        {hasError && (
          <div className='absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-12 space-y-6 z-[100]'>
            <ShieldAlert className='w-16 h-16 text-red-500' />
            <div className='space-y-2'>
              <h4 className='text-2xl font-space font-bold text-white uppercase'>
                Acceso a Hardware Denegado
              </h4>
              <p className='text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed'>
                No se pudo inicializar el escáner bióptico. Verifique permisos de cámara en el
                navegador.
              </p>
            </div>
            <button
              onClick={onClose}
              className='px-12 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest'
            >
              CERRAR VISOR
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes laser-scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-laser-scan { animation: laser-scan 2.5s linear infinite; }
      `}</style>
    </div>
  );
};

export default BarcodeScannerHUD;
