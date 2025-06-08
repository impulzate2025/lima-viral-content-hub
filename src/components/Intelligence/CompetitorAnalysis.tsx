
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, TrendingUp, Target, Lightbulb, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompetitorContent {
  id: string;
  platform: string;
  competitor: string;
  content: string;
  engagement: number;
  topics: string[];
  analyzedAt: Date;
}

interface GapAnalysis {
  uncoveredTopics: string[];
  opportunities: string[];
  suggestions: string[];
}

export function CompetitorAnalysis() {
  const [competitorContents, setCompetitorContents] = useState<CompetitorContent[]>([]);
  const [newContent, setNewContent] = useState('');
  const [competitorName, setCompetitorName] = useState('');
  const [platform, setPlatform] = useState('');
  const [engagement, setEngagement] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const { toast } = useToast();

  const handleAddContent = async () => {
    if (!newContent.trim() || !competitorName.trim() || !platform.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const topics = extractTopics(newContent);
    
    const content: CompetitorContent = {
      id: Date.now().toString(),
      platform,
      competitor: competitorName,
      content: newContent,
      engagement: parseInt(engagement) || 0,
      topics,
      analyzedAt: new Date()
    };

    setCompetitorContents(prev => [...prev, content]);
    
    // Limpiar formulario
    setNewContent('');
    setCompetitorName('');
    setPlatform('');
    setEngagement('');
    
    toast({
      title: "Contenido agregado",
      description: "El contenido del competidor ha sido analizado y agregado"
    });
  };

  const extractTopics = (content: string): string[] => {
    // Análisis básico de temas basado en palabras clave inmobiliarias
    const realEstateKeywords = [
      'precio', 'inversión', 'compra', 'venta', 'alquiler', 'distrito',
      'departamento', 'casa', 'terreno', 'revalorización', 'metro cuadrado',
      'crédito', 'hipoteca', 'financiamiento', 'construcción', 'obra nueva',
      'ubicación', 'zona', 'miraflores', 'san isidro', 'surco', 'lima',
      'rentabilidad', 'roi', 'plusvalía', 'mercado inmobiliario'
    ];
    
    const lowerContent = content.toLowerCase();
    return realEstateKeywords.filter(keyword => 
      lowerContent.includes(keyword)
    ).slice(0, 5); // Limitar a 5 temas principales
  };

  const performGapAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simular análisis (en producción, esto sería con IA)
    setTimeout(() => {
      const allTopics = competitorContents.flatMap(c => c.topics);
      const topicFrequency = allTopics.reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Temas poco cubiertos por la competencia
      const uncoveredTopics = [
        'Distritos emergentes',
        'Inversión para millennials',
        'Propiedades sostenibles',
        'Smart homes',
        'Co-living spaces',
        'Inversión en terrenos',
        'Propiedades comerciales pequeñas'
      ].filter(topic => 
        !Object.keys(topicFrequency).some(covered => 
          covered.includes(topic.toLowerCase().split(' ')[0])
        )
      );

      // Oportunidades basadas en gaps
      const opportunities = [
        'Crear contenido sobre distritos emergentes con datos específicos',
        'Desarrollar guías de inversión para jóvenes profesionales',
        'Posicionarse como experto en propiedades eco-friendly',
        'Contenido sobre tecnología en bienes raíces',
        'Análisis de nuevas modalidades de vivienda'
      ];

      // Sugerencias específicas
      const suggestions = [
        'Video: "5 distritos de Lima que la competencia ignora"',
        'Serie: "Invierte en Lima con S/50,000"',
        'Contenido: "Departamentos con paneles solares en Lima"',
        'Post: "Apps que todo inversionista inmobiliario debe conocer"',
        'Guía: "Co-living: La nueva tendencia habitacional en Lima"'
      ];

      setGapAnalysis({
        uncoveredTopics,
        opportunities,
        suggestions
      });
      
      setIsAnalyzing(false);
      
      toast({
        title: "Análisis completado",
        description: `Se identificaron ${uncoveredTopics.length} oportunidades de contenido`
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Formulario para agregar contenido de competidores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Agregar Contenido de Competidores
          </CardTitle>
          <CardDescription>
            Analiza el contenido de tus competidores para identificar oportunidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Nombre del competidor"
              value={competitorName}
              onChange={(e) => setCompetitorName(e.target.value)}
            />
            <Input
              placeholder="Plataforma (TikTok, Instagram, etc.)"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
            <Input
              placeholder="Engagement (likes, views, etc.)"
              type="number"
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
            />
          </div>
          
          <Textarea
            placeholder="Pega aquí el contenido del competidor (hook, descripción, hashtags...)"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
          />
          
          <Button onClick={handleAddContent} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Analizar Contenido
          </Button>
        </CardContent>
      </Card>

      {/* Lista de contenidos analizados */}
      {competitorContents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Contenidos Analizados ({competitorContents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitorContents.slice(-3).map((content) => (
                <div key={content.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{content.competitor}</h4>
                      <p className="text-sm text-muted-foreground">{content.platform}</p>
                    </div>
                    <Badge variant="outline">{content.engagement.toLocaleString()} engagement</Badge>
                  </div>
                  
                  <p className="text-sm mb-3 line-clamp-2">{content.content}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {content.topics.map((topic, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={performGapAnalysis} 
              disabled={isAnalyzing || competitorContents.length === 0}
              className="w-full mt-4"
            >
              {isAnalyzing ? (
                <>
                  <TrendingUp className="mr-2 h-4 w-4 animate-pulse" />
                  Analizando gaps...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Realizar Gap Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Resultados del Gap Analysis */}
      {gapAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Temas no cubiertos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <Target className="h-5 w-5" />
                Temas Descubiertos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gapAnalysis.uncoveredTopics.map((topic, i) => (
                  <Badge key={i} variant="outline" className="block text-center py-2">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Oportunidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <TrendingUp className="h-5 w-5" />
                Oportunidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {gapAnalysis.opportunities.map((opportunity, i) => (
                  <li key={i} className="text-sm border-l-2 border-blue-200 pl-3">
                    {opportunity}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Sugerencias específicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Lightbulb className="h-5 w-5" />
                Contenido Sugerido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {gapAnalysis.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm bg-green-50 p-2 rounded border-l-2 border-green-200">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
