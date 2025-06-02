
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Platform } from "@/types";

const PLATFORMS: Platform[] = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn'];

interface PlatformFilterProps {
  value: Platform | undefined;
  onChange: (platform: Platform | undefined) => void;
}

export function PlatformFilter({ value, onChange }: PlatformFilterProps) {
  const handleChange = (selectedValue: string) => {
    console.log('🔍 Platform filter changed to:', selectedValue);
    onChange(selectedValue as Platform || undefined);
  };

  return (
    <div className="space-y-2">
      <Label>Plataforma</Label>
      <Select value={value || undefined} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Todas las plataformas" />
        </SelectTrigger>
        <SelectContent>
          {PLATFORMS.map(platform => (
            <SelectItem key={platform} value={platform}>
              {platform}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
