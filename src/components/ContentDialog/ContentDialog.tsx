
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContentEditor } from "@/components/ContentEditor/ContentEditor";
import { FileUploader } from "@/components/FileUploader/FileUploader";
import { ContentItem, DialogType } from "@/types"; // Importar DialogType

// type DialogType = 'none' | 'editor' | 'uploader' | 'viewer'; // Eliminar definición local

interface ContentDialogProps {
  dialogType: DialogType;
  selectedContent: ContentItem | null;
  onSave: (contentData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onImport: (importedContents: ContentItem[]) => Promise<void>;
  onClose: () => void;
  onEdit: (content: ContentItem) => void;
  onCopy: (content: ContentItem) => void;
}

export function ContentDialog({
  dialogType,
  selectedContent,
  onSave,
  onImport,
  onClose,
  onEdit,
  onCopy
}: ContentDialogProps) {
  return (
    <>
      {/* Editor Dialog */}
      <Dialog open={dialogType === 'editor'} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedContent ? 'Editar Contenido' : 'Nuevo Contenido Viral'}
            </DialogTitle>
          </DialogHeader>
          <ContentEditor
            content={selectedContent || undefined}
            onSave={onSave}
            onCancel={onClose}
          />
        </DialogContent>
      </Dialog>

      {/* Uploader Dialog */}
      <Dialog open={dialogType === 'uploader'} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Contenidos desde Excel/CSV</DialogTitle>
          </DialogHeader>
          <FileUploader
            onImport={onImport}
            onCancel={onClose}
          />
        </DialogContent>
      </Dialog>

      {/* Viewer Dialog */}
      <Dialog open={dialogType === 'viewer'} onOpenChange={onClose}>
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
                <Button onClick={() => onEdit(selectedContent)}>
                  Editar Contenido
                </Button>
                <Button variant="outline" onClick={() => onCopy(selectedContent)}>
                  Copiar Hook y Script
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
