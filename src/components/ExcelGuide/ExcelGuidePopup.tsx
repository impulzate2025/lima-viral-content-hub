
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, X, Download, CheckCircle } from 'lucide-react';

interface ExcelGuidePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExcelGuidePopup({ isOpen, onClose }: ExcelGuidePopupProps) {
  const requiredColumns = [
    { name: 'Hook', required: true, description: 'Gancho principal del contenido' },
    { name: 'Script', required: true, description: 'Guión completo del contenido' },
    { name: 'Plataformas', required: false, description: 'TikTok, Instagram, YouTube, LinkedIn (separar por comas)' },
    { name: 'Tipo', required: false, description: 'Educativo, Testimonial, Controversial, Predictivo, Behind-Scenes' },
    { name: 'Duración', required: false, description: '15s, 30s, 60s, 3-5min' },
    { name: 'Visual', required: false, description: 'Descripción de elementos visuales' },
    { name: 'Contexto', required: false, description: 'Contexto o situación del contenido' },
    { name: 'CTA', required: false, description: 'Llamada a la acción' },
    { name: 'Viral Score', required: false, description: 'Puntuación de 0 a 100' },
    { name: 'AI Tools', required: false, description: 'Herramientas de IA utilizadas' },
    { name: 'Tags', required: false, description: 'Etiquetas separadas por comas' }
  ];

  const downloadTemplate = () => {
    // Crear datos de ejemplo para el template
    const templateData = [
      {
        'Hook': 'Ejemplo: Llevo 8 años vendiendo propiedades en Lima. Estos datos cambiarán tu perspectiva...',
        'Script': 'Ejemplo de script completo con introducción, desarrollo y cierre...',
        'Plataformas': 'TikTok, Instagram',
        'Tipo': 'Educativo',
        'Duración': '30s',
        'Visual': 'Gráficos de datos, imágenes de propiedades',
        'Contexto': 'Mercado inmobiliario Lima 2024',
        'CTA': 'Comentar tu distrito favorito',
        'Viral Score': '85',
        'AI Tools': 'ChatGPT, Canva',
        'Tags': 'lima, inmobiliaria, inversion'
      }
    ];

    // Convertir a CSV
    const headers = Object.keys(templateData[0]);
    const csvContent = [
      headers.join(','),
      templateData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
      ).join('\n')
    ].join('\n');

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_contenido_viral.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            Guía: Cómo Subir tu Archivo Excel/CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Introducción */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📋 Formato Requerido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Tu archivo Excel/CSV debe contener las siguientes columnas. Solo <strong>Hook</strong> y <strong>Script</strong> son obligatorios.
              </p>
              
              <div className="grid gap-3">
                {requiredColumns.map((column, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{column.name}</span>
                        {column.required && (
                          <Badge variant="destructive" className="text-xs">Obligatorio</Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {column.description}
                      </span>
                    </div>
                    {column.required && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ejemplos de tipos de contenido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎯 Tipos de Ganchos Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold">Educativo</h4>
                    <p className="text-sm text-muted-foreground">Contenido que enseña y aporta valor</p>
                  </div>
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold">Testimonial</h4>
                    <p className="text-sm text-muted-foreground">Casos de éxito y experiencias reales</p>
                  </div>
                  <div className="p-3 border-l-4 border-red-500 bg-red-50">
                    <h4 className="font-semibold">Controversial</h4>
                    <p className="text-sm text-muted-foreground">Temas que generan debate</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-semibold">Predictivo</h4>
                    <p className="text-sm text-muted-foreground">Predicciones y tendencias futuras</p>
                  </div>
                  <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold">Behind-Scenes</h4>
                    <p className="text-sm text-muted-foreground">Detrás de cámaras y procesos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consejos importantes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Consejos Importantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">✅ Buenas Prácticas:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Usa la primera fila para los nombres de columnas</li>
                    <li>• Separa múltiples valores con comas</li>
                    <li>• Hooks claros y concisos</li>
                    <li>• Scripts completos con estructura</li>
                    <li>• Viral Score entre 0-100</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">❌ Evita:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Hooks o scripts vacíos</li>
                    <li>• Caracteres especiales en nombres de columnas</li>
                    <li>• Datos inconsistentes</li>
                    <li>• Formatos de fecha complejos</li>
                    <li>• Celdas combinadas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={downloadTemplate} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Descargar Template de Ejemplo
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cerrar Guía
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
