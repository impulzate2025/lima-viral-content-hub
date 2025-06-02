
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "./StatCard";
import { QuickActions } from "./QuickActions";
import { PlatformChart } from "./PlatformChart";
import { contentService, forceSampleDataLoad } from "@/lib/database";
import { FileText, TrendingUp, CheckCircle, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  onNewContent: () => void;
  onImportExcel: () => void;
  onExportData: () => void;
  onGenerateAI: () => void;
}

interface DashboardStats {
  totalContents: number;
  avgViralScore: number;
  readyContents: number;
  publishedContents: number;
  platformDistribution: Record<string, number>;
}

export function Dashboard({ onNewContent, onImportExcel, onExportData, onGenerateAI }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalContents: 0,
    avgViralScore: 0,
    readyContents: 0,
    publishedContents: 0,
    platformDistribution: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    console.log('🔍 Dashboard: Loading stats...');
    setIsLoading(true);
    try {
      const dashboardStats = await contentService.getStats();
      console.log('📊 Dashboard: Stats loaded:', dashboardStats);
      setStats(dashboardStats);
    } catch (error) {
      console.error('❌ Dashboard: Error loading stats:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas del dashboard.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceLoadSampleData = async () => {
    console.log('🔍 Dashboard: Force loading sample data...');
    setIsLoading(true);
    try {
      await forceSampleDataLoad();
      await loadStats(); // Recargar stats después de insertar datos
      toast({
        title: "Datos cargados",
        description: "Los datos de prueba se han cargado exitosamente.",
      });
    } catch (error) {
      console.error('❌ Dashboard: Error force loading sample data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de prueba.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Viral Content Manager</h1>
            <p className="text-lg opacity-90">Real Estate Lima - Dashboard de Contenido</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.totalContents}</div>
            <div className="text-sm opacity-90">Contenidos Totales</div>
          </div>
        </div>
      </div>

      {/* No data state */}
      {stats.totalContents === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">No hay datos que mostrar</h3>
              <p className="text-yellow-700">La base de datos está vacía. Carga algunos datos de prueba para empezar.</p>
            </div>
            <Button 
              onClick={handleForceLoadSampleData}
              disabled={isLoading}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isLoading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Cargar Datos de Prueba
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contenidos"
          value={stats.totalContents}
          description="Contenidos en la base de datos"
          icon={FileText}
          trend={stats.totalContents > 0 ? { value: 12, isPositive: true } : undefined}
        />
        
        <StatCard
          title="Viral Score Promedio"
          value={stats.totalContents > 0 ? `${stats.avgViralScore}/100` : "0/100"}
          description="Potencial viral promedio"
          icon={TrendingUp}
          trend={stats.avgViralScore > 0 ? { value: 5, isPositive: true } : undefined}
        />
        
        <StatCard
          title="Listos para Publicar"
          value={stats.readyContents}
          description="Contenidos finalizados"
          icon={CheckCircle}
        />
        
        <StatCard
          title="Publicados"
          value={stats.publishedContents}
          description="Contenidos ya publicados"
          icon={Users}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions
        onNewContent={onNewContent}
        onImportExcel={onImportExcel}
        onExportData={onExportData}
        onGenerateAI={onGenerateAI}
      />

      {/* Charts Section */}
      {Object.keys(stats.platformDistribution).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <PlatformChart data={stats.platformDistribution} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Contenido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Métricas de rendimiento disponibles próximamente</p>
                <p className="text-sm">Conecta tus plataformas para ver analytics</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Debug refresh button - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h4 className="font-medium text-blue-800">Debug Dashboard</h4>
              <p className="text-sm text-blue-700">Herramientas de desarrollo</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadStats}
                disabled={isLoading}
              >
                {isLoading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                Actualizar Stats
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleForceLoadSampleData}
                disabled={isLoading}
              >
                Recargar Datos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
