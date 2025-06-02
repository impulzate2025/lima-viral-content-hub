
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface SearchFilterProps {
  value: string | undefined;
  onChange: (search: string | undefined) => void;
}

export function SearchFilter({ value, onChange }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState(value || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🔍 Search debounce triggered with:', searchTerm);
      onChange(searchTerm || undefined);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('🔍 Search input changed to:', newValue);
    setSearchTerm(newValue);
  };

  return (
    <div className="space-y-2">
      <Label>Buscar</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar en hooks, scripts, contexto..."
          value={searchTerm}
          onChange={handleChange}
          className="pl-10"
        />
      </div>
    </div>
  );
}
