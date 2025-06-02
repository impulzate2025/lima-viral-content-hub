
import { useState } from "react";
import { useContentStore } from "@/stores/content-store";
import { useToast } from "@/hooks/use-toast";
import { ContentItem } from "@/types";
import { excelProcessor } from "@/lib/excel-processor";
import { initializeSampleData } from "@/lib/database";

type DialogType = 'none' | 'editor' | 'uploader' | 'viewer';

export function useContentActions() {
  const [dialogType, setDialogType] = useState<DialogType>('none');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const {
    contents,
    addContent,
    updateContent,
    deleteContent,
    loadContents
  } = useContentStore();

  const { toast } = useToast();

  const handleNewContent = () => {
    console.log('🔍 Opening new content editor');
    setSelectedContent(null);
    setDialogType('editor');
  };

  const handleEditContent = (content: ContentItem) => {
    console.log('🔍 Opening content editor for:', content.id);
    setSelectedContent(content);
    setDialogType('editor');
  };

  const handleViewContent = (content: ContentItem) => {
    console.log('🔍 Opening content viewer for:', content.id);
    setSelectedContent(content);
    setDialogType('viewer');
  };

  const handleSaveContent = async (contentData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedContent) {
        console.log('🔍 Updating existing content:', selectedContent.id);
        await updateContent(selectedContent.id, contentData);
        toast({
          title: "Contenido actualizado",
          description: "El contenido se ha actualizado exitosamente."
        });
      } else {
        console.log('🔍 Creating new content');
        await addContent(contentData);
        toast({
          title: "Contenido creado",
          description: "El nuevo contenido se ha guardado exitosamente."
        });
      }
      setDialogType('none');
      setSelectedContent(null);
    } catch (error) {
      console.error('❌ Error saving content:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar el contenido.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      console.log('🔍 Deleting content:', id);
      await deleteContent(id);
      toast({
        title: "Contenido eliminado",
        description: "El contenido se ha eliminado exitosamente."
      });
    } catch (error) {
      console.error('❌ Error deleting content:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el contenido.",
        variant: "destructive"
      });
    }
  };

  const handleCopyContent = (content: ContentItem) => {
    const textToCopy = `Hook: ${content.hook}\n\nScript: ${content.script}`;
    navigator.clipboard.writeText(textToCopy);
    console.log('📋 Content copied to clipboard');
    toast({
      title: "Contenido copiado",
      description: "El hook y script se han copiado al portapapeles."
    });
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      console.log('🔍 Bulk deleting contents:', ids);
      await Promise.all(ids.map(id => deleteContent(id)));
      toast({
        title: "Contenidos eliminados",
        description: `Se eliminaron ${ids.length} contenidos exitosamente.`
      });
    } catch (error) {
      console.error('❌ Error bulk deleting contents:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar los contenidos.",
        variant: "destructive"
      });
    }
  };

  const handleImportExcel = () => {
    console.log('🔍 Opening import dialog');
    setDialogType('uploader');
  };

  const handleImportContents = async (importedContents: ContentItem[]) => {
    try {
      console.log('🔍 Importing contents:', importedContents.length);
      await Promise.all(importedContents.map(content => addContent(content)));
      toast({
        title: "Importación exitosa",
        description: `Se importaron ${importedContents.length} contenidos exitosamente.`
      });
      setDialogType('none');
    } catch (error) {
      console.error('❌ Error importing contents:', error);
      toast({
        title: "Error en importación",
        description: "Hubo un problema al importar los contenidos.",
        variant: "destructive"
      });
    }
  };

  const handleExportData = async () => {
    try {
      console.log('🔍 Exporting all contents');
      const blob = await excelProcessor.exportToExcel(contents);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contenidos-virales-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportación exitosa",
        description: "Los contenidos se han exportado a Excel."
      });
    } catch (error) {
      console.error('❌ Error exporting contents:', error);
      toast({
        title: "Error en exportación",
        description: "Hubo un problema al exportar los contenidos.",
        variant: "destructive"
      });
    }
  };

  const handleExportSelected = async (ids: string[]) => {
    try {
      console.log('🔍 Exporting selected contents:', ids);
      const selectedContents = contents.filter(content => ids.includes(content.id));
      const blob = await excelProcessor.exportToExcel(selectedContents);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contenidos-seleccionados-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportación exitosa",
        description: `Se exportaron ${selectedContents.length} contenidos seleccionados.`
      });
    } catch (error) {
      console.error('❌ Error exporting selected contents:', error);
      toast({
        title: "Error en exportación",
        description: "Hubo un problema al exportar los contenidos.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateAI = () => {
    console.log('🔍 AI generation requested');
    toast({
      title: "Función próximamente",
      description: "La generación con IA estará disponible pronto.",
    });
  };

  const handleLoadSampleData = async () => {
    try {
      console.log('🔍 Loading sample data manually');
      await initializeSampleData();
      await loadContents();
      toast({
        title: "Datos de prueba cargados",
        description: "Se han cargado los contenidos de prueba exitosamente."
      });
    } catch (error) {
      console.error('❌ Error loading sample data:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al cargar los datos de prueba.",
        variant: "destructive"
      });
    }
  };

  const closeDialog = () => {
    setDialogType('none');
    setSelectedContent(null);
  };

  return {
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
  };
}
