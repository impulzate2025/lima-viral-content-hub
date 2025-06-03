
import { useState } from "react";
import { useContentStore } from "@/stores/content-store";
import { useToast } from "@/hooks/use-toast";
import { ContentItem, DialogType } from "@/types";

export function useContentCrud() {
  const [dialogType, setDialogType] = useState<DialogType>('none');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const {
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
    closeDialog,
    setDialogType,
    setSelectedContent
  };
}
