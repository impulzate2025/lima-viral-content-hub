
import { Button } from '@/components/ui/button';
import { CONTENT_TYPES } from './types';

interface ContentTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export function ContentTypeSelector({ selectedType, onSelect }: ContentTypeSelectorProps) {
  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'Educativo': return '🎓';
      case 'Testimonial': return '⭐';
      case 'Controversial': return '🔥';
      case 'Predictivo': return '🔮';
      case 'Behind-Scenes': return '🎬';
      case 'Tutorial': return '📚';
      default: return '🎭';
    }
  };

  return (
    <div>
      <label className="text-base font-medium mb-3 block">🎭 ¿Qué tipo de contenido?</label>
      <div className="grid grid-cols-2 gap-2">
        {CONTENT_TYPES.map(type => (
          <Button
            key={type}
            type="button"
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => onSelect(type)}
            className="text-sm py-3"
          >
            {getTypeEmoji(type)} {type}
          </Button>
        ))}
      </div>
    </div>
  );
}
