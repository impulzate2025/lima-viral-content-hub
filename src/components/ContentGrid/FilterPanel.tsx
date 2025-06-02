
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { ContentFilter, Platform, ContentType, Duration, ContentStatus } from "@/types";

interface FilterPanelProps {
  filter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
  onClearFilters: () => void;
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

export function FilterPanel({ filter, onFilterChange, onClearFilters }: FilterPanelProps) {
  const [viralScoreRange, setViralScoreRange] = useState<[number, number]>([
    filter.minViralScore || 0,
    filter.maxViralScore || 100
  ]);

  const handleViralScoreChange = (values: number[]) => {
    setViralScoreRange([values[0], values[1]]);
    onFilterChange({
      ...filter,
      minViralScore: values[0],
      maxViralScore: values[1]
    });
  };

  const hasActiveFilters = Object.keys(filter).some(key => {
    const value = filter[key as keyof ContentFilter];
    return value !== undefined && value !== '' && value !== null;
  });

  const getActiveFilterCount = () => {
    let count = 0;
    if (filter.platform) count++;
    if (filter.type) count++;
    if (filter.duration) count++;
    if (filter.status) count++;
    if (filter.search) count++;
    if (filter.minViralScore !== undefined || filter.maxViralScore !== undefined) count++;
    return count;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </CardTitle>
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Búsqueda */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            placeholder="Buscar en hooks, scripts o contexto..."
            value={filter.search || ''}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
          />
        </div>

        {/* Plataforma */}
        <div className="space-y-2">
          <Label>Plataforma</Label>
          <Select 
            value={filter.platform || undefined} 
            onValueChange={(value) => onFilterChange({ ...filter, platform: value as Platform || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las plataformas" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map(platform => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de Contenido */}
        <div className="space-y-2">
          <Label>Tipo de Contenido</Label>
          <Select 
            value={filter.type || undefined} 
            onValueChange={(value) => onFilterChange({ ...filter, type: value as ContentType || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duración */}
        <div className="space-y-2">
          <Label>Duración</Label>
          <Select 
            value={filter.duration || undefined} 
            onValueChange={(value) => onFilterChange({ ...filter, duration: value as Duration || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las duraciones" />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map(duration => (
                <SelectItem key={duration} value={duration}>
                  {duration}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select 
            value={filter.status || undefined} 
            onValueChange={(value) => onFilterChange({ ...filter, status: value as ContentStatus || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
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

        {/* Viral Score Range */}
        <div className="space-y-4">
          <Label>Viral Score: {viralScoreRange[0]} - {viralScoreRange[1]}</Label>
          <Slider
            value={viralScoreRange}
            onValueChange={handleViralScoreChange}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
