
export interface DistrictData {
  name: string;
  price_m2: number;
  growth_percentage: number;
  rental_yield: number;
  target_audience: string[];
  infrastructure_projects: string[];
  characteristics: string[];
  investment_potential: 'bajo' | 'medio' | 'alto' | 'premium';
}

export interface LimaInsights {
  districts: Record<string, DistrictData>;
  trends_2025: string[];
  success_stories: SuccessStory[];
  popular_hashtags: Record<string, string[]>;
  market_insights: MarketInsight[];
}

export interface SuccessStory {
  id: string;
  client_type: string;
  district: string;
  investment_amount: number;
  roi_percentage: number;
  timeframe_months: number;
  story_summary: string;
  testimonial_quote: string;
}

export interface MarketInsight {
  id: string;
  topic: string;
  insight: string;
  data_source: string;
  last_updated: Date;
  relevance_score: number;
}

export interface ContentQualityScore {
  grammar_score: number;
  relevance_score: number;
  local_context: boolean;
  cta_present: boolean;
  hook_strength: number;
  overall_score: number;
  suggestions: string[];
}

export interface ContentPerformance {
  content_id: string;
  hook: string;
  projected_engagement: number;
  actual_engagement?: number;
  actual_views?: number;
  actual_shares?: number;
  performance_rating: 'poor' | 'average' | 'good' | 'excellent';
  improvement_suggestions: string[];
  created_at: Date;
  measured_at?: Date;
}
