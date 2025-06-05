
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ContentType, Platform } from '@/types';
import { HookGenerationParams, CompleteContentGenerationParams, GeneratedContent } from '@/lib/ai-generator';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIGeneratorForm } from './AIGenerator/AIGeneratorForm';
import { GeneratedHookDisplay } from './AIGenerator/GeneratedHookDisplay';
import { GeneratedContentDisplay } from './AIGenerator/GeneratedContentDisplay';

interface AIGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: HookGenerationParams) => Promise<void>;
  onGenerateComplete: (params: CompleteContentGenerationParams) => Promise<void>;
  onUseHook: (hook: string) => void;
  onUseCompleteContent: (hook: string, content: GeneratedContent) => void;
  isLoading: boolean;
  isGeneratingComplete: boolean;
  generatedHook: string | null;
  generatedContent: GeneratedContent | null;
}

export function AIGeneratorDialog({ 
  isOpen, 
  onClose, 
  onGenerate, 
  onGenerateComplete,
  onUseHook, 
  onUseCompleteContent,
  isLoading, 
  isGeneratingComplete,
  generatedHook, 
  generatedContent 
}: AIGeneratorDialogProps) {
  const [formParams, setFormParams] = useState<Omit<CompleteContentGenerationParams, 'hook'>>({
    platform: 'TikTok',
    type: 'Educativo',
    topic: '',
    audience: '',
    context: '',
    viralScoreTarget: 7
  });
  const { toast } = useToast();

  const handleGenerate = async (params: HookGenerationParams) => {
    setFormParams(params);
    await onGenerate(params);
  };

  const handleUseGeneratedHook = () => {
    if (generatedHook) {
      onUseHook(generatedHook);
      toast({
        title: "Hook Guardado",
        description: "El hook se ha guardado y puedes editarlo en el formulario de contenido."
      });
    }
  };

  const handleUseCompleteGeneratedContent = () => {
    if (generatedHook && generatedContent) {
      onUseCompleteContent(generatedHook, generatedContent);
      toast({
        title: "Contenido Completo Guardado",
        description: "El contenido completo se ha guardado y puedes editarlo en el formulario."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="mr-2 h-5 w-5 text-primary" /> Generador de Contenido Viral con IA
          </DialogTitle>
          <DialogDescription>
            Completa los detalles para que la IA genere un gancho viral y el contenido completo para tu próximo post.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <AIGeneratorForm 
            onGenerate={handleGenerate}
            isLoading={isLoading}
            isGeneratingComplete={isGeneratingComplete}
          />

          {generatedHook && !isLoading && (
            <GeneratedHookDisplay
              generatedHook={generatedHook}
              onCopyHook={() => {}}
              onUseHook={handleUseGeneratedHook}
              onGenerateComplete={onGenerateComplete}
              isGeneratingComplete={isGeneratingComplete}
              formParams={formParams}
            />
          )}

          {generatedContent && !isGeneratingComplete && (
            <GeneratedContentDisplay
              generatedContent={generatedContent}
              onUseCompleteContent={handleUseCompleteGeneratedContent}
            />
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading || isGeneratingComplete}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
