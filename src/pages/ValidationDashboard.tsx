
import React from 'react';
import { ValidationTestRunner } from '@/components/ValidationTesting/ValidationTestRunner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, TestTube } from 'lucide-react';

export default function ValidationDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Dashboard de Validación</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sistema completo de validación para contenido generado por IA. 
          Garantiza que todo el contenido cumpla con los estándares profesionales inmobiliarios.
        </p>
      </div>

      {/* Estadísticas clave */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Totales</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              Casos de prueba implementados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Palabras Prohibidas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Términos bloqueados automáticamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Límite Hook</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Palabras máximo por hook
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Mínimo</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80</div>
            <p className="text-xs text-muted-foreground">
              Puntos requeridos para aprobar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reglas de validación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Contenido Prohibido
            </CardTitle>
            <CardDescription>
              Términos y estructuras que se bloquean automáticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Palabras Prohibidas:</h4>
              <div className="flex flex-wrap gap-1">
                {['explotar', 'boom', 'estallar', 'gigante', 'loco', 'increíble', 'madre'].map(word => (
                  <Badge key={word} variant="destructive" className="text-xs">
                    {word}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">CTAs Genéricos:</h4>
              <div className="flex flex-wrap gap-1">
                {['busca asesoría', 'investiga', 'consulta con expertos'].map(cta => (
                  <Badge key={cta} variant="outline" className="text-xs">
                    {cta}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Emojis Inapropiados:</h4>
              <div className="flex gap-2 text-lg">
                🤯 💥 🔥 😱 🚀 💣
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Contenido Aprobado
            </CardTitle>
            <CardDescription>
              Alternativas profesionales y vocabulario recomendado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Reemplazos Automáticos:</h4>
              <div className="space-y-1 text-sm">
                <div>explotar → <span className="text-green-600">crecer significativamente</span></div>
                <div>boom → <span className="text-green-600">auge</span></div>
                <div>gigante → <span className="text-green-600">considerable</span></div>
                <div>madre → <span className="text-green-600">cliente</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">CTAs Profesionales:</h4>
              <div className="flex flex-wrap gap-1">
                {['agenda conmigo', 'te ayudo a encontrar', 'envíame DM', 'descarga mi guía'].map(cta => (
                  <Badge key={cta} variant="default" className="text-xs">
                    {cta}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Emojis Profesionales:</h4>
              <div className="flex gap-2 text-lg">
                🏠 🏢 📈 💰 ✅ 🎯 📊 🔑
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Runner de tests */}
      <ValidationTestRunner />
    </div>
  );
}
