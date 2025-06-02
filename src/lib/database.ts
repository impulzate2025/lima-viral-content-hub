
import Dexie, { Table } from 'dexie';
import { ContentItem, Campaign, AppSettings, ExportRecord, ContentFilter } from '@/types';

export class VCMDatabase extends Dexie {
  contents!: Table<ContentItem>;
  campaigns!: Table<Campaign>;
  settings!: Table<AppSettings>;
  exports!: Table<ExportRecord>;

  constructor() {
    super('ViralContentManager');
    
    this.version(1).stores({
      contents: '++id, platform, type, viralScore, status, createdAt, updatedAt, campaign, *tags',
      campaigns: '++id, name, status, startDate, endDate',
      settings: '++id, key, value',
      exports: '++id, type, filename, createdAt'
    });
  }
}

export const db = new VCMDatabase();

// Generar ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Servicios de base de datos
export const contentService = {
  async getAll(): Promise<ContentItem[]> {
    return await db.contents.orderBy('updatedAt').reverse().toArray();
  },
  
  async getByFilter(filter: ContentFilter): Promise<ContentItem[]> {
    let query = db.contents.toCollection();
    
    if (filter.platform) {
      query = query.filter(item => item.platform.includes(filter.platform));
    }
    if (filter.type) {
      query = query.filter(item => item.type === filter.type);
    }
    if (filter.status) {
      query = query.filter(item => item.status === filter.status);
    }
    if (filter.duration) {
      query = query.filter(item => item.duration === filter.duration);
    }
    if (filter.minViralScore !== undefined) {
      query = query.filter(item => item.viralScore >= filter.minViralScore);
    }
    if (filter.maxViralScore !== undefined) {
      query = query.filter(item => item.viralScore <= filter.maxViralScore);
    }
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      query = query.filter(item => 
        item.hook.toLowerCase().includes(searchTerm) ||
        item.script.toLowerCase().includes(searchTerm) ||
        item.context.toLowerCase().includes(searchTerm)
      );
    }
    
    return await query.toArray();
  },
  
  async create(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const id = generateId();
    await db.contents.add({
      ...content,
      id,
      createdAt: now,
      updatedAt: now
    });
    return id;
  },
  
  async update(id: string, updates: Partial<ContentItem>): Promise<void> {
    await db.contents.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },
  
  async delete(id: string): Promise<void> {
    await db.contents.delete(id);
  },

  async getStats() {
    const contents = await this.getAll();
    const totalContents = contents.length;
    const avgViralScore = contents.length > 0 
      ? Math.round(contents.reduce((sum, item) => sum + item.viralScore, 0) / contents.length)
      : 0;
    const readyContents = contents.filter(item => item.status === 'ready').length;
    const publishedContents = contents.filter(item => item.status === 'published').length;
    
    const platformDistribution = contents.reduce((acc, item) => {
      item.platform.forEach(platform => {
        acc[platform] = (acc[platform] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalContents,
      avgViralScore,
      readyContents,
      publishedContents,
      platformDistribution
    };
  }
};

export const campaignService = {
  async getAll(): Promise<Campaign[]> {
    return await db.campaigns.orderBy('startDate').reverse().toArray();
  },
  
  async create(campaign: Omit<Campaign, 'id'>): Promise<string> {
    const id = generateId();
    await db.campaigns.add({ ...campaign, id });
    return id;
  },
  
  async update(id: string, updates: Partial<Campaign>): Promise<void> {
    await db.campaigns.update(id, updates);
  },
  
  async delete(id: string): Promise<void> {
    await db.campaigns.delete(id);
  }
};
