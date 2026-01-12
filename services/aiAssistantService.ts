
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Product, RebalanceSuggestion, VisualDiagnostic } from "../types";

export const ROSPORTS_TOOLS: FunctionDeclaration[] = [
  {
    name: 'check_stock_at_node',
    parameters: {
      type: Type.OBJECT,
      description: 'Verifica la disponibilidad exacta de un producto en un nodo logístico específico.',
      properties: {
        sku: { type: Type.STRING, description: 'El SKU técnico del producto o variante.' },
        nodeId: { type: Type.STRING, description: 'El ID del nodo (N-01, N-02, N-03).' }
      },
      required: ['sku', 'nodeId']
    }
  },
  {
    name: 'generate_retention_coupon',
    parameters: {
      type: Type.OBJECT,
      description: 'Genera un cupón de descuento temporal para fidelizar al atleta.',
      properties: {
        reason: { type: Type.STRING, description: 'Motivo del cupón (ej: stock_bajo, consulta_tecnica).' },
        discountPercent: { type: Type.NUMBER, description: 'Porcentaje sugerido (max 15).' }
      },
      required: ['reason']
    }
  }
];

export const AIAssistantService = {
  diagnoseProductFault: async (base64Image: string, reason: string): Promise<VisualDiagnostic> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: `Analiza esta zapatilla reportada como "${reason}". Responde en JSON con confidence, detectedFaults (array), recommendation (approve|manual_review|reject) y aiAnalysis.` }
          ]
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { confidence: 0, detectedFaults: [], recommendation: 'manual_review', aiAnalysis: "Falla en nodo visual." };
    }
  },

  getRebalanceStrategy: async (products: Product[]): Promise<RebalanceSuggestion[]> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analiza este stock: ${JSON.stringify(products.map(p => ({ n: p.name, s: p.variants?.[0].inventoryLevels })))}. Sugiere 3 transferencias estratégicas en JSON array.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "[]");
    } catch (e) { return []; }
  }
};
