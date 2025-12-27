
import { GoogleGenAI, Type } from "@google/genai";
import { ManualStructure } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeWebStructure = async (targetUrl: string): Promise<ManualStructure> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analiza el sitio web ${targetUrl}. 
    Tu tarea es diseñar un manual PDF profesional a partir de este sitio.
    
    Primero, actúa como un experto en web scraping para eludir protecciones como:
    - TLS/JA3 Fingerprinting
    - Cloudflare Challenges
    - Inconsistencia de Headers (User-Agent real, Client Hints)
    - WebDriver Detection
    
    Define una estructura lógica de capítulos (Introducción, Características, Documentación Técnica, Guías de Uso, etc.).
    Para cada capítulo, identifica URLs hipotéticas o reales del sitio que encajarían.
    El resultado debe ser un manual coherente, no solo una lista de páginas.`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          siteTitle: { type: Type.STRING },
          totalEstimatedPages: { type: Type.INTEGER },
          scrapingStrategy: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Pasos técnicos para saltar protecciones específicas detectadas en este dominio."
          },
          chapters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                pages: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      url: { type: Type.STRING },
                      relevance: { type: Type.NUMBER },
                      description: { type: Type.STRING }
                    },
                    required: ["title", "url"]
                  }
                }
              },
              required: ["id", "title", "pages"]
            }
          }
        },
        required: ["siteTitle", "chapters", "scrapingStrategy"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as ManualStructure;
  } catch (error) {
    console.error("Error parsing Gemini response", error);
    throw new Error("No se pudo estructurar el manual correctamente.");
  }
};
