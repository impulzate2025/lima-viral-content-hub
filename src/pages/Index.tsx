
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard/Dashboard";
import { ContentGrid } from "@/components/ContentGrid/ContentGrid";
import { ContentEditor } from "@/components/ContentEditor/ContentEditor";
import { FileUploader } from "@/components/FileUploader/FileUploader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContentStore } from "@/stores/content-store";
import { useToast } from "@/hooks/use-toast";
import { ContentItem } from "@/types";
import { excelProcessor } from "@/lib/excel-processor";
import { Home, Grid3X3, Plus, Upload, FileDown, Sparkles } from "lucide-react";

type DialogType = 'none' | 'editor' | 'uploader' | 'viewer';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dialogType, setDialogType] = useState<DialogType>('none');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  
  const {
    contents,
    filteredContents,
    currentFilter,
    isLoading,
    loadContents,
    addContent,
    updateContent,
    deleteContent,
    setFilter
  } = useContentStore();

  const { toast } = useToast();

  useEffect(() => {
    loadContents();
  }, [loadContents]);

  const handleNewContent = () => {
    setSelectedContent(null);
    setDialogType('editor');
  };

  const handleEditContent = (content: ContentItem) => {
    setSelectedContent(content);
    setDialogType('editor');
  };

  const handleViewContent = (content: ContentItem) => {
    setSelectedContent(content);
    setDialogType('viewer');
  };

  const handleSaveContent = async (contentData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedContent) {
        await updateContent(selectedContent.id, contentData);
        toast({
          title: "Contenido actualizado",
          description: "El contenido se ha actualizado exitosamente."
        });
      } else {
        await addContent(contentData);
        toast({
          title: "Contenido creado",
          description: "El nuevo contenido se ha guardado exitosamente."
        });
      }
      setDialogType('none');
      setSelectedContent(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al guardar el contenido.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      await deleteContent(id);
      toast({
        title: "Contenido eliminado",
        description: "El contenido se ha eliminado exitosamente."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el contenido.",
        variant: "destructive"
      });
    }
  };

  const handleCopyContent = (content: ContentItem) => {
    navigator.clipboard.writeText(`Hook: ${content.hook}\n\nScript: ${content.script}`);
    toast({
      title: "Contenido copiado",
      description: "El hook y script se han copiado al portapapeles."
    });
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => deleteContent(id)));
      toast({
        title: "Contenidos eliminados",
        description: `Se eliminaron ${ids.length} contenidos exitosamente.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar los contenidos.",
        variant: "destructive"
      });
    }
  };

  const handleImportExcel = () => {
    setDialogType('uploader');
  };

  const handleImportContents = async (importedContents: ContentItem[]) => {
    try {
      await Promise.all(importedContents.map(content => addContent(content)));
      toast({
        title: "Importación exitosa",
        description: `Se importaron ${importedContents.length} contenidos exitosamente.`
      });
      setDialogType('none');
    } catch (error) {
      toast({
        title: "Error en importación",
        description: "Hubo un problema al importar los contenidos.",
        variant: "destructive"
      });
    }
  };

  const handleExportData = async () => {
    try {
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
      toast({
        title: "Error en exportación",
        description: "Hubo un problema al exportar los contenidos.",
        variant: "destructive"
      });
    }
  };

  const handleExportSelected = async (ids: string[]) => {
    try {
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
      toast({
        title: "Error en exportación",
        description: "Hubo un problema al exportar los contenidos.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateAI = () => {
    toast({
      title: "Función próximamente",
      description: "La generación con IA estará disponible pronto.",
    });
  };

  const closeDialog = () => {
    setDialogType('none');
    setSelectedContent(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] rounded-lg flex items-center justify-center text-white font-bold">
                🏠
              </div>
              <div>
                <h1 className="text-xl font-bold">Viral Content Manager</h1>
                <p className="text-sm text-muted-foreground">Real Estate Lima</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleNewContent} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo
              </Button>
              <Button onClick={handleImportExcel} variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Contenidos ({contents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard
              onNewContent={handleNewContent}
              onImportExcel={handleImportExcel}
              onExportData={handleExportData}
              onGenerateAI={handleGenerateAI}
            />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentGrid
              contents={filteredContents}
              filter={currentFilter}
              onFilterChange={setFilter}
              onEdit={handleEditContent}
              onDelete={handleDeleteContent}
              onView={handleViewContent}
              onCopy={handleCopyContent}
              onBulkDelete={handleBulkDelete}
              onExportSelected={handleExportSelected}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <Dialog open={dialogType === 'editor'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedContent ? 'Editar Contenido' : 'Nuevo Contenido Viral'}
            </DialogTitle>
          </DialogHeader>
          <ContentEditor
            content={selectedContent || undefined}
            onSave={handleSaveContent}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === 'uploader'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Contenidos desde Excel/CSV</DialogTitle>
          </DialogHeader>
          <FileUploader
            onImport={handleImportContents}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === 'viewer'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vista Previa del Contenido</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">HOOK</h4>
                    <p className="font-medium">{selectedContent.hook}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">SCRIPT</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedContent.script}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">CONTEXTO</h4>
                    <p className="text-sm">{selectedContent.context || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">CTA</h4>
                    <p className="text-sm">{selectedContent.cta || 'No especificado'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">ELEMENTOS VISUALES</h4>
                    <p className="text-sm">{selectedContent.visualElements || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">HERRAMIENTAS IA</h4>
                    <p className="text-sm">{selectedContent.aiTools || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">MÉTRICAS</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Viral Score: {selectedContent.viralScore}/100</div>
                      <div>Duración: {selectedContent.duration}</div>
                      <div>Tipo: {selectedContent.type}</div>
                      <div>Estado: {selectedContent.status}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => {
                  handleEditContent(selectedContent);
                  setDialogType('editor');
                }}>
                  Editar Contenido
                </Button>
                <Button variant="outline" onClick={() => handleCopyContent(selectedContent)}>
                  Copiar Hook y Script
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
