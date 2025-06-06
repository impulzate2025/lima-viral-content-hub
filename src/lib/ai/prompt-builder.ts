
import { HookGenerationParams, CompleteContentGenerationParams } from '../ai-generator';

export class PromptBuilder {
  static buildHookPrompt(params: HookGenerationParams): string {
    return `
Eres un experto en marketing inmobiliario digital con vasta experiencia en el mercado de Lima, Perú. Tu objetivo es crear hooks virales y de alto impacto para redes sociales, adaptados al público peruano y al sector inmobiliario emergente.

**Instrucciones Generales:**
1. Genera solo el HOOK inicial para un contenido de video corto.
2. El hook debe ser IMPACTANTE, conciso (máximo 15 palabras), y generar curiosidad o urgencia.
3. Debe ser gramaticalmente impecable en español de Lima, utilizando un lenguaje que resuene con la audiencia objetivo.
4. Considera siempre la plataforma para el tono y formato.
5. La audiencia objetivo es CRÍTICA. El hook debe hablarles directamente o apelar a sus intereses/problemas.
6. Integra el tema principal de forma clara y atractiva.
7. El contexto adicional debe enriquecer el hook si es relevante.
8. El tipo de gancho es fundamental para definir el estilo del hook.

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

**GUÍA ESPECÍFICA PARA TIPOS DE GANCHO:**

${this.getHookTypeGuide(params.type)}

---

**Contexto Local de Lima 2025:**
- Usa referencias actualizadas del mercado inmobiliario limeño
- Incorpora distritos emergentes y en crecimiento
- Considera el poder adquisitivo de jóvenes profesionales peruanos
- Utiliza expresiones naturales del español de Lima
- Aprovecha tendencias de inversión y revalorización local

**Ejemplo de Hook Exitoso para Referencia:**
Para el tipo "${params.type}" con viralidad ${params.viralScoreTarget}, un hook efectivo sería:
${this.getExampleHook(params.type, params.viralScoreTarget)}

---

**Ahora, genera un hook único, impactante y específico usando todos estos parámetros. Responde SOLO con el hook, sin explicaciones adicionales.**

Tema: ${params.topic}
Audiencia: ${params.audience}
Contexto: ${params.context}
    `;
  }

  static buildCompleteContentPrompt(params: CompleteContentGenerationParams): string {
    return `
Eres un experto en marketing inmobiliario digital y creador de contenido viral en Lima, Perú. Tu tarea es expandir el siguiente HOOK en un contenido completo para ${params.platform}, incluyendo script, elementos visuales, CTA, estrategia de distribución y métricas proyectadas.

**HOOK YA GENERADO:** "${params.hook}"

**Contexto Completo del Contenido:**
- Plataforma: ${params.platform}
- Tipo de Gancho: ${params.type}
- Tema Principal: ${params.topic}
- Audiencia Objetivo: ${params.audience}
- Contexto Adicional: ${params.context}
- Objetivo de Viralidad (1-10): ${params.viralScoreTarget}

---

**Instrucciones para la Generación del Contenido Completo:**

1. **Script Completo (200-500 palabras):**
   - Debe ser una continuación lógica y fluida del HOOK.
   - Estructura: Problema → Solución → Beneficios → Evidencia/Ejemplos → Llamada a la acción.
   - Tono: Consistente con el tipo de gancho "${params.type}" y la plataforma ${params.platform}.
   - Incluye frases clave, datos relevantes sobre Lima (distritos, precios, tendencias, etc.).
   - Asegura coherencia gramatical y léxica en español de Lima.
   - Incorpora elementos específicos del mercado inmobiliario peruano 2025.

2. **Elementos Visuales Sugeridos:**
   ${this.getPlatformVisualGuide(params.platform)}

3. **CTA Optimizado (Llamada a la Acción):**
   - Debe ser ÚNICO, CLARO y ORIENTADO A LA ACCIÓN.
   - Adapta el CTA a ${params.platform} y al objetivo de viralidad ${params.viralScoreTarget}.
   - Sugiere dónde colocar el CTA (al final del video, en la descripción, link en bio).
   - Ejemplos efectivos: "Agenda asesoría gratuita", "Descarga la guía de distritos 2025", "Envíanos un DM para más info".

4. **Estrategia de Distribución:**
   **Horarios:** ${this.getPlatformTimingGuide(params.platform)}
   **Hashtags:** Proporciona 8-12 hashtags relevantes mezclando amplios y específicos para el nicho inmobiliario limeño.
   **Estrategias de Crecimiento:** Menciona técnicas específicas para ${params.platform} que aumenten el alcance.

5. **Métricas Proyectadas:**
   ${this.getMetricsGuide(params.viralScoreTarget, params.platform)}

**Contexto Específico de Lima 2025:**
- Distritos en crecimiento: Pueblo Libre, Breña, Jesús María, Magdalena
- Precios promedio por m²: Miraflores (S/8,500), San Isidro (S/9,200), Surco (S/6,800)
- Tendencias: Espacios híbridos trabajo-vivienda, sostenibilidad, conectividad
- Jerga local: "jalado", "bacán", "chévere", "pata" (amigo)
- Referencias culturales: Metro de Lima, tráfico de la Panamericana, fin de semana en Asia

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

  private static getViralityGuide(viralScore: number): string {
    if (viralScore <= 3) {
      return `**1-3 (Bajo Impacto):** Tono informativo, directo, claro. Enfocado en la utilidad o dato específico. Menos emocional. Ejemplo: "3 distritos de Lima con mejor proyección inmobiliaria 2025"`;
    } else if (viralScore <= 6) {
      return `**4-6 (Moderado Impacto):** Un poco más de emoción o una pregunta que invite a la reflexión. Introduce un elemento de novedad o beneficio. Ejemplo: "¿Conoces estos 3 distritos que van a cambiar en 2025?"`;
    } else if (viralScore <= 8) {
      return `**7-8 (Alto Impacto):** Lenguaje más enérgico, uso de preguntas retóricas, misterio, o una promesa clara. Juega con la emoción y la curiosidad. Ejemplo: "¡Los 3 distritos de Lima que van a EXPLOTAR en 2025!"`;
    } else {
      return `**9-10 (Viral Masivo):** Lenguaje muy EXPLOSIVO, controvertido (si aplica), que desafíe la norma, que genere asombro, urgencia o un secreto. Usa emojis y exclamaciones para enfatizar. Ejemplo: "¡Lima 2025: 3 distritos BOOM que nadie te dice! 🤫 ¿O te quedarás con las migajas?"`;
    }
  }

  private static getHookTypeGuide(type: string): string {
    const guides = {
      'Autoridad': 'El hook debe posicionarte como un experto. Utiliza frases que demuestren conocimiento profundo, proyecciones, datos o consejos directos. Ej: "Como experto en el mercado limeño...", "Basado en mis años de experiencia...", "Te revelo el secreto de..."',
      'Controversial': 'El hook debe desafiar una creencia común o una práctica estándar. Usa un tono provocador que invite al debate. Ej: "Olvídate de X, la verdad es Y...", "¿Todavía crees en Z? Estás perdiendo dinero..."',
      'Shock': 'El hook debe contener una afirmación impactante, una estadística sorprendente o una revelación inesperada que capture la atención de inmediato. Ej: "Nadie te ha dicho esto sobre...", "El 90% de los compradores cometen este error GIGANTE..."',
      'Predictivo': 'El hook debe anticipar el futuro, revelar tendencias o hacer una proyección sobre el mercado inmobiliario. Ej: "Esto pasará en Lima en 2025...", "Prepárate para la próxima ola de..."',
      'Storytelling': 'Aunque el hook es corto, debe insinuar una historia o un problema narrativo. Ej: "Lo que aprendí al comprar mi primera propiedad...", "Mi cliente casi pierde su sueño por esto..."',
      'Reto': 'El hook debe desafiar directamente a la audiencia o plantearles una meta. Ej: "¿Eres lo suficientemente inteligente para ver esto?", "Te reto a encontrar algo mejor que..."',
      'Polemico': 'Similar a controversial, pero con un matiz más de confrontación o crítica a algo establecido. Ej: "La gran mentira de los bancos sobre...", "Por qué las inmobiliarias NO quieren que sepas..."',
      'Educativo': 'El hook debe prometer una enseñanza clara y directa. Ej: "Aprende los 3 pasos para...", "Guía rápida para entender..."',
      'Testimonial': 'Aunque sin un testimonio completo, el hook puede insinuar una experiencia positiva o un resultado. Ej: "Así logré X...", "Lo que mis clientes me agradecen de..."',
      'Behind-Scenes': 'El hook debe prometer una mirada interna o exclusiva. Ej: "Lo que no ves de los proyectos inmobiliarios...", "Te llevo tras bambalinas..."'
    };

    return guides[type] || guides['Educativo'];
  }

  private static getExampleHook(type: string, viralScore: number): string {
    const examples = {
      'Autoridad': viralScore >= 8 ? "¡Lima 2025: 3 distritos que los BANCOS NO QUIEREN que sepas! 🤫" : "Como experto inmobiliario, te revelo los 3 distritos con mayor potencial 2025",
      'Controversial': viralScore >= 8 ? "¿Sigues creyendo que Miraflores es la mejor inversión? ERROR GIGANTE 🚨" : "Olvídate de Miraflores, estos 3 distritos son mejores inversiones",
      'Shock': viralScore >= 8 ? "¡95% de limeños NO SABE esto sobre inversión inmobiliaria! 😱" : "El error que cometen 9 de cada 10 compradores en Lima",
      'Predictivo': viralScore >= 8 ? "¡BOOM inmobiliario 2025: 3 distritos que EXPLOTAR antes que sea tarde!" : "Estos 3 distritos tendrán el mayor crecimiento en 2025"
    };

    return examples[type] || "Hook optimizado para tu tipo de contenido y nivel de viralidad";
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
