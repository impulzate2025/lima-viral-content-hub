
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationIssue {
  type: string;
  message: string;
  suggestion?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  score: number;
}

interface ValidationReport {
  totalScore: number;
  quality: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT';
  hookAnalysis: ValidationResult;
  scriptAnalysis: ValidationResult;
  recommendations: string[];
}

class ContentValidator {
  private bannedWords = [
    'explotar', 'explotarán', 'explota', 'exploten',
    'boom', 'estallar', 'estallará', 'estalla',
    'gigante', 'gigantesco', 'gigantes',
    'loco', 'loca', 'increíble', 'increíbles',
    'madre', 'madres'
  ];
  
  private approvedWords: Record<string, string> = {
    'explotar': 'crecer significativamente',
    'explotarán': 'experimentarán crecimiento',
    'boom': 'auge',
    'estallar': 'incrementar considerablemente',
    'gigante': 'considerable',
    'loco': 'extraordinario',
    'increíble': 'excepcional',
    'madre': 'cliente',
    'madres': 'clientes'
  };
  
  private professionalEmojis = ['🏠', '🏢', '📈', '💰', '✅', '🎯', '📊', '🔑', '🌟', '💡'];
  private bannedEmojis = ['🤯', '💥', '🔥', '😱', '🚀', '💣'];

  validateHook(hook: string): ValidationResult {
    const issues: ValidationIssue[] = [];
    const words = hook.trim().split(/\s+/);
    
    // 1. Verificar longitud
    if (words.length > 12) {
      issues.push({
        type: 'LENGTH_ERROR',
        message: `Hook muy largo: ${words.length} palabras (máximo: 12)`,
        severity: 'HIGH'
      });
    }
    
    // 2. Verificar palabras prohibidas
    const lowerHook = hook.toLowerCase();
    this.bannedWords.forEach(word => {
      if (lowerHook.includes(word)) {
        issues.push({
          type: 'BANNED_WORD',
          message: `Palabra prohibida: "${word}"`,
          suggestion: this.approvedWords[word] || 'usar vocabulario profesional',
          severity: 'CRITICAL'
        });
      }
    });
    
    // 3. Verificar emojis problemáticos
    this.bannedEmojis.forEach(emoji => {
      if (hook.includes(emoji)) {
        issues.push({
          type: 'INAPPROPRIATE_EMOJI',
          message: `Emoji inapropiado: ${emoji}`,
          suggestion: 'usar emojis profesionales como 📈 🏠 💰',
          severity: 'MEDIUM'
        });
      }
    });
    
    // 4. Verificar exceso de exclamaciones
    const exclamationCount = (hook.match(/!/g) || []).length;
    if (exclamationCount > 2) {
      issues.push({
        type: 'EXCESSIVE_EXCLAMATION',
        message: `Demasiadas exclamaciones: ${exclamationCount}`,
        severity: 'LOW'
      });
    }
    
    return {
      isValid: issues.filter(i => i.severity === 'CRITICAL').length === 0,
      issues: issues,
      score: this.calculateScore(issues)
    };
  }

  validateScript(script: string): ValidationResult {
    const issues: ValidationIssue[] = [];
    const words = script.trim().split(/\s+/);
    const paragraphs = script.split('\n\n').filter(p => p.trim());
    
    // 1. Verificar longitud
    if (words.length > 250) {
      issues.push({
        type: 'LENGTH_ERROR',
        message: `Script muy largo: ${words.length} palabras (máximo: 250)`,
        severity: 'HIGH'
      });
    }
    
    if (words.length < 150) {
      issues.push({
        type: 'LENGTH_WARNING',
        message: `Script muy corto: ${words.length} palabras (mínimo: 150)`,
        severity: 'MEDIUM'
      });
    }
    
    // 2. Verificar párrafos
    if (paragraphs.length > 4) {
      issues.push({
        type: 'STRUCTURE_ERROR',
        message: `Demasiados párrafos: ${paragraphs.length} (máximo: 4)`,
        severity: 'MEDIUM'
      });
    }
    
    // 3. Verificar palabras prohibidas
    const lowerScript = script.toLowerCase();
    this.bannedWords.forEach(word => {
      if (lowerScript.includes(word)) {
        issues.push({
          type: 'BANNED_WORD',
          message: `Palabra prohibida: "${word}"`,
          suggestion: this.approvedWords[word] || 'usar vocabulario profesional',
          severity: 'CRITICAL'
        });
      }
    });
    
    // 4. Verificar CTA (Call to Action) - Debe ser específico
    const genericCTAs = ['busca asesoría', 'investiga', 'consulta con expertos', 'analiza por tu cuenta'];
    const goodCTAs = ['agenda', 'contacta', 'llama', 'envía', 'descarga', 'visita', 'solicita', 'te ayudo'];
    
    const lowerScript = script.toLowerCase();
    const hasGenericCTA = genericCTAs.some(cta => lowerScript.includes(cta));
    const hasGoodCTA = goodCTAs.some(cta => lowerScript.includes(cta));
    
    if (hasGenericCTA) {
      issues.push({
        type: 'GENERIC_CTA',
        message: 'CTA genérico detectado. Debe posicionarte como la solución',
        suggestion: 'Usar CTAs como "Agenda conmigo", "Te ayudo a encontrar", "Envíame DM"',
        severity: 'HIGH'
      });
    }
    
    if (!hasGoodCTA) {
      issues.push({
        type: 'MISSING_CTA',
        message: 'No se detecta una llamada a la acción clara donde TÚ eres la solución',
        suggestion: 'Incluir CTA específico donde ofreces tu servicio directo',
        severity: 'HIGH'
      });
    }
    
    return {
      isValid: issues.filter(i => i.severity === 'CRITICAL').length === 0,
      issues: issues,
      score: this.calculateScore(issues)
    };
  }

  private calculateScore(issues: ValidationIssue[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch(issue.severity) {
        case 'CRITICAL': score -= 25; break;
        case 'HIGH': score -= 15; break;
        case 'MEDIUM': score -= 10; break;
        case 'LOW': score -= 5; break;
      }
    });
    
    return Math.max(0, score);
  }

  generateReport(hookResult: ValidationResult, scriptResult: ValidationResult): ValidationReport {
    const totalScore = Math.round((hookResult.score + scriptResult.score) / 2);
    
    return {
      totalScore: totalScore,
      quality: totalScore >= 80 ? 'EXCELLENT' : totalScore >= 60 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
      hookAnalysis: hookResult,
      scriptAnalysis: scriptResult,
      recommendations: this.generateRecommendations(hookResult, scriptResult)
    };
  }

  private generateRecommendations(hookResult: ValidationResult, scriptResult: ValidationResult): string[] {
    const recommendations: string[] = [];
    const allIssues = [...hookResult.issues, ...scriptResult.issues];
    
    if (allIssues.some(i => i.type === 'BANNED_WORD')) {
      recommendations.push('Reemplazar palabras prohibidas por vocabulario profesional inmobiliario');
    }
    
    if (allIssues.some(i => i.type === 'LENGTH_ERROR')) {
      recommendations.push('Ajustar longitud del contenido según especificaciones');
    }
    
    if (allIssues.some(i => i.type === 'MISSING_CTA' || i.type === 'GENERIC_CTA')) {
      recommendations.push('Incluir CTA donde TÚ eres la solución, no enviar a "buscar asesoría"');
    }
    
    if (allIssues.some(i => i.type === 'INAPPROPRIATE_EMOJI')) {
      recommendations.push('Usar emojis profesionales apropiados para bienes raíces');
    }
    
    return recommendations;
  }

  autoCorrectContent(content: string): string {
    let corrected = content;
    
    // Reemplazar palabras prohibidas
    Object.keys(this.approvedWords).forEach(banned => {
      const regex = new RegExp(`\\b${banned}\\b`, 'gi');
      corrected = corrected.replace(regex, this.approvedWords[banned]);
    });
    
    // Reemplazar emojis problemáticos
    this.bannedEmojis.forEach(emoji => {
      corrected = corrected.replace(new RegExp(emoji, 'g'), '📈');
    });
    
    // Reemplazar CTAs genéricos
    corrected = corrected.replace(/busca asesoría profesional/gi, 'agenda tu consulta conmigo');
    corrected = corrected.replace(/investiga propiedades/gi, 'te ayudo a encontrar propiedades');
    corrected = corrected.replace(/consulta con expertos/gi, 'consulta conmigo');
    
    return corrected;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { hook, script, action } = await req.json();
    const validator = new ContentValidator();

    if (action === 'validate') {
      const hookResult = validator.validateHook(hook);
      const scriptResult = script ? validator.validateScript(script) : { isValid: true, issues: [], score: 100 };
      const report = validator.generateReport(hookResult, scriptResult);

      return new Response(JSON.stringify(report), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'correct') {
      const correctedHook = validator.autoCorrectContent(hook);
      const correctedScript = script ? validator.autoCorrectContent(script) : script;

      return new Response(JSON.stringify({
        correctedHook,
        correctedScript
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Action not supported' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in validate-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
