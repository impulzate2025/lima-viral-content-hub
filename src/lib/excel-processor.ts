
import * as XLSX from 'xlsx';
import { ContentItem, Platform, ContentType, Duration, ContentStatus } from '@/types';
import { generateId } from './database';

export class ExcelProcessor {
  async processFile(file: File): Promise<ContentItem[]> {
    try {
      const workbook = XLSX.read(await file.arrayBuffer());
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(worksheet);
      
      return rawData.map((row: any) => this.mapRowToContent(row)).filter(Boolean);
    } catch (error) {
      console.error('Error processing Excel file:', error);
      throw new Error('Error al procesar el archivo Excel. Verifica el formato.');
    }
  }
  
  private mapRowToContent(row: any): ContentItem | null {
    try {
      return {
        id: generateId(),
        hook: row['Hook'] || row['hook'] || '',
        script: row['Script'] || row['script'] || '',
        platform: this.parsePlatforms(row['Plataformas'] || row['plataformas'] || row['Platform'] || ''),
        type: this.parseContentType(row['Tipo'] || row['tipo'] || row['Type'] || ''),
        duration: this.parseDuration(row['Duración'] || row['duracion'] || row['Duration'] || ''),
        visualElements: row['Visual'] || row['visual'] || row['Visual Elements'] || '',
        context: row['Contexto'] || row['contexto'] || row['Context'] || '',
        cta: row['CTA'] || row['cta'] || '',
        viralScore: this.parseViralScore(row['Viral Score'] || row['viral_score'] || row['ViralScore'] || 0),
        aiTools: row['AI Tools'] || row['ai_tools'] || row['AITools'] || '',
        tags: this.parseTags(row['Tags'] || row['tags'] || ''),
        status: 'draft' as ContentStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error mapping row to content:', error, row);
      return null;
    }
  }
  
  private parsePlatforms(platformString: string): Platform[] {
    if (!platformString) return [];
    
    const platforms = platformString.split(',').map(p => p.trim());
    const validPlatforms: Platform[] = [];
    
    platforms.forEach(platform => {
      switch (platform.toLowerCase()) {
        case 'tiktok':
        case 'tik tok':
          validPlatforms.push('TikTok');
          break;
        case 'instagram':
        case 'ig':
          validPlatforms.push('Instagram');
          break;
        case 'youtube':
        case 'yt':
          validPlatforms.push('YouTube');
          break;
        case 'linkedin':
          validPlatforms.push('LinkedIn');
          break;
      }
    });
    
    return validPlatforms.length > 0 ? validPlatforms : ['TikTok'];
  }
  
  private parseContentType(typeString: string): ContentType {
    const type = typeString.toLowerCase();
    if (type.includes('educativo') || type.includes('educational')) return 'Educativo';
    if (type.includes('testimonial')) return 'Testimonial';
    if (type.includes('controversial')) return 'Controversial';
    if (type.includes('predictivo') || type.includes('prediction')) return 'Predictivo';
    if (type.includes('behind') || type.includes('detras')) return 'Behind-Scenes';
    if (type.includes('shock') || type.includes('impacto')) return 'Shock';
    if (type.includes('storytelling') || type.includes('historia')) return 'Storytelling';
    if (type.includes('polemico') || type.includes('debate')) return 'Polemico';
    if (type.includes('reto') || type.includes('challenge')) return 'Reto';
    if (type.includes('autoridad') || type.includes('authority')) return 'Autoridad';
    return 'Educativo';
  }
  
  private parseDuration(durationString: string): Duration {
    const duration = durationString.toLowerCase();
    if (duration.includes('15')) return '15s';
    if (duration.includes('30')) return '30s';
    if (duration.includes('60') || duration.includes('1min')) return '60s';
    if (duration.includes('3') || duration.includes('5')) return '3-5min';
    return '30s';
  }
  
  private parseViralScore(score: any): number {
    const numScore = typeof score === 'number' ? score : parseInt(score) || 0;
    return Math.max(0, Math.min(100, numScore));
  }
  
  private parseTags(tagsString: string): string[] {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  
  async exportToExcel(contents: ContentItem[]): Promise<Blob> {
    const exportData = contents.map(content => ({
      'ID': content.id,
      'Hook': content.hook,
      'Script': content.script,
      'Plataformas': content.platform.join(', '),
      'Tipo': content.type,
      'Duración': content.duration,
      'Visual': content.visualElements,
      'Contexto': content.context,
      'CTA': content.cta,
      'Viral Score': content.viralScore,
      'AI Tools': content.aiTools,
      'Estado': content.status,
      'Fecha Creación': content.createdAt.toLocaleDateString('es-PE'),
      'Tags': content.tags.join(', '),
      'Views': content.metrics?.views || 0,
      'Engagement': content.metrics?.engagement || 0,
      'Leads': content.metrics?.leads || 0
    }));
    
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

export const excelProcessor = new ExcelProcessor();
