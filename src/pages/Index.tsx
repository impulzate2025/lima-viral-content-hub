
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader/MainHeader";
import { MainTabs } from "@/components/MainTabs/MainTabs";
import { ContentDialog } from "@/components/ContentDialog/ContentDialog";
import { useContentStore } from "@/stores/content-store";
import { useContentActions } from "@/hooks/useContentActions";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    contents,
    filteredContents,
    currentFilter,
    loadContents,
    setFilter
  } = useContentStore();

  const {
    dialogType,
    selectedContent,
    handleNewContent,
    handleEditContent,
    handleViewContent,
    handleSaveContent,
    handleDeleteContent,
    handleCopyContent,
    handleBulkDelete,
    handleImportExcel,
    handleImportContents,
    handleExportData,
    handleExportSelected,
    handleGenerateAI,
    handleLoadSampleData,
    closeDialog
  } = useContentActions();

  useEffect(() => {
    console.log('🚀 Index component mounted, loading contents...');
    loadContents();
  }, [loadContents]);

  // Debug: Log state changes
  useEffect(() => {
    console.log(`📊 Contents state updated: ${contents.length} total, ${filteredContents.length} filtered`);
  }, [contents, filteredContents]);

  useEffect(() => {
    console.log('📊 Current filter state:', currentFilter);
  }, [currentFilter]);

  return (
    <div className="min-h-screen bg-background">
      <MainHeader
        contentsCount={contents.length}
        onNewContent={handleNewContent}
        onImportExcel={handleImportExcel}
        onLoadSampleData={handleLoadSampleData}
      />

      <main className="container mx-auto px-4 py-6">
        <MainTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          filteredContents={filteredContents}
          totalContents={contents.length}
          currentFilter={currentFilter}
          onFilterChange={setFilter}
          onNewContent={handleNewContent}
          onImportExcel={handleImportExcel}
          onExportData={handleExportData}
          onGenerateAI={handleGenerateAI}
          onEdit={handleEditContent}
          onDelete={handleDeleteContent}
          onView={handleViewContent}
          onCopy={handleCopyContent}
          onBulkDelete={handleBulkDelete}
          onExportSelected={handleExportSelected}
        />
      </main>

      <ContentDialog
        dialogType={dialogType}
        selectedContent={selectedContent}
        onSave={handleSaveContent}
        onImport={handleImportContents}
        onClose={closeDialog}
        onEdit={handleEditContent}
        onCopy={handleCopyContent}
      />
    </div>
  );
};

export default Index;
