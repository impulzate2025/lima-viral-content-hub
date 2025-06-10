
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ContentItem } from '@/types';
import { NewPlanForm } from './types';
import { ExistingContentSelector } from './ExistingContentSelector';
import { PlatformSelector } from './PlatformSelector';
import { ContentTypeSelector } from './ContentTypeSelector';
import { TopicSelector } from './TopicSelector';
import { PrioritySelector } from './PrioritySelector';

interface AddContentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contents: ContentItem[];
  useExistingContent: boolean;
  setUseExistingContent: (use: boolean) => void;
  selectedContentId: string;
  setSelectedContentId: (id: string) => void;
  newPlan: NewPlanForm;
  setNewPlan: (plan: NewPlanForm) => void;
  onAddPlan: () => void;
}

export function AddContentDialog({
  isOpen,
  onOpenChange,
  contents,
  useExistingContent,
  setUseExistingContent,
  selectedContentId,
  setSelectedContentId,
  newPlan,
  setNewPlan,
  onAddPlan
}: AddContentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
          <Plus className="mr-2 h-6 w-6" />
          ➕ Agregar Contenido Fácil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            🎯 Nuevo Contenido - ¡Súper Fácil!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-4">
          <ExistingContentSelector
            contents={contents}
            selectedContentId={selectedContentId}
            onSelect={setSelectedContentId}
            useExistingContent={useExistingContent}
            onToggle={setUseExistingContent}
          />

          {!useExistingContent && (
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 space-y-4">
              <h3 className="text-lg font-medium text-center">🆕 Crear contenido nuevo</h3>
              
              <PlatformSelector
                selectedPlatform={newPlan.platform}
                onSelect={(platform) => setNewPlan({ ...newPlan, platform })}
              />

              <ContentTypeSelector
                selectedType={newPlan.type}
                onSelect={(type) => setNewPlan({ ...newPlan, type })}
              />

              <TopicSelector
                selectedTopic={newPlan.topic}
                onSelect={(topic) => setNewPlan({ ...newPlan, topic })}
              />
            </div>
          )}

          <PrioritySelector
            selectedPriority={newPlan.priority}
            onSelect={(priority) => setNewPlan({ ...newPlan, priority })}
          />
          
          <Button 
            onClick={onAddPlan} 
            className="w-full text-xl py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={useExistingContent ? !selectedContentId : (!newPlan.platform || !newPlan.topic)}
          >
            ✨ ¡Agregar al Calendario!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
