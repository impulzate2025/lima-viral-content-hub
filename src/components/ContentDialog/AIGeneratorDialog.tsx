import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ContentType, Platform } from '@/types';
import { HookGenerationParams, CompleteContentGenerationParams, GeneratedContent } from '@/lib/ai-generator';
import { Loader2, Copy, Wand2, Sparkles, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const PLATFORMS: Platform[] = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn'];
const CONTENT_TYPES: ContentType[] = [
  'Educativo', 
  'Testimonial', 
  'Controversial', 
  'Predictivo', 
  'Behind-Scenes',
  'Shock',
  'Storytelling', 
  'Polemico',
  'Reto',
  'Autoridad'
];

const CONTENT_TYPE_DESCRIPTIONS = {
  'Educativo': 'Contenido que enseña y aporta valor',
  'Testimonial': 'Casos de éxito y experiencias reales',
  'Controversial': 'Temas que generan debate y discusión',
  'Predictivo': 'Predicciones y tendencias futuras',
  'Behind-Scenes': 'Detrás de cámaras y procesos',
  'Shock': 'Contenido impactante que sorprende',
  'Storytelling': 'Narrativas envolventes y emocionales',
  'Polemico': 'Temas que desafían ideas establecidas',
  'Reto': 'Desafíos y competencias virales',
  'Autoridad': 'Demostración de expertise y liderazgo'
};

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
  const [platform, setPlatform] = useState<Platform>('TikTok');
  const [type, setType] = useState<ContentType>('Educativo');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [context, setContext] = useState('');
  const [viralScoreTarget, setViralScoreTarget] = useState<number>(7);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !audience) {
        toast({
            title: "Campos incompletos",
            description: "Por favor, completa el tema principal y la audiencia objetivo.",
            variant: "destructive"
        });
        return;
    }
    await onGenerate({ platform, type, topic, audience, context, viralScoreTarget });
  };

  const handleGenerateCompleteContent = async () => {
    if (!generatedHook) return;
    
    await onGenerateComplete({
      platform,
      type,
      topic,
      audience,
      context,
      viralScoreTarget,
      hook: generatedHook
    });
  };

  const handleCopyHook = () => {
    if (generatedHook) {
      navigator.clipboard.writeText(generatedHook);
      toast({
        title: "Hook Copiado",
        description: "El gancho generado por IA ha sido copiado al portapapeles."
      });
    }
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
          
          {/* Información sobre el sistema */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">¿Cómo funciona?</p>
              <p>1. Genera un hook con IA</p>
              <p>2. Opcionalmente, genera el contenido completo</p>
              <p>3. Usa "Usar Solo Hook" o "Usar Contenido Completo" para guardarlo</p>
              <p>4. Tu contenido se guardará en la lista y podrás editarlo cuando quieras</p>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">Plataforma</Label>
              <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Selecciona plataforma" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Tipo de Gancho</Label>
              <Select value={type} onValueChange={(value) => setType(value as ContentType)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map(ct => (
                    <SelectItem key={ct} value={ct}>
                      <div className="flex flex-col">
                        <span>{ct}</span>
                        <span className="text-xs text-muted-foreground">
                          {CONTENT_TYPE_DESCRIPTIONS[ct]}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descripción del tipo seleccionado */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>{type}:</strong> {CONTENT_TYPE_DESCRIPTIONS[type]}
            </p>
          </div>

          <div>
            <Label htmlFor="topic">Tema Principal (Obligatorio)</Label>
            <Input 
              id="topic" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              placeholder="Ej: Los 3 distritos de Lima con mayor potencial para 2025" 
            />
          </div>
          <div>
            <Label htmlFor="audience">Audiencia Objetivo (Obligatorio)</Label>
            <Input 
              id="audience" 
              value={audience} 
              onChange={(e) => setAudience(e.target.value)} 
              placeholder="Ej: Jóvenes universitarios, Emprendedores, Inversionistas" 
            />
          </div>
          <div>
            <Label htmlFor="context">Contexto Adicional (Opcional)</Label>
            <Textarea 
              id="context" 
              value={context} 
              onChange={(e) => setContext(e.target.value)} 
              placeholder="Ej: Jóvenes que quieren usar su primer ahorro, tendencias 2025" 
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="viralScoreTarget">Objetivo de Viralidad (1-10)</Label>
            <Input 
              id="viralScoreTarget" 
              type="number" 
              min="1" 
              max="10" 
              value={viralScoreTarget} 
              onChange={(e) => setViralScoreTarget(parseInt(e.target.value, 10))} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              1-3: Bajo impacto | 4-6: Moderado | 7-8: Alto | 9-10: Viral masivo
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Generando hook con IA para 2025...</p>
            </div>
          )}

          {generatedHook && !isLoading && (
            <div className="mt-6 p-4 border rounded-md bg-muted">
              <Label className="font-semibold text-lg">Hook Generado:</Label>
              <p className="mt-2 text-md whitespace-pre-wrap">{generatedHook}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" onClick={handleCopyHook} variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" /> Copiar Hook
                </Button>
                <Button type="button" onClick={handleUseGeneratedHook} size="sm" variant="secondary">
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
            </div>
          )}

          {isGeneratingComplete && (
            <div className="flex items-center justify-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="ml-2 text-purple-700">Generando contenido completo con IA...</p>
            </div>
          )}

          {generatedContent && !isGeneratingComplete && (
            <div className="mt-6 p-4 border rounded-md bg-gradient-to-r from-purple-50 to-blue-50">
              <Label className="font-semibold text-lg text-purple-800">Contenido Completo Generado:</Label>
              
              <div className="mt-4 space-y-4">
                <div>
                  <Label className="font-medium text-purple-700">Script:</Label>
                  <p className="mt-1 text-sm bg-white p-3 rounded border max-h-32 overflow-y-auto">{generatedContent.script}</p>
                </div>
                
                <div>
                  <Label className="font-medium text-purple-700">Elementos Visuales:</Label>
                  <p className="mt-1 text-sm bg-white p-3 rounded border">{generatedContent.visualElements}</p>
                </div>
                
                <div>
                  <Label className="font-medium text-purple-700">Call-to-Action:</Label>
                  <p className="mt-1 text-sm bg-white p-3 rounded border">{generatedContent.cta}</p>
                </div>
                
                <div>
                  <Label className="font-medium text-purple-700">Estrategia de Distribución:</Label>
                  <p className="mt-1 text-sm bg-white p-3 rounded border">{generatedContent.distributionStrategy}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-white rounded border">
                    <Label className="text-xs font-medium text-purple-700">Views Estimadas</Label>
                    <p className="text-lg font-bold text-purple-800">{generatedContent.projectedMetrics.estimatedViews.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded border">
                    <Label className="text-xs font-medium text-purple-700">Engagement</Label>
                    <p className="text-lg font-bold text-purple-800">{generatedContent.projectedMetrics.estimatedEngagement}%</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded border">
                    <Label className="text-xs font-medium text-purple-700">Shares</Label>
                    <p className="text-lg font-bold text-purple-800">{generatedContent.projectedMetrics.estimatedShares}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button 
                  type="button" 
                  onClick={handleUseCompleteGeneratedContent} 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Sparkles className="mr-2 h-5 w-5" /> 
                  Usar Contenido Completo
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading || isGeneratingComplete}>
              Cerrar
            </Button>
            <Button type="submit" disabled={isLoading || isGeneratingComplete || !topic || !audience}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} 
              Generar Hook
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
