// src/components/BackupRestoreManager/index.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // shadcn/ui button
import { Input } from '@/components/ui/input'; // shadcn/ui input
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { exportDataAsJson, importDataFromJson } from '@/lib/data-backup';
import { toast } from 'sonner'; // Si estás usando sonner para notificaciones
import { useContentStore } from '@/stores/content-store'; // Importar useContentStore

export const BackupRestoreManager: React.FC = () => {
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [isLoadingImport, setIsLoadingImport] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { loadContents } = useContentStore(); // Obtener loadContents del store

  const handleExport = async () => {
    setIsLoadingExport(true);
    try {
      await exportDataAsJson();
      toast.success("Backup de datos exportado con éxito.");
    } catch (error) {
      toast.error("Error al exportar datos. " + (error as Error).message);
    } finally {
      setIsLoadingExport(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Por favor, selecciona un archivo para importar.");
      return;
    }

    setIsLoadingImport(true);
    try {
      // Confirmación adicional antes de sobrescribir
      const confirmImport = window.confirm(
        "¡ADVERTENCIA! Al importar, todos los datos existentes en la aplicación serán ELIMINADOS y reemplazados por los datos del archivo. ¿Estás seguro de que quieres continuar?"
      );
      if (!confirmImport) {
        setIsLoadingImport(false);
        return;
      }

      await importDataFromJson(selectedFile);
      toast.success("Datos importados y restaurados con éxito.");
      loadContents(); // Recargar los datos desde la BD para actualizar la UI
      // O incluso window.location.reload() para un reinicio completo (menos elegante)
    } catch (error) {
      toast.error("Error al importar datos. " + (error as Error).message);
    } finally {
      setIsLoadingImport(false);
      setSelectedFile(null); // Limpiar el input file
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Backups de Datos</CardTitle>
        <CardDescription>
          Exporta tus datos a un archivo JSON o impórtalos para restaurar tu información.
          Tus datos se guardan solo en tu navegador.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sección de Exportación */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Exportar Datos</h3>
          <p className="text-sm text-gray-500">
            Descarga una copia de seguridad de todos tus contenidos y campañas como un archivo JSON.
          </p>
          <Button onClick={handleExport} disabled={isLoadingExport}>
            {isLoadingExport ? 'Exportando...' : 'Exportar Datos (JSON)'}
          </Button>
        </div>

        {/* Sección de Importación */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Importar Datos</h3>
          <p className="text-sm text-gray-500">
            Carga un archivo JSON de backup para restaurar tus datos. Esto SOBREESCRIBIRÁ todos los datos actuales.
          </p>
          <div className="flex items-center space-x-2">
            <Label htmlFor="backup-file" className="sr-only">Archivo JSON</Label>
            <Input id="backup-file" type="file" accept=".json" onChange={handleFileChange} />
            <Button onClick={handleImport} disabled={isLoadingImport || !selectedFile}>
              {isLoadingImport ? 'Importando...' : 'Importar Datos (JSON)'}
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md">
          <p className="font-semibold">⚠️ Advertencia Importante:</p>
          <ul className="list-disc list-inside text-sm mt-1">
            <li>Los backups se guardan en tu equipo. Eres responsable de proteger ese archivo.</li>
            <li>Si limpias la caché del navegador, cambias de navegador o de equipo, los datos locales se perderán a menos que tengas un backup.</li>
            <li>La importación de un backup SOBREESCRIBE los datos actuales.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};