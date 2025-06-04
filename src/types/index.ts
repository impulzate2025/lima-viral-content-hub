
export type Platform = 'TikTok' | 'Instagram' | 'YouTube' | 'LinkedIn';
export type ContentType = 'Educativo' | 'Testimonial' | 'Controversial' | 'Predictivo' | 'Behind-Scenes' | 'Shock' | 'Storytelling' | 'Polemico' | 'Reto' | 'Autoridad';
export type Duration = '15s' | '30s' | '60s' | '3-5min';
export type ContentStatus = 'draft' | 'ready' | 'published' | 'archived';

export interface ContentMetrics {
  views?: number;
  engagement?: number;
  shares?: number;
  leads?: number;
  conversions?: number;
}

export interface ContentItem {
  id: string;
  platform: Platform[];
  type: ContentType;
  hook: string;
  script: string;
  visualElements: string;
  duration: Duration;
  context: string;
  cta: string;
  viralScore: number;
  aiTools: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  status: ContentStatus;
  metrics?: ContentMetrics;
  campaign?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  contentIds: string[];
  startDate: Date;
  endDate?: Date;
  goals: CampaignGoals;
  status: 'planning' | 'active' | 'completed';
}

export interface CampaignGoals {
  targetViews?: number;
  targetEngagement?: number;
  targetLeads?: number;
}

export interface ContentFilter {
  platform?: Platform;
  type?: ContentType;
  duration?: Duration;
  status?: ContentStatus;
  minViralScore?: number;
  maxViralScore?: number;
  search?: string;
  tags?: string[];
}

export interface AppSettings {
  id: string;
  key: string;
  value: any;
}

export type DialogType = 'none' | 'editor' | 'uploader' | 'viewer' | 'aiGenerator';

export interface ExportRecord {
  id: string;
  type: 'excel' | 'pdf' | 'campaign';
  filename: string;
  createdAt: Date;
}
