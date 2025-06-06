import { HookGenerationParams, CompleteContentGenerationParams } from '../ai-generator';
import { generateHookTypePrompt } from './enhanced-hook-types';
import { getContentTemplateForType, getDayThemeRecommendation, LIMA_CONTENT_TEMPLATES } from './lima-content-templates';
import { 
  getDistrictData, 
  getRelevantSuccessStories, 
  getRelevantHashtags, 
  getRelevantMarketInsights,
  getRelevantTrends 
} from '../local-insights';
import { ContentValidator } from './content-validator';

export class EnhancedPromptBuilder {
  static buildEnhancedHookPrompt(params: HookGenerationParams): string {
    // Obtener datos contextuales relevantes
    const districtData = this.extractDistrictFromTopic(params.topic);
    const successStories = getRelevantSuccessStories(params.audience, districtData?.name);
    const marketInsights = getRelevantMarketInsights(params.topic);
    const trends = getRelevantTrends(params.audience);
    const template = getContentTemplateForType(params.type);
    const todayTheme = getDayThemeRecommendation(new Date().getDay());
    
    const contextualData = this.buildContextualData(districtData, successStories, marketInsights, trends);
    const restrictions = ContentValidator.getPromptRestrictions();
    const hookTypeGuide = generateHookTypePrompt(params.type);
    
    return `
Eres un experto en marketing inmobiliario digital con vasta experiencia en el mercado de Lima, Perú. Tu objetivo es crear hooks virales y de alto impacto para redes sociales, adaptados al público peruano y al sector inmobiliario emergente.

${restrictions}

**DATOS CONTEXTUALES DE LIMA 2024-2025:**
${contextualData}

${hookTypeGuide}

**TEMPLATE SUGERIDO:** ${template ? template.name : 'Genérico'}
${template ? `Estructura: ${template.structure.join(' → ')}` : ''}

**TEMA DEL DÍA:** ${todayTheme?.name} - ${todayTheme?.focus}

**DIFERENCIACIÓN CRÍTICA POR TIPO:**

**EDUCATIVO vs OTROS:**
- EDUCATIVO: "Llevo X años... Estos datos/errores..." (Credencial + Experiencia + Enseñanza)
- SHOCK: "X% de personas comete este error..." (Estadística sorprendente + Consecuencia)
- POLÉMICO: "Las inmobiliarias NO quieren que sepas..." (Crítica a industria + Insider knowledge)

**Instrucciones Generales:**
1. Genera solo el HOOK inicial para un contenido de video corto.
2. El hook debe ser IMPACTANTE, conciso (máximo ${ContentValidator['config'].maxHookWords} palabras), y generar curiosidad o urgencia.
3. Debe ser gramaticalmente impecable en español de Lima, utilizando un lenguaje que resuene con la audiencia objetivo.
4. UTILIZA los datos contextuales proporcionados para hacer el hook más específico y relevante.
5. SIGUE ESTRICTAMENTE las características del tipo de gancho "${params.type}".
6. La audiencia objetivo es CRÍTICA. El hook debe hablarles directamente o apelar a sus intereses/problemas.
7. Integra el tema principal de forma clara y atractiva.
8. USA SOLO vocabulario profesional inmobiliario aprobado.

**Variables del Contexto:**
- Plataforma: ${params.platform}
- Tipo de Gancho: ${params.type}
- Tema Principal: ${params.topic}
- Audiencia Objetivo: ${params.audience}
- Contexto Adicional: ${params.context}
- Objetivo de Viralidad (1-10): ${params.viralScoreTarget}

---

**GUÍA ESPECÍFICA PARA OBJETIVO DE VIRALIDAD:**
${this.getViralityGuide(params.viralScoreTarget)}

---

**INSTRUCCIONES ESPECIALES BASADAS EN DATOS LOCALES:**
${this.getLocalDataInstructions(districtData, successStories, marketInsights)}

---

**Contexto Local de Lima 2025:**
- Usa referencias actualizadas del mercado inmobiliario limeño
- Incorpora distritos emergentes y en crecimiento mencionados en los datos
- Considera el poder adquisitivo de jóvenes profesionales peruanos
- Utiliza expresiones naturales del español de Lima
- Aprovecha tendencias de inversión y revalorización local específicas

**Ejemplo de Hook Exitoso para Referencia:**
Para el tipo "${params.type}" con viralidad ${params.viralScoreTarget}, considerando los datos locales:
${this.getEnhancedExampleHook(params.type, params.viralScoreTarget, districtData)}

---

**VALIDACIÓN FINAL:** 
Antes de generar, verifica que el hook:
✅ Cumple con las características ESPECÍFICAS del tipo "${params.type}"
✅ Se diferencia claramente de otros tipos de gancho
✅ Usa datos contextuales de Lima cuando sea relevante
✅ Máximo ${ContentValidator['config'].maxHookWords} palabras
✅ Vocabulario profesional inmobiliario únicamente

**Ahora, genera un hook único, impactante y específico usando todos estos parámetros y datos contextuales. RESPONDE SOLO con el hook, sin explicaciones adicionales.**

Tema: ${params.topic}
Audiencia: ${params.audience}
Contexto: ${params.context}
    `;
  }

  static buildEnhancedCompleteContentPrompt(params: CompleteContentGenerationParams): string {
    const districtData = this.extractDistrictFromTopic(params.topic);
    const hashtags = getRelevantHashtags(districtData?.name, params.topic);
    const successStories = getRelevantSuccessStories(params.audience, districtData?.name);
    const marketInsights = getRelevantMarketInsights(params.topic);
    const template = getContentTemplateForType(params.type);
    const restrictions = ContentValidator.getPromptRestrictions();
    
    return `
Eres un experto en marketing inmobiliario digital y creador de contenido viral en Lima, Perú. Tu tarea es expandir el siguiente HOOK en un contenido completo para ${params.platform}, siguiendo la estructura de templates probados.

${restrictions}

**HOOK YA GENERADO:** "${params.hook}"

**TEMPLATE SUGERIDO:** ${template ? template.name : 'Estructura Genérica'}
${template ? `
**Estructura del Template:**
${template.structure.map((step, i) => `${i + 1}. ${step}`).join('\n')}

**Ejemplo de aplicación:**
Hook: ${template.examples.hook}
Puntos clave: ${template.examples.keyPoints.join(', ')}
CTA: ${template.examples.cta}
` : ''}

**DATOS CONTEXTUALES RELEVANTES:**
${this.buildContextualData(districtData, successStories, marketInsights, [])}

**Hashtags Sugeridos:** ${hashtags.join(', ')}

**Contexto Completo del Contenido:**
- Plataforma: ${params.platform}
- Tipo de Gancho: ${params.type}
- Tema Principal: ${params.topic}
- Audiencia Objetivo: ${params.audience}
- Contexto Adicional: ${params.context}
- Objetivo de Viralidad (1-10): ${params.viralScoreTarget}

---

**Instrucciones para la Generación del Contenido Completo:**

1. **Script Completo (150-${ContentValidator['config'].maxScriptWords} palabras):**
   - Debe ser una continuación lógica y fluida del HOOK.
   - ${template ? `Sigue la estructura del template ${template.name}` : 'Estructura: Problema → Solución → Beneficios → Evidencia/Ejemplos → Llamada a la acción.'}
   - Tono: Consistente con el tipo de gancho "${params.type}" y la plataforma ${params.platform}.
   - UTILIZA los datos contextuales específicos proporcionados (precios, proyectos, casos de éxito).
   - Incluye frases clave, datos relevantes sobre Lima (distritos, precios, tendencias, etc.).
   - Asegura coherencia gramatical y léxica en español de Lima.
   - Incorpora elementos específicos del mercado inmobiliario peruano 2025.
   - USA SOLO vocabulario profesional inmobiliario aprobado.
   - INCLUYE una llamada a la acción específica y clara.

2. **Elementos Visuales Sugeridos:**
   ${this.getPlatformVisualGuide(params.platform)}
   ${districtData ? `- Incluir imágenes específicas de ${districtData.name}: ${districtData.characteristics.join(', ')}` : ''}
   ${template ? `- Elementos visuales del template: ${template.structure.join(', ')}` : ''}

3. **CTA Optimizado (Llamada a la Acción):**
   - Debe ser ÚNICO, CLARO y ORIENTADO A LA ACCIÓN.
   - ${template ? `Inspirado en: "${template.examples.cta}"` : 'CTA genérico optimizado'}
   - Adapta el CTA a ${params.platform} y al objetivo de viralidad ${params.viralScoreTarget}.
   - Sugiere dónde colocar el CTA (al final del video, en la descripción, link en bio).
   - Ejemplos efectivos: "Agenda asesoría gratuita", "Descarga la guía de distritos 2025", "Envíanos un DM para más info".

4. **Estrategia de Distribución:**
   **Horarios:** ${this.getPlatformTimingGuide(params.platform)}
   **Hashtags:** ${hashtags.join(' ')}
   **Estrategias de Crecimiento:** Menciona técnicas específicas para ${params.platform} que aumenten el alcance.

5. **Métricas Proyectadas:**
   ${this.getMetricsGuide(params.viralScoreTarget, params.platform)}

**Contexto Específico de Lima 2025:**
${this.buildDetailedLimaContext(districtData, marketInsights)}

Responde ÚNICAMENTE con el JSON válido en esta estructura exacta:

{
  "script": "Script completo desarrollando el hook de manera fluida y persuasiva...",
  "visualElements": "Descripción detallada de elementos visuales específicos para ${params.platform}...",
  "cta": "Call-to-action optimizado y específico...",
  "distributionStrategy": "Estrategia completa: horarios, hashtags, técnicas de crecimiento...",
  "projectedMetrics": {
    "estimatedViews": número_realista_de_vistas,
    "estimatedEngagement": porcentaje_de_engagement,
    "estimatedShares": número_de_shares
  }
}
    `;
  }

  private static extractDistrictFromTopic(topic: string) {
    const topicLower = topic.toLowerCase();
    const districts = ['miraflores', 'san_isidro', 'surco', 'pueblo_libre', 'brena', 'jesus_maria', 'magdalena'];
    
    for (const district of districts) {
      if (topicLower.includes(district.replace('_', ' ')) || topicLower.includes(district)) {
        return getDistrictData(district);
      }
    }
    return null;
  }

  private static buildContextualData(districtData: any, successStories: any[], marketInsights: any[], trends: string[]): string {
    let context = '';
    
    if (districtData) {
      context += `\n**Datos del Distrito ${districtData.name}:**\n`;
      context += `- Precio promedio por m²: S/${districtData.price_m2.toLocaleString()}\n`;
      context += `- Crecimiento proyectado: ${districtData.growth_percentage}%\n`;
      context += `- Rentabilidad anual: ${districtData.rental_yield}%\n`;
      context += `- Proyectos de infraestructura: ${districtData.infrastructure_projects.join(', ')}\n`;
      context += `- Características: ${districtData.characteristics.join(', ')}\n`;
    }
    
    if (successStories.length > 0) {
      context += `\n**Casos de Éxito Relevantes:**\n`;
      successStories.slice(0, 2).forEach(story => {
        context += `- ${story.client_type} en ${story.district}: ROI ${story.roi_percentage}% en ${story.timeframe_months} meses\n`;
      });
    }
    
    if (marketInsights.length > 0) {
      context += `\n**Insights de Mercado:**\n`;
      marketInsights.slice(0, 2).forEach(insight => {
        context += `- ${insight.insight}\n`;
      });
    }
    
    if (trends.length > 0) {
      context += `\n**Tendencias 2025:**\n`;
      trends.forEach(trend => {
        context += `- ${trend}\n`;
      });
    }
    
    return context;
  }

  private static buildDetailedLimaContext(districtData: any, marketInsights: any[]): string {
    return `
- Distritos en crecimiento: Pueblo Libre, Breña, Jesús María, Magdalena
- Precios promedio por m²: Miraflores (S/8,500), San Isidro (S/9,200), Surco (S/6,800)
- Tendencias: Espacios híbridos trabajo-vivienda, sostenibilidad, conectividad
- Jerga local: "jalado", "bacán", "chévere", "pata" (amigo)
- Referencias culturales: Metro de Lima, tráfico de la Panamericana, fin de semana en Asia
${districtData ? `- Datos específicos de ${districtData.name}: ${districtData.characteristics.join(', ')}` : ''}
${marketInsights.length > 0 ? `- Insight clave: ${marketInsights[0].insight}` : ''}
    `;
  }

  private static getLocalDataInstructions(districtData: any, successStories: any[], marketInsights: any[]): string {
    let instructions = '';
    
    if (districtData) {
      instructions += `- Menciona el precio específico de S/${districtData.price_m2.toLocaleString()} por m² en ${districtData.name}\n`;
      instructions += `- Destaca el crecimiento proyectado del ${districtData.growth_percentage}%\n`;
      instructions += `- Usa las características específicas: ${districtData.characteristics.slice(0, 2).join(', ')}\n`;
    }
    
    if (successStories.length > 0) {
      instructions += `- Puedes referenciar casos como: "${successStories[0].client_type} logró ${successStories[0].roi_percentage}% ROI"\n`;
    }
    
    if (marketInsights.length > 0) {
      instructions += `- Incorpora este insight: "${marketInsights[0].insight}"\n`;
    }
    
    return instructions || '- Usa datos generales del mercado limeño';
  }

  private static getEnhancedExampleHook(type: string, viralScore: number, districtData: any): string {
    const baseExamples = {
      'Autoridad': viralScore >= 8 
        ? `Lima 2025: 3 distritos con alto potencial de revalorización 📈` 
        : `Como experto inmobiliario, te revelo los 3 distritos con mayor potencial 2025`,
      'Controversial': viralScore >= 8 
        ? `¿Sigues pensando que Miraflores es la mejor inversión? 🤔` 
        : `Olvídate de Miraflores, estos 3 distritos son mejores inversiones`,
      'Shock': viralScore >= 8 
        ? `95% de limeños NO conoce estos distritos de alta revalorización 😱` 
        : `El error que cometen 9 de cada 10 compradores en Lima`,
      'Predictivo': viralScore >= 8 
        ? `Crecimiento inmobiliario 2025: 3 distritos que se revalorizarán significativamente` 
        : `Estos 3 distritos tendrán el mayor crecimiento en 2025`
    };
    
    let example = baseExamples[type] || "Hook optimizado para tu tipo de contenido y nivel de viralidad";
    
    if (districtData) {
      example = example.replace('3 distritos', `${districtData.name} y 2 distritos más`);
    }
    
    return example;
  }

  private static getViralityGuide(viralScore: number): string {
    if (viralScore <= 3) {
      return `**1-3 (Bajo Impacto):** Tono informativo, directo, claro. Enfocado en la utilidad o dato específico. Menos emocional. Ejemplo: "3 distritos de Lima con mejor proyección inmobiliaria 2025"`;
    } else if (viralScore <= 6) {
      return `**4-6 (Moderado Impacto):** Un poco más de emoción o una pregunta que invite a la reflexión. Introduce un elemento de novedad o beneficio. Ejemplo: "¿Conoces estos 3 distritos que van a cambiar en 2025?"`;
    } else if (viralScore <= 8) {
      return `**7-8 (Alto Impacto):** Lenguaje más enérgico, uso de preguntas retóricas, misterio, o una promesa clara. Juega con la emoción y la curiosidad. Ejemplo: "¡Los 3 distritos de Lima que se revalorizarán significativamente en 2025!"`;
    } else {
      return `**9-10 (Viral Masivo):** Lenguaje muy ENÉRGICO, que desafíe la norma, que genere asombro, urgencia o conocimiento exclusivo. Usa emojis profesionales para enfatizar. Ejemplo: "Lima 2025: 3 distritos con potencial de revalorización que pocos conocen 🤫 ¿Te quedarás sin esta oportunidad?"`;
    }
  }

  private static getPlatformVisualGuide(platform: string): string {
    const guides = {
      'TikTok': 'Transiciones rápidas, música trending, texto overlay dinámico, tomas verticales, cambios de escenario cada 3-5 segundos, mapas animados de Lima, gráficos simples con números grandes.',
      'Instagram': 'Reels dinámicos con transiciones suaves, carruseles informativos, stories interactivas, imágenes de alta calidad de propiedades, antes/después, gráficos estéticamente atractivos.',
      'YouTube': 'Tomas más largas y profesionales, gráficos detallados, B-roll de propiedades, entrevistas, mapas interactivos, animaciones explicativas, intro y outro consistentes.',
      'LinkedIn': 'Gráficos profesionales e informativos, datos y estadísticas, videos de alta calidad con presentador, infografías, testimoniales de clientes, casos de estudio visuales.'
    };

    return guides[platform] || guides['Instagram'];
  }

  private static getPlatformTimingGuide(platform: string): string {
    const guides = {
      'TikTok': 'Mejores horarios en Lima: 7 PM - 10 PM L-V (jóvenes post-trabajo), 1 PM - 4 PM S-D (tiempo libre), 11 AM - 1 PM (pausa almuerzo).',
      'Instagram': 'Óptimo: 6 PM - 9 PM L-V (engagement máximo), 10 AM - 12 PM S-D (navegación relajada), evitar 2 PM - 4 PM (siesta).',
      'YouTube': 'Prime time: 8 PM - 11 PM todos los días (contenido largo), 12 PM - 2 PM (almuerzo), fines de semana 3 PM - 6 PM.',
      'LinkedIn': 'Horarios laborales: 8 AM - 10 AM (inicio día), 12 PM - 2 PM (almuerzo), 5 PM - 7 PM (final jornada), evitar fines de semana.'
    };

    return guides[platform] || guides['Instagram'];
  }

  private static getMetricsGuide(viralScore: number, platform: string): string {
    if (viralScore <= 3) {
      return 'Haz una estimación conservadora: Views: 1k-5k | Engagement: 3-6% | Shares: 0.2-1%. Justifica: "Contenido informativo con audiencia específica interesada en el tema."';
    } else if (viralScore <= 6) {
      return 'Estimación moderada: Views: 5k-20k | Engagement: 5-8% | Shares: 1-3%. Justifica: "Contenido con elementos de curiosidad que invita a la interacción."';
    } else if (viralScore <= 8) {
      return 'Estimación alta: Views: 20k-80k | Engagement: 8-12% | Shares: 3-6%. Justifica: "Hook impactante y tema relevante que genera discusión y compartidos."';
    } else {
      return 'Estimación viral: Views: 50k-300k+ | Engagement: 10-20% | Shares: 5-15%. Justifica: "Contenido controvertial/impactante con alto potencial viral por su naturaleza disruptiva."';
    }
  }
}
