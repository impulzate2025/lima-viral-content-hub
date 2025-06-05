
import { GeneratedContent } from '../ai-generator';

export class ResponseProcessor {
  static processHookResponse(generatedText: string): string {
    if (!generatedText) {
      throw new Error("La IA no generó ningún texto. Intenta de nuevo.");
    }
    return generatedText;
  }

  static processCompleteContentResponse(generatedText: string): GeneratedContent {
    if (!generatedText) {
      throw new Error("La IA no generó contenido completo. Intenta de nuevo.");
    }

    try {
      // Limpiar el texto de posibles marcadores de código
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedContent = JSON.parse(cleanedText);
      
      // Validar estructura
      if (!parsedContent.script || !parsedContent.visualElements || !parsedContent.cta) {
        throw new Error("Estructura de contenido incompleta");
      }

      return parsedContent as GeneratedContent;
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      console.log('Texto recibido:', generatedText);
      throw new Error("Error al procesar el contenido generado. Intenta de nuevo.");
    }
  }
}
