
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API Key for Google Gemini is missing. Please set VITE_GOOGLE_GEMINI_API_KEY in your .env.local file.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private getGenerationConfig(temperature: number = 0.9, maxTokens: number = 2048) {
    return {
      temperature,
      topK: 1,
      topP: 1,
      maxOutputTokens: maxTokens,
    };
  }

  private getSafetySettings() {
    return [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];
  }

  private getAvailableModels(): string[] {
    return [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-1.0-pro'
    ];
  }

  private async initializeModel(): Promise<{ model: any; modelName: string }> {
    const modelsToTry = this.getAvailableModels();
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`🔍 Intentando con modelo: ${modelName}`);
        const modelInstance = this.genAI.getGenerativeModel({ model: modelName });
        return { model: modelInstance, modelName };
      } catch (modelError) {
        console.warn(`⚠️ Modelo '${modelName}' no disponible:`, modelError);
        continue;
      }
    }

    throw new Error("No se pudo inicializar ningún modelo Gemini disponible. Verifica tu API key y conectividad.");
  }

  async generateContent(prompt: string, temperature: number = 0.9, maxTokens: number = 2048): Promise<string> {
    try {
      const generationConfig = this.getGenerationConfig(temperature, maxTokens);
      const safetySettings = this.getSafetySettings();

      const { model: modelInstance, modelName } = await this.initializeModel();
      console.log(`✅ Usando modelo: ${modelName}`);

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

      return generatedText;
    } catch (error) {
      this.handleAPIError(error);
      throw error;
    }
  }

  private handleAPIError(error: any): void {
    console.error('❌ Error al generar contenido con IA:', error);

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

    throw new Error("Error al generar contenido con IA. Por favor, inténtalo de nuevo más tarde.");
  }
}
