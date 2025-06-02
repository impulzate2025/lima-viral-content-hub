
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react';
import { excelProcessor } from '@/lib/excel-processor';
import { ContentItem } from '@/types';

interface FileUploaderProps {
  onImport: (contents: ContentItem[]) => Promise<void>;
  onCancel: () => void;
}

interface ImportResult {
  success: boolean;
  data?: ContentItem[];
  errors?: string[];
  warnings?: string[];
}

export function FileUploader({ onImport, onCancel }: FileUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<ContentItem[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setResult(null);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const contents = await excelProcessor.processFile(file);
      
      clearInterval(progressInterval);
      setProgress(100);

      const errors: string[] = [];
      const warnings: string[] = [];

      // Validaciones
      contents.forEach((content, index) => {
        if (!content.hook.trim()) {
          errors.push(`Fila ${index + 2}: Hook vacío`);
        }
        if (!content.script.trim()) {
          errors.push(`Fila ${index + 2}: Script vacío`);
        }
        if (content.platform.length === 0) {
          warnings.push(`Fila ${index + 2}: Sin plataformas seleccionadas, se asignó TikTok por defecto`);
        }
        if (content.viralScore < 10) {
          warnings.push(`Fila ${index + 2}: Viral Score muy bajo (${content.viralScore})`);
        }
      });

      setPreviewData(contents);
      setResult({
        success: errors.length === 0,
        data: contents,
        errors,
        warnings
      });

    } catch (error) {
      console.error('Error processing file:', error);
      setResult({
        success: false,
        errors: ['Error al procesar el archivo. Verifica el formato y las columnas.']
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const handleConfirmImport = async () => {
    if (result?.data) {
      try {
        await onImport(result.data);
      } catch (error) {
        console.error('Error importing data:', error);
      }
    }
  };

  const reset = () => {
    setResult(null);
    setPreviewData([]);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Contenidos desde Excel/CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          {!result && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg">Suelta el archivo aquí...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">Arrastra y suelta tu archivo Excel/CSV aquí</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    o haz clic para seleccionar un archivo
                  </p>
                  <Button variant="outline">
                    Seleccionar Archivo
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Procesando archivo...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">
                  {result.success ? 'Archivo procesado exitosamente' : 'Errores en el archivo'}
                </span>
              </div>

              {/* Stats */}
              {result.data && (
                <div className="flex gap-4">
                  <Badge variant="outline" className="bg-blue-50">
                    {result.data.length} contenidos encontrados
                  </Badge>
                  {result.errors && result.errors.length > 0 && (
                    <Badge variant="destructive">
                      {result.errors.length} errores
                    </Badge>
                  )}
                  {result.warnings && result.warnings.length > 0 && (
                    <Badge variant="outline" className="bg-yellow-50">
                      {result.warnings.length} advertencias
                    </Badge>
                  )}
                </div>
              )}

              {/* Errors */}
              {result.errors && result.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Errores encontrados:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {result.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Warnings */}
              {result.warnings && result.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Advertencias:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {result.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Preview */}
              {previewData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preview de Contenidos (primeros 3)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {previewData.slice(0, 3).map((content, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <div className="flex gap-1">
                              {content.platform.map(platform => (
                                <Badge key={platform} variant="secondary" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                            <Badge variant="outline">{content.type}</Badge>
                          </div>
                          <p className="font-medium text-sm">{content.hook}</p>
                          <p className="text-xs text-muted-foreground">
                            Viral Score: {content.viralScore}/100 | Duración: {content.duration}
                          </p>
                        </div>
                      ))}
                      {previewData.length > 3 && (
                        <p className="text-sm text-muted-foreground text-center">
                          ... y {previewData.length - 3} contenidos más
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            {result ? (
              <>
                {result.success && (
                  <Button 
                    onClick={handleConfirmImport}
                    className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] hover:from-[#44A08D] hover:to-[#4ECDC4] text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Importar {result.data?.length} Contenidos
                  </Button>
                )}
                <Button variant="outline" onClick={reset}>
                  Probar Otro Archivo
                </Button>
              </>
            ) : null}
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>

          {/* Format Help */}
          <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
            <p className="font-medium">Formato esperado del archivo Excel/CSV:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>• Hook (obligatorio)</div>
              <div>• Script (obligatorio)</div>
              <div>• Plataformas (TikTok, Instagram, etc.)</div>
              <div>• Tipo (Educativo, Testimonial, etc.)</div>
              <div>• Duración (15s, 30s, 60s, 3-5min)</div>
              <div>• Viral Score (0-100)</div>
              <div>• Visual (descripción)</div>
              <div>• Contexto</div>
              <div>• CTA</div>
              <div>• AI Tools</div>
              <div>• Tags (separados por comas)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
