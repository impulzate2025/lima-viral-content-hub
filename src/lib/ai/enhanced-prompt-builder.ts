
import { HookGenerationParams, CompleteContentGenerationParams } from '../ai-generator';
import { generateHookTypePrompt } from './enhanced-hook-types';
import { getContentTemplateForType, getDayThemeRecommendation } from './lima-content-templates';
import { 
  getRelevantSuccessStories, 
  getRelevantHashtags, 
  getRelevantMarketInsights,
  getRelevantTrends 
} from '../local-insights';
import { ContentValidator } from './content-validator';
import { ContextDataBuilder } from './prompt-builders/context-data-builder';
import { ViralityGuideBuilder } from './prompt-builders/virality-guide-builder';
import { PlatformGuideBuilder } from './prompt-builders/platform-guide-builder';

export class EnhancedPromptBuilder {
  static buildEnhancedHookPrompt(params: HookGenerationParams): string {
    // Obtener datos contextuales relevantes
    const districtData = ContextDataBuilder.extractDistrictFromTopic(params.topic);
    const successStories = getRelevantSuccessStories(params.audience, districtData?.name);
    const marketInsights = getRelevantMarketInsights(params.topic);
    const trends = getRelevantTrends(params.audience);
    const template = getContentTemplateForType(params.type);
    const todayTheme = getDayThemeRecommendation(new Date().getDay());
    
    const contextualData = ContextDataBuilder.buildContextualData(districtData, successStories, marketInsights, trends);
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
${ViralityGuideBuilder.getViralityGuide(params.viralScoreTarget)}

---

**INSTRUCCIONES ESPECIALES BASADAS EN DATOS LOCALES:**
${ContextDataBuilder.getLocalDataInstructions(districtData, successStories, marketInsights)}

---

**Contexto Local de Lima 2025:**
- Usa referencias actualizadas del mercado inmobiliario limeño
- Incorpora distritos emergentes y en crecimiento mencionados en los datos
- Considera el poder adquisitivo de jóvenes profesionales peruanos
- Utiliza expresiones naturales del español de Lima
- Aprovecha tendencias de inversión y revalorización local específicas

**Ejemplo de Hook Exitoso para Referencia:**
Para el tipo "${params.type}" con viralidad ${params.viralScoreTarget}, considerando los datos locales:
${ViralityGuideBuilder.getEnhancedExampleHook(params.type, params.viralScoreTarget, districtData)}

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
    const districtData = ContextDataBuilder.extractDistrictFromTopic(params.topic);
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
${ContextDataBuilder.buildContextualData(districtData, successStories, marketInsights, [])}

**Hashtags Sugeridos:** ${hashtags.join(', ')}

**ESTRUCTURA OBLIGATORIA PARA CTA:**
- TÚ eres el experto que puede resolver su problema
- Ofrece valor específico: "Te comparto el análisis completo", "Agenda tu consulta gratuita"
- Crea urgencia sin presión: "Solo 3 consultas disponibles esta semana"
- NUNCA digas: "busca asesoría", "investiga", "consulta con expertos"
- SIEMPRE: "Envíame DM", "Agenda conmigo", "Te ayudo a", "Descarga mi guía"

**EJEMPLOS DE CTA CORRECTOS:**
- "Envíame un DM con 'DISTRITOS' y te comparto el análisis completo de estas 3 zonas"
- "Agenda tu consulta gratuita conmigo - link en mi bio - y evaluamos tu mejor opción"
- "Descarga mi guía gratuita 'Inversión Lima 2025' - solo por WhatsApp al 999-XXX-XXX"
- "Te ayudo a encontrar tu primera propiedad. Comentarios 'QUIERO' y te contacto"

**EJEMPLOS DE CTA PROHIBIDOS:**
- ❌ "Busca asesoría profesional"
- ❌ "Investiga propiedades en estas zonas"  
- ❌ "Consulta con expertos"
- ❌ "Analiza su potencial de rentabilidad"

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
   - ${template ? `Sigue la estructura del template ${template.name}` : 'Estructura: Problema → Solución → Beneficios → Evidencia/Ejemplos → TÚ como la solución.'}
   - Tono: Consistente con el tipo de gancho "${params.type}" y la plataforma ${params.platform}.
   - UTILIZA los datos contextuales específicos proporcionados (precios, proyectos, casos de éxito).
   - El agente debe posicionarse como LA SOLUCIÓN al problema presentado.
   - Incluye casos específicos SIN usar "cliente" o referencias familiares irrelevantes.
   - USA SOLO vocabulario profesional inmobiliario aprobado.
   - TERMINA con CTA donde TÚ eres quien ayuda, no donde envías a "buscar ayuda".

2. **Elementos Visuales Sugeridos:**
   ${PlatformGuideBuilder.getPlatformVisualGuide(params.platform)}
   ${districtData ? `- Incluir imágenes específicas de ${districtData.name}: ${districtData.characteristics.join(', ')}` : ''}
   ${template ? `- Elementos visuales del template: ${template.structure.join(', ')}` : ''}

3. **CTA Optimizado (Llamada a la Acción):**
   - Debe ser ÚNICO, CLARO y donde TÚ eres la solución.
   - ${template ? `Inspirado en: "${template.examples.cta}"` : 'CTA específico donde ofreces tu servicio directo'}
   - Adapta el CTA a ${params.platform} y al objetivo de viralidad ${params.viralScoreTarget}.
   - EJEMPLOS CORRECTOS: "Agenda conmigo", "Te ayudo", "Descarga mi guía", "Envíame DM"
   - PROHIBIDO: "busca", "investiga", "consulta con otros", "analiza por tu cuenta"

4. **Estrategia de Distribución:**
   **Horarios:** ${PlatformGuideBuilder.getPlatformTimingGuide(params.platform)}
   **Hashtags:** ${hashtags.join(' ')}
   **Estrategias de Crecimiento:** Menciona técnicas específicas para ${params.platform} que aumenten el alcance.

5. **Métricas Proyectadas:**
   ${ViralityGuideBuilder.getMetricsGuide(params.viralScoreTarget, params.platform)}

**Contexto Específico de Lima 2025:**
${ContextDataBuilder.buildDetailedLimaContext(districtData, marketInsights)}

**RECORDATORIO FINAL:**
- NUNCA uses "busca asesoría", "investiga", "consulta con expertos"
- SIEMPRE posiciona al agente como LA SOLUCIÓN
- Casos de éxito específicos: "Un joven profesional", "Una pareja", "Un inversionista"
- CTA debe generar acción HACIA el agente, no hacia otros

Responde ÚNICAMENTE con el JSON válido en esta estructura exacta:

{
  "script": "Script completo desarrollando el hook de manera fluida y persuasiva, terminando con CTA donde TÚ eres la solución...",
  "visualElements": "Descripción detallada de elementos visuales específicos para ${params.platform}...",
  "cta": "Call-to-action optimizado donde TÚ ayudas directamente, no envías a buscar ayuda...",
  "distributionStrategy": "Estrategia completa: horarios, hashtags, técnicas de crecimiento...",
  "projectedMetrics": {
    "estimatedViews": número_realista_de_vistas,
    "estimatedEngagement": porcentaje_de_engagement,
    "estimatedShares": número_de_shares
  }
}
    `;
  }
}
