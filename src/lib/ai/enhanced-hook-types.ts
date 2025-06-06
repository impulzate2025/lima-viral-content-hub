
export interface HookTypeConfig {
  description: string;
  tone: string;
  structure: string;
  examples: string[];
  forbiddenElements: string[];
  requiredElements: string[];
}

export const HOOK_TYPE_CONFIGURATIONS: Record<string, HookTypeConfig> = {
  'Educativo': {
    description: 'Contenido educativo viral que enseña algo valioso usando datos y experiencia profesional',
    tone: 'Profesional pero accesible, basado en credenciales y experiencia',
    structure: 'Credencial + Experiencia + Dato/Insight específico + Promesa de valor',
    examples: [
      'Llevo 8 años vendiendo propiedades en Lima. Estos datos cambiarán tu perspectiva...',
      'Analicé 500 ventas en San Isidro. El 80% paga de más por este error...',
      'Vendí 200 propiedades en Lima. Estos 3 errores arruinan a compradores primerizos...'
    ],
    requiredElements: ['experiencia específica', 'dato concreto', 'valor educativo'],
    forbiddenElements: ['controversia artificial', 'shock sin fundamento', 'promesas exageradas']
  },
  
  'Shock': {
    description: 'Revelación impactante que rompe expectativas usando estadísticas sorprendentes',
    tone: 'Impactante pero respaldado por datos reales',
    structure: 'Estadística sorprendente + Consecuencia inesperada + Revelación específica',
    examples: [
      '95% de compradores en Lima comete este error y pierde S/50K...',
      'Solo 3 de cada 100 propiedades en Miraflores son realmente rentables...',
      'El 87% de inversores extranjeros falla en Lima por ignorar esto...'
    ],
    requiredElements: ['estadística real', 'consecuencia específica', 'elemento inesperado'],
    forbiddenElements: ['datos inventados', 'exageraciones sin base', 'alarmismo gratuito']
  },
  
  'Controversial': {
    description: 'Desafía creencias establecidas del mercado con perspectiva contrarian respaldada',
    tone: 'Provocador pero fundamentado, desafía el status quo',
    structure: 'Creencia común + Contradicción con evidencia + Nueva perspectiva',
    examples: [
      '¿Miraflores siempre es buena inversión? Los números dicen lo contrario...',
      'Todos dicen "compra en planos". Yo digo que es tu peor error...',
      'La verdad sobre condominios en La Molina que nadie cuenta...'
    ],
    requiredElements: ['mito establecido', 'evidencia contraria', 'nueva perspectiva'],
    forbiddenElements: ['controversia sin fundamento', 'ataques personales', 'información falsa']
  },
  
  'Polemico': {
    description: 'Critica directamente prácticas establecidas de la industria con insider knowledge',
    tone: 'Crítico y directo, "whistleblower" de la industria',
    structure: 'Práctica cuestionable + Insider knowledge + Consecuencias ocultas',
    examples: [
      'Por qué las inmobiliarias NO quieren que sepas esto sobre comisiones...',
      'La gran mentira de los bancos sobre créditos hipotecarios en Lima...',
      'Desarrolladores ocultan esta información crucial sobre estos proyectos...'
    ],
    requiredElements: ['crítica específica', 'conocimiento interno', 'consecuencias reveladas'],
    forbiddenElements: ['acusaciones sin pruebas', 'teorías conspirativas', 'difamación']
  },
  
  'Autoridad': {
    description: 'Demuestra expertise profundo con proyecciones y análisis profesional',
    tone: 'Experto y seguro, thought leadership',
    structure: 'Credencial + Análisis profundo + Proyección/Predicción específica',
    examples: [
      'Como experto en mercado limeño, estas son mis proyecciones 2025...',
      'Basado en mi análisis de 1000+ transacciones, esto pasará en Lima...',
      'Mi experiencia de 15 años me dice que estos distritos liderarán...'
    ],
    requiredElements: ['credencial clara', 'análisis fundamentado', 'proyección específica'],
    forbiddenElements: ['arrogancia', 'predicciones sin base', 'auto-promoción excesiva']
  },
  
  'Predictivo': {
    description: 'Anticipa el futuro del mercado basado en mega-tendencias y proyectos confirmados',
    tone: 'Visionario pero fundamentado en hechos concretos',
    structure: 'Mega-proyecto/tendencia + Impacto calculado + Oportunidad específica',
    examples: [
      'La Línea 2 del Metro cambiará estos 3 distritos para siempre...',
      'Lima 2025: estos mega-proyectos revalorizarán 5 zonas específicas...',
      'El boom de remote work transformará el real estate limeño así...'
    ],
    requiredElements: ['factor de cambio real', 'impacto medible', 'timing específico'],
    forbiddenElements: ['especulación sin base', 'predicciones vagas', 'promesas garantizadas']
  },
  
  'Testimonial': {
    description: 'Case study real con transformación concreta y lecciones aplicables',
    tone: 'Narrativo y inspirador, centrado en resultados reales',
    structure: 'Cliente específico + Situación inicial + Proceso + Resultado + Lección',
    examples: [
      'María compró en Pueblo Libre por S/180K en 2022. Hoy vale S/240K...',
      'Cliente compró en Breña "por error". 18 meses después agradece...',
      'Joven profesional invirtió S/120K en Jesús María. Su ROI fue...'
    ],
    requiredElements: ['caso real', 'números específicos', 'transformación medible'],
    forbiddenElements: ['testimonios falsos', 'promesas irreales', 'casos idealizados']
  },
  
  'Storytelling': {
    description: 'Historia personal del agente con insights profesionales revelados',
    tone: 'Personal y auténtico, behind-the-scenes profesional',
    structure: 'Situación personal + Desafío + Descubrimiento + Insight aplicable',
    examples: [
      'Mi primer error como broker me costó S/30K. Aprendí esto...',
      'El día que casi perdí mi cliente más importante por ignorar...',
      'Lo que descubrí visitando 50 departamentos en un día...'
    ],
    requiredElements: ['experiencia personal', 'lección aprendida', 'aplicación práctica'],
    forbiddenElements: ['drama innecesario', 'auto-victimización', 'lecciones vagas']
  },
  
  'Behind-Scenes': {
    description: 'Acceso exclusivo a procesos internos y secrets de la industria',
    tone: 'Exclusivo y revelador, insider access',
    structure: 'Proceso interno + Información privilegiada + Ventaja revelada',
    examples: [
      'Lo que realmente pasa en una negociación inmobiliaria...',
      'Así evalúan los bancos tu capacidad crediticia en Lima...',
      'El proceso secreto de tasación que determina precios reales...'
    ],
    requiredElements: ['acceso exclusivo', 'información valiosa', 'ventaja práctica'],
    forbiddenElements: ['información confidencial', 'violación de privacidad', 'secretos falsos']
  },
  
  'Reto': {
    description: 'Desafío directo a la audiencia para demostrar conocimiento o coraje',
    tone: 'Desafiante pero constructivo, call-to-action intelectual',
    structure: 'Desafío específico + Criterio de éxito + Recompensa/consecuencia',
    examples: [
      '¿Puedes identificar cuál de estos 3 depas será mejor inversión?',
      'Te reto: encuentra mejor ROI que este proyecto en Surco...',
      '¿Tienes el criterio para elegir entre estas 3 oportunidades?'
    ],
    requiredElements: ['desafío claro', 'criterio medible', 'participación activa'],
    forbiddenElements: ['retos imposibles', 'humillación', 'competencia desleal']
  }
};

export function getHookTypeConfig(hookType: string): HookTypeConfig {
  return HOOK_TYPE_CONFIGURATIONS[hookType] || HOOK_TYPE_CONFIGURATIONS['Educativo'];
}

export function generateHookTypePrompt(hookType: string): string {
  const config = getHookTypeConfig(hookType);
  
  return `
**TIPO DE GANCHO: ${hookType.toUpperCase()}**

**Definición:** ${config.description}

**Tono Requerido:** ${config.tone}

**Estructura Obligatoria:** ${config.structure}

**Ejemplos de Referencia:**
${config.examples.map(ex => `- "${ex}"`).join('\n')}

**DEBE INCLUIR:**
${config.requiredElements.map(req => `✅ ${req}`).join('\n')}

**PROHIBIDO INCLUIR:**
${config.forbiddenElements.map(forb => `❌ ${forb}`).join('\n')}

**Diferenciador Clave:** ${getDifferentiator(hookType)}
  `;
}

function getDifferentiator(hookType: string): string {
  const differentiators = {
    'Educativo': 'Enseña algo específico basado en experiencia profesional comprobable',
    'Shock': 'Revela estadística inesperada que rompe expectativas comunes',
    'Controversial': 'Desafía creencia establecida con evidencia contraria',
    'Polemico': 'Critica directamente prácticas de la industria desde adentro',
    'Autoridad': 'Demuestra expertise con análisis profundo y proyecciones',
    'Predictivo': 'Anticipa futuro basado en mega-tendencias confirmadas',
    'Testimonial': 'Narra transformación real de cliente con números específicos',
    'Storytelling': 'Comparte experiencia personal del agente con insight aplicable',
    'Behind-Scenes': 'Revela procesos internos normalmente ocultos',
    'Reto': 'Desafía a la audiencia a demostrar conocimiento o tomar acción'
  };
  
  return differentiators[hookType] || 'Diferenciador no definido';
}
