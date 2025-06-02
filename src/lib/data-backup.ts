// src/lib/data-backup.ts
import { db } from './database'; // Tu instancia de Dexie
import { ContentItem, Campaign } from '@/types'; // Asegúrate de la ruta

interface AppDataBackup {
  contents: ContentItem[];
  campaigns: Campaign[];
  // Cualquier otra tabla que quieras respaldar
}

export async function exportDataAsJson(filename: string = 'vcm_backup.json'): Promise<void> {
  try {
    const allContents = await db.contents.toArray();
    const allCampaigns = await db.campaigns.toArray();

    const dataToBackup: AppDataBackup = {
      contents: allContents,
      campaigns: allCampaigns,
    };

    const jsonString = JSON.stringify(dataToBackup, null, 2); // null, 2 para formato legible
    const blob = new Blob([jsonString], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); // Necesario para que Safari funcione
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Liberar la URL del objeto

    console.log("Backup JSON generado y descargado con éxito.");
    // Aquí puedes añadir una notificación Toast al usuario
  } catch (error) {
    console.error("Error al exportar datos JSON:", error);
    // Notificación de error al usuario
    throw error; // Propagar el error para manejo en la UI
  }
}

export async function importDataFromJson(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!file || file.type !== 'application/json') {
      reject(new Error("Por favor, selecciona un archivo JSON válido."));
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const jsonString = event.target?.result as string;
        const backupData: AppDataBackup = JSON.parse(jsonString);

        // Empezar una transacción para asegurar la atomicidad
        await db.transaction('rw', db.contents, db.campaigns, async () => {
          // Borrar tablas existentes antes de importar
          await db.contents.clear();
          await db.campaigns.clear();

          // Añadir los datos importados
          if (backupData.contents && backupData.contents.length > 0) {
            // Es importante asegurarse de que las fechas se rehidraten como objetos Date
            const contentsToAdd = backupData.contents.map(item => ({
              ...item,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt)
            }));
            await db.contents.bulkAdd(contentsToAdd);
          }
          if (backupData.campaigns && backupData.campaigns.length > 0) {
            const campaignsToAdd = backupData.campaigns.map(item => ({
              ...item,
              startDate: new Date(item.startDate),
              endDate: item.endDate ? new Date(item.endDate) : undefined
            }));
            await db.campaigns.bulkAdd(campaignsToAdd);
          }
        });

        console.log("Datos JSON importados y restaurados con éxito.");
        resolve();
        // Aquí puedes añadir una notificación Toast de éxito
        // Y quizás recargar los datos en el store de Zustand si es necesario
      } catch (error) {
        console.error("Error al importar datos JSON:", error);
        reject(new Error("Error al procesar el archivo JSON: " + (error as Error).message));
      }
    };

    reader.onerror = () => {
      console.error("Error al leer el archivo.");
      reject(new Error("Error al leer el archivo."));
    };

    reader.readAsText(file);
  });
}