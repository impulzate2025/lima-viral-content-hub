
import * as XLSX from 'xlsx';
import { ContentItem } from '@/types';
import { ExcelMappers } from './excel-mappers';

export class ExcelExporter {
  static async exportToExcel(contents: ContentItem[]): Promise<Blob> {
    const exportData = ExcelMappers.mapContentToExportData(contents);
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contenidos Virales');
    
    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 15 }, // ID
      { wch: 50 }, // Hook
      { wch: 80 }, // Script
      { wch: 20 }, // Plataformas
      { wch: 15 }, // Tipo
      { wch: 10 }, // Duración
      { wch: 30 }, // Visual
      { wch: 40 }, // Contexto
      { wch: 30 }, // CTA
      { wch: 12 }, // Viral Score
      { wch: 25 }, // AI Tools
      { wch: 12 }, // Estado
      { wch: 15 }, // Fecha
      { wch: 20 }, // Tags
      { wch: 10 }, // Views
      { wch: 12 }, // Engagement
      { wch: 10 }  // Leads
    ];
    worksheet['!cols'] = colWidths;
    
    return new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  }
}
