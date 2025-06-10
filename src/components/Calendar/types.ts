
export interface ContentPlan {
  id: string;
  date: Date;
  contentId?: string;
  platform: string;
  type: string;
  topic: string;
  hook?: string;
  script?: string;
  status: 'planned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface NewPlanForm {
  platform: string;
  type: string;
  topic: string;
  priority: 'low' | 'medium' | 'high';
}

export const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Facebook', 'Twitter'];
export const CONTENT_TYPES = ['Educativo', 'Testimonial', 'Controversial', 'Predictivo', 'Behind-Scenes', 'Tutorial'];
export const TOPICS_PREDEFINIDOS = [
  '3 distritos emergentes Lima 2025',
  '¿Por qué Miraflores ya no es la mejor inversión?',
  'Secretos de inversión inmobiliaria',
  'Errores comunes al comprar departamento',
  'Tendencias del mercado inmobiliario',
  'Consejos para primera compra',
  'Zonas con mayor plusvalía',
  'Análisis de precios por distrito'
];
