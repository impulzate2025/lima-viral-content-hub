
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ViralScoreFilterProps {
  minValue: number | undefined;
  maxValue: number | undefined;
  onChange: (min: number | undefined, max: number | undefined) => void;
}

export function ViralScoreFilter({ minValue, maxValue, onChange }: ViralScoreFilterProps) {
  const [viralScoreRange, setViralScoreRange] = useState<[number, number]>([
    minValue || 0,
    maxValue || 100
  ]);

  // Sincronizar viral score range con el filtro
  useEffect(() => {
    setViralScoreRange([
      minValue || 0,
      maxValue || 100
    ]);
  }, [minValue, maxValue]);

  const handleViralScoreChange = (values: number[]) => {
    console.log('🔍 Viral score range changed to:', values);
    setViralScoreRange([values[0], values[1]]);
    onChange(
      values[0] === 0 ? undefined : values[0],
      values[1] === 100 ? undefined : values[1]
    );
  };

  return (
    <div className="space-y-4">
      <Label>Viral Score: {viralScoreRange[0]} - {viralScoreRange[1]}</Label>
      <Slider
        value={viralScoreRange}
        onValueChange={handleViralScoreChange}
        max={100}
        min={0}
        step={5}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}
