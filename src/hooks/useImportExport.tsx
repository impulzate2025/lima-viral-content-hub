
import { useState } from "react";
import { useContentStore } from "@/stores/content-store";
import { useToast } from "@/hooks/use-toast";
import { ContentItem, DialogType } from "@/types";
import { excelProcessor } from "@/lib/excel-processor";
import { initializeSampleData } from "@/lib/database";

export function useImportExport() {
  const [dialogType, setDialogType] = useState<DialogType>('none');

  const {
    contents,
    addContent,
    loadContents
  } = useContentStore();

  const { toast } = useToast();

  const handleImportExcel = () => {
    console.log('🔍 Opening import dialog');
    setDialogType('uploader');
  };

  const handleImportContents = async (importedContents: ContentItem[]) => {
    try {
      console.log('🔍 Importing contents:', importedContents.length);
      await Promise.all(importedContents.map(content => addContent(content)));
      toast({
        title: "Importación exitosa",
        description: `Se importaron ${importedContents.length} contenidos exitosamente.`
      });
      setDialogType('none');
    } catch (error) {
      console.error('❌ Error importing contents:', error);
      toast({
        title: "Error en importación",
        description: "Hubo un problema al importar los contenidos.",
        variant: "destructive"
      });
    }
  };

  const handleExportData = async () => {
    try {
      console.log('🔍 Exporting all contents');
      const blob = await excelProcessor.exportToExcel(contents);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contenidos-virales-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportación exitosa",
        description: "Los contenidos se han exportado a Excel."
      });
    } catch (error) {
      console.error('❌ Error exporting contents:', error);
      toast({
        title: "Error en exportación",
        description: "Hubo un problema al exportar los contenidos.",
        variant: "destructive"
      });
    }
  };

  const handleExportSelected = async (ids: string[]) => {
    try {
      console.log('🔍 Exporting selected contents:', ids);
      const selectedContents = contents.filter(content => ids.includes(content.id));
      const blob = await excelProcessor.exportToExcel(selectedContents);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contenidos-seleccionados-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportación exitosa",
        description: `Se exportaron ${selectedContents.length} contenidos seleccionados.`
      });
    } catch (error) {
      console.error('❌ Error exporting selected contents:', error);
      toast({
        title: "Error en exportación",
        description: "Hubo un problema al exportar los contenidos.",
        variant: "destructive"
      });
    }
  };

  const handleLoadSampleData = async () => {
    try {
      console.log('🔍 Loading sample data manually');
      await initializeSampleData();
      await loadContents();
      toast({
        title: "Datos de prueba cargados",
        description: "Se han cargado los contenidos de prueba exitosamente."
      });
    } catch (error) {
      console.error('❌ Error loading sample data:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al cargar los datos de prueba.",
        variant: "destructive"
      });
    }
  };

  return {
    dialogType,
    handleImportExcel,
    handleImportContents,
    handleExportData,
    handleExportSelected,
    handleLoadSampleData,
    setDialogType
  };
}
