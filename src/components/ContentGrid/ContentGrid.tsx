
import { useState } from "react";
import { ContentTable } from "./ContentTable";
import { FilterPanel } from "./FilterPanel";
import { ContentItem, ContentFilter } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, FileDown, RefreshCw } from "lucide-react";
import { useContentStore } from "@/stores/content-store";

interface ContentGridProps {
  contents: ContentItem[];
  filter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
  onEdit: (content: ContentItem) => void;
  onDelete: (id: string) => void;
  onView: (content: ContentItem) => void;
  onCopy: (content: ContentItem) => void;
  onBulkDelete: (ids: string[]) => void;
  onExportSelected: (ids: string[]) => void;
}

export function ContentGrid({
  contents,
  filter,
  onFilterChange,
  onEdit,
  onDelete,
  onView,
  onCopy,
  onBulkDelete,
  onExportSelected
}: ContentGridProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { clearFilters, loadContents, isLoading } = useContentStore();

  const handleClearFilters = () => {
    console.log('🔍 ContentGrid: Clearing filters');
    clearFilters();
  };

  const handleRefreshData = async () => {
    console.log('🔍 ContentGrid: Refreshing data');
    await loadContents();
  };

  const handleBulkAction = (action: 'delete' | 'export') => {
    if (selectedIds.length === 0) return;
    
    console.log(`🔍 ContentGrid: Bulk ${action} for ${selectedIds.length} items`);
    
    if (action === 'delete') {
      onBulkDelete(selectedIds);
    } else if (action === 'export') {
      onExportSelected(selectedIds);
    }
    
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header con acciones bulk */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Gestión de Contenidos ({contents.length})
              {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <div className="flex gap-2">
              {/* Botón de actualizar datos */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              
              {/* Acciones bulk */}
              {selectedIds.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('export')}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Exportar ({selectedIds.length})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar ({selectedIds.length})
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel de Filtros */}
        <div className="lg:col-span-1">
          <FilterPanel
            filter={filter}
            onFilterChange={onFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Tabla de Contenidos */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <ContentTable
                contents={contents}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                onCopy={onCopy}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
