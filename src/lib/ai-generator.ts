
// src/lib/ai-generator.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ContentType, Platform } from '@/types';

export interface HookGenerationParams {
  platform: Platform;
  type: ContentType;
  topic: string;
  audience: string;
  context: string;
  viralScoreTarget: number;
}

export class AIContentGenerator {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API Key for Google Gemini is missing. Please set VITE_GOOGLE_GEMINI_API_KEY in your .env.local file.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private buildHookPrompt(params: HookGenerationParams): string {
    return `
    Eres un experto en marketing viral y creación de contenido para redes sociales en Lima, Perú.
    Tu tarea es generar un gancho (hook) extremadamente viral y atractivo para un contenido específico.

    Plataforma: ${params.platform}
    Tipo de Contenido: ${params.type}
    Tema Principal: ${params.topic}
    Audiencia Objetivo: ${params.audience}
    Contexto Adicional: ${params.context}
    Objetivo de Viralidad (Escala 1-10, donde 10 es máximo viral): ${params.viralScoreTarget}

    Considera los siguientes elementos para maximizar la viralidad en Lima:
    - Curiosidad: Genera intriga desde el primer segundo.
    - Emoción: Conecta con emociones fuertes (sorpresa, humor, indignación, inspiración).
    - Relevancia Local: Usa jergas, lugares, situaciones o tendencias conocidas en Lima y Perú.
    - Brevedad y Directo al Grano: Especialmente para TikTok e Instagram Reels.
    - Controversia (si aplica y es apropiado para el tipo de contenido): Temas que generen debate.
    - Storytelling: Insinúa una historia interesante.
    - Beneficio Claro o Problema Resuelto: ¿Qué ganará el espectador al ver el contenido?
    - Llamada a la Interacción Implícita: Que invite a comentar o compartir.

    Ejemplos de Ganchos Virales para Inspiración (NO los copies, solo úsalos como referencia de estilo y efectividad):
    - "¿Sabías que hay un distrito en Lima donde S/100,000 te dan más rentabilidad que Miraflores?"
    - "Los brokers de Lima me van a odiar por decir esto..."
    - "Esta chica compró en Pueblo Libre con S/50K de inicial. 18 meses después..."
    
    Genera SOLO el texto del gancho. Debe ser corto, impactante y optimizado para la plataforma indicada.
    No incluyas introducciones como "Aquí tienes un gancho:". Solo el gancho.
    `;
  }

  async generateHook(params: HookGenerationParams): Promise<string> {
    const prompt = this.buildHookPrompt(params);
    console.log("Enviando prompt a la IA...");

    try {
      const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };

      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ];

      // Lista de modelos a intentar (orden de preferencia)
      const modelsToTry = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-1.0-pro'
      ];

      let modelInstance: any;
      let modelUsed = '';

      // Intentar con cada modelo hasta encontrar uno que funcione
      for (const modelName of modelsToTry) {
        try {
          console.log(`🔍 Intentando con modelo: ${modelName}`);
          modelInstance = this.genAI.getGenerativeModel({ model: modelName });
          modelUsed = modelName;
          break;
        } catch (modelError) {
          console.warn(`⚠️ Modelo '${modelName}' no disponible:`, modelError);
          continue;
        }
      }

      if (!modelInstance) {
        throw new Error("No se pudo inicializar ningún modelo Gemini disponible. Verifica tu API key y conectividad.");
      }

      console.log(`✅ Usando modelo: ${modelUsed}`);

      const result = await modelInstance.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      const response = result.response;
      const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      if (!generatedText) {
        console.error("La IA no devolvió ningún texto.", response);
        throw new Error("La IA no generó ningún texto. Intenta de nuevo.");
      }

      console.log("✅ Texto generado con éxito");
      return generatedText;
    } catch (error) {
      console.error('❌ Error al generar el gancho con IA:', error);

      if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.includes('invalid')) {
          throw new Error("API Key de Google Gemini no válida. Verifica tu archivo .env.local.");
        }
        if (error.message.includes('quota') || error.message.includes('limit')) {
          throw new Error("Has alcanzado el límite de uso de la API de Gemini. Intenta más tarde.");
        }
        if (error.message.includes('PERMISSION_DENIED')) {
          throw new Error("Permisos denegados. Verifica que tu API key tenga acceso a Gemini API.");
        }
      }

      throw new Error("Error al generar el gancho con IA. Por favor, inténtalo de nuevo más tarde.");
    }
  }
}

export const aiGenerator = new AIContentGenerator("AIzaSyAXtkhhdIY4nvGAeeXPf_ohqZZYe0HvSiw");
