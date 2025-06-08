
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ValidationClient, TestResult, ValidationIssue } from '@/lib/validation-client';
import { useToast } from '@/hooks/use-toast';
import { TestTube, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

export function ValidationTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const { toast } = useToast();

  const runTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      console.log('🧪 Iniciando suite de pruebas de validación...');
      const results = await ValidationClient.runValidationTests();
      setTestResults(results);
      
      if (results.successRate === 100) {
        toast({
          title: "¡Tests Completados!",
          description: `Todos los ${results.totalTests} tests pasaron exitosamente.`,
        });
      } else {
        toast({
          title: "Tests Completados con Issues",
          description: `${results.passedTests}/${results.totalTests} tests pasaron (${results.successRate}%).`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error running tests:', error);
      toast({
        title: "Error en Tests",
        description: "Hubo un problema al ejecutar los tests de validación.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Validación de Contenido</h2>
          <p className="text-muted-foreground">
            Ejecuta tests para verificar que las validaciones funcionen correctamente
          </p>
        </div>
        <Button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <TestTube className="h-4 w-4" />
          )}
          {isRunning ? 'Ejecutando Tests...' : 'Ejecutar Tests'}
        </Button>
      </div>

      {/* Información del sistema */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Tests incluidos:</strong> Palabras prohibidas, longitud de contenido, CTAs genéricos, 
          emojis inapropiados, y casos de contenido perfecto. Mínimo 80/100 puntos para aprobar.
        </AlertDescription>
      </Alert>

      {/* Resultados generales */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {testResults.successRate === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Resultados de Tests
            </CardTitle>
            <CardDescription>
              {testResults.summary}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{testResults.totalTests}</div>
                <div className="text-sm text-muted-foreground">Tests Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testResults.passedTests}</div>
                <div className="text-sm text-muted-foreground">Pasaron</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{testResults.successRate}%</div>
                <div className="text-sm text-muted-foreground">Éxito</div>
              </div>
            </div>
            
            <Progress value={testResults.successRate} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Resultados detallados */}
      {testResults && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resultados Detallados</h3>
          {testResults.results.map((result, index) => (
            <Card key={index} className={result.passed ? 'border-green-200' : 'border-red-200'}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Test {index + 1}: {result.testName}
                  </CardTitle>
                  {result.score !== undefined && (
                    <Badge variant={result.score >= 80 ? 'default' : 'destructive'}>
                      {result.score}/100
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              {result.error && (
                <CardContent>
                  <Alert variant="destructive">
                    <AlertDescription>
                      <strong>Error:</strong> {result.error}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              )}
              
              {result.issues && result.issues.length > 0 && (
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Issues Detectados:</h4>
                    {result.issues.map((issue: ValidationIssue, issueIndex: number) => (
                      <div key={issueIndex} className="flex items-start gap-2 text-sm">
                        <Badge 
                          variant={getSeverityBadgeVariant(issue.severity)}
                          className="text-xs"
                        >
                          {issue.severity}
                        </Badge>
                        <div className="flex-1">
                          <div className="font-medium">{issue.type}</div>
                          <div className="text-muted-foreground">{issue.message}</div>
                          {issue.suggestion && (
                            <div className="text-blue-600 text-xs mt-1">
                              💡 {issue.suggestion}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Información técnica */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuración de Validación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Palabras Prohibidas:</strong>
              <div className="text-muted-foreground">
                explotar, boom, estallar, gigante, loco, increíble, madre
              </div>
            </div>
            <div>
              <strong>Límites de Longitud:</strong>
              <div className="text-muted-foreground">
                Hook: máx 12 palabras | Script: 150-250 palabras
              </div>
            </div>
            <div>
              <strong>CTAs Prohibidos:</strong>
              <div className="text-muted-foreground">
                "busca asesoría", "investiga", "consulta con expertos"
              </div>
            </div>
            <div>
              <strong>Puntuación Mínima:</strong>
              <div className="text-muted-foreground">
                80/100 para contenido aprobado
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
