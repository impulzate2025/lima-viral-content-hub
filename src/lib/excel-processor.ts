
import * as XLSX from 'xlsx';
import { ContentItem } from '@/types';
import { ExcelMappers } from './excel/excel-mappers';
import { ExcelExporter } from './excel/excel-exporter';

export class ExcelProcessor {
  async processFile(file: File): Promise<ContentItem[]> {
    try {
      const workbook = XLSX.read(await file.arrayBuffer());
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(worksheet);
      
      return rawData.map((row: any) => ExcelMappers.mapRowToContent(row)).filter(Boolean);
    } catch (error) {
      console.error('Error processing Excel file:', error);
      throw new Error('Error al procesar el archivo Excel. Verifica el formato.');
    }
  }
  
  async exportToExcel(contents: ContentItem[]): Promise<Blob> {
    return ExcelExporter.exportToExcel(contents);
  }
  
  processExcelData(data: any[]): Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>[] {
    return ExcelMappers.mapExcelDataToContent(data);
  }
}

export const excelProcessor = new ExcelProcessor();
