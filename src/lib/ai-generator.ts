// src/lib/ai-generator.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ContentType, Platform } from '@/types'; // Asegúrate de que las rutas sean correctas

export interface HookGenerationParams {
  platform: Platform;
  type: ContentType;
  topic: string;
  audience: string;
  context: string;
  viralScoreTarget: number; // Añadido para el prompt
}

export class AIContentGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any; // El tipo correcto sería 'GenerativeModel' pero depende del SDK

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API Key for Google Gemini is missing. Please set VITE_GOOGLE_GEMINI_API_KEY in your .env.local file.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  private buildHookPrompt(params: HookGenerationParams): string {
    // Prompt mejorado basado en el mega-prompt y los parámetros
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
    - "Descubrí el point más caleta de Lima para [tema] y no vas a creer lo que pasó..."
    - "¿Cansado de [problema común en Lima]? Esta es la solución que nadie te contó."
    - "El SECRETO para [logro deseado] que los influencers limeños NO quieren que sepas."
    - "3 cosas que ODIARÁS de [situación/lugar en Lima] (la última te sorprenderá)."
    - "Así reaccionaron los limeños cuando [evento inesperado] en [lugar conocido]."

    Genera SOLO el texto del gancho. Debe ser corto, impactante y optimizado para la plataforma indicada.
    No incluyas introducciones como "Aquí tienes un gancho:". Solo el gancho.
    GANCHO VIRAL:
    `;
  }

  async generateHook(params: HookGenerationParams): Promise<string> {
    const prompt = this.buildHookPrompt(params);
    console.log("Sending prompt to AI:", prompt); // Para debugging

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

      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{text: prompt}]}],
        generationConfig,
        safetySettings,
      });
      
      const response = result.response;
      const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      
      if (!generatedText) {
        console.error("AI did not return any text.", response);
        throw new Error("La IA no generó ningún texto. Intenta de nuevo.");
      }
      console.log("AI Response Text:", generatedText);
      return generatedText;
    } catch (error) {
      console.error('Error generating hook with AI:', error);
      if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("API Key de Google Gemini no válida. Verifica tu archivo .env.local y la configuración en Google AI Studio.");
      }
      throw new Error("Error al generar el gancho con IA. Por favor, inténtalo de nuevo más tarde.");
    }
  }
}