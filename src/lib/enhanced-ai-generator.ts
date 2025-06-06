
import { ContentType, Platform } from '@/types';
import { EnhancedPromptBuilder } from './ai/enhanced-prompt-builder';
import { GeminiClient } from './ai/gemini-client';
import { ResponseProcessor } from './ai/response-processor';
import { ContentQualityValidator } from './content-quality-validator';
import { ContentValidator } from './ai/content-validator';
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
    validationResult?: any;
  }> {
    console.log("🚀 Generando hook mejorado con validación de calidad...");
    
    let attempts = 0;
    let bestHook = '';
    let bestScore = 0;
    let bestValidation = null;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`🔍 Intento ${attempts}/${maxAttempts}`);
      
      const prompt = EnhancedPromptBuilder.buildEnhancedHookPrompt(params);
      const generatedText = await this.geminiClient.generateContent(prompt, 0.9, 2048);
      let processedHook = ResponseProcessor.processHookResponse(generatedText);
      
      // Validación crítica - Paso 1: Pre-validación
      console.log(`📝 Hook generado (bruto): "${processedHook}"`);
      const validation = ContentValidator.validateHook(processedHook);
      
      // Si hay corrección automática, usar la versión corregida
      if (validation.correctedContent) {
        console.log(`🔧 Hook corregido automáticamente: "${validation.correctedContent}"`);
        processedHook = validation.correctedContent;
      }
      
      // Validar calidad del hook
      const qualityScore = ContentQualityValidator.validateContent(
        processedHook,
        undefined,
        undefined,
        params.audience
      );
      
      console.log(`📊 Hook final (intento ${attempts}): "${processedHook}"`);
      console.log(`📊 Puntuación de validación: ${validation.score}/100`);
      console.log(`📊 Puntuación de calidad: ${qualityScore.overall_score}/100`);
      
      if (validation.issues.length > 0) {
        console.log(`⚠️ Issues detectados:`, validation.issues);
      }
      
      // Combinar puntuaciones (validación tiene prioridad)
      const combinedScore = Math.min(validation.score, qualityScore.overall_score);
      
      // Si la calidad es buena o es el último intento, usar este hook
      if (combinedScore > bestScore || attempts === maxAttempts) {
        bestHook = processedHook;
        bestScore = combinedScore;
        bestValidation = validation;
        
        // Si la calidad es excelente (>85) y pasa validación, no necesitamos más intentos
        if (combinedScore >= 85 && validation.isValid) {
          console.log("✅ Hook de alta calidad y validado generado");
          break;
        }
      }
      
      // Si la validación falló crítica, intentar de nuevo
      if (!validation.isValid && attempts < maxAttempts) {
        console.log(`🔄 Validación falló, reintentando...`);
        continue;
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
      attempts,
      validationResult: bestValidation
    };
  }

  async generateEnhancedCompleteContent(params: CompleteContentGenerationParams): Promise<{
    content: GeneratedContent;
    qualityScore: any;
    validationResult?: any;
  }> {
    console.log("🚀 Generando contenido completo mejorado con validación...");
    
    const prompt = EnhancedPromptBuilder.buildEnhancedCompleteContentPrompt(params);
    const generatedText = await this.geminiClient.generateContent(prompt, 0.8, 4096);
    let processedContent = ResponseProcessor.processCompleteContentResponse(generatedText);
    
    // Validación crítica del script
    console.log(`📝 Script generado (bruto): "${processedContent.script.substring(0, 100)}..."`);
    const scriptValidation = ContentValidator.validateScript(processedContent.script);
    
    // Si hay corrección automática, usar la versión corregida
    if (scriptValidation.correctedContent) {
      console.log(`🔧 Script corregido automáticamente`);
      processedContent.script = scriptValidation.correctedContent;
    }
    
    // Validar calidad del contenido completo
    const qualityScore = ContentQualityValidator.validateContent(
      params.hook,
      processedContent.script,
      processedContent.cta,
      params.audience
    );
    
    console.log(`📊 Contenido completo generado`);
    console.log(`📊 Puntuación de validación script: ${scriptValidation.score}/100`);
    console.log(`📊 Puntuación de calidad general: ${qualityScore.overall_score}/100`);
    
    if (scriptValidation.issues.length > 0) {
      console.log(`⚠️ Issues detectados en script:`, scriptValidation.issues);
    }
    
    if (qualityScore.suggestions.length > 0) {
      console.log(`💡 Sugerencias de mejora:`, qualityScore.suggestions);
    }
    
    console.log("✅ Contenido completo mejorado y validado generado");
    
    return {
      content: processedContent,
      qualityScore,
      validationResult: scriptValidation
    };
  }
}

export const enhancedAIGenerator = new EnhancedAIContentGenerator("AIzaSyAXtkhhdIY4nvGAeeXPf_ohqZZYe0HvSiw");
