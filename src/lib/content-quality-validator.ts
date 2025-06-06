
import { ContentQualityScore } from '@/types/local-insights';
import { LIMA_INSIGHTS } from './local-insights';

export class ContentQualityValidator {
  
  static validateContent(hook: string, script?: string, cta?: string, audience?: string): ContentQualityScore {
    const grammar_score = this.calculateGrammarScore(hook, script);
    const relevance_score = this.calculateRelevanceScore(hook, script, audience);
    const local_context = this.hasLocalContext(hook, script);
    const cta_present = this.hasCTA(cta, hook, script);
    const hook_strength = this.calculateHookStrength(hook);
    
    const overall_score = this.calculateOverallScore({
      grammar_score,
      relevance_score,
      local_context,
      cta_present,
      hook_strength
    });
    
    const suggestions = this.generateSuggestions({
      grammar_score,
      relevance_score,
      local_context,
      cta_present,
      hook_strength,
      hook,
      script,
      cta
    });
    
    return {
      grammar_score,
      relevance_score,
      local_context,
      cta_present,
      hook_strength,
      overall_score,
      suggestions
    };
  }
  
  private static calculateGrammarScore(hook: string, script?: string): number {
    const text = `${hook} ${script || ''}`.toLowerCase();
    let score = 100;
    
    // Penalizaciones por errores comunes
    const commonErrors = [
      { pattern: /\s{2,}/g, penalty: 5, description: 'espacios dobles' },
      { pattern: /[.]{2,}/g, penalty: 10, description: 'puntos múltiples' },
      { pattern: /[!]{3,}/g, penalty: 5, description: 'exclamaciones excesivas' },
      { pattern: /[?]{2,}/g, penalty: 10, description: 'signos de interrogación múltiples' },
      { pattern: /\b(tú|tu)\b/g, penalty: 2, description: 'inconsistencia en tuteo' }
    ];
    
    commonErrors.forEach(error => {
      const matches = text.match(error.pattern);
      if (matches) {
        score -= Math.min(error.penalty * matches.length, 20);
      }
    });
    
    // Bonificaciones por buenas prácticas
    if (hook.length > 5 && hook.length < 100) score += 5; // Longitud adecuada
    if (/[¿¡]/.test(hook)) score += 3; // Signos de interrogación/exclamación españoles
    
    return Math.max(0, Math.min(100, score));
  }
  
  private static calculateRelevanceScore(hook: string, script?: string, audience?: string): number {
    const text = `${hook} ${script || ''}`.toLowerCase();
    let score = 50; // Base score
    
    // Keywords inmobiliarios
    const realEstateKeywords = [
      'departamento', 'casa', 'propiedad', 'inversión', 'comprar', 'vender',
      'alquiler', 'distrito', 'lima', 'metro', 'revalorización', 'financiamiento'
    ];
    
    realEstateKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 3;
    });
    
    // Distritos de Lima
    Object.keys(LIMA_INSIGHTS.districts).forEach(district => {
      if (text.includes(district.replace('_', ' '))) score += 5;
    });
    
    // Relevancia por audiencia
    if (audience) {
      const audienceKeywords = {
        'joven': ['joven', 'profesional', 'primera', 'moderno'],
        'familia': ['familia', 'hijos', 'colegio', 'parque', 'seguro'],
        'inversor': ['inversión', 'rentabilidad', 'roi', 'oportunidad', 'crecimiento']
      };
      
      Object.entries(audienceKeywords).forEach(([type, keywords]) => {
        if (audience.toLowerCase().includes(type)) {
          keywords.forEach(keyword => {
            if (text.includes(keyword)) score += 4;
          });
        }
      });
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  private static hasLocalContext(hook: string, script?: string): boolean {
    const text = `${hook} ${script || ''}`.toLowerCase();
    
    // Verificar menciones de Lima, distritos, o referencias locales
    const localReferences = [
      'lima', 'perú', 'soles', 's/', 'malecón', 'centro de lima',
      ...Object.keys(LIMA_INSIGHTS.districts).map(d => d.replace('_', ' ')),
      'metro línea', 'panamericana', 'costa verde'
    ];
    
    return localReferences.some(ref => text.includes(ref));
  }
  
  private static hasCTA(cta?: string, hook?: string, script?: string): boolean {
    if (cta && cta.trim().length > 0) return true;
    
    const text = `${hook || ''} ${script || ''}`.toLowerCase();
    const ctaPatterns = [
      'comenta', 'comparte', 'sigue', 'envía', 'agenda', 'descarga',
      'contacta', 'llama', 'visita', 'regístrate', 'suscríbete'
    ];
    
    return ctaPatterns.some(pattern => text.includes(pattern));
  }
  
  private static calculateHookStrength(hook: string): number {
    let score = 50;
    
    // Longitud óptima (8-15 palabras)
    const wordCount = hook.split(' ').length;
    if (wordCount >= 8 && wordCount <= 15) score += 15;
    else if (wordCount < 8) score -= 10;
    else if (wordCount > 20) score -= 15;
    
    // Palabras de poder
    const powerWords = [
      'secreto', 'increíble', 'sorprendente', 'exclusivo', 'revelación',
      'boom', 'explotar', 'oportunidad', 'último', 'primero', 'único'
    ];
    
    powerWords.forEach(word => {
      if (hook.toLowerCase().includes(word)) score += 8;
    });
    
    // Elementos virales
    if (/[!]{1,2}/.test(hook)) score += 5; // Exclamaciones
    if (/\?/.test(hook)) score += 5; // Preguntas
    if (/\d+/.test(hook)) score += 5; // Números
    if (/[🔥💥⚡🚨🤫💰]/.test(hook)) score += 3; // Emojis relevantes
    
    // Urgencia/escasez
    const urgencyWords = ['ahora', 'antes', 'último', 'solo', 'limitado', 'rápido'];
    urgencyWords.forEach(word => {
      if (hook.toLowerCase().includes(word)) score += 6;
    });
    
    return Math.max(0, Math.min(100, score));
  }
  
  private static calculateOverallScore(scores: {
    grammar_score: number;
    relevance_score: number;
    local_context: boolean;
    cta_present: boolean;
    hook_strength: number;
  }): number {
    const weights = {
      grammar: 0.20,
      relevance: 0.25,
      local_context: 0.15,
      cta: 0.15,
      hook_strength: 0.25
    };
    
    const weighted_score = 
      (scores.grammar_score * weights.grammar) +
      (scores.relevance_score * weights.relevance) +
      ((scores.local_context ? 100 : 0) * weights.local_context) +
      ((scores.cta_present ? 100 : 0) * weights.cta) +
      (scores.hook_strength * weights.hook_strength);
    
    return Math.round(weighted_score);
  }
  
  private static generateSuggestions(params: {
    grammar_score: number;
    relevance_score: number;
    local_context: boolean;
    cta_present: boolean;
    hook_strength: number;
    hook: string;
    script?: string;
    cta?: string;
  }): string[] {
    const suggestions: string[] = [];
    
    if (params.grammar_score < 80) {
      suggestions.push('Revisar gramática y ortografía');
    }
    
    if (params.relevance_score < 70) {
      suggestions.push('Incluir más keywords inmobiliarios específicos');
      suggestions.push('Mencionar distritos específicos de Lima');
    }
    
    if (!params.local_context) {
      suggestions.push('Agregar referencias locales de Lima/Perú');
      suggestions.push('Incluir datos específicos del mercado limeño');
    }
    
    if (!params.cta_present) {
      suggestions.push('Agregar una llamada a la acción clara');
    }
    
    if (params.hook_strength < 70) {
      const wordCount = params.hook.split(' ').length;
      if (wordCount > 15) {
        suggestions.push('Acortar el hook (máximo 15 palabras)');
      }
      if (wordCount < 8) {
        suggestions.push('Extender el hook (mínimo 8 palabras)');
      }
      if (!/[!?]/.test(params.hook)) {
        suggestions.push('Usar signos de exclamación o interrogación');
      }
      if (!/\d/.test(params.hook)) {
        suggestions.push('Incluir números específicos (ej: "3 distritos", "25%")');
      }
    }
    
    return suggestions.slice(0, 5); // Máximo 5 sugerencias
  }
}
