
import { Button } from "@/components/ui/button";
import { Plus, Upload, Database } from "lucide-react";

interface MainHeaderProps {
  contentsCount: number;
  onNewContent: () => void;
  onImportExcel: () => void;
  onLoadSampleData: () => void;
}

export function MainHeader({ 
  contentsCount, 
  onNewContent, 
  onImportExcel, 
  onLoadSampleData 
}: MainHeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] rounded-lg flex items-center justify-center text-white font-bold">
              🏠
            </div>
            <div>
              <h1 className="text-xl font-bold">Viral Content Manager</h1>
              <p className="text-sm text-muted-foreground">Real Estate Lima</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={onNewContent} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo
            </Button>
            <Button onClick={onImportExcel} variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            {contentsCount === 0 && (
              <Button onClick={onLoadSampleData} variant="outline" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Datos Prueba
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
