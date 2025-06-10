
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentItem } from '@/types';

interface ExistingContentSelectorProps {
  contents: ContentItem[];
  selectedContentId: string;
  onSelect: (contentId: string) => void;
  useExistingContent: boolean;
  onToggle: (use: boolean) => void;
}

export function ExistingContentSelector({ 
  contents, 
  selectedContentId, 
  onSelect, 
  useExistingContent, 
  onToggle 
}: ExistingContentSelectorProps) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
      <div className="flex items-center space-x-3 mb-4">
        <input
          type="checkbox"
          id="useExisting"
          checked={useExistingContent}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5"
        />
        <label htmlFor="useExisting" className="text-lg font-medium">
          📋 Usar contenido que ya tienes
        </label>
      </div>

      {useExistingContent && (
        <Select value={selectedContentId} onValueChange={onSelect}>
          <SelectTrigger className="w-full text-lg py-6">
            <SelectValue placeholder="🔍 Elige tu contenido..." />
          </SelectTrigger>
          <SelectContent>
            {contents.map(content => (
              <SelectItem key={content.id} value={content.id} className="text-base py-3">
                📝 {content.hook.substring(0, 60)}...
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
