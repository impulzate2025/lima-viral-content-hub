
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchFilterProps {
  value: string | undefined;
  onChange: (search: string | undefined) => void;
}

export function SearchFilter({ value, onChange }: SearchFilterProps) {
  const [searchText, setSearchText] = useState(value || '');

  // Debounce para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText !== value) {
        console.log(`🔍 Search debounce triggered with: "${searchText}"`);
        onChange(searchText || undefined);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText, value, onChange]);

  // Sincronizar search text con el filtro
  useEffect(() => {
    setSearchText(value || '');
  }, [value]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log('🔍 Search input changed to:', inputValue);
    setSearchText(inputValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="search">Buscar</Label>
      <Input
        id="search"
        placeholder="Buscar en hooks, scripts o contexto..."
        value={searchText}
        onChange={handleSearchChange}
      />
      {searchText && (
        <p className="text-xs text-muted-foreground">
          Buscando: "{searchText}"
        </p>
      )}
    </div>
  );
}
