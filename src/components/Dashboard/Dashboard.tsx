
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "./StatCard";
import { QuickActions } from "./QuickActions";
import { PlatformChart } from "./PlatformChart";
import { contentService } from "@/lib/database";
import { FileText, TrendingUp, CheckCircle, Users } from "lucide-react";

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

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const dashboardStats = await contentService.getStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contenidos"
          value={stats.totalContents}
          description="Contenidos en la base de datos"
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title="Viral Score Promedio"
          value={`${stats.avgViralScore}/100`}
          description="Potencial viral promedio"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
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
    </div>
  );
}
