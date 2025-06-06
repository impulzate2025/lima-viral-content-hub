
import { LimaInsights, DistrictData, SuccessStory, MarketInsight } from '@/types/local-insights';

// Base de datos estática de insights de Lima (actualizada 2024-2025)
export const LIMA_INSIGHTS: LimaInsights = {
  districts: {
    'miraflores': {
      name: 'Miraflores',
      price_m2: 8500,
      growth_percentage: 12,
      rental_yield: 5.8,
      target_audience: ['inversores', 'ejecutivos', 'extranjeros'],
      infrastructure_projects: ['Renovación del Malecón', 'Mejoras en Óvalo Gutiérrez'],
      characteristics: ['vista al mar', 'zona turística', 'alto tránsito', 'premium'],
      investment_potential: 'premium'
    },
    'san_isidro': {
      name: 'San Isidro',
      price_m2: 9200,
      growth_percentage: 15,
      rental_yield: 6.2,
      target_audience: ['familias premium', 'ejecutivos senior', 'inversores institucionales'],
      infrastructure_projects: ['Metro Línea 2', 'Renovación Parque El Olivar'],
      characteristics: ['distrito financiero', 'áreas verdes', 'seguridad', 'colegios premium'],
      investment_potential: 'premium'
    },
    'surco': {
      name: 'Santiago de Surco',
      price_m2: 6800,
      growth_percentage: 18,
      rental_yield: 7.1,
      target_audience: ['familias jóvenes', 'profesionales', 'primera vivienda'],
      infrastructure_projects: ['Extensión Metro Línea 1', 'Vía Expresa Sur'],
      characteristics: ['crecimiento acelerado', 'centros comerciales', 'conectividad'],
      investment_potential: 'alto'
    },
    'pueblo_libre': {
      name: 'Pueblo Libre',
      price_m2: 4200,
      growth_percentage: 25,
      rental_yield: 8.5,
      target_audience: ['jóvenes profesionales', 'primerizos', 'estudiantes'],
      infrastructure_projects: ['Metro Línea 2', 'Renovación Centro Histórico'],
      characteristics: ['emergente', 'cultural', 'accesible', 'potencial'],
      investment_potential: 'alto'
    },
    'brena': {
      name: 'Breña',
      price_m2: 3800,
      growth_percentage: 30,
      rental_yield: 9.2,
      target_audience: ['inversores astutos', 'jóvenes', 'emprendedores'],
      infrastructure_projects: ['Metro Línea 2', 'Regeneración urbana'],
      characteristics: ['gentrificación', 'céntrico', 'oportunidad', 'subestimado'],
      investment_potential: 'alto'
    },
    'jesus_maria': {
      name: 'Jesús María',
      price_m2: 5100,
      growth_percentage: 22,
      rental_yield: 7.8,
      target_audience: ['familias profesionales', 'médicos', 'trabajadores del centro'],
      infrastructure_projects: ['Metro Línea 2', 'Hospital Rebagliati expansión'],
      characteristics: ['hospitales', 'céntrico', 'residencial', 'creciente'],
      investment_potential: 'alto'
    },
    'magdalena': {
      name: 'Magdalena del Mar',
      price_m2: 5600,
      growth_percentage: 20,
      rental_yield: 7.3,
      target_audience: ['surfistas', 'jóvenes profesionales', 'familias costeras'],
      infrastructure_projects: ['Costa Verde', 'Malecón turístico'],
      characteristics: ['playa', 'bohemio', 'cultural', 'alternativo'],
      investment_potential: 'medio'
    }
  },
  
  trends_2025: [
    'Espacios híbridos trabajo-vivienda',
    'Departamentos con terraza post-pandemia',
    'Edificios eco-sostenibles',
    'Smart homes con domótica',
    'Proximidad a estaciones de metro',
    'Amenities tipo resort',
    'Co-living para jóvenes profesionales',
    'Inversión en distritos emergentes',
    'Propiedades pet-friendly',
    'Espacios flexibles multifuncionales'
  ],
  
  success_stories: [
    {
      id: 'story-001',
      client_type: 'Madre soltera',
      district: 'Pueblo Libre',
      investment_amount: 180000,
      roi_percentage: 35,
      timeframe_months: 18,
      story_summary: 'María compró un departamento de 2 dormitorios antes del boom del Metro Línea 2',
      testimonial_quote: 'Nunca imaginé que en año y medio mi departamento se revalorizaría tanto. El Metro cambió todo.'
    },
    {
      id: 'story-002',
      client_type: 'Joven profesional',
      district: 'Breña',
      investment_amount: 150000,
      roi_percentage: 42,
      timeframe_months: 24,
      story_summary: 'Carlos apostó por Breña cuando nadie hablaba del distrito, ahora es zona premium',
      testimonial_quote: 'Mis amigos me decían loco por comprar en Breña. Ahora me piden consejos de inversión.'
    },
    {
      id: 'story-003',
      client_type: 'Pareja joven',
      district: 'Jesús María',
      investment_amount: 220000,
      roi_percentage: 28,
      timeframe_months: 20,
      story_summary: 'Ana y José compraron cerca del Hospital Rebagliati, perfecta ubicación para alquiler',
      testimonial_quote: 'La ubicación estratégica nos da tranquilidad. Siempre hay demanda de alquiler aquí.'
    }
  ],
  
  popular_hashtags: {
    'general': ['#InmobiliariaLima', '#RealEstatePeru', '#InvierteEnLima', '#PropiedadesLima', '#Lima2025'],
    'miraflores': ['#MirafloresLife', '#VistAlMar', '#MalecónLima', '#MirafloresPremium'],
    'san_isidro': ['#SanIsidroFinanciero', '#ElOlivar', '#SanIsidroPremium', '#DistritoFinanciero'],
    'surco': ['#SurcoLife', '#FamiliasSurco', '#SurcoModerno', '#ConnectividadSurco'],
    'pueblo_libre': ['#PuebloLibreEmergente', '#MetroLinea2', '#PuebloLibreBoom', '#CulturalDistrict'],
    'brena': ['#BreñaRising', '#BreñaGentrification', '#BreñaOportunidad', '#InvertirBreña'],
    'emergentes': ['#DistritosEmergentes', '#OportunidadInmobiliaria', '#FuturoLima', '#InversiónInteligente']
  },
  
  market_insights: [
    {
      id: 'insight-001',
      topic: 'Metro Línea 2 Impact',
      insight: 'Los distritos por donde pasa el Metro Línea 2 han visto un crecimiento promedio del 25% en precios',
      data_source: 'CAPECO 2024',
      last_updated: new Date('2024-11-01'),
      relevance_score: 95
    },
    {
      id: 'insight-002',
      topic: 'Trabajo Remoto',
      insight: 'El 65% de compradores post-pandemia priorizan espacios de home office',
      data_source: 'Estudio Inmobiliario Lima 2024',
      last_updated: new Date('2024-10-15'),
      relevance_score: 88
    },
    {
      id: 'insight-003',
      topic: 'Jóvenes Profesionales',
      insight: 'El 78% de profesionales de 25-35 años prefiere alquilar en distritos emergentes que comprar en zonas premium',
      data_source: 'Ipsos Perú 2024',
      last_updated: new Date('2024-09-20'),
      relevance_score: 82
    }
  ]
};

// Función para obtener datos específicos de un distrito
export const getDistrictData = (districtName: string): DistrictData | null => {
  const normalizedName = districtName.toLowerCase().replace(/\s+/g, '_');
  return LIMA_INSIGHTS.districts[normalizedName] || null;
};

// Función para obtener casos de éxito relevantes
export const getRelevantSuccessStories = (audience: string, district?: string): SuccessStory[] => {
  return LIMA_INSIGHTS.success_stories.filter(story => {
    const audienceMatch = story.client_type.toLowerCase().includes(audience.toLowerCase());
    const districtMatch = district ? story.district.toLowerCase().includes(district.toLowerCase()) : true;
    return audienceMatch || districtMatch;
  });
};

// Función para obtener hashtags relevantes
export const getRelevantHashtags = (district?: string, theme?: string): string[] => {
  let hashtags = [...LIMA_INSIGHTS.popular_hashtags.general];
  
  if (district) {
    const normalizedDistrict = district.toLowerCase().replace(/\s+/g, '_');
    const districtHashtags = LIMA_INSIGHTS.popular_hashtags[normalizedDistrict];
    if (districtHashtags) {
      hashtags = [...hashtags, ...districtHashtags];
    }
  }
  
  if (theme && theme.includes('emergente')) {
    hashtags = [...hashtags, ...LIMA_INSIGHTS.popular_hashtags.emergentes];
  }
  
  return hashtags.slice(0, 12); // Máximo 12 hashtags
};

// Función para obtener insights de mercado relevantes
export const getRelevantMarketInsights = (topic: string): MarketInsight[] => {
  return LIMA_INSIGHTS.market_insights
    .filter(insight => 
      insight.topic.toLowerCase().includes(topic.toLowerCase()) ||
      insight.insight.toLowerCase().includes(topic.toLowerCase())
    )
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 3);
};

// Función para obtener tendencias relevantes
export const getRelevantTrends = (audience: string): string[] => {
  const audienceTrendMap: Record<string, string[]> = {
    'joven': ['Espacios híbridos trabajo-vivienda', 'Smart homes con domótica', 'Co-living para jóvenes profesionales'],
    'familia': ['Departamentos con terraza post-pandemia', 'Amenities tipo resort', 'Propiedades pet-friendly'],
    'inversor': ['Inversión en distritos emergentes', 'Proximidad a estaciones de metro', 'Edificios eco-sostenibles'],
    'profesional': ['Espacios flexibles multifuncionales', 'Proximidad a estaciones de metro', 'Espacios híbridos trabajo-vivienda']
  };
  
  for (const [key, trends] of Object.entries(audienceTrendMap)) {
    if (audience.toLowerCase().includes(key)) {
      return trends;
    }
  }
  
  return LIMA_INSIGHTS.trends_2025.slice(0, 3);
};
