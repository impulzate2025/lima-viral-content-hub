
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Database, Search, Plus, TrendingUp, MapPin, Users, DollarSign } from 'lucide-react';

interface Insight {
  id: string;
  category: 'market' | 'district' | 'demographic' | 'pricing' | 'trends';
  title: string;
  content: string;
  source: string;
  date: Date;
  tags: string[];
  relevanceScore: number;
}

export function InsightsDatabase() {
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: '1',
      category: 'market',
      title: 'Crecimiento del mercado inmobiliario en Lima Este',
      content: 'El mercado inmobiliario en distritos como Ate y Santa Anita ha crecido 23% en el último año, impulsado por mejoras en infraestructura de transporte.',
      source: 'CAPECO - Diciembre 2024',
      date: new Date(2024, 11, 1),
      tags: ['lima este', 'crecimiento', 'infraestructura'],
      relevanceScore: 9.2
    },
    {
      id: '2',
      category: 'demographic',
      title: 'Millennials buscan espacios de co-working integrados',
      content: 'El 67% de compradores millennials en Lima priorizan departamentos con espacios de co-working o adaptables para trabajo remoto.',
      source: 'Estudio Ipsos - Noviembre 2024',
      date: new Date(2024, 10, 15),
      tags: ['millennials', 'co-working', 'trabajo remoto'],
      relevanceScore: 8.7
    },
    {
      id: '3',
      category: 'pricing',
      title: 'Incremento en precios por m² en Jesús María',
      content: 'Jesús María registra un aumento del 18% en precios por m² durante 2024, consolidándose como distrito emergente premium.',
      source: 'Tinsa Perú - Diciembre 2024',
      date: new Date(2024, 11, 10),
      tags: ['jesús maría', 'precios', 'revalorización'],
      relevanceScore: 9.5
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingInsight, setIsAddingInsight] = useState(false);
  const [newInsight, setNewInsight] = useState({
    category: 'market' as const,
    title: '',
    content: '',
    source: '',
    tags: ''
  });

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || insight.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddInsight = () => {
    if (!newInsight.title || !newInsight.content) return;

    const insight: Insight = {
      id: Date.now().toString(),
      category: newInsight.category,
      title: newInsight.title,
      content: newInsight.content,
      source: newInsight.source || 'Fuente propia',
      date: new Date(),
      tags: newInsight.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      relevanceScore: Math.round((Math.random() * 3 + 7) * 10) / 10 // 7.0 - 10.0
    };

    setInsights(prev => [insight, ...prev]);
    setNewInsight({
      category: 'market',
      title: '',
      content: '',
      source: '',
      tags: ''
    });
    setIsAddingInsight(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'market': return <TrendingUp className="h-4 w-4" />;
      case 'district': return <MapPin className="h-4 w-4" />;
      case 'demographic': return <Users className="h-4 w-4" />;
      case 'pricing': return <DollarSign className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market': return 'bg-blue-100 text-blue-800';
      case 'district': return 'bg-green-100 text-green-800';
      case 'demographic': return 'bg-purple-100 text-purple-800';
      case 'pricing': return 'bg-orange-100 text-orange-800';
      case 'trends': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Base de Datos de Insights Inmobiliarios
          </CardTitle>
          <CardDescription>
            Centraliza y organiza insights de mercado, tendencias y datos relevantes para crear contenido de valor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Controles de búsqueda y filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar insights por título, contenido o tags..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="all">Todas las categorías</option>
              <option value="market">Mercado</option>
              <option value="district">Distritos</option>
              <option value="demographic">Demográficos</option>
              <option value="pricing">Precios</option>
              <option value="trends">Tendencias</option>
            </select>

            <Dialog open={isAddingInsight} onOpenChange={setIsAddingInsight}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Insight
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nuevo Insight</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categoría</label>
                    <select
                      value={newInsight.category}
                      onChange={(e) => setNewInsight(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full p-2 border rounded"
                    >
                      <option value="market">Mercado</option>
                      <option value="district">Distritos</option>
                      <option value="demographic">Demográficos</option>
                      <option value="pricing">Precios</option>
                      <option value="trends">Tendencias</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Título</label>
                    <Input
                      placeholder="Título del insight..."
                      value={newInsight.title}
                      onChange={(e) => setNewInsight(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contenido</label>
                    <Textarea
                      placeholder="Describe el insight con detalle..."
                      value={newInsight.content}
                      onChange={(e) => setNewInsight(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Fuente</label>
                    <Input
                      placeholder="Fuente del dato (opcional)"
                      value={newInsight.source}
                      onChange={(e) => setNewInsight(prev => ({ ...prev, source: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags (separados por comas)</label>
                    <Input
                      placeholder="lima norte, precios, crecimiento..."
                      value={newInsight.tags}
                      onChange={(e) => setNewInsight(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                  
                  <Button onClick={handleAddInsight} className="w-full">
                    Guardar Insight
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{insights.filter(i => i.category === 'market').length}</div>
              <div className="text-sm text-blue-600">Mercado</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{insights.filter(i => i.category === 'district').length}</div>
              <div className="text-sm text-green-600">Distritos</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{insights.filter(i => i.category === 'demographic').length}</div>
              <div className="text-sm text-purple-600">Demográficos</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{insights.filter(i => i.category === 'pricing').length}</div>
              <div className="text-sm text-orange-600">Precios</div>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-pink-600">{insights.filter(i => i.category === 'trends').length}</div>
              <div className="text-sm text-pink-600">Tendencias</div>
            </div>
          </div>

          {/* Lista de insights */}
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(insight.category)}>
                        {getCategoryIcon(insight.category)}
                        <span className="ml-1 capitalize">{insight.category}</span>
                      </Badge>
                      <Badge variant="outline" className="text-green-600">
                        Score: {insight.relevanceScore}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {insight.date.toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold mb-2">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{insight.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {insight.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      Fuente: {insight.source}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInsights.length === 0 && (
            <div className="text-center py-12">
              <Database className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                No se encontraron insights
              </h3>
              <p className="text-gray-400 mb-4">
                Intenta con otros términos de búsqueda o agrega nuevos insights
              </p>
              <Button onClick={() => setIsAddingInsight(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar primer insight
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
