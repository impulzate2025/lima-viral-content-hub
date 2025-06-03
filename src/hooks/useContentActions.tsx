
import { useContentStore } from "@/stores/content-store";
import { useContentCrud } from "@/hooks/useContentCrud";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import { useImportExport } from "@/hooks/useImportExport";
import { DialogType } from "@/types";

export function useContentActions() {
  const { loadContents } = useContentStore();

  const contentCrud = useContentCrud();
  const aiGeneration = useAIGeneration();
  const importExport = useImportExport();

  const handleOpenAIGenerator = () => {
    console.log('🔍 Opening AI Generator');
    aiGeneration.setGeneratedHook(null);
    contentCrud.setDialogType('aiGenerator');
  };

  const closeDialog = () => {
    contentCrud.closeDialog();
    importExport.setDialogType('none');
  };

  // Determine the current dialog type from both hooks
  const getCurrentDialogType = (): DialogType => {
    if (contentCrud.dialogType !== 'none') return contentCrud.dialogType;
    if (importExport.dialogType !== 'none') return importExport.dialogType;
    return 'none';
  };

  return {
    // Dialog state
    dialogType: getCurrentDialogType(),
    selectedContent: contentCrud.selectedContent,
    
    // Content CRUD operations
    handleNewContent: contentCrud.handleNewContent,
    handleEditContent: contentCrud.handleEditContent,
    handleViewContent: contentCrud.handleViewContent,
    handleSaveContent: contentCrud.handleSaveContent,
    handleDeleteContent: contentCrud.handleDeleteContent,
    handleCopyContent: contentCrud.handleCopyContent,
    handleBulkDelete: contentCrud.handleBulkDelete,
    
    // Import/Export operations
    handleImportExcel: importExport.handleImportExcel,
    handleImportContents: importExport.handleImportContents,
    handleExportData: importExport.handleExportData,
    handleExportSelected: importExport.handleExportSelected,
    handleLoadSampleData: importExport.handleLoadSampleData,
    
    // AI Generation
    handleOpenAIGenerator,
    handleGenerateAI: aiGeneration.handleGenerateAI,
    generatedHook: aiGeneration.generatedHook,
    isAILoading: aiGeneration.isAILoading,
    setGeneratedHook: aiGeneration.setGeneratedHook,
    
    // Utility functions
    closeDialog,
    loadContents,
    setSelectedContent: contentCrud.setSelectedContent
  };
}
