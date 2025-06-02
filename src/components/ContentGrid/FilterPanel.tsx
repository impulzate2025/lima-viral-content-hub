
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [searchText, setSearchText] = useState(filter.search || '');

  // Debounce para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText !== filter.search) {
        console.log(`🔍 Search debounce triggered with: "${searchText}"`);
        onFilterChange({ search: searchText || undefined });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText, filter.search, onFilterChange]);

  // Sincronizar viral score range con el filtro
  useEffect(() => {
    setViralScoreRange([
      filter.minViralScore || 0,
      filter.maxViralScore || 100
    ]);
  }, [filter.minViralScore, filter.maxViralScore]);

  // Sincronizar search text con el filtro
  useEffect(() => {
    setSearchText(filter.search || '');
  }, [filter.search]);

  const handleViralScoreChange = (values: number[]) => {
    console.log('🔍 Viral score range changed to:', values);
    setViralScoreRange([values[0], values[1]]);
    onFilterChange({
      minViralScore: values[0] === 0 ? undefined : values[0],
      maxViralScore: values[1] === 100 ? undefined : values[1]
    });
  };

  const handlePlatformChange = (value: string) => {
    console.log('🔍 Platform filter changed to:', value);
    onFilterChange({ platform: value as Platform || undefined });
  };

  const handleTypeChange = (value: string) => {
    console.log('🔍 Content type filter changed to:', value);
    onFilterChange({ type: value as ContentType || undefined });
  };

  const handleDurationChange = (value: string) => {
    console.log('🔍 Duration filter changed to:', value);
    onFilterChange({ duration: value as Duration || undefined });
  };

  const handleStatusChange = (value: string) => {
    console.log('🔍 Status filter changed to:', value);
    onFilterChange({ status: value as ContentStatus || undefined });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('🔍 Search input changed to:', value);
    setSearchText(value);
  };

  const handleClearFilters = () => {
    console.log('🔍 Clearing all filters');
    setSearchText('');
    setViralScoreRange([0, 100]);
    onClearFilters();
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
    if (filter.minViralScore !== undefined || filter.maxViralScore !== undefined) {
      // Solo contar si no son los valores por defecto
      if (filter.minViralScore !== 0 || filter.maxViralScore !== 100) count++;
    }
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
              onClick={handleClearFilters}
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
            value={searchText}
            onChange={handleSearchChange}
          />
          {searchText && (
            <p className="text-xs text-muted-foreground">
              Buscando: "{searchText}"
            </p>
          )}
        </div>

        {/* Plataforma */}
        <div className="space-y-2">
          <Label>Plataforma</Label>
          <Select 
            value={filter.platform || undefined} 
            onValueChange={handlePlatformChange}
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
            onValueChange={handleTypeChange}
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
            onValueChange={handleDurationChange}
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
            onValueChange={handleStatusChange}
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

        {/* Debug Info - Solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <strong>Debug - Current Filter:</strong>
            <pre>{JSON.stringify(filter, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
