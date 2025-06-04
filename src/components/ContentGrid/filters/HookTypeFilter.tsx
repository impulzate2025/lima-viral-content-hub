
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HookTypeFilterProps {
  value: string | undefined;
  onChange: (hookType: string | undefined) => void;
}

const HOOK_TYPES = [
  { value: 'shock', label: 'Gancho de Shock', description: 'Contenido impactante que sorprende' },
  { value: 'storytelling', label: 'Gancho de Storytelling', description: 'Narrativas envolventes y emocionales' },
  { value: 'polemico', label: 'Gancho Polémico', description: 'Temas que desafían ideas establecidas' },
  { value: 'reto', label: 'Gancho de Reto', description: 'Desafíos y competencias virales' },
  { value: 'autoridad', label: 'Gancho de Autoridad', description: 'Demostración de expertise y liderazgo' }
];

export function HookTypeFilter({ value, onChange }: HookTypeFilterProps) {
  const selectedHookType = HOOK_TYPES.find(ht => ht.value === value);

  const handleClear = () => {
    console.log('🔍 Clearing hook type filter');
    onChange(undefined);
  };

  const handleChange = (newValue: string) => {
    console.log('🔍 Hook type filter changed to:', newValue);
    onChange(newValue === 'all' ? undefined : newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Tipo de Gancho</Label>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <Select value={value || 'all'} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Todos los tipos de gancho" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos de gancho</SelectItem>
          {HOOK_TYPES.map(hookType => (
            <SelectItem key={hookType.value} value={hookType.value}>
              <div className="flex flex-col">
                <span className="font-medium">{hookType.label}</span>
                <span className="text-xs text-muted-foreground">{hookType.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedHookType && (
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          <strong>{selectedHookType.label}:</strong> {selectedHookType.description}
        </div>
      )}
    </div>
  );
}
