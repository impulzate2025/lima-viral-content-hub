
import { ContentType, Platform } from '@/types';
import { EnhancedPromptBuilder } from './ai/enhanced-prompt-builder';
import { GeminiClient } from './ai/gemini-client';
import { ResponseProcessor } from './ai/response-processor';
import { ContentQualityValidator } from './content-quality-validator';
import { ContentValidator } from './ai/content-validator';
import { ValidationClient } from './validation-client';
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
    console.log("🚀 Generando hook mejorado con validación backend...");
    
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
      
      console.log(`📝 Hook generado (bruto): "${processedHook}"`);
      
      try {
        // Usar el sistema de validación backend
        const validationResult = await ValidationClient.validateGeneratedContent(processedHook);
        
        if (validationResult.correctedContent) {
          console.log(`🔧 Hook corregido automáticamente: "${validationResult.correctedContent.hook}"`);
          processedHook = validationResult.correctedContent.hook;
        }
        
        // Validar calidad del hook final
        const qualityScore = ContentQualityValidator.validateContent(
          processedHook,
          undefined,
          undefined,
          params.audience
        );
        
        console.log(`📊 Hook final (intento ${attempts}): "${processedHook}"`);
        console.log(`📊 Puntuación de validación backend: ${validationResult.report.totalScore}/100`);
        console.log(`📊 Puntuación de calidad local: ${qualityScore.overall_score}/100`);
        
        // Combinar puntuaciones (validación backend tiene prioridad)
        const combinedScore = Math.min(validationResult.report.totalScore, qualityScore.overall_score);
        
        // Si la calidad es buena o es el último intento, usar este hook
        if (combinedScore > bestScore || attempts === maxAttempts) {
          bestHook = processedHook;
          bestScore = combinedScore;
          bestValidation = validationResult.report;
          
          // Si la calidad es excelente (>85) y pasa validación, no necesitamos más intentos
          if (combinedScore >= 85 && validationResult.isValid) {
            console.log("✅ Hook de alta calidad y validado generado");
            break;
          }
        }
        
        // Si la validación falló crítica, intentar de nuevo
        if (!validationResult.isValid && attempts < maxAttempts) {
          console.log(`🔄 Validación backend falló, reintentando...`);
          continue;
        }
        
      } catch (error) {
        console.error('Error en validación backend, usando validación local:', error);
        
        // Fallback a validación local si falla el backend
        const validation = ContentValidator.validateHook(processedHook);
        
        if (validation.correctedContent) {
          processedHook = validation.correctedContent;
        }
        
        const qualityScore = ContentQualityValidator.validateContent(
          processedHook,
          undefined,
          undefined,
          params.audience
        );
        
        const combinedScore = Math.min(validation.score, qualityScore.overall_score);
        
        if (combinedScore > bestScore || attempts === maxAttempts) {
          bestHook = processedHook;
          bestScore = combinedScore;
          bestValidation = validation;
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
      attempts,
      validationResult: bestValidation
    };
  }

  async generateEnhancedCompleteContent(params: CompleteContentGenerationParams): Promise<{
    content: GeneratedContent;
    qualityScore: any;
    validationResult?: any;
  }> {
    console.log("🚀 Generando contenido completo mejorado con validación backend...");
    
    const prompt = EnhancedPromptBuilder.buildEnhancedCompleteContentPrompt(params);
    const generatedText = await this.geminiClient.generateContent(prompt, 0.8, 4096);
    let processedContent = ResponseProcessor.processCompleteContentResponse(generatedText);
    
    console.log(`📝 Script generado (bruto): "${processedContent.script.substring(0, 100)}..."`);
    
    try {
      // Usar el sistema de validación backend para el script
      const validationResult = await ValidationClient.validateGeneratedContent(params.hook, processedContent.script);
      
      if (validationResult.correctedContent) {
        console.log(`🔧 Script corregido automáticamente`);
        processedContent.script = validationResult.correctedContent.script || processedContent.script;
      }
      
      // Validar calidad del contenido completo
      const qualityScore = ContentQualityValidator.validateContent(
        params.hook,
        processedContent.script,
        processedContent.cta,
        params.audience
      );
      
      console.log(`📊 Contenido completo generado`);
      console.log(`📊 Puntuación de validación backend: ${validationResult.report.totalScore}/100`);
      console.log(`📊 Puntuación de calidad local: ${qualityScore.overall_score}/100`);
      
      if (validationResult.report.recommendations.length > 0) {
        console.log(`💡 Recomendaciones del backend:`, validationResult.report.recommendations);
      }
      
      if (qualityScore.suggestions.length > 0) {
        console.log(`💡 Sugerencias locales:`, qualityScore.suggestions);
      }
      
      console.log("✅ Contenido completo mejorado y validado generado");
      
      return {
        content: processedContent,
        qualityScore,
        validationResult: validationResult.report
      };
      
    } catch (error) {
      console.error('Error en validación backend, usando validación local:', error);
      
      // Fallback a validación local si falla el backend
      const scriptValidation = ContentValidator.validateScript(processedContent.script);
      
      if (scriptValidation.correctedContent) {
        processedContent.script = scriptValidation.correctedContent;
      }
      
      const qualityScore = ContentQualityValidator.validateContent(
        params.hook,
        processedContent.script,
        processedContent.cta,
        params.audience
      );
      
      console.log("✅ Contenido completo generado con validación local");
      
      return {
        content: processedContent,
        qualityScore,
        validationResult: scriptValidation
      };
    }
  }
}

export const enhancedAIGenerator = new EnhancedAIContentGenerator("AIzaSyAXtkhhdIY4nvGAeeXPf_ohqZZYe0HvSiw");
