
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { enhancedAIGenerator } from "@/lib/enhanced-ai-generator";
import { HookGenerationParams, CompleteContentGenerationParams, GeneratedContent } from "@/lib/ai-generator";

export function useAIGeneration() {
  const [isAILoading, setIsAILoading] = useState(false);
  const [isGeneratingComplete, setIsGeneratingComplete] = useState(false);
  const [generatedHook, setGeneratedHook] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [hookQualityScore, setHookQualityScore] = useState<any>(null);
  const [contentQualityScore, setContentQualityScore] = useState<any>(null);
  const [hookValidationResult, setHookValidationResult] = useState<any>(null);
  const [contentValidationResult, setContentValidationResult] = useState<any>(null);

  const { toast } = useToast();

  const handleGenerateAI = async (params: HookGenerationParams) => {
    console.log('🚀 Kicking off enhanced AI generation with params:', params);
    setIsAILoading(true);
    setGeneratedHook(null);
    setHookQualityScore(null);
    setHookValidationResult(null);
    
    try {
      const result = await enhancedAIGenerator.generateEnhancedHook(params);
      setGeneratedHook(result.hook);
      setHookQualityScore(result.qualityScore);
      setHookValidationResult(result.validationResult);
      
      // Mostrar toast con información de calidad
      if (result.validationResult && !result.validationResult.isValid) {
        toast({
          title: "¡Hook Generado con Correcciones!",
          description: `Se aplicaron correcciones automáticas para mejorar la calidad. Puntuación: ${result.qualityScore.overall_score}/100`,
          variant: "default"
        });
      } else {
        toast({
          title: "¡Hook Generado!",
          description: `La IA ha generado un nuevo hook de calidad. Puntuación: ${result.qualityScore.overall_score}/100`,
        });
      }
    } catch (error: any) {
      console.error('❌ Error generating content with enhanced AI:', error);
      toast({
        title: "Error de IA",
        description: error.message || "Hubo un problema al generar el contenido con IA.",
        variant: "destructive"
      });
      setGeneratedHook(null);
      setHookQualityScore(null);
      setHookValidationResult(null);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleGenerateCompleteContent = async (params: CompleteContentGenerationParams) => {
    console.log('🚀 Generando contenido completo mejorado con params:', params);
    setIsGeneratingComplete(true);
    setGeneratedContent(null);
    setContentQualityScore(null);
    setContentValidationResult(null);
    
    try {
      const result = await enhancedAIGenerator.generateEnhancedCompleteContent(params);
      setGeneratedContent(result.content);
      setContentQualityScore(result.qualityScore);
      setContentValidationResult(result.validationResult);
      
      // Mostrar toast con información de calidad
      if (result.validationResult && !result.validationResult.isValid) {
        toast({
          title: "¡Contenido Completo Generado con Correcciones!",
          description: `Se aplicaron correcciones automáticas. Puntuación: ${result.qualityScore.overall_score}/100`,
        });
      } else {
        toast({
          title: "¡Contenido Completo Generado!",
          description: `La IA ha generado contenido de alta calidad. Puntuación: ${result.qualityScore.overall_score}/100`,
        });
      }
    } catch (error: any) {
      console.error('❌ Error generating complete content:', error);
      toast({
        title: "Error de IA",
        description: error.message || "Hubo un problema al generar el contenido completo.",
        variant: "destructive"
      });
      setGeneratedContent(null);
      setContentQualityScore(null);
      setContentValidationResult(null);
    } finally {
      setIsGeneratingComplete(false);
    }
  };

  const clearGeneratedData = () => {
    console.log('🔄 Clearing generated data');
    setGeneratedHook(null);
    setGeneratedContent(null);
    setHookQualityScore(null);
    setContentQualityScore(null);
    setHookValidationResult(null);
    setContentValidationResult(null);
  };

  return {
    isAILoading,
    isGeneratingComplete,
    generatedHook,
    generatedContent,
    hookQualityScore,
    contentQualityScore,
    hookValidationResult,
    contentValidationResult,
    handleGenerateAI,
    handleGenerateCompleteContent,
    setGeneratedHook,
    setGeneratedContent,
    clearGeneratedData
  };
}
