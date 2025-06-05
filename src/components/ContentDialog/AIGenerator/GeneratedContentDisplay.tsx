
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { GeneratedContent } from '@/lib/ai-generator';

interface GeneratedContentDisplayProps {
  generatedContent: GeneratedContent;
  onUseCompleteContent: () => void;
}

export function GeneratedContentDisplay({ 
  generatedContent, 
  onUseCompleteContent 
}: GeneratedContentDisplayProps) {
  return (
    <div className="mt-6 p-4 border rounded-md bg-gradient-to-r from-purple-50 to-blue-50">
      <Label className="font-semibold text-lg text-purple-800">Contenido Completo Generado:</Label>
      
      <div className="mt-4 space-y-4">
        <div>
          <Label className="font-medium text-purple-700">Script:</Label>
          <p className="mt-1 text-sm bg-white p-3 rounded border max-h-32 overflow-y-auto">
            {generatedContent.script}
          </p>
        </div>
        
        <div>
          <Label className="font-medium text-purple-700">Elementos Visuales:</Label>
          <p className="mt-1 text-sm bg-white p-3 rounded border">
            {generatedContent.visualElements}
          </p>
        </div>
        
        <div>
          <Label className="font-medium text-purple-700">Call-to-Action:</Label>
          <p className="mt-1 text-sm bg-white p-3 rounded border">
            {generatedContent.cta}
          </p>
        </div>
        
        <div>
          <Label className="font-medium text-purple-700">Estrategia de Distribución:</Label>
          <p className="mt-1 text-sm bg-white p-3 rounded border">
            {generatedContent.distributionStrategy}
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-white rounded border">
            <Label className="text-xs font-medium text-purple-700">Views Estimadas</Label>
            <p className="text-lg font-bold text-purple-800">
              {generatedContent.projectedMetrics.estimatedViews.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-2 bg-white rounded border">
            <Label className="text-xs font-medium text-purple-700">Engagement</Label>
            <p className="text-lg font-bold text-purple-800">
              {generatedContent.projectedMetrics.estimatedEngagement}%
            </p>
          </div>
          <div className="text-center p-2 bg-white rounded border">
            <Label className="text-xs font-medium text-purple-700">Shares</Label>
            <p className="text-lg font-bold text-purple-800">
              {generatedContent.projectedMetrics.estimatedShares}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button 
          type="button" 
          onClick={onUseCompleteContent} 
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Sparkles className="mr-2 h-5 w-5" /> 
          Usar Contenido Completo
        </Button>
      </div>
    </div>
  );
}
