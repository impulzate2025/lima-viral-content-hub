
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
    
    // Crear un objeto sin ID para forzar creación de nuevo contenido
    const newContentWithCompleteData = {
      hook: hook,
      script: content.script,
      visualElements: content.visualElements,
      cta: content.cta,
      platform: ['TikTok'], // Valor por defecto
      type: 'Educativo', // Valor por defecto
      duration: '30s',
      tags: [content.distributionStrategy.split(',')[0]?.trim() || 'AI Generated'],
      status: 'draft',
      viralScore: Math.round((content.projectedMetrics.estimatedEngagement * 10) / 100),
      context: `Estrategia: ${content.distributionStrategy}`,
      aiTools: 'Gemini AI - Contenido Completo',
    } as Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>;
    
    // Preservar datos de IA
    aiGeneration.setGeneratedContent(content);
    aiGeneration.setGeneratedHook(hook);
    
    // Abrir editor con contenido completo - sin ID para que se cree como nuevo
    contentCrud.setDialogType('editor');
    contentCrud.setSelectedContent(null); // Pasar null para indicar que es nuevo contenido
    
    // Establecer los datos temporalmente para que el editor los use
    contentCrud.setSelectedContent({
      ...newContentWithCompleteData,
      id: '', // ID vacío para indicar que es nuevo
      createdAt: new Date(),
      updatedAt: new Date(),
      metrics: undefined
    } as ContentItem);
    
    console.log('✅ Content editor opened with complete data for new content');
  };

  const handleUseHookOnly = (hook: string) => {
    console.log('💾 Using hook only:', hook);
    
    // Crear un objeto sin ID para forzar creación de nuevo contenido
    const newContentWithHook = {
        hook: hook,
        platform: ['TikTok'], // Valor por defecto
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
    } as Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>;
    
    // Preservar el hook generado
    aiGeneration.setGeneratedHook(hook);
    
    // Abrir editor con solo el hook - sin ID para que se cree como nuevo
    contentCrud.setDialogType('editor');
    contentCrud.setSelectedContent(null); // Pasar null para indicar que es nuevo contenido
    
    // Establecer los datos temporalmente para que el editor los use
    contentCrud.setSelectedContent({
      ...newContentWithHook,
      id: '', // ID vacío para indicar que es nuevo
      createdAt: new Date(),
      updatedAt: new Date(),
      metrics: undefined
    } as ContentItem);
    
    console.log('✅ Content editor opened with hook only for new content');
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
