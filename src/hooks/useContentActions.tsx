
import { useContentStore } from "@/stores/content-store";
import { useContentCrud } from "@/hooks/useContentCrud";
import { useAIGeneration } from "@/hooks/useAIGeneration";
import { useImportExport } from "@/hooks/useImportExport";
import { DialogType, ContentItem } from "@/types";
import { GeneratedContent } from "@/lib/ai-generator";

export function useContentActions() {
  const { loadContents } = useContentStore();

  const contentCrud = useContentCrud();
  const aiGeneration = useAIGeneration();
  const importExport = useImportExport();

  const handleOpenAIGenerator = () => {
    console.log('🔍 Opening AI Generator');
    aiGeneration.clearGeneratedData();
    contentCrud.setDialogType('aiGenerator');
  };

  const closeDialog = () => {
    contentCrud.closeDialog();
    importExport.setDialogType('none');
    // NO limpiar los datos generados aquí - mantener para que el usuario pueda volver a usarlos
  };

  // Determine the current dialog type from both hooks
  const getCurrentDialogType = (): DialogType => {
    if (contentCrud.dialogType !== 'none') return contentCrud.dialogType;
    if (importExport.dialogType !== 'none') return importExport.dialogType;
    return 'none';
  };

  const handleUseCompleteContent = (hook: string, content: GeneratedContent) => {
    console.log('💾 Using complete content:', { hook, content });
    
    const newContentWithCompleteData: Partial<ContentItem> = {
      hook: hook,
      script: content.script,
      visualElements: content.visualElements,
      cta: content.cta,
      platform: [],
      type: 'Educativo',
      duration: '30s',
      tags: [content.distributionStrategy.split(',')[0]?.trim() || 'AI Generated'],
      status: 'draft',
      viralScore: Math.round((content.projectedMetrics.estimatedEngagement * 10) / 100),
      context: `Estrategia: ${content.distributionStrategy}`,
      aiTools: 'Gemini AI - Contenido Completo',
    };
    
    // Abre el editor con el contenido completo
    contentCrud.handleEditContent(newContentWithCompleteData as ContentItem);
    
    // Mantener los datos generados para que el usuario pueda reutilizarlos
    console.log('✅ Content editor opened with complete data, keeping AI generated data available');
  };

  const handleUseHookOnly = (hook: string) => {
    console.log('💾 Using hook only:', hook);
    
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
        aiTools: 'Gemini AI - Hook',
    };
    
    contentCrud.handleEditContent(newContentWithHook as ContentItem);
    console.log('✅ Content editor opened with hook only');
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
    handleGenerateCompleteContent: aiGeneration.handleGenerateCompleteContent,
    generatedHook: aiGeneration.generatedHook,
    generatedContent: aiGeneration.generatedContent,
    isAILoading: aiGeneration.isAILoading,
    isGeneratingComplete: aiGeneration.isGeneratingComplete,
    setGeneratedHook: aiGeneration.setGeneratedHook,
    handleUseCompleteContent,
    handleUseHookOnly,
    
    // Utility functions
    closeDialog,
    loadContents,
    setSelectedContent: contentCrud.setSelectedContent
  };
}
