
export interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
  correctedContent?: string;
  suggestions: string[];
}

export interface ValidationConfig {
  maxHookWords: number;
  maxScriptWords: number;
  bannedWords: string[];
  replacements: Record<string, string>;
  approvedVocabulary: string[];
}

export class ContentValidator {
  private static config: ValidationConfig = {
    maxHookWords: 12,
    maxScriptWords: 250,
    bannedWords: [
      'explotar', 'explotarán', 'explota', 'explotaron',
      'boom', 'estallar', 'estalla', 'estallarán', 'estallaron',
      'gigante', 'gigantesco', 'gigantes', 'gigantesca',
      'loco', 'loca', 'locos', 'locas', 'increíble', 'increíbles'
    ],
    replacements: {
      'explotar': 'crecer significativamente',
      'explotarán': 'experimentarán crecimiento',
      'explota': 'crece significativamente',
      'explotaron': 'experimentaron crecimiento',
      'boom': 'auge',
      'estallar': 'incrementar',
      'estalla': 'incrementa',
      'estallarán': 'incrementarán',
      'estallaron': 'incrementaron',
      'gigante': 'considerable',
      'gigantesco': 'significativo',
      'gigantes': 'considerables',
      'gigantesca': 'significativa',
      'loco': 'extraordinario',
      'loca': 'extraordinaria',
      'locos': 'extraordinarios',
      'locas': 'extraordinarias',
      'increíble': 'excepcional',
      'increíbles': 'excepcionales'
    },
    approvedVocabulary: [
      'revalorizar', 'crecimiento', 'oportunidad', 'potencial',
      'demanda', 'inversión', 'rentabilidad', 'valorización',
      'estratégico', 'sólido', 'sostenible', 'proyección'
    ]
  };

  static validateHook(hook: string): ValidationResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let correctedContent = hook;
    let score = 100;

    // Validar longitud
    const words = hook.trim().split(/\s+/);
    if (words.length > this.config.maxHookWords) {
      issues.push(`Hook muy largo: ${words.length} palabras (máximo: ${this.config.maxHookWords})`);
      suggestions.push(`Reducir a máximo ${this.config.maxHookWords} palabras`);
      score -= 20;
    }

    // Validar palabras prohibidas y corregir
    const { corrected, foundBanned } = this.replaceBannedWords(correctedContent);
    correctedContent = corrected;
    
    if (foundBanned.length > 0) {
      issues.push(`Palabras inapropiadas detectadas: ${foundBanned.join(', ')}`);
      suggestions.push('Usar vocabulario profesional inmobiliario');
      score -= 25 * foundBanned.length;
    }

    // Validar emojis excesivos
    const emojiCount = (hook.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
    if (emojiCount > 2) {
      issues.push(`Demasiados emojis: ${emojiCount} (máximo: 2)`);
      suggestions.push('Limitar a 1-2 emojis profesionales');
      score -= 10;
    }

    // Validar exclamaciones múltiples
    const exclamationCount = (hook.match(/!/g) || []).length;
    if (exclamationCount > 2) {
      issues.push(`Demasiadas exclamaciones: ${exclamationCount} (máximo: 2)`);
      suggestions.push('Usar máximo 2 signos de exclamación');
      score -= 10;
    }

    return {
      isValid: score >= 80,
      score: Math.max(0, score),
      issues,
      correctedContent: correctedContent !== hook ? correctedContent : undefined,
      suggestions
    };
  }

  static validateScript(script: string): ValidationResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let correctedContent = script;
    let score = 100;

    // Validar longitud
    const words = script.trim().split(/\s+/);
    if (words.length > this.config.maxScriptWords) {
      issues.push(`Script muy largo: ${words.length} palabras (máximo: ${this.config.maxScriptWords})`);
      suggestions.push(`Reducir a máximo ${this.config.maxScriptWords} palabras`);
      score -= 20;
    }

    // Validar palabras prohibidas y corregir
    const { corrected, foundBanned } = this.replaceBannedWords(correctedContent);
    correctedContent = corrected;
    
    if (foundBanned.length > 0) {
      issues.push(`Palabras inapropiadas detectadas: ${foundBanned.join(', ')}`);
      suggestions.push('Usar vocabulario profesional inmobiliario');
      score -= 15 * foundBanned.length;
    }

    // Validar estructura básica (debe tener CTA)
    const hasCallToAction = /(?:comenta|comparte|sigue|envía|agenda|descarga|contacta|llama|visita|regístrate|suscríbete)/i.test(script);
    if (!hasCallToAction) {
      issues.push('Falta llamada a la acción clara');
      suggestions.push('Incluir CTA específico (agenda, descarga, contacta, etc.)');
      score -= 15;
    }

    return {
      isValid: score >= 80,
      score: Math.max(0, score),
      issues,
      correctedContent: correctedContent !== script ? correctedContent : undefined,
      suggestions
    };
  }

  private static replaceBannedWords(content: string): { corrected: string; foundBanned: string[] } {
    let corrected = content;
    const foundBanned: string[] = [];

    this.config.bannedWords.forEach(bannedWord => {
      const regex = new RegExp(`\\b${bannedWord}\\b`, 'gi');
      if (regex.test(corrected)) {
        foundBanned.push(bannedWord);
        const replacement = this.config.replacements[bannedWord.toLowerCase()] || bannedWord;
        corrected = corrected.replace(regex, replacement);
      }
    });

    return { corrected, foundBanned };
  }

  static getPromptRestrictions(): string {
    return `
RESTRICCIONES CRÍTICAS - OBLIGATORIAS:
- NUNCA uses estas palabras: ${this.config.bannedWords.join(', ')}
- Hook: MÁXIMO ${this.config.maxHookWords} palabras
- Script: MÁXIMO ${this.config.maxScriptWords} palabras
- Solo emojis profesionales: 🏠 🏢 📈 💰 ✅ 🎯 (máximo 2)
- Máximo 2 signos de exclamación por texto
- Lenguaje: Profesional inmobiliario, no coloquial

VOCABULARIO PROFESIONAL APROBADO:
${this.config.approvedVocabulary.join(', ')}

REEMPLAZOS AUTOMÁTICOS:
${Object.entries(this.config.replacements).map(([banned, approved]) => `- "${banned}" → "${approved}"`).join('\n')}
    `;
  }
}
