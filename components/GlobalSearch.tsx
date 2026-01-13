import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { GoogleGenAI } from '@google/genai';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelect: (p: Product) => void;
}

/**
 * @description Inicialización del cliente de IA. Se mantiene fuera para evitar fugas de memoria.
 * @requires process.env.API_KEY
 */
const initializeAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, products, onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * @async
   * @function fetchAiSuggestions
   * @description Consulta términos relacionados mediante Gemini.
   */
  const fetchAiSuggestions = async (term: string) => {
    if (term.length < 3) return;
    setIsAiLoading(true);
    try {
      const ai = initializeAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analiza este término de búsqueda para una tienda de zapatillas premium llamada ROSPORTS: "${term}". 
                  Sugiere 3 términos o categorías de moda urbana relacionados. 
                  Responde solo con una lista separada por comas en español.`,
      });
      const text = response.text || '';
      setSuggestions(text.split(',').map((s) => s.trim()));
    } catch (e) {
      console.error('AI Search Error', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 3) fetchAiSuggestions(query);
    }, 800);
    return () => clearTimeout(timer);
  }, [query]);

  const results =
    query.length >= 2
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.category.toLowerCase().includes(query.toLowerCase()) ||
              p.sku_parent?.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 6)
      : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[1000] flex items-start justify-center pt-[5vh] md:pt-[10vh] px-4 md:px-6'>
      <div
        className='absolute inset-0 bg-main/90 backdrop-blur-[40px] animate-in fade-in'
        onClick={onClose}
      />

      <div className='relative w-full max-w-3xl glass-card rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-content-muted/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-10 bg-surface/98'>
        <div className='p-6 md:p-10 border-b border-content-muted/10 bg-content-muted/[0.01]'>
          <div className='relative flex items-center'>
            <Search
              className={`absolute left-5 w-6 h-6 ${isAiLoading ? 'text-brand-blue animate-pulse' : 'text-content-muted'}`}
            />
            <input
              ref={inputRef}
              type='text'
              placeholder='¿Qué modelo buscas hoy?'
              className='w-full pl-14 pr-8 py-6 md:py-8 bg-transparent outline-none text-2xl md:text-3xl font-space font-bold text-content-primary uppercase tracking-tighter placeholder:text-content-muted/20'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={onClose}
              className='p-3 glass rounded-xl text-content-muted hover:text-content-primary transition-all'
            >
              <X />
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className='flex items-center gap-4 mt-6 px-4 animate-in fade-in slide-in-from-left-2'>
              <Sparkles className='w-3.5 h-3.5 text-brand-blue' />
              <div className='flex flex-wrap gap-2'>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(s)}
                    className='px-3 py-1 glass rounded-full text-[8px] font-black text-brand-blue uppercase tracking-widest hover:bg-brand-blue/10 transition-all border border-brand-blue/20'
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='p-4 md:p-6 max-h-[60vh] overflow-y-auto custom-scrollbar'>
          {results.length > 0 ? (
            <div className='space-y-2'>
              <p className='text-[8px] font-black text-content-muted uppercase tracking-[0.4em] px-4 mb-2'>
                Modelos Encontrados
              </p>
              {results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelect(p);
                    onClose();
                  }}
                  className='w-full p-4 glass hover:bg-content-muted/[0.04] rounded-2xl border border-transparent hover:border-brand-blue/30 transition-all flex items-center gap-6 group'
                >
                  <div className='w-16 h-16 glass rounded-xl p-2 shrink-0 bg-main'>
                    <img src={p.image} className='w-full h-full object-contain' alt='' />
                  </div>
                  <div className='flex-1 text-left'>
                    <div className='flex items-center gap-2'>
                      <span className='text-[8px] font-black text-brand-blue uppercase tracking-widest'>
                        {p.brand}
                      </span>
                      <div className='w-1 h-1 bg-content-muted/20 rounded-full' />
                      <span className='text-[8px] font-bold text-content-muted uppercase tracking-widest'>
                        {p.category}
                      </span>
                    </div>
                    <h4 className='text-lg font-bold text-content-primary uppercase leading-none mt-1 group-hover:text-brand-blue transition-colors'>
                      {p.name}
                    </h4>
                  </div>
                  <div className='text-right shrink-0'>
                    <p className='text-lg font-space font-bold text-content-primary'>
                      S/ {p.price.toFixed(2)}
                    </p>
                    <span className='text-[7px] font-black text-emerald-500 uppercase tracking-widest'>
                      En Stock
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className='py-20 flex flex-col items-center justify-center text-center space-y-6 opacity-30'>
              <AlertCircle className='w-16 h-16 text-content-muted' />
              <div className='space-y-1'>
                <p className='text-[10px] font-black uppercase tracking-[0.5em] text-content-primary'>
                  Sin Coincidencias
                </p>
              </div>
            </div>
          ) : (
            <div className='py-8 px-6'>
              <h5 className='text-[9px] font-black text-content-muted uppercase tracking-[0.5em] mb-6'>
                Explorar por Estilo
              </h5>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {['RUNNING ELITE', 'MODA URBANA', 'COLECCIÓN LIFESTYLE', 'CALZADO DEPORTIVO'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className='p-5 glass rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-brand-blue/50 transition-all text-left flex items-center justify-between group text-content-secondary'
                    >
                      {tag}
                      <ArrowRight className='w-3.5 h-3.5 text-content-muted group-hover:text-brand-blue group-hover:translate-x-2 transition-all' />
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        <div className='p-4 md:p-6 border-t border-content-muted/10 bg-content-muted/[0.04] flex justify-between items-center'>
          <div className='flex items-center gap-2 text-[8px] md:text-[9px] font-black text-brand-blue uppercase tracking-widest'>
            <Sparkles className='w-3 h-3' /> INTELIGENCIA ROSPORTS ACTIVA
          </div>
          <div className='flex items-center gap-2 text-[7px] md:text-[8px] font-black text-content-muted uppercase'>
            ESC para cerrar
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
