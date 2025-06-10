
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { ContentPlan } from './types';

interface CalendarSummaryProps {
  contentPlans: ContentPlan[];
}

export function CalendarSummary({ contentPlans }: CalendarSummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Target className="h-5 w-5" />
          📊 Resumen Rápido
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow">
            <span className="text-base font-medium">📝 Planificados</span>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {contentPlans.filter(p => p.status === 'planned').length}
            </Badge>
          </div>
          <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow">
            <span className="text-base font-medium">🔄 En progreso</span>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {contentPlans.filter(p => p.status === 'in_progress').length}
            </Badge>
          </div>
          <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow">
            <span className="text-base font-medium">✅ Completados</span>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {contentPlans.filter(p => p.status === 'completed').length}
            </Badge>
          </div>
          <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow">
            <span className="text-base font-medium">🔗 Vinculados</span>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {contentPlans.filter(p => p.contentId).length}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
