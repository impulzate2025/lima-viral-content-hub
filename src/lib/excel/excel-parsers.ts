
import { Platform, ContentType, Duration, ContentStatus } from '@/types';

export class ExcelParsers {
  static parsePlatforms(platformString: string): Platform[] {
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
  
  static parseContentType(typeString: string): ContentType {
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
  
  static parseDuration(durationString: string): Duration {
    const duration = durationString.toLowerCase();
    if (duration.includes('15')) return '15s';
    if (duration.includes('30')) return '30s';
    if (duration.includes('60') || duration.includes('1min')) return '60s';
    if (duration.includes('3') || duration.includes('5')) return '3-5min';
    return '30s';
  }
  
  static parseViralScore(score: any): number {
    const numScore = typeof score === 'number' ? score : parseInt(score) || 0;
    return Math.max(0, Math.min(100, numScore));
  }
  
  static parseTags(tagsString: string): string[] {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  static parseStatus(statusString: string): ContentStatus {
    const status = statusString.toLowerCase();
    if (status.includes('draft') || status.includes('borrador')) return 'draft';
    if (status.includes('ready') || status.includes('listo')) return 'ready';
    if (status.includes('published') || status.includes('publicado')) return 'published';
    if (status.includes('archived') || status.includes('archivado')) return 'archived';
    return 'draft';
  }

  static parseNumber(value: any): number {
    const num = typeof value === 'number' ? value : parseInt(value) || 0;
    return Math.max(0, num);
  }

  static parseMetrics(metricRow: any[]): { views?: number; engagement?: number; shares?: number; leads?: number } {
    return {
      views: this.parseNumber(metricRow[0]),
      engagement: this.parseNumber(metricRow[1]),
      shares: this.parseNumber(metricRow[2]),
      leads: this.parseNumber(metricRow[3])
    };
  }
}
