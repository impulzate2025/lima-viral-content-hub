
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ContentType, Platform } from '@/types';
import { HookGenerationParams } from '@/lib/ai-generator';
import { Loader2, Copy, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: HookGenerationParams) => Promise<void>;
  onUseHook: (hook: string) => void;
  isLoading: boolean;
  generatedHook: string | null;
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

export function AIGeneratorDialog({ isOpen, onClose, onGenerate, onUseHook, isLoading, generatedHook }: AIGeneratorDialogProps) {
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
      onClose(); 
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="mr-2 h-5 w-5 text-primary" /> Generador de Hooks con IA
          </DialogTitle>
          <DialogDescription>
            Completa los detalles para que la IA genere un gancho viral para tu próximo contenido.
          </DialogDescription>
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
              placeholder="Ej: El mejor ceviche de Lima, Inversión inmobiliaria, Marketing digital" 
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
              placeholder="Ej: Temporada de verano, Crisis económica, Tendencia viral actual" 
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
              <p className="ml-2">Generando hook con IA...</p>
            </div>
          )}

          {generatedHook && !isLoading && (
            <div className="mt-6 p-4 border rounded-md bg-muted">
              <Label className="font-semibold text-lg">Hook Generado:</Label>
              <p className="mt-2 text-md whitespace-pre-wrap">{generatedHook}</p>
              <div className="mt-4 flex gap-2">
                <Button type="button" onClick={handleCopyHook} variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" /> Copiar Hook
                </Button>
                <Button type="button" onClick={handleUseGeneratedHook} size="sm">
                  <Wand2 className="mr-2 h-4 w-4" /> Usar este Hook
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
            <Button type="submit" disabled={isLoading || !topic || !audience}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} 
              Generar Hook
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
