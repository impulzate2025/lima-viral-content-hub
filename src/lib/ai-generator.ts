
import { ContentType, Platform } from '@/types';
import { PromptBuilder } from './ai/prompt-builder';
import { GeminiClient } from './ai/gemini-client';
import { ResponseProcessor } from './ai/response-processor';

export interface HookGenerationParams {
  platform: Platform;
  type: ContentType;
  topic: string;
  audience: string;
  context: string;
  viralScoreTarget: number;
}

export interface CompleteContentGenerationParams extends HookGenerationParams {
  hook: string;
}

export interface GeneratedContent {
  script: string;
  visualElements: string;
  cta: string;
  distributionStrategy: string;
  projectedMetrics: {
    estimatedViews: number;
    estimatedEngagement: number;
    estimatedShares: number;
  };
}

export class AIContentGenerator {
  private geminiClient: GeminiClient;

  constructor(apiKey: string) {
    this.geminiClient = new GeminiClient(apiKey);
  }

  async generateHook(params: HookGenerationParams): Promise<string> {
    console.log("Enviando prompt a la IA...");
    
    const prompt = PromptBuilder.buildHookPrompt(params);
    const generatedText = await this.geminiClient.generateContent(prompt, 0.9, 2048);
    
    const processedHook = ResponseProcessor.processHookResponse(generatedText);
    console.log("✅ Hook generado con éxito");
    
    return processedHook;
  }

  async generateCompleteContent(params: CompleteContentGenerationParams): Promise<GeneratedContent> {
    console.log("🚀 Generando contenido completo con IA...");
    
    const prompt = PromptBuilder.buildCompleteContentPrompt(params);
    const generatedText = await this.geminiClient.generateContent(prompt, 0.8, 4096);
    
    const processedContent = ResponseProcessor.processCompleteContentResponse(generatedText);
    console.log("✅ Contenido completo generado con éxito");
    
    return processedContent;
  }
}

export const aiGenerator = new AIContentGenerator("AIzaSyAXtkhhdIY4nvGAeeXPf_ohqZZYe0HvSiw");
