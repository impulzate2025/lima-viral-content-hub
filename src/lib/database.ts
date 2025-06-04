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

// Datos de prueba iniciales
const SAMPLE_CONTENTS: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    platform: ['TikTok', 'Instagram'],
    type: 'Educativo',
    hook: '¿Sabías que en Miraflores puedes encontrar departamentos con vista al mar?',
    script: 'En este video te muestro las mejores opciones de departamentos con vista panorámica al océano en Miraflores. Desde 1 hasta 3 dormitorios, con amenities de lujo y ubicaciones privilegiadas.',
    visualElements: 'Drone shots del malecón, interior de departamentos modernos, vista panorámica',
    duration: '60s',
    context: 'Video educativo sobre opciones de vivienda en Miraflores dirigido a jóvenes profesionales',
    cta: 'Envía mensaje para agendar visita virtual gratuita',
    viralScore: 85,
    aiTools: 'ChatGPT para script, Midjourney para thumbnails',
    tags: ['miraflores', 'vista-mar', 'departamentos', 'lujo'],
    status: 'ready'
  },
  {
    platform: ['YouTube', 'LinkedIn'],
    type: 'Testimonial',
    hook: 'Mi experiencia comprando mi primer departamento en San Isidro',
    script: 'Conoce la historia de María, quien logró comprar su primer departamento en San Isidro a los 28 años. Te comparte sus tips de ahorro, el proceso de financiamiento y por qué eligió trabajar con nosotros.',
    visualElements: 'Entrevista testimonial, fotos del proceso, departamento final',
    duration: '3-5min',
    context: 'Testimonial real de cliente para generar confianza en servicios inmobiliarios',
    cta: 'Agenda tu consulta gratuita con nuestros especialistas',
    viralScore: 72,
    aiTools: 'Descript para edición, Canva para gráficos',
    tags: ['testimonial', 'san-isidro', 'primer-departamento', 'financiamiento'],
    status: 'published'
  },
  {
    platform: ['Instagram', 'TikTok'],
    type: 'Controversial',
    hook: '¿Es 2024 el PEOR año para comprar casa en Lima? La verdad que nadie te dice',
    script: 'Todos dicen que los precios están altísimos, pero ¿realmente es mal momento? Te revelo 3 datos que los medios no te muestran sobre el mercado inmobiliario actual en Lima.',
    visualElements: 'Gráficos de tendencias, comparativas de precios, estadísticas',
    duration: '30s',
    context: 'Contenido controversial para generar engagement sobre timing de compra',
    cta: 'Comenta tu opinión 👇 ¿Comprarías casa este año?',
    viralScore: 91,
    aiTools: 'ChatGPT para research, Canva para estadísticas visuales',
    tags: ['controversial', 'mercado-inmobiliario', 'precios', 'lima'],
    status: 'ready'
  },
  {
    platform: ['LinkedIn'],
    type: 'Predictivo',
    hook: 'Estas 3 zonas de Lima se van a revalorizar 40% en los próximos 2 años',
    script: 'Análisis predictivo basado en datos de desarrollo urbano, nuevos proyectos de transporte y crecimiento demográfico. Te muestro exactamente qué distritos van a experimentar mayor crecimiento.',
    visualElements: 'Mapas interactivos, proyecciones de crecimiento, infografías',
    duration: '3-5min',
    context: 'Contenido de valor para inversores y compradores estratégicos',
    cta: 'Descarga nuestro reporte completo de zonas emergentes',
    viralScore: 78,
    aiTools: 'Claude para análisis de datos, Flourish para visualizaciones',
    tags: ['predictivo', 'inversión', 'revalorización', 'zonas-emergentes'],
    status: 'draft'
  },
  {
    platform: ['TikTok'],
    type: 'Behind-Scenes',
    hook: 'Day in the life: Broker inmobiliario en Lima',
    script: 'Acompáñame en un día típico: desde las 7am visitando propiedades, reuniones con clientes, hasta cerrar una venta importante. La realidad del trabajo inmobiliario que pocos conocen.',
    visualElements: 'Footage real del día a día, timelapses, interacciones con clientes',
    duration: '60s',
    context: 'Contenido behind-scenes para humanizar la marca y mostrar expertise',
    cta: 'Síguenos para más contenido detrás de cámaras',
    viralScore: 68,
    aiTools: 'CapCut para edición rápida, tendencias TikTok actuales',
    tags: ['behind-scenes', 'day-in-life', 'broker', 'realidad'],
    status: 'archived'
  }
];

// Función para forzar la carga de datos de prueba
export const forceSampleDataLoad = async (): Promise<void> => {
  console.log('🔍 Force loading sample data...');
  
  try {
    // Limpiar contenidos existentes
    await db.contents.clear();
    console.log('🗑️ Cleared existing contents');
    
    const now = new Date();
    const sampleContentsWithDates = SAMPLE_CONTENTS.map((content, index) => ({
      ...content,
      id: generateId(),
      createdAt: new Date(now.getTime() - (6 - index) * 24 * 60 * 60 * 1000), // Diferentes fechas
      updatedAt: new Date(now.getTime() - (5 - index) * 12 * 60 * 60 * 1000) // Diferentes fechas de actualización
    }));
    
    await db.contents.bulkAdd(sampleContentsWithDates);
    console.log(`✅ Force inserted ${sampleContentsWithDates.length} sample contents`);
    
    // Verificar que se insertaron correctamente
    const count = await db.contents.count();
    console.log(`📊 Current database count: ${count}`);
    
  } catch (error) {
    console.error('❌ Error force loading sample data:', error);
    throw error;
  }
};

// Función para inicializar datos de prueba si no existen
export const initializeSampleData = async (): Promise<void> => {
  console.log('🔍 Checking if sample data needs to be initialized...');
  
  try {
    const existingContents = await db.contents.count();
    console.log(`📊 Found ${existingContents} existing contents in database`);
    
    if (existingContents === 0) {
      console.log('🚀 Database is empty, inserting sample data...');
      await forceSampleDataLoad();
    } else {
      console.log('✅ Database already has content, skipping sample data initialization');
    }
  } catch (error) {
    console.error('❌ Error initializing sample data:', error);
  }
};

// Servicios de base de datos
export class ContentService {
  async getAll(): Promise<ContentItem[]> {
    console.log('🔍 contentService.getAll() called');
    
    // Siempre verificar e inicializar datos de prueba si es necesario
    await initializeSampleData();
    
    const contents = await db.contents.orderBy('updatedAt').reverse().toArray();
    console.log(`📊 contentService.getAll() returning ${contents.length} contents`);
    return contents;
  }
  
  async getByFilter(filter: ContentFilter): Promise<ContentItem[]> {
    console.log('🔍 contentService.getByFilter() called with filter:', filter);
    
    try {
      let collection = db.contents.orderBy('updatedAt');
      
      // Aplicar filtros según los criterios
      if (filter.platform) {
        console.log('🏷️ Filtering by platform:', filter.platform);
        collection = collection.filter(item => 
          item.platform.includes(filter.platform!)
        );
      }
      
      if (filter.type) {
        console.log('🏷️ Filtering by type:', filter.type);
        collection = collection.filter(item => item.type === filter.type);
      }
      
      if (filter.duration) {
        console.log('🏷️ Filtering by duration:', filter.duration);
        collection = collection.filter(item => item.duration === filter.duration);
      }
      
      if (filter.status) {
        console.log('🏷️ Filtering by status:', filter.status);
        collection = collection.filter(item => item.status === filter.status);
      }
      
      if (filter.hookType) {
        console.log('🏷️ Filtering by hookType:', filter.hookType);
        collection = collection.filter(item => {
          // Buscar el tipo de gancho en el hook, context o aiTools
          const hookText = (item.hook || '').toLowerCase();
          const contextText = (item.context || '').toLowerCase();
          const aiToolsText = (item.aiTools || '').toLowerCase();
          const searchText = `${hookText} ${contextText} ${aiToolsText}`.toLowerCase();
          
          switch (filter.hookType) {
            case 'shock':
              return searchText.includes('shock') || 
                     searchText.includes('impactante') || 
                     searchText.includes('sorprendente') ||
                     hookText.includes('no vas a creer') ||
                     hookText.includes('esto te sorprenderá');
            case 'storytelling':
              return searchText.includes('storytelling') || 
                     searchText.includes('historia') || 
                     searchText.includes('narrativa') ||
                     hookText.includes('te voy a contar') ||
                     hookText.includes('esta es la historia');
            case 'polemico':
              return searchText.includes('polémico') || 
                     searchText.includes('controversial') || 
                     searchText.includes('debate') ||
                     hookText.includes('nadie te dice') ||
                     hookText.includes('la verdad sobre');
            case 'reto':
              return searchText.includes('reto') || 
                     searchText.includes('challenge') || 
                     searchText.includes('desafío') ||
                     hookText.includes('si puedes') ||
                     hookText.includes('atrévete');
            case 'autoridad':
              return searchText.includes('autoridad') || 
                     searchText.includes('experto') || 
                     searchText.includes('años de experiencia') ||
                     hookText.includes('como experto') ||
                     hookText.includes('en mi experiencia');
            default:
              return true;
          }
        });
      }
      
      if (filter.minViralScore !== undefined) {
        console.log('🏷️ Filtering by minViralScore:', filter.minViralScore);
        collection = collection.filter(item => item.viralScore >= filter.minViralScore!);
      }
      
      if (filter.maxViralScore !== undefined) {
        console.log('🏷️ Filtering by maxViralScore:', filter.maxViralScore);
        collection = collection.filter(item => item.viralScore <= filter.maxViralScore!);
      }
      
      if (filter.search && typeof filter.search === 'string' && filter.search.trim()) {
        console.log('🏷️ Filtering by search:', filter.search);
        const searchTerm = filter.search.toLowerCase().trim();
        collection = collection.filter(item => {
          const searchableText = `${item.hook} ${item.script} ${item.context} ${item.tags.join(' ')}`.toLowerCase();
          return searchableText.includes(searchTerm);
        });
      }
      
      const results = await collection.toArray();
      console.log('📊 Current filter state:', filter);
      console.log(`📊 contentService.getByFilter() returning ${results.length} filtered contents`);
      
      return results;
    } catch (error) {
      console.error('❌ Error in getByFilter:', error);
      throw error;
    }
  }
  
  async create(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('🔍 contentService.create() called with:', content);
    const now = new Date();
    const id = generateId();
    await db.contents.add({
      ...content,
      id,
      createdAt: now,
      updatedAt: now
    });
    console.log(`✅ Created content with id: ${id}`);
    return id;
  }
  
  async update(id: string, updates: Partial<ContentItem>): Promise<void> {
    console.log(`🔍 contentService.update() called for id: ${id}`, updates);
    await db.contents.update(id, {
      ...updates,
      updatedAt: new Date()
    });
    console.log(`✅ Updated content with id: ${id}`);
  }
  
  async delete(id: string): Promise<void> {
    console.log(`🔍 contentService.delete() called for id: ${id}`);
    await db.contents.delete(id);
    console.log(`✅ Deleted content with id: ${id}`);
  }
  
  async getStats() {
    console.log('🔍 contentService.getStats() called');
    
    // Asegurar que hay datos de prueba
    await initializeSampleData();
    
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

    const stats = {
      totalContents,
      avgViralScore,
      readyContents,
      publishedContents,
      platformDistribution
    };
    
    console.log('📊 contentService.getStats() returning:', stats);
    return stats;
  }
}

// ... keep existing code (campaignService)
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

// Ejemplos específicos para cada tipo de gancho
export const sampleContents: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    platform: ['TikTok', 'Instagram'],
    type: 'Shock',
    hook: 'No vas a creer lo que pasó cuando invertí S/50K en este distrito de Lima - Los resultados te van a SORPRENDER',
    script: 'Hola, soy [nombre] y hace 6 meses decidí hacer un experimento loco. Invertí exactamente S/50,000 en una propiedad en un distrito que todos me decían que era "peligroso" para invertir. Hoy te voy a mostrar los números REALES y por qué esto cambió completamente mi estrategia de inversión en Lima.',
    visualElements: 'Video con transiciones rápidas, números grandes en pantalla, antes/después de la zona, gráficos de ROI impactantes',
    duration: '30s',
    context: 'Gancho de Shock - Contenido impactante que sorprende',
    cta: '¿Quieres saber cuál fue el distrito? Comentalo y te mando toda la data por DM',
    viralScore: 85,
    aiTools: 'Gemini AI - Gancho de Shock',
    tags: ['shock', 'inversión', 'lima', 'roi'],
    status: 'published',
    metrics: {
      views: 125000,
      engagement: 8500,
      shares: 450
    }
  },
  {
    platform: ['Instagram', 'YouTube'],
    type: 'Storytelling',
    hook: 'Te voy a contar la historia de María, una madre soltera que transformó su vida con una decisión inmobiliaria que cambió todo',
    script: 'Esta es María. Hace 2 años era madre soltera, trabajaba en un banco y vivía de alquiler pagando S/1,200 al mes. Un día tomó una decisión que la llevó de pagar alquiler a ser propietaria de 3 departamentos. Te voy a contar exactamente cómo lo hizo y por qué su estrategia puede funcionar para ti también.',
    visualElements: 'Fotos de María, timeline visual de su progreso, propiedades actuales, testimonial en video',
    duration: '60s',
    context: 'Gancho de Storytelling - Narrativa envolvente y emocional',
    cta: 'Si María pudo hacerlo, tú también puedes. ¿Quieres conocer su estrategia completa? Link en bio',
    viralScore: 78,
    aiTools: 'Gemini AI - Gancho de Storytelling',
    tags: ['storytelling', 'historia', 'transformación', 'madre-soltera'],
    status: 'published',
    metrics: {
      views: 89000,
      engagement: 6200,
      shares: 320
    }
  },
  {
    platform: ['TikTok', 'LinkedIn'],
    type: 'Controversial',
    hook: 'La verdad sobre Miraflores que ningún broker te va a decir - Por qué puede ser tu PEOR inversión en 2024',
    script: 'Todos piensan que Miraflores es la zona premium de Lima para invertir. Pero después de analizar 200 transacciones inmobiliarias en los últimos 2 años, descubrí algo que va a cambiar tu perspectiva completamente. Te voy a mostrar la data REAL que los brokers no quieren que sepas.',
    visualElements: 'Gráficos comparativos, data de precios, mapa de Lima, estadísticas sorprendentes',
    duration: '30s',
    context: 'Gancho Polémico - Desafía ideas establecidas sobre Miraflores',
    cta: '¿Te atreves a ver toda la data? Desliza para conocer los números que cambiarán tu opinión',
    viralScore: 92,
    aiTools: 'Gemini AI - Gancho Polémico',
    tags: ['polémico', 'miraflores', 'data', 'inversión'],
    status: 'published',
    metrics: {
      views: 156000,
      engagement: 12300,
      shares: 780
    }
  },
  {
    platform: ['TikTok', 'Instagram'],
    type: 'Reto',
    hook: 'RETO: Si puedes encontrar una mejor inversión que esta con S/80K en Lima, te regalo S/1000',
    script: 'Estoy tan seguro de esta oportunidad de inversión en Lima que te lanzo este reto: Si encuentras una mejor opción con S/80K que dé mejor ROI que esta, te regalo S/1000 en efectivo. Te voy a mostrar todos los números, la ubicación, y por qué estoy dispuesto a apostar mi dinero.',
    visualElements: 'Countdown timer, números del ROI, ubicación del inmueble, términos del reto',
    duration: '30s',
    context: 'Gancho de Reto - Desafío viral con premio real',
    cta: '¿Aceptas el reto? Comenta "ACEPTO" y te mando todos los detalles',
    viralScore: 88,
    aiTools: 'Gemini AI - Gancho de Reto',
    tags: ['reto', 'challenge', 'inversión', 'premio'],
    status: 'published',
    metrics: {
      views: 134000,
      engagement: 9800,
      shares: 560
    }
  },
  {
    platform: ['LinkedIn', 'YouTube'],
    type: 'Educativo',
    hook: 'Como experto en Real Estate con 12 años de experiencia, estos son los 5 errores que destruyen el 90% de las inversiones en Lima',
    script: 'En mis 12 años como especialista en Real Estate he visto más de 1000 transacciones. El 90% de los inversionistas primerizos cometen estos 5 errores que literalmente destruyen su rentabilidad. Hoy voy a compartir contigo mi conocimiento para que no seas parte de esa estadística.',
    visualElements: 'Credenciales profesionales, estadísticas de experiencia, casos reales de errores, soluciones prácticas',
    duration: '60s',
    context: 'Gancho de Autoridad - Demostración de expertise y liderazgo',
    cta: 'Si quieres evitar estos errores y maximizar tu ROI, agenda una consulta gratuita conmigo',
    viralScore: 82,
    aiTools: 'Gemini AI - Gancho de Autoridad',
    tags: ['autoridad', 'experto', 'experiencia', 'errores-comunes'],
    status: 'published',
    metrics: {
      views: 76000,
      engagement: 5400,
      shares: 280
    }
  }
];

export const contentService = new ContentService();
