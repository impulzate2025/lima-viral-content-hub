
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ContentItem, Platform, ContentType, Duration, ContentStatus } from "@/types";
import { Save, X, Eye } from "lucide-react";
import { useState } from "react";

const contentSchema = z.object({
  hook: z.string().min(1, "El hook es obligatorio").max(200, "El hook no puede superar 200 caracteres"),
  script: z.string().min(1, "El script es obligatorio"),
  platform: z.array(z.string()).min(1, "Debe seleccionar al menos una plataforma"),
  type: z.string().min(1, "Debe seleccionar un tipo de contenido"),
  duration: z.string().min(1, "Debe seleccionar una duración"),
  visualElements: z.string(),
  context: z.string(),
  cta: z.string(),
  viralScore: z.number().min(0).max(100),
  aiTools: z.string(),
  tags: z.string(),
  status: z.string()
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentEditorProps {
  content?: ContentItem;
  onSave: (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const PLATFORMS: Platform[] = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn'];
const CONTENT_TYPES: ContentType[] = ['Educativo', 'Testimonial', 'Controversial', 'Predictivo', 'Behind-Scenes'];
const DURATIONS: Duration[] = ['15s', '30s', '60s', '3-5min'];
const STATUSES: ContentStatus[] = ['draft', 'ready', 'published', 'archived'];

const STATUS_LABELS = {
  draft: 'Borrador',
  ready: 'Listo',
  published: 'Publicado',
  archived: 'Archivado'
};

export function ContentEditor({ content, onSave, onCancel }: ContentEditorProps) {
  // Determinar si es nuevo contenido (sin ID válido o ID vacío)
  const isNewContent = !content || !content.id || content.id === '';
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(content?.platform || []);
  const [viralScore, setViralScore] = useState<number[]>([content?.viralScore || 50]);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      hook: content?.hook || '',
      script: content?.script || '',
      platform: content?.platform || [],
      type: content?.type || '',
      duration: content?.duration || '',
      visualElements: content?.visualElements || '',
      context: content?.context || '',
      cta: content?.cta || '',
      viralScore: content?.viralScore || 50,
      aiTools: content?.aiTools || '',
      tags: content?.tags.join(', ') || '',
      status: content?.status || 'draft'
    }
  });

  const watchedHook = watch('hook');
  const watchedScript = watch('script');

  const handlePlatformChange = (platform: Platform, checked: boolean) => {
    const newPlatforms = checked 
      ? [...selectedPlatforms, platform]
      : selectedPlatforms.filter(p => p !== platform);
    
    setSelectedPlatforms(newPlatforms);
    setValue('platform', newPlatforms);
  };

  const handleViralScoreChange = (values: number[]) => {
    setViralScore(values);
    setValue('viralScore', values[0]);
  };

  const onSubmit = (data: ContentFormData) => {
    const tags = data.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSave({
      hook: data.hook,
      script: data.script,
      platform: selectedPlatforms,
      type: data.type as ContentType,
      duration: data.duration as Duration,
      visualElements: data.visualElements,
      context: data.context,
      cta: data.cta,
      viralScore: viralScore[0],
      aiTools: data.aiTools,
      tags,
      status: data.status as ContentStatus,
      metrics: content?.metrics
    });
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isNewContent ? 'Nuevo Contenido Viral' : 'Editar Contenido'}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Ocultar Preview' : 'Preview'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna Principal */}
              <div className="space-y-6">
                {/* Hook */}
                <div className="space-y-2">
                  <Label htmlFor="hook">Hook Viral *</Label>
                  <Textarea
                    id="hook"
                    {...register('hook')}
                    placeholder="Escribe un hook que capture atención inmediata..."
                    className="min-h-20"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{errors.hook?.message}</span>
                    <span>{watchedHook?.length || 0}/200 caracteres</span>
                  </div>
                </div>

                {/* Script */}
                <div className="space-y-2">
                  <Label htmlFor="script">Script Completo *</Label>
                  <Textarea
                    id="script"
                    {...register('script')}
                    placeholder="Desarrolla el contenido completo del video/post..."
                    className="min-h-32"
                  />
                  {errors.script && (
                    <p className="text-sm text-red-600">{errors.script.message}</p>
                  )}
                </div>

                {/* Elementos Visuales */}
                <div className="space-y-2">
                  <Label htmlFor="visualElements">Elementos Visuales</Label>
                  <Textarea
                    id="visualElements"
                    {...register('visualElements')}
                    placeholder="Describe los elementos visuales necesarios..."
                    className="min-h-20"
                  />
                </div>

                {/* Contexto */}
                <div className="space-y-2">
                  <Label htmlFor="context">Contexto/Momento</Label>
                  <Textarea
                    id="context"
                    {...register('context')}
                    placeholder="¿Cuándo y dónde usar este contenido?"
                    className="min-h-20"
                  />
                </div>
              </div>

              {/* Columna Secundaria */}
              <div className="space-y-6">
                {/* Plataformas */}
                <div className="space-y-3">
                  <Label>Plataformas * (selecciona al menos una)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PLATFORMS.map(platform => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform}
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                        />
                        <Label htmlFor={platform} className="text-sm font-normal">
                          {platform}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.platform && (
                    <p className="text-sm text-red-600">{errors.platform.message}</p>
                  )}
                </div>

                {/* Tipo de Contenido */}
                <div className="space-y-2">
                  <Label>Tipo de Contenido *</Label>
                  <Select onValueChange={(value) => setValue('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo">
                        {content?.type}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>

                {/* Duración */}
                <div className="space-y-2">
                  <Label>Duración *</Label>
                  <Select onValueChange={(value) => setValue('duration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la duración">
                        {content?.duration}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map(duration => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.duration && (
                    <p className="text-sm text-red-600">{errors.duration.message}</p>
                  )}
                </div>

                {/* Viral Score */}
                <div className="space-y-4">
                  <Label className={`${getViralScoreColor(viralScore[0])}`}>
                    Viral Score: {viralScore[0]}/100
                  </Label>
                  <Slider
                    value={viralScore}
                    onValueChange={handleViralScoreChange}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Bajo</span>
                    <span>Medio</span>
                    <span>Alto</span>
                    <span>Viral</span>
                  </div>
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select onValueChange={(value) => setValue('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado">
                        {content?.status && STATUS_LABELS[content.status]}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(status => (
                        <SelectItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* CTA */}
                <div className="space-y-2">
                  <Label htmlFor="cta">Call to Action</Label>
                  <Input
                    id="cta"
                    {...register('cta')}
                    placeholder="¿Cuál es la acción deseada?"
                  />
                </div>

                {/* AI Tools */}
                <div className="space-y-2">
                  <Label htmlFor="aiTools">Herramientas IA Sugeridas</Label>
                  <Textarea
                    id="aiTools"
                    {...register('aiTools')}
                    placeholder="ChatGPT, Midjourney, etc."
                    className="min-h-16"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (separados por comas)</Label>
                  <Input
                    id="tags"
                    {...register('tags')}
                    placeholder="miraflores, departamento, inversion"
                  />
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Preview del Contenido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">HOOK</h4>
                    <p className="font-medium">{watchedHook || 'Sin hook definido'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">SCRIPT</h4>
                    <p className="text-sm whitespace-pre-wrap">{watchedScript || 'Sin script definido'}</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedPlatforms.map(platform => (
                      <Badge key={platform} variant="secondary">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button type="submit" className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] hover:from-[#44A08D] hover:to-[#4ECDC4] text-white">
                <Save className="h-4 w-4 mr-2" />
                {isNewContent ? 'Guardar' : 'Actualizar'} Contenido
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
