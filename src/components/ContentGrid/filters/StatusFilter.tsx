
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentStatus } from "@/types";

const STATUSES: ContentStatus[] = ['draft', 'ready', 'published', 'archived'];

const STATUS_LABELS = {
  draft: 'Borrador',
  ready: 'Listo',
  published: 'Publicado',
  archived: 'Archivado'
};

interface StatusFilterProps {
  value: ContentStatus | undefined;
  onChange: (status: ContentStatus | undefined) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const handleChange = (selectedValue: string) => {
    console.log('🔍 Status filter changed to:', selectedValue);
    onChange(selectedValue as ContentStatus || undefined);
  };

  return (
    <div className="space-y-2">
      <Label>Estado</Label>
      <Select value={value || undefined} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Todos los estados" />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map(status => (
            <SelectItem key={status} value={status}>
              {STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
