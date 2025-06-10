
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TOPICS_PREDEFINIDOS } from './types';

interface TopicSelectorProps {
  selectedTopic: string;
  onSelect: (topic: string) => void;
}

export function TopicSelector({ selectedTopic, onSelect }: TopicSelectorProps) {
  return (
    <div>
      <label className="text-base font-medium mb-3 block">💡 ¿De qué tema?</label>
      <Select value={selectedTopic} onValueChange={onSelect}>
        <SelectTrigger className="w-full text-base py-6">
          <SelectValue placeholder="🎯 Elige un tema..." />
        </SelectTrigger>
        <SelectContent>
          {TOPICS_PREDEFINIDOS.map(topic => (
            <SelectItem key={topic} value={topic} className="text-base py-3">
              💭 {topic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
