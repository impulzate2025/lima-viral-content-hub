
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Duration } from "@/types";

const DURATIONS: Duration[] = ['15s', '30s', '60s', '3-5min'];

interface DurationFilterProps {
  value: Duration | undefined;
  onChange: (duration: Duration | undefined) => void;
}

export function DurationFilter({ value, onChange }: DurationFilterProps) {
  const handleChange = (selectedValue: string) => {
    console.log('🔍 Duration filter changed to:', selectedValue);
    onChange(selectedValue as Duration || undefined);
  };

  return (
    <div className="space-y-2">
      <Label>Duración</Label>
      <Select value={value || undefined} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Todas las duraciones" />
        </SelectTrigger>
        <SelectContent>
          {DURATIONS.map(duration => (
            <SelectItem key={duration} value={duration}>
              {duration}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
