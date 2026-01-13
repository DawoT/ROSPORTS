import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, MicOff, RefreshCw } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { ROSPORTS_TOOLS } from '../services/aiAssistantService';

const LiveSupportAssistant: React.FC = () => {
  const { products, inventoryNodes, addNotification } = useGlobal();
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<'esperando' | 'escuchando' | 'respondiendo' | 'procesando'>(
    'esperando',
  );
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            setStatus('escuchando');
          },
          onmessage: async (msg) => {
            if (msg.toolCall) {
              setStatus('procesando');
              for (const fc of msg.toolCall.functionCalls) {
                let result = 'Lo siento, no pude encontrar esa información.';

                if (fc.name === 'check_stock_at_node') {
                  const product = products.find(
                    (p) => p.sku_parent === fc.args.sku || p.id === fc.args.sku,
                  );
                  const node = inventoryNodes.find((n) => n.id === fc.args.nodeId);
                  result = product
                    ? `Sí, tenemos stock en la tienda ${node?.name}.`
                    : 'Ese modelo no se encuentra disponible actualmente.';
                }

                if (fc.name === 'generate_retention_coupon') {
                  result = 'He aplicado un descuento exclusivo para tu próxima compra.';
                  addNotification('¡Tienes un descuento especial activado por voz!', 'success');
                }

                sessionPromise.then((session) => {
                  session.sendToolResponse({
                    functionResponses: {
                      id: fc.id,
                      name: fc.name,
                      response: { result },
                    },
                  });
                });
              }
            }
            if (msg.serverContent?.modelTurn) setStatus('respondiendo');
            if (msg.serverContent?.turnComplete) setStatus('escuchando');
          },
          onerror: () => setIsActive(false),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: ROSPORTS_TOOLS }],
          systemInstruction:
            'Eres un asesor de moda experto en zapatillas de ROSPORTS Perú. Tu tono es elegante, amable y muy servicial. Ayuda a los clientes a encontrar su talla, verificar stock en tiendas de Lima y dales consejos de estilo.',
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        },
      });

      sessionRef.current = await sessionPromise;
    } catch () {
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
    setStatus('esperando');
  };

  return (
    <div className='fixed bottom-10 right-32 z-[200]'>
      <div
        className={`glass px-6 py-4 rounded-[2.5rem] border-brand-blue/20 shadow-2xl flex items-center gap-6 transition-all duration-500 ${isActive ? 'bg-brand-blue text-white w-80' : 'bg-surface hover:border-brand-blue/50 w-auto'}`}
      >
        <div className='relative'>
          <button
            onClick={isActive ? stopSession : startSession}
            disabled={isConnecting}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-white text-brand-blue animate-pulse' : 'bg-brand-blue text-white shadow-xl'}`}
          >
            {isConnecting ? (
              <RefreshCw className='w-5 h-5 animate-spin' />
            ) : isActive ? (
              <MicOff className='w-5 h-5' />
            ) : (
              <Mic className='w-5 h-5' />
            )}
          </button>
        </div>

        <div className='flex flex-col min-w-0'>
          <span
            className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-white/70' : 'text-content-muted'}`}
          >
            Asesor Rosports en Vivo
          </span>
          <p className='text-[10px] font-bold uppercase tracking-tight truncate'>
            {isConnecting
              ? 'CONECTANDO...'
              : isActive
                ? `MODO: ${status.toUpperCase()}`
                : 'HABLAR CON ASESOR'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveSupportAssistant;
