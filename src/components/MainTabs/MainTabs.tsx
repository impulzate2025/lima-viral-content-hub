
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "@/components/Dashboard/Dashboard";
import { BackupRestoreManager } from "@/components/BackupRestoreManager"; // Importar BackupRestoreManager
import { ContentGrid } from "@/components/ContentGrid/ContentGrid";
import { Home, Grid3X3 } from "lucide-react";
import { ContentItem, ContentFilter } from "@/types";

interface MainTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  filteredContents: ContentItem[];
  totalContents: number;
  currentFilter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
  onNewContent: () => void;
  onImportExcel: () => void;
  onExportData: () => void;
  onGenerateAI: () => void;
  onEdit: (content: ContentItem) => void;
  onDelete: (id: string) => void;
  onView: (content: ContentItem) => void;
  onCopy: (content: ContentItem) => void;
  onBulkDelete: (ids: string[]) => void;
  onExportSelected: (ids: string[]) => void;
}

export function MainTabs({
  activeTab,
  onTabChange,
  filteredContents,
  totalContents,
  currentFilter,
  onFilterChange,
  onNewContent,
  onImportExcel,
  onExportData,
  onGenerateAI,
  onEdit,
  onDelete,
  onView,
  onCopy,
  onBulkDelete,
  onExportSelected
}: MainTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="content" className="flex items-center gap-2">
          <Grid3X3 className="h-4 w-4" />
          Contenidos ({filteredContents.length}/{totalContents})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-6">
        <Dashboard
          onNewContent={onNewContent}
          onImportExcel={onImportExcel}
          onExportData={onExportData}
          onGenerateAI={onGenerateAI}
        />
        <div className="mt-8">
          <BackupRestoreManager />
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-6">
        <ContentGrid
          contents={filteredContents}
          filter={currentFilter}
          onFilterChange={onFilterChange}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onCopy={onCopy}
          onBulkDelete={onBulkDelete}
          onExportSelected={onExportSelected}
        />
      </TabsContent>
    </Tabs>
  );
}
