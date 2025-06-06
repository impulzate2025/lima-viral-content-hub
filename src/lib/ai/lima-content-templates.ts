
export interface ContentTemplate {
  name: string;
  description: string;
  structure: string[];
  platforms: string[];
  examples: {
    hook: string;
    keyPoints: string[];
    cta: string;
  };
}

export const LIMA_CONTENT_TEMPLATES: Record<string, ContentTemplate> = {
  'experimento-lima': {
    name: 'El Experimento Lima',
    description: 'Prueba real con inversión en múltiples distritos, mostrando resultados comparativos',
    structure: [
      'Presentación del experimento (0-5s)',
      'Los distritos elegidos (5-15s)', 
      'Criterios de selección (15-20s)',
      'Resultados impactantes (20-25s)',
      'CTA estratégico (25-30s)'
    ],
    platforms: ['TikTok', 'Instagram'],
    examples: {
      hook: 'Invertí S/50K en 3 distritos diferentes. 12 meses después, estos son los resultados...',
      keyPoints: [
        'Monto específico invertido',
        'Distritos seleccionados y por qué',
        'Resultados reales con números',
        'Lección aprendida aplicable'
      ],
      cta: 'Comenta cuál distrito elegirías tú'
    }
  },
  
  'mythbusters-lima': {
    name: 'Lima Real Estate Mythbusters',
    description: 'Desmiente mitos comunes del mercado inmobiliario limeño con evidencia real',
    structure: [
      'El mito común (0-3s)',
      'Por qué decidí probarlo (3-8s)',
      'El proceso real (8-18s)',
      'La verdad revelada (18-25s)',
      'Aplicación práctica (25-30s)'
    ],
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    examples: {
      hook: 'Todo el mundo dice que X distrito es malo para invertir. Compré ahí y esto pasó...',
      keyPoints: [
        'Mito específico del mercado',
        'Decisión contrarian tomada',
        'Proceso de validación',
        'Resultado inesperado',
        'Nueva perspectiva revelada'
      ],
      cta: 'Guarda este post si también creías el mito'
    }
  },
  
  'prediccion-lima': {
    name: 'Predicción Lima 20XX',
    description: 'Proyección específica sobre el futuro de un distrito basada en mega-tendencias',
    structure: [
      'La predicción audaz (0-5s)',
      'Los 3 factores clave (5-15s)',
      'Evidencia concreta (15-22s)',
      'Cómo aprovecharlo HOY (22-30s)'
    ],
    platforms: ['TikTok', 'Instagram', 'LinkedIn'],
    examples: {
      hook: 'Si tuviera que elegir solo 1 distrito para invertir en Lima los próximos 5 años, sería este...',
      keyPoints: [
        'Distrito específico seleccionado',
        'Mega-proyectos que lo impactarán',
        'Timeline de transformación',
        'Oportunidad actual disponible'
      ],
      cta: 'DM para info detallada del distrito'
    }
  },
  
  'data-lima': {
    name: 'Data Lima Real Estate',
    description: 'Análisis de datos exclusivos del mercado inmobiliario limeño con insights accionables',
    structure: [
      'Introducción del análisis (0-5s)',
      'Datos más sorprendentes (5-15s)',
      'Patterns identificados (15-25s)',
      'Acción recomendada (25-30s)'
    ],
    platforms: ['LinkedIn', 'Instagram', 'YouTube'],
    examples: {
      hook: 'Analicé 1000+ transacciones en Lima. Estos patterns cambiarán tu estrategia...',
      keyPoints: [
        'Tamaño del dataset analizado',
        'Discoveries más importantes',
        'Implications para inversores',
        'Estrategia recomendada'
      ],
      cta: 'Descarga el reporte completo'
    }
  },
  
  'insider-secrets': {
    name: 'Insider Secrets Lima',
    description: 'Revelación de información privilegiada de la industria inmobiliaria limeña',
    structure: [
      'Setup de credencial (0-3s)',
      'El secreto revelado (3-12s)',
      'Por qué importa (12-20s)',
      'Cómo usarlo (20-30s)'
    ],
    platforms: ['TikTok', 'Instagram', 'LinkedIn'],
    examples: {
      hook: 'Trabajo con los mejores desarrolladores de Lima. Te explico por qué este proyecto será el más rentable...',
      keyPoints: [
        'Credencial que da acceso',
        'Información privilegiada específica',
        'Ventaja competitiva revelada',
        'Aplicación práctica inmediata'
      ],
      cta: 'Sígueme para más insider tips'
    }
  }
};

export const LIMA_WEEKLY_THEMES = {
  'monday': {
    name: 'Market Monday',
    focus: 'Data fresca del mercado limeño',
    contentTypes: ['Educativo', 'Autoridad', 'Predictivo'],
    examples: [
      'Reporte semanal de precios por distrito',
      'Análisis de nuevas ofertas vs demanda',
      'Tendencias emergentes del mercado'
    ]
  },
  'tuesday': {
    name: 'Transformation Tuesday', 
    focus: 'Casos de éxito y transformaciones reales',
    contentTypes: ['Testimonial', 'Storytelling'],
    examples: [
      'Cliente que duplicó su inversión',
      'Transformación de barrio emergente', 
      'ROI stories documentadas'
    ]
  },
  'wednesday': {
    name: 'Wisdom Wednesday',
    focus: 'Tips profesionales y educación avanzada',
    contentTypes: ['Educativo', 'Behind-Scenes'],
    examples: [
      'Errores costosos a evitar',
      'Proceso de due diligence',
      'Secrets de negociación'
    ]
  },
  'thursday': {
    name: 'Throwback Thursday',
    focus: 'Evolución histórica del mercado limeño',
    contentTypes: ['Controversial', 'Educativo'],
    examples: [
      'Cómo han cambiado los precios',
      'Distritos que sorprendieron',
      'Lecciones del pasado'
    ]
  },
  'friday': {
    name: 'Future Friday',
    focus: 'Predicciones y oportunidades futuras',
    contentTypes: ['Predictivo', 'Autoridad'],
    examples: [
      'Mega-proyectos que impactarán',
      'Distritos del futuro',
      'Tendencias globales en Lima'
    ]
  },
  'saturday': {
    name: 'Saturday Solutions',
    focus: 'Q&A y resolución de problemas',
    contentTypes: ['Educativo', 'Reto'],
    examples: [
      'Respuestas a dudas comunes',
      'Problem-solving en vivo',
      'Consultas de seguidores'
    ]
  },
  'sunday': {
    name: 'Sunday Stories',
    focus: 'Behind the scenes y humanización',
    contentTypes: ['Storytelling', 'Behind-Scenes'],
    examples: [
      'Día en la vida de broker',
      'Anécdotas profesionales',
      'Lado humano del negocio'
    ]
  }
};

export function getContentTemplateForType(hookType: string): ContentTemplate | null {
  const templateMappings = {
    'Educativo': 'data-lima',
    'Shock': 'mythbusters-lima', 
    'Controversial': 'mythbusters-lima',
    'Predictivo': 'prediccion-lima',
    'Autoridad': 'insider-secrets',
    'Testimonial': 'experimento-lima',
    'Storytelling': 'experimento-lima'
  };
  
  const templateKey = templateMappings[hookType];
  return templateKey ? LIMA_CONTENT_TEMPLATES[templateKey] : null;
}

export function getDayThemeRecommendation(dayOfWeek: number): any {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayKey = days[dayOfWeek];
  return LIMA_WEEKLY_THEMES[dayKey];
}
