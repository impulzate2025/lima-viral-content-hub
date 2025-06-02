
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
export const contentService = {
  async getAll(): Promise<ContentItem[]> {
    console.log('🔍 contentService.getAll() called');
    
    // Siempre verificar e inicializar datos de prueba si es necesario
    await initializeSampleData();
    
    const contents = await db.contents.orderBy('updatedAt').reverse().toArray();
    console.log(`📊 contentService.getAll() returning ${contents.length} contents`);
    return contents;
  },
  
  async getByFilter(filter: ContentFilter): Promise<ContentItem[]> {
    console.log('🔍 contentService.getByFilter() called with filter:', filter);
    
    let query = db.contents.toCollection();
    
    // Platform filter - check if any of the content's platforms match the filter
    if (filter.platform) {
      console.log(`🏷️ Filtering by platform: ${filter.platform}`);
      query = query.filter(item => item.platform.includes(filter.platform!));
    }
    
    // Type filter
    if (filter.type) {
      console.log(`🏷️ Filtering by type: ${filter.type}`);
      query = query.filter(item => item.type === filter.type);
    }
    
    // Status filter
    if (filter.status) {
      console.log(`🏷️ Filtering by status: ${filter.status}`);
      query = query.filter(item => item.status === filter.status);
    }
    
    // Duration filter
    if (filter.duration) {
      console.log(`🏷️ Filtering by duration: ${filter.duration}`);
      query = query.filter(item => item.duration === filter.duration);
    }
    
    // Viral score range filter
    if (filter.minViralScore !== undefined) {
      console.log(`🏷️ Filtering by minViralScore: ${filter.minViralScore}`);
      query = query.filter(item => item.viralScore >= filter.minViralScore!);
    }
    if (filter.maxViralScore !== undefined) {
      console.log(`🏷️ Filtering by maxViralScore: ${filter.maxViralScore}`);
      query = query.filter(item => item.viralScore <= filter.maxViralScore!);
    }
    
    // Search filter - search in hook, script, and context
    if (filter.search && filter.search.trim() !== '') {
      const searchTerm = filter.search.toLowerCase().trim();
      console.log(`🔍 Filtering by search term: "${searchTerm}"`);
      query = query.filter(item => 
        item.hook.toLowerCase().includes(searchTerm) ||
        item.script.toLowerCase().includes(searchTerm) ||
        item.context.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    const results = await query.toArray();
    console.log(`📊 contentService.getByFilter() returning ${results.length} filtered contents`);
    return results;
  },
  
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
  },
  
  async update(id: string, updates: Partial<ContentItem>): Promise<void> {
    console.log(`🔍 contentService.update() called for id: ${id}`, updates);
    await db.contents.update(id, {
      ...updates,
      updatedAt: new Date()
    });
    console.log(`✅ Updated content with id: ${id}`);
  },
  
  async delete(id: string): Promise<void> {
    console.log(`🔍 contentService.delete() called for id: ${id}`);
    await db.contents.delete(id);
    console.log(`✅ Deleted content with id: ${id}`);
  },

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
};

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
