
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ContentQualityScore } from '@/types/local-insights';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface QualityScoreDisplayProps {
  qualityScore: ContentQualityScore;
  className?: string;
}

export function QualityScoreDisplay({ qualityScore, className }: QualityScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 85) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          Puntuación de Calidad
          <Badge variant={getScoreBadgeVariant(qualityScore.overall_score)}>
            {qualityScore.overall_score}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Puntuación General</span>
            <span className={getScoreColor(qualityScore.overall_score)}>
              {qualityScore.overall_score}%
            </span>
          </div>
          <Progress 
            value={qualityScore.overall_score} 
            className="h-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            {qualityScore.grammar_score >= 80 ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-red-500" />
            )}
            <span>Gramática: {qualityScore.grammar_score}%</span>
          </div>
          
          <div className="flex items-center gap-1">
            {qualityScore.relevance_score >= 70 ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-red-500" />
            )}
            <span>Relevancia: {qualityScore.relevance_score}%</span>
          </div>
          
          <div className="flex items-center gap-1">
            {qualityScore.local_context ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-red-500" />
            )}
            <span>Contexto Local</span>
          </div>
          
          <div className="flex items-center gap-1">
            {qualityScore.cta_present ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-red-500" />
            )}
            <span>CTA Presente</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Fuerza del Hook</span>
            <span className={getScoreColor(qualityScore.hook_strength)}>
              {qualityScore.hook_strength}%
            </span>
          </div>
          <Progress 
            value={qualityScore.hook_strength} 
            className="h-1"
          />
        </div>

        {qualityScore.suggestions.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-1 mb-2">
              <AlertCircle className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium">Sugerencias</span>
            </div>
            <div className="space-y-1">
              {qualityScore.suggestions.map((suggestion, index) => (
                <div key={index} className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                  • {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
