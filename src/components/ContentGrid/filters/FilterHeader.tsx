
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import { ContentFilter } from "@/types";

interface FilterHeaderProps {
  filter: ContentFilter;
  onClearFilters: () => void;
}

export function FilterHeader({ filter, onClearFilters }: FilterHeaderProps) {
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
  );
}
