
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Wand2, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CompleteContentGenerationParams } from '@/lib/ai-generator';

interface GeneratedHookDisplayProps {
  generatedHook: string;
  onCopyHook: () => void;
  onUseHook: () => void;
  onGenerateComplete: (params: CompleteContentGenerationParams) => Promise<void>;
  isGeneratingComplete: boolean;
  formParams: Omit<CompleteContentGenerationParams, 'hook'>;
}

export function GeneratedHookDisplay({ 
  generatedHook, 
  onCopyHook, 
  onUseHook, 
  onGenerateComplete,
  isGeneratingComplete,
  formParams
}: GeneratedHookDisplayProps) {
  const { toast } = useToast();

  const handleCopyHook = () => {
    navigator.clipboard.writeText(generatedHook);
    toast({
      title: "Hook Copiado",
      description: "El gancho generado por IA ha sido copiado al portapapeles."
    });
  };

  const handleGenerateCompleteContent = async () => {
    await onGenerateComplete({
      ...formParams,
      hook: generatedHook
    });
  };

  return (
    <div className="mt-6 p-4 border rounded-md bg-muted">
      <Label className="font-semibold text-lg">Hook Generado:</Label>
      <p className="mt-2 text-md whitespace-pre-wrap">{generatedHook}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={handleCopyHook} variant="outline" size="sm">
          <Copy className="mr-2 h-4 w-4" /> Copiar Hook
        </Button>
        <Button type="button" onClick={onUseHook} size="sm" variant="secondary">
          <Wand2 className="mr-2 h-4 w-4" /> Usar Solo Hook
        </Button>
        <Button 
          type="button" 
          onClick={handleGenerateCompleteContent} 
          size="sm"
          disabled={isGeneratingComplete}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isGeneratingComplete ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generar el Resto de Contenido
        </Button>
      </div>

      {isGeneratingComplete && (
        <div className="flex items-center justify-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg mt-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="ml-2 text-purple-700">Generando contenido completo con IA...</p>
        </div>
      )}
    </div>
  );
}
