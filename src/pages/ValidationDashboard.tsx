
import { AutoTestRunner } from '@/components/Testing/AutoTestRunner';
import { CompetitorAnalysis } from '@/components/Intelligence/CompetitorAnalysis';
import { InteractiveCalendar } from '@/components/Calendar/InteractiveCalendar';
import { InsightsDatabase } from '@/components/Insights/InsightsDatabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube, Brain, Calendar, Database } from 'lucide-react';

export default function ValidationDashboard() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Centro de Inteligencia de Contenido</h1>
        <p className="text-muted-foreground">
          Sistema completo de validación, análisis competitivo, planificación y gestión de insights
        </p>
      </div>

      <Tabs defaultValue="validation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Validación IA
          </TabsTrigger>
          <TabsTrigger value="competitor" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Análisis Competencia
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendario
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Base de Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="validation">
          <AutoTestRunner />
        </TabsContent>

        <TabsContent value="competitor">
          <CompetitorAnalysis />
        </TabsContent>

        <TabsContent value="calendar">
          <InteractiveCalendar />
        </TabsContent>

        <TabsContent value="insights">
          <InsightsDatabase />
        </TabsContent>
      </Tabs>
    </div>
  );
}
