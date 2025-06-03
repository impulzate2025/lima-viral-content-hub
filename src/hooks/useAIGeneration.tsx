
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { aiGenerator, HookGenerationParams } from "@/lib/ai-generator";

export function useAIGeneration() {
  const [isAILoading, setIsAILoading] = useState(false);
  const [generatedHook, setGeneratedHook] = useState<string | null>(null);

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

  return {
    isAILoading,
    generatedHook,
    handleGenerateAI,
    setGeneratedHook
  };
}
