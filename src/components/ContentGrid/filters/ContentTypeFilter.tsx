
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentType } from "@/types";

const CONTENT_TYPES: ContentType[] = ['Educativo', 'Testimonial', 'Controversial', 'Predictivo', 'Behind-Scenes'];

interface ContentTypeFilterProps {
  value: ContentType | undefined;
  onChange: (type: ContentType | undefined) => void;
}

export function ContentTypeFilter({ value, onChange }: ContentTypeFilterProps) {
  const handleChange = (selectedValue: string) => {
    console.log('🔍 Content type filter changed to:', selectedValue);
    onChange(selectedValue as ContentType || undefined);
  };

  return (
    <div className="space-y-2">
      <Label>Tipo de Contenido</Label>
      <Select value={value || undefined} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Todos los tipos" />
        </SelectTrigger>
        <SelectContent>
          {CONTENT_TYPES.map(type => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
