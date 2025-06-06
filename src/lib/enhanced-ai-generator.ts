
import { ContentType, Platform } from '@/types';
import { EnhancedPromptBuilder } from './ai/enhanced-prompt-builder';
import { GeminiClient } from './ai/gemini-client';
import { ResponseProcessor } from './ai/response-processor';
import { ContentQualityValidator } from './content-quality-validator';
import { HookGenerationParams, CompleteContentGenerationParams, GeneratedContent } from './ai-generator';

export class EnhancedAIContentGenerator {
  private geminiClient: GeminiClient;

  constructor(apiKey: string) {
    this.geminiClient = new GeminiClient(apiKey);
  }

  async generateEnhancedHook(params: HookGenerationParams): Promise<{
    hook: string;
    qualityScore: any;
    attempts: number;
  }> {
    console.log("🚀 Generando hook mejorado con datos contextuales...");
    
    let attempts = 0;
    let bestHook = '';
    let bestScore = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`🔍 Intento ${attempts}/${maxAttempts}`);
      
      const prompt = EnhancedPromptBuilder.buildEnhancedHookPrompt(params);
      const generatedText = await this.geminiClient.generateContent(prompt, 0.9, 2048);
      const processedHook = ResponseProcessor.processHookResponse(generatedText);
      
      // Validar calidad del hook
      const qualityScore = ContentQualityValidator.validateContent(
        processedHook,
        undefined,
        undefined,
        params.audience
      );
      
      console.log(`📊 Hook generado (intento ${attempts}): "${processedHook}"`);
      console.log(`📊 Puntuación de calidad: ${qualityScore.overall_score}/100`);
      
      // Si la calidad es buena o es el último intento, usar este hook
      if (qualityScore.overall_score > bestScore || attempts === maxAttempts) {
        bestHook = processedHook;
        bestScore = qualityScore.overall_score;
        
        // Si la calidad es excelente (>85), no necesitamos más intentos
        if (qualityScore.overall_score >= 85) {
          console.log("✅ Hook de alta calidad generado");
          return {
            hook: bestHook,
            qualityScore,
            attempts
          };
        }
      }
    }
    
    const finalQualityScore = ContentQualityValidator.validateContent(
      bestHook,
      undefined,
      undefined,
      params.audience
    );
    
    console.log(`✅ Mejor hook generado en ${attempts} intentos (puntuación: ${bestScore})`);
    
    return {
      hook: bestHook,
      qualityScore: finalQualityScore,
      attempts
    };
  }

  async generateEnhancedCompleteContent(params: CompleteContentGenerationParams): Promise<{
    content: GeneratedContent;
    qualityScore: any;
  }> {
    console.log("🚀 Generando contenido completo mejorado con datos contextuales...");
    
    const prompt = EnhancedPromptBuilder.buildEnhancedCompleteContentPrompt(params);
    const generatedText = await this.geminiClient.generateContent(prompt, 0.8, 4096);
    const processedContent = ResponseProcessor.processCompleteContentResponse(generatedText);
    
    // Validar calidad del contenido completo
    const qualityScore = ContentQualityValidator.validateContent(
      params.hook,
      processedContent.script,
      processedContent.cta,
      params.audience
    );
    
    console.log(`📊 Contenido completo generado`);
    console.log(`📊 Puntuación de calidad: ${qualityScore.overall_score}/100`);
    
    if (qualityScore.suggestions.length > 0) {
      console.log(`💡 Sugerencias de mejora:`, qualityScore.suggestions);
    }
    
    console.log("✅ Contenido completo mejorado generado con éxito");
    
    return {
      content: processedContent,
      qualityScore
    };
  }
}

export const enhancedAIGenerator = new EnhancedAIContentGenerator("AIzaSyAXtkhhdIY4nvGAeeXPf_ohqZZYe0HvSiw");
