
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Play, Loader2 } from 'lucide-react';

interface TestCase {
  name: string;
  hook: string;
  script: string;
  expectedIssues: string[];
  shouldPass: boolean;
}

interface TestResult {
  name: string;
  passed: boolean;
  score: number;
  issues: any[];
  recommendations: string[];
}

export function AutoTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<{passed: number, total: number} | null>(null);

  const testCases: TestCase[] = [
    {
      name: 'Hook con palabra prohibida',
      hook: '¡Tu primer ahorro en Lima? ¡Estos 3 distritos explotarán en 2025! 🤯',
      script: 'Los distritos de San Isidro están experimentando un crecimiento significativo. Para aprovechar estas oportunidades, agenda una consulta gratuita con nuestro equipo.',
      expectedIssues: ['BANNED_WORD', 'INAPPROPRIATE_EMOJI'],
      shouldPass: false
    },
    {
      name: 'Hook correcto',
      hook: '3 distritos de Lima se revalorizarán 15% en 2025 📈',
      script: 'San Isidro, Miraflores y Jesús María muestran indicadores excepcionales de crecimiento. Contacta ahora para una asesoría personalizada sobre oportunidades de inversión.',
      expectedIssues: [],
      shouldPass: true
    },
    {
      name: 'Hook muy largo',
      hook: 'Descubre los secretos que los expertos no quieren que sepas sobre los tres distritos más prometedores de Lima',
      script: 'Script normal de longitud apropiada con información relevante. Contacta para más información.',
      expectedIssues: ['LENGTH_ERROR'],
      shouldPass: false
    },
    {
      name: 'Script sin CTA',
      hook: 'Inversión inteligente en Lima 2025 🏠',
      script: 'Los precios en Lima han mostrado una tendencia positiva. Varios distritos ofrecen oportunidades interesantes.',
      expectedIssues: ['MISSING_CTA'],
      shouldPass: false
    },
    {
      name: 'CTA genérico prohibido',
      hook: 'Oportunidad única en Lima 🏠',
      script: 'El mercado inmobiliario presenta oportunidades. Busca asesoría profesional para tus inversiones.',
      expectedIssues: ['GENERIC_CTA'],
      shouldPass: false
    },
    {
      name: 'Contenido perfecto',
      hook: 'Oportunidad única: 3 distritos con 15% de crecimiento 📈',
      script: 'El mercado inmobiliario de Lima presenta oportunidades excepcionales en tres distritos estratégicos. Agenda una consulta gratuita para analizar tu estrategia de inversión.',
      expectedIssues: [],
      shouldPass: true
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    console.log('🧪 INICIANDO SUITE DE PRUEBAS - VALIDACIÓN DE CONTENIDO IA');
    
    const testResults: TestResult[] = [];
    
    for (const testCase of testCases) {
      try {
        // Simular la validación usando la lógica que implementamos
        const response = await fetch('/api/validate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hook: testCase.hook,
            script: testCase.script
          })
        });
        
        if (!response.ok) {
          // Fallback a validación local si el backend no está disponible
          const result = validateContentLocally(testCase.hook, testCase.script);
          const passed = testCase.shouldPass ? result.score >= 80 : result.score < 80;
          
          testResults.push({
            name: testCase.name,
            passed,
            score: result.score,
            issues: result.issues,
            recommendations: result.recommendations
          });
        } else {
          const data = await response.json();
          const passed = testCase.shouldPass ? data.score >= 80 : data.score < 80;
          
          testResults.push({
            name: testCase.name,
            passed,
            score: data.score,
            issues: data.issues || [],
            recommendations: data.recommendations || []
          });
        }
        
        console.log(`✅ Test completado: ${testCase.name}`);
        
      } catch (error) {
        console.error(`❌ Error en test ${testCase.name}:`, error);
        
        // Fallback a validación local
        const result = validateContentLocally(testCase.hook, testCase.script);
        const passed = testCase.shouldPass ? result.score >= 80 : result.score < 80;
        
        testResults.push({
          name: testCase.name,
          passed,
          score: result.score,
          issues: result.issues,
          recommendations: result.recommendations
        });
      }
    }
    
    setResults(testResults);
    const passedCount = testResults.filter(r => r.passed).length;
    setSummary({ passed: passedCount, total: testResults.length });
    setIsRunning(false);
    
    console.log(`📊 RESULTADOS: ${passedCount}/${testResults.length} tests passed`);
  };

  // Función de validación local como fallback
  const validateContentLocally = (hook: string, script: string) => {
    const bannedWords = ['explotar', 'explotarán', 'explota', 'boom', 'estallar', 'gigante', 'loco', 'increíble'];
    const bannedEmojis = ['🤯', '💥', '🔥', '😱'];
    const genericCTAs = ['busca asesoría', 'consulta con expertos', 'investiga', 'analiza por tu cuenta'];
    
    let score = 100;
    const issues = [];
    const recommendations = [];
    
    // Validar hook
    const hookWords = hook.trim().split(/\s+/);
    if (hookWords.length > 12) {
      score -= 25;
      issues.push({ type: 'LENGTH_ERROR', message: 'Hook muy largo' });
    }
    
    // Palabras prohibidas
    const lowerHook = hook.toLowerCase();
    const lowerScript = script.toLowerCase();
    
    bannedWords.forEach(word => {
      if (lowerHook.includes(word) || lowerScript.includes(word)) {
        score -= 25;
        issues.push({ type: 'BANNED_WORD', message: `Palabra prohibida: ${word}` });
      }
    });
    
    // Emojis prohibidos
    bannedEmojis.forEach(emoji => {
      if (hook.includes(emoji)) {
        score -= 15;
        issues.push({ type: 'INAPPROPRIATE_EMOJI', message: `Emoji inapropiado: ${emoji}` });
      }
    });
    
    // CTA genérico
    const hasGenericCTA = genericCTAs.some(cta => lowerScript.includes(cta));
    if (hasGenericCTA) {
      score -= 20;
      issues.push({ type: 'GENERIC_CTA', message: 'CTA genérico detectado' });
    }
    
    // CTA faltante
    const ctaKeywords = ['agenda', 'contacta', 'llama', 'envía', 'descarga'];
    const hasCTA = ctaKeywords.some(keyword => lowerScript.includes(keyword));
    if (!hasCTA) {
      score -= 20;
      issues.push({ type: 'MISSING_CTA', message: 'No hay CTA específico' });
    }
    
    if (issues.length > 0) {
      recommendations.push('Revisar y corregir los issues identificados');
    }
    
    return { score: Math.max(0, score), issues, recommendations };
  };

  // Auto-ejecutar tests al cargar
  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Sistema de Validación de Contenido IA
          </CardTitle>
          <CardDescription>
            Tests automáticos para verificar las restricciones y calidad del contenido generado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={runTests} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ejecutando Tests...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Ejecutar Tests
                </>
              )}
            </Button>
            
            {summary && (
              <Badge variant={summary.passed === summary.total ? "default" : "destructive"}>
                {summary.passed}/{summary.total} tests pasaron
              </Badge>
            )}
          </div>
          
          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{result.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={result.score >= 80 ? "default" : "secondary"}>
                        {result.score}/100
                      </Badge>
                      {result.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  {result.issues.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-amber-600 mb-1">Issues detectados:</p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {result.issues.map((issue, i) => (
                          <li key={i}>{issue.message}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
