
import { Card, CardContent } from "@/components/ui/card";
import { ContentFilter } from "@/types";
import { SearchFilter } from "./filters/SearchFilter";
import { PlatformFilter } from "./filters/PlatformFilter";
import { ContentTypeFilter } from "./filters/ContentTypeFilter";
import { DurationFilter } from "./filters/DurationFilter";
import { StatusFilter } from "./filters/StatusFilter";
import { ViralScoreFilter } from "./filters/ViralScoreFilter";
import { HookTypeFilter } from "./filters/HookTypeFilter";
import { FilterHeader } from "./filters/FilterHeader";

interface FilterPanelProps {
  filter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
  onClearFilters: () => void;
}

export function FilterPanel({ filter, onFilterChange, onClearFilters }: FilterPanelProps) {
  const handleFilterChange = (updates: Partial<ContentFilter>) => {
    onFilterChange(updates);
  };

  return (
    <Card className="w-full">
      <FilterHeader filter={filter} onClearFilters={onClearFilters} />
      
      <CardContent className="space-y-6">
        <SearchFilter
          value={filter.search}
          onChange={(search) => handleFilterChange({ search })}
        />

        <PlatformFilter
          value={filter.platform}
          onChange={(platform) => handleFilterChange({ platform })}
        />

        <ContentTypeFilter
          value={filter.type}
          onChange={(type) => handleFilterChange({ type })}
        />

        <HookTypeFilter
          value={filter.hookType}
          onChange={(hookType) => handleFilterChange({ hookType })}
        />

        <DurationFilter
          value={filter.duration}
          onChange={(duration) => handleFilterChange({ duration })}
        />

        <StatusFilter
          value={filter.status}
          onChange={(status) => handleFilterChange({ status })}
        />

        <ViralScoreFilter
          minValue={filter.minViralScore}
          maxValue={filter.maxViralScore}
          onChange={(minViralScore, maxViralScore) => 
            handleFilterChange({ minViralScore, maxViralScore })
          }
        />

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
