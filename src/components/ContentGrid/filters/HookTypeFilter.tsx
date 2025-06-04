
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HookTypeFilterProps {
  value: string | undefined;
  onChange: (hookType: string | undefined) => void;
}

const HOOK_TYPES = [
  { 
    value: 'shock', 
    label: 'Gancho de Shock', 
    description: 'Contenido impactante que sorprende',
    examples: 'No vas a creer, te va a sorprender'
  },
  { 
    value: 'storytelling', 
    label: 'Gancho de Storytelling', 
    description: 'Narrativas envolventes y emocionales',
    examples: 'Te voy a contar la historia, esta es la historia'
  },
  { 
    value: 'polemico', 
    label: 'Gancho Polémico', 
    description: 'Temas que desafían ideas establecidas',
    examples: 'La verdad que nadie te dice, controversial'
  },
  { 
    value: 'reto', 
    label: 'Gancho de Reto', 
    description: 'Desafíos y competencias virales',
    examples: 'Si puedes, atrévete, reto/challenge'
  },
  { 
    value: 'autoridad', 
    label: 'Gancho de Autoridad', 
    description: 'Demostración de expertise y liderazgo',
    examples: 'Como experto, en mi experiencia, años de experiencia'
  }
];

export function HookTypeFilter({ value, onChange }: HookTypeFilterProps) {
  const selectedHookType = HOOK_TYPES.find(ht => ht.value === value);

  const handleClear = () => {
    console.log('🔍 Clearing hook type filter');
    onChange(undefined);
  };

  const handleChange = (newValue: string) => {
    console.log('🔍 Hook type filter changed to:', newValue);
    if (newValue === 'all' || newValue === '') {
      onChange(undefined);
    } else {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Tipo de Gancho</Label>
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
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar tipo de gancho" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos de gancho</SelectItem>
          {HOOK_TYPES.map(hookType => (
            <SelectItem key={hookType.value} value={hookType.value}>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm">{hookType.label}</span>
                <span className="text-xs text-muted-foreground">{hookType.description}</span>
                <span className="text-xs text-blue-600 italic">Ej: {hookType.examples}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedHookType && (
        <div className="text-xs text-muted-foreground p-3 bg-blue-50 rounded-lg border">
          <div className="space-y-1">
            <div className="font-semibold text-blue-900">{selectedHookType.label}</div>
            <div className="text-blue-700">{selectedHookType.description}</div>
            <div className="text-blue-600 italic">Ejemplos: {selectedHookType.examples}</div>
          </div>
        </div>
      )}
    </div>
  );
}

