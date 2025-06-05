
import { HookGenerationParams, CompleteContentGenerationParams } from '../ai-generator';

export class PromptBuilder {
  static buildHookPrompt(params: HookGenerationParams): string {
    return `
    FECHA ACTUAL: 2025 - USA SIEMPRE EL AÑO 2025, NUNCA 2024
    
    Eres un experto en marketing viral y creación de contenido para redes sociales en Lima, Perú.
    Tu tarea es generar un gancho (hook) extremadamente viral y atractivo para un contenido específico.

    IMPORTANTE: Estamos en el año 2025. Siempre usa 2025, nunca menciones 2024.

    Plataforma: ${params.platform}
    Tipo de Contenido: ${params.type}
    Tema Principal: ${params.topic}
    Audiencia Objetivo: ${params.audience}
    Contexto Adicional: ${params.context}
    Objetivo de Viralidad (Escala 1-10, donde 10 es máximo viral): ${params.viralScoreTarget}

    Considera los siguientes elementos para maximizar la viralidad en Lima:
    - Curiosidad: Genera intriga desde el primer segundo.
    - Emoción: Conecta con emociones fuertes (sorpresa, humor, indignación, inspiración).
    - Relevancia Local: Usa jergas, lugares, situaciones o tendencias conocidas en Lima y Perú.
    - Brevedad y Directo al Grano: Especialmente para TikTok e Instagram Reels.
    - Controversia (si aplica y es apropiado para el tipo de contenido): Temas que generen debate.
    - Storytelling: Insinúa una historia interesante.
    - Beneficio Claro o Problema Resuelto: ¿Qué ganará el espectador al ver el contenido?
    - Llamada a la Interacción Implícita: Que invite a comentar o compartir.

    CONTEXTO TEMPORAL: Estamos en 2025, todas las referencias temporales deben ser a 2025 o futuro.

    Ejemplos de Ganchos Virales para Inspiración (adaptados a 2025):
    - "¿Sabías que hay un distrito en Lima donde S/100,000 te dan más rentabilidad en 2025 que Miraflores?"
    - "Los brokers de Lima me van a odiar por revelar esto en 2025..."
    - "Esta chica compró en Pueblo Libre con S/50K de inicial. En 2025..."
    
    Genera SOLO el texto del gancho. Debe ser corto, impactante y optimizado para la plataforma indicada.
    RECUERDA: Usa 2025, nunca 2024.
    No incluyas introducciones como "Aquí tienes un gancho:". Solo el gancho.
    `;
  }

  static buildCompleteContentPrompt(params: CompleteContentGenerationParams): string {
    return `
    FECHA ACTUAL: 2025 - USA SIEMPRE EL AÑO 2025, NUNCA 2024
    
    Eres un experto en marketing viral y estrategia de contenido para redes sociales en Lima, Perú.
    Basándote en el hook ya generado, completa el resto del contenido siguiendo el framework VIRAL-RE.

    INFORMACIÓN DEL CONTENIDO:
    Plataforma: ${params.platform}
    Tipo de Contenido: ${params.type}
    Tema Principal: ${params.topic}
    Audiencia Objetivo: ${params.audience}
    Contexto Adicional: ${params.context}
    Hook Generado: "${params.hook}"
    Objetivo de Viralidad: ${params.viralScoreTarget}/10

    CONTEXTO TEMPORAL: Estamos en 2025, todas las referencias temporales deben ser a 2025 o futuro.

    GENERA EL CONTENIDO COMPLETO EN FORMATO JSON con esta estructura exacta:

    {
      "script": "Script completo del contenido (200-500 palabras). Incluye introducción basada en el hook, desarrollo del tema con datos específicos de Lima para 2025, storytelling envolvente, y cierre potente.",
      "visualElements": "Descripción detallada de elementos visuales necesarios: planos, gráficos, texto overlay, transiciones, colores, estilo visual. Específico para ${params.platform}.",
      "cta": "Call-to-action optimizado para generar engagement y conversiones. Debe ser específico y accionable.",
      "distributionStrategy": "Estrategia de distribución: mejores horarios para Lima, hashtags específicos para 2025, cross-posting en otras plataformas, colaboraciones sugeridas.",
      "projectedMetrics": {
        "estimatedViews": número_estimado_de_vistas,
        "estimatedEngagement": porcentaje_estimado_de_engagement,
        "estimatedShares": número_estimado_de_shares
      }
    }

    CONSIDERACIONES IMPORTANTES:
    - El script debe fluir naturalmente desde el hook proporcionado
    - Incluye datos específicos de Lima cuando sea relevante, siempre referenciando 2025
    - Los elementos visuales deben ser específicos para ${params.platform}
    - El CTA debe alinearse con los objetivos del tipo de contenido "${params.type}"
    - Las métricas deben ser realistas basadas en el tipo de contenido y plataforma

    Responde ÚNICAMENTE con el JSON válido, sin texto adicional.
    `;
  }
}
