
import { ContentItem, ContentStatus } from '@/types';
import { generateId } from '@/lib/database';
import { ExcelParsers } from './excel-parsers';
import { detectHookType } from './hook-detector';

export class ExcelMappers {
  static mapRowToContent(row: any): ContentItem | null {
    try {
      return {
        id: generateId(),
        hook: row['Hook'] || row['hook'] || '',
        script: row['Script'] || row['script'] || '',
        platform: ExcelParsers.parsePlatforms(row['Plataformas'] || row['plataformas'] || row['Platform'] || ''),
        type: ExcelParsers.parseContentType(row['Tipo'] || row['tipo'] || row['Type'] || ''),
        duration: ExcelParsers.parseDuration(row['Duración'] || row['duracion'] || row['Duration'] || ''),
        visualElements: row['Visual'] || row['visual'] || row['Visual Elements'] || '',
        context: row['Contexto'] || row['contexto'] || row['Context'] || '',
        cta: row['CTA'] || row['cta'] || '',
        viralScore: ExcelParsers.parseViralScore(row['Viral Score'] || row['viral_score'] || row['ViralScore'] || 0),
        aiTools: row['AI Tools'] || row['ai_tools'] || row['AITools'] || '',
        tags: ExcelParsers.parseTags(row['Tags'] || row['tags'] || ''),
        status: 'draft' as ContentStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error mapping row to content:', error, row);
      return null;
    }
  }

  static mapExcelDataToContent(data: any[]): Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>[] {
    console.log('📊 ExcelMappers: Processing Excel data, rows:', data.length);
    
    return data.slice(1).map((row, index) => {
      try {
        const hook = String(row[0] || '').trim();
        const context = String(row[6] || '').trim();
        const aiTools = String(row[9] || '').trim();
        
        // Detectar tipo de gancho automáticamente
        const detectedHookType = detectHookType(hook, context, aiTools);
        
        const content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'> = {
          hook,
          script: String(row[1] || '').trim(),
          visualElements: String(row[2] || '').trim(),
          platform: ExcelParsers.parsePlatforms(String(row[3] || '')),
          type: ExcelParsers.parseContentType(String(row[4] || '')),
          duration: ExcelParsers.parseDuration(String(row[5] || '')),
          context: `${context}${detectedHookType !== 'Sin clasificar' ? ` | ${detectedHookType}` : ''}`,
          cta: String(row[7] || '').trim(),
          viralScore: ExcelParsers.parseViralScore(row[8]),
          aiTools: aiTools || 'Manual',
          tags: ExcelParsers.parseTags(String(row[10] || '')),
          status: ExcelParsers.parseStatus(String(row[11] || '')) as ContentStatus,
          metrics: ExcelParsers.parseMetrics(row.slice(12, 17))
        };

        console.log(`📊 Processed row ${index + 1}:`, {
          hook: content.hook.substring(0, 50) + '...',
          detectedHookType,
          platforms: content.platform.length,
          type: content.type
        });

        return content;
      } catch (error) {
        console.error(`❌ Error processing row ${index + 1}:`, error);
        throw new Error(`Error en fila ${index + 2}: ${error}`);
      }
    });
  }

  static mapContentToExportData(contents: ContentItem[]) {
    return contents.map(content => ({
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
  }
}
