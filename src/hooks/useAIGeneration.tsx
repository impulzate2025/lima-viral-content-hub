
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { aiGenerator, HookGenerationParams, CompleteContentGenerationParams, GeneratedContent } from "@/lib/ai-generator";

export function useAIGeneration() {
  const [isAILoading, setIsAILoading] = useState(false);
  const [isGeneratingComplete, setIsGeneratingComplete] = useState(false);
  const [generatedHook, setGeneratedHook] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const { toast } = useToast();

  const handleGenerateAI = async (params: HookGenerationParams) => {
    console.log('🚀 Kicking off AI generation with params:', params);
    setIsAILoading(true);
    setGeneratedHook(null);
    try {
      const hook = await aiGenerator.generateHook(params);
      setGeneratedHook(hook);
      toast({
        title: "¡Hook Generado!",
        description: "La IA ha generado un nuevo hook para tu contenido."
      });
    } catch (error: any) {
      console.error('❌ Error generating content with AI:', error);
      toast({
        title: "Error de IA",
        description: error.message || "Hubo un problema al generar el contenido con IA.",
        variant: "destructive"
      });
      setGeneratedHook(null);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleGenerateCompleteContent = async (params: CompleteContentGenerationParams) => {
    console.log('🚀 Generando contenido completo con params:', params);
    setIsGeneratingComplete(true);
    setGeneratedContent(null);
    try {
      const content = await aiGenerator.generateCompleteContent(params);
      setGeneratedContent(content);
      toast({
        title: "¡Contenido Completo Generado!",
        description: "La IA ha generado el script, elementos visuales, CTA y estrategia completa."
      });
    } catch (error: any) {
      console.error('❌ Error generating complete content:', error);
      toast({
        title: "Error de IA",
        description: error.message || "Hubo un problema al generar el contenido completo.",
        variant: "destructive"
      });
      setGeneratedContent(null);
    } finally {
      setIsGeneratingComplete(false);
    }
  };

  const clearGeneratedData = () => {
    console.log('🔄 Clearing generated data');
    setGeneratedHook(null);
    setGeneratedContent(null);
  };

  return {
    isAILoading,
    isGeneratingComplete,
    generatedHook,
    generatedContent,
    handleGenerateAI,
    handleGenerateCompleteContent,
    setGeneratedHook,
    setGeneratedContent,
    clearGeneratedData
  };
}
