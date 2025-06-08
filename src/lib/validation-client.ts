import { supabase } from '@/integrations/supabase/client';

export interface ValidationIssue {
  type: string;
  message: string;
  suggestion?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  score: number;
}

export interface ValidationReport {
  totalScore: number;
  quality: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT';
  hookAnalysis: ValidationResult;
  scriptAnalysis: ValidationResult;
  recommendations: string[];
}

export interface TestResult {
  totalTests: number;
  passedTests: number;
  successRate: number;
  results: Array<{
    testName: string;
    passed: boolean;
    score?: number;
    issues?: ValidationIssue[];
    error?: string;
  }>;
  summary: string;
}

export class ValidationClient {
  static async validateContent(hook: string, script?: string): Promise<ValidationReport> {
    try {
      const { data, error } = await supabase.functions.invoke('validate-content', {
        body: {
          hook,
          script,
          action: 'validate'
        }
      });

      if (error) throw error;
      return data as ValidationReport;
    } catch (error) {
      console.error('Error validating content:', error);
      throw new Error('Failed to validate content');
    }
  }

  static async correctContent(hook: string, script?: string): Promise<{ correctedHook: string; correctedScript?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('validate-content', {
        body: {
          hook,
          script,
          action: 'correct'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error correcting content:', error);
      throw new Error('Failed to correct content');
    }
  }

  static async runValidationTests(): Promise<TestResult> {
    try {
      const { data, error } = await supabase.functions.invoke('test-validation', {
        body: {}
      });

      if (error) throw error;
      return data as TestResult;
    } catch (error) {
      console.error('Error running validation tests:', error);
      throw new Error('Failed to run validation tests');
    }
  }

  // Función para validar contenido generado automáticamente antes de mostrarlo al usuario
  static async validateGeneratedContent(hook: string, script?: string): Promise<{
    isValid: boolean;
    correctedContent?: { hook: string; script?: string };
    report: ValidationReport;
  }> {
    console.log('🔍 Validating generated content with backend...');
    
    // Validar contenido original
    const report = await this.validateContent(hook, script);
    
    console.log(`📊 Backend validation score: ${report.totalScore}/100`);
    console.log(`📊 Quality: ${report.quality}`);
    
    // Si el contenido no es válido, intentar corrección automática
    if (report.totalScore < 80) {
      console.log('🔧 Content needs improvement, applying auto-correction...');
      
      try {
        const corrected = await this.correctContent(hook, script);
        const correctedReport = await this.validateContent(corrected.correctedHook, corrected.correctedScript);
        
        console.log(`📊 Corrected content score: ${correctedReport.totalScore}/100`);
        
        return {
          isValid: correctedReport.totalScore >= 80,
          correctedContent: {
            hook: corrected.correctedHook,
            script: corrected.correctedScript
          },
          report: correctedReport
        };
      } catch (error) {
        console.error('Auto-correction failed:', error);
        return {
          isValid: false,
          report
        };
      }
    }
    
    return {
      isValid: true,
      report
    };
  }
}
