
import { Button } from '@/components/ui/button';

interface PrioritySelectorProps {
  selectedPriority: 'low' | 'medium' | 'high';
  onSelect: (priority: 'low' | 'medium' | 'high') => void;
}

export function PrioritySelector({ selectedPriority, onSelect }: PrioritySelectorProps) {
  return (
    <div>
      <label className="text-base font-medium mb-3 block">⚡ ¿Qué tan importante es?</label>
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant={selectedPriority === 'low' ? "default" : "outline"}
          onClick={() => onSelect('low')}
          className="text-base py-4 bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
        >
          🟢 Tranquilo
        </Button>
        <Button
          type="button"
          variant={selectedPriority === 'medium' ? "default" : "outline"}
          onClick={() => onSelect('medium')}
          className="text-base py-4 bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
        >
          🟡 Normal
        </Button>
        <Button
          type="button"
          variant={selectedPriority === 'high' ? "default" : "outline"}
          onClick={() => onSelect('high')}
          className="text-base py-4 bg-red-100 border-red-300 text-red-800 hover:bg-red-200"
        >
          🔴 Urgente
        </Button>
      </div>
    </div>
  );
}
