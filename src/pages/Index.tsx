
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader/MainHeader";
import { MainTabs } from "@/components/MainTabs/MainTabs";
import { ContentDialog } from "@/components/ContentDialog/ContentDialog";
import { AIGeneratorDialog } from "@/components/ContentDialog/AIGeneratorDialog";
import { ExcelHelpButton } from "@/components/ExcelGuide/ExcelHelpButton";
import { useContentStore } from "@/stores/content-store";
import { useContentActions } from "@/hooks/useContentActions";
import { ContentItem } from "@/types";

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
    handleOpenAIGenerator,
    handleGenerateAI,
    handleGenerateCompleteContent,
    handleLoadSampleData,
    closeDialog,
    isAILoading,
    isGeneratingComplete,
    generatedHook,
    generatedContent,
    setGeneratedHook,
    setSelectedContent,
    handleUseCompleteContent
  } = useContentActions();

  useEffect(() => {
    console.log('🚀 Index component mounted, loading contents...');
    loadContents();
  }, [loadContents]);

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
          onGenerateAI={handleOpenAIGenerator}
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

      {dialogType === 'aiGenerator' && (
        <AIGeneratorDialog
          isOpen={dialogType === 'aiGenerator'}
          onClose={closeDialog}
          onGenerate={handleGenerateAI}
          onGenerateComplete={handleGenerateCompleteContent}
          onUseHook={(hook) => {
            const newContentWithHook: Partial<ContentItem> = {
                hook: hook,
                platform: [],
                type: 'Educativo',
                duration: '30s',
                script: '',
                tags: [],
                status: 'draft',
                viralScore: 50,
                visualElements: '',
                context: '',
                cta: '',
                aiTools: '',
            };
            handleEditContent(newContentWithHook as ContentItem);
            setGeneratedHook(null);
          }}
          onUseCompleteContent={handleUseCompleteContent}
          isLoading={isAILoading}
          isGeneratingComplete={isGeneratingComplete}
          generatedHook={generatedHook}
          generatedContent={generatedContent}
        />
      )}

      {/* Botón flotante de ayuda para Excel */}
      <ExcelHelpButton />
    </div>
  );
};

export default Index;
