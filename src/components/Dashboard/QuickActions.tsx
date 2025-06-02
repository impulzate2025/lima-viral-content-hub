
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, FileDown, Sparkles } from "lucide-react";

interface QuickActionsProps {
  onNewContent: () => void;
  onImportExcel: () => void;
  onExportData: () => void;
  onGenerateAI: () => void;
}

export function QuickActions({ 
  onNewContent, 
  onImportExcel, 
  onExportData, 
  onGenerateAI 
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          onClick={onNewContent}
          className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] hover:from-[#44A08D] hover:to-[#4ECDC4] text-white h-16 flex flex-col gap-2"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm">Nuevo Contenido</span>
        </Button>
        
        <Button 
          onClick={onImportExcel}
          variant="outline"
          className="h-16 flex flex-col gap-2 hover:bg-blue-50"
        >
          <Upload className="h-5 w-5" />
          <span className="text-sm">Importar Excel</span>
        </Button>
        
        <Button 
          onClick={onExportData}
          variant="outline"
          className="h-16 flex flex-col gap-2 hover:bg-green-50"
        >
          <FileDown className="h-5 w-5" />
          <span className="text-sm">Exportar Datos</span>
        </Button>
        
        <Button 
          onClick={onGenerateAI}
          variant="outline"
          className="h-16 flex flex-col gap-2 hover:bg-purple-50 border-purple-200"
        >
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span className="text-sm text-purple-600">Generar con IA</span>
        </Button>
      </CardContent>
    </Card>
  );
}
