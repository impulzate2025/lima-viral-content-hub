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
  private model: any;
  // private modelName: string = 'gemini-pro'; // Comentamos o quitamos esta línea, la determinaremos dinámicamente

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API Key for Google Gemini is missing. Please set VITE_GOOGLE_GEMINI_API_KEY in your .env.local file.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Ya no inicializamos el modelo aquí en el constructor
  }

  // --- COMIENZO DE LA FUNCIÓN A RE-AÑADIR/VERIFICAR ---
  // Este método lista los modelos DISPONIBLES para tu cuenta
  async listAvailableModels(): Promise<any[]> {
    try {
      console.log("🔍 Fetching available AI models...");
      const { models } = await this.genAI.listModels();
      console.log("✅ RAW Available AI models array (for debugging):", models); // <-- MUESTRA EL ARRAY COMPLETO
      console.log("✅ Detailed list of available AI models:");
      models.forEach(model => {
        console.log(`- Model Name: ${model.name}`);
        console.log(`  Description: ${model.description}`);
        console.log(`  Supported Generation Methods: ${model.supportedGenerationMethods?.join(', ')}`);
        console.log(`  Input Token Limit: ${model.inputTokenLimit}`);
        console.log(`  Output Token Limit: ${model.outputTokenLimit}`);
        console.log('---');
      });
      return models;
    } catch (error) {
      console.error("❌ Error listing available AI models:", error);
      throw error;
    }
  }
  // --- FIN DE LA FUNCIÓN A RE-AÑADIR/VERIFICAR ---

  private buildHookPrompt(params: HookGenerationParams): string {
    // ... tu código de prompt (que ya está bien) ...
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

      // --- CAMBIOS EN LA SELECCIÓN DEL MODELO ---
      let modelToUse = 'gemini-1.5-pro'; // ¡Intentemos con gemini-1.5-pro como primer intento!
      let modelInstance: any;

      try {
        modelInstance = this.genAI.getGenerativeModel({ model: modelToUse });
        console.log(`✅ Intentando con modelo: ${modelToUse}`);
      } catch (initialModelError) {
        console.warn(`⚠️ Modelo '${modelToUse}' no disponible directamente o no soportado para generateContent. Buscando alternativas...`, initialModelError);

        // Si el modelo principal falla, listamos y buscamos uno compatible
        const availableModels = await this.listAvailableModels(); // Esto ahora debería loguear la lista completa

        // Buscar un modelo Gemini que soporte 'generateContent'
        const suitableModel = availableModels.find(m =>
          m.supportedGenerationMethods?.includes('generateContent') &&
          m.name.includes('gemini') // Preferimos cualquier modelo Gemini compatible
        );

        if (suitableModel) {
          modelToUse = suitableModel.name;
          modelInstance = this.genAI.getGenerativeModel({ model: modelToUse });
          console.log(`✅ Usando modelo compatible encontrado: ${modelToUse}`);
        } else {
          throw new Error("No se encontró un modelo Gemini compatible para 'generateContent' en tu proyecto. Por favor, revisa la consola de Google Cloud para la disponibilidad de modelos.");
        }
      }

      if (!modelInstance) {
        throw new Error("Fallo al inicializar el modelo de IA. La instancia del modelo es nula.");
      }
      // --- FIN CAMBIOS SELECCIÓN MODELO ---
      
      const result = await modelInstance.generateContent({ // Usamos modelInstance aquí
        contents: [{ role: "user", parts: [{text: prompt}]}],
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
      
      // Manejo de errores más genérico para capturar cualquier fallo de la API
      if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
          throw new Error("API Key de Google Gemini no válida. Verifica tu archivo .env.local.");
        }
        if (error.message.includes('No se encontró un modelo Gemini compatible')) {
           // Este error ya lo manejamos arriba, lo propagamos
           throw error;
        }
        // Capturar cualquier otro error de la API de Google
        if (error.message.includes('GoogleGenerativeAIFetchError')) {
           throw new Error("Error de conexión con la API de Google Gemini. Revisa tu conexión a internet o la consola para detalles: " + (error as Error).message);
        }
      }
      
      throw new Error("Error al generar el gancho con IA. Por favor, inténtalo de nuevo más tarde.");
    }
  }
}

export const aiGenerator = new AIContentGenerator(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY as string);