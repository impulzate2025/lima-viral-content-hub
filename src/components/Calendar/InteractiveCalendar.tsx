
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarDays, Plus, Clock, Target, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useContentStore } from '@/stores/content-store';
import { ContentItem, Platform, ContentType } from '@/types';

interface ContentPlan {
  id: string;
  date: Date;
  contentId?: string;
  platform: string;
  type: string;
  topic: string;
  hook?: string;
  script?: string;
  status: 'planned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'Facebook', 'Twitter'];
const CONTENT_TYPES = ['Educativo', 'Testimonial', 'Controversial', 'Predictivo', 'Behind-Scenes', 'Tutorial'];
const TOPICS_PREDEFINIDOS = [
  '3 distritos emergentes Lima 2025',
  '¿Por qué Miraflores ya no es la mejor inversión?',
  'Secretos de inversión inmobiliaria',
  'Errores comunes al comprar departamento',
  'Tendencias del mercado inmobiliario',
  'Consejos para primera compra',
  'Zonas con mayor plusvalía',
  'Análisis de precios por distrito'
];

export function InteractiveCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [contentPlans, setContentPlans] = useState<ContentPlan[]>([]);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [useExistingContent, setUseExistingContent] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string>('');
  const [newPlan, setNewPlan] = useState({
    platform: '',
    type: '',
    topic: '',
    priority: 'medium' as const
  });

  const { contents } = useContentStore();

  useEffect(() => {
    const examplePlans: ContentPlan[] = [
      {
        id: '1',
        date: new Date(2024, 11, 15),
        platform: 'TikTok',
        type: 'Educativo',
        topic: '3 distritos emergentes Lima 2025',
        status: 'planned',
        priority: 'high'
      },
      {
        id: '2',
        date: new Date(2024, 11, 16),
        platform: 'Instagram',
        type: 'Controversial',
        topic: '¿Por qué Miraflores ya no es la mejor inversión?',
        status: 'in_progress',
        priority: 'medium'
      }
    ];
    setContentPlans(examplePlans);
  }, []);

  const getPlansForDate = (date: Date) => {
    return contentPlans.filter(plan => 
      format(plan.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getDatesWithContent = () => {
    return contentPlans.map(plan => plan.date);
  };

  const handleAddPlan = () => {
    if (!selectedDate) return;

    let planData: Partial<ContentPlan> = {
      id: Date.now().toString(),
      date: selectedDate,
      status: 'planned',
      priority: newPlan.priority
    };

    if (useExistingContent && selectedContentId) {
      const selectedContent = contents.find(c => c.id === selectedContentId);
      if (selectedContent) {
        planData = {
          ...planData,
          contentId: selectedContentId,
          platform: Array.isArray(selectedContent.platform) ? selectedContent.platform[0] : selectedContent.platform,
          type: selectedContent.type,
          topic: selectedContent.hook,
          hook: selectedContent.hook,
          script: selectedContent.script
        };
      }
    } else {
      if (!newPlan.platform || !newPlan.topic) return;
      planData = {
        ...planData,
        platform: newPlan.platform,
        type: newPlan.type,
        topic: newPlan.topic
      };
    }

    setContentPlans(prev => [...prev, planData as ContentPlan]);
    setNewPlan({ platform: '', type: '', topic: '', priority: 'medium' });
    setSelectedContentId('');
    setUseExistingContent(false);
    setIsAddingContent(false);
  };

  const handleDragStart = (e: React.DragEvent, planId: string) => {
    e.dataTransfer.setData('text/plain', planId);
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    const planId = e.dataTransfer.getData('text/plain');
    
    setContentPlans(prev => prev.map(plan => 
      plan.id === planId 
        ? { ...plan, date: targetDate }
        : plan
    ));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'planned': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CalendarDays className="h-6 w-6" />
            📅 Calendario de Contenido Súper Fácil
          </CardTitle>
          <CardDescription className="text-lg">
            🎯 Solo haz clic y arrastra. ¡Tan fácil como usar WhatsApp!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendario principal */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-2 border-blue-200 bg-white shadow-lg"
                  modifiers={{
                    hasContent: getDatesWithContent()
                  }}
                  modifiersStyles={{
                    hasContent: { backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold' }
                  }}
                  onDayClick={(date) => {
                    setSelectedDate(date);
                  }}
                />
                
                {/* Leyenda más visual */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">📅 Días con contenido</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-medium">✅ Completado</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">🔄 En progreso</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow">
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                    <span className="font-medium">📝 Planificado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel lateral mejorado */}
            <div className="space-y-6">
              {selectedDate && (
                <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-center">
                      📅 {format(selectedDate, 'EEEE d MMMM', { locale: es })}
                    </CardTitle>
                    <Dialog open={isAddingContent} onOpenChange={setIsAddingContent}>
                      <DialogTrigger asChild>
                        <Button size="lg" className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                          <Plus className="mr-2 h-6 w-6" />
                          ➕ Agregar Contenido Fácil
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-center">
                            🎯 Nuevo Contenido - ¡Súper Fácil!
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 p-4">
                          {/* Opción simple: usar contenido existente */}
                          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                            <div className="flex items-center space-x-3 mb-4">
                              <input
                                type="checkbox"
                                id="useExisting"
                                checked={useExistingContent}
                                onChange={(e) => setUseExistingContent(e.target.checked)}
                                className="w-5 h-5"
                              />
                              <label htmlFor="useExisting" className="text-lg font-medium">
                                📋 Usar contenido que ya tienes
                              </label>
                            </div>

                            {useExistingContent && (
                              <Select value={selectedContentId} onValueChange={setSelectedContentId}>
                                <SelectTrigger className="w-full text-lg py-6">
                                  <SelectValue placeholder="🔍 Elige tu contenido..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {contents.map(content => (
                                    <SelectItem key={content.id} value={content.id} className="text-base py-3">
                                      📝 {content.hook.substring(0, 60)}...
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>

                          {/* Opción crear nuevo - TODO MUY FÁCIL */}
                          {!useExistingContent && (
                            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 space-y-4">
                              <h3 className="text-lg font-medium text-center">🆕 Crear contenido nuevo</h3>
                              
                              {/* Plataforma - Botones grandes */}
                              <div>
                                <label className="text-base font-medium mb-3 block">📱 ¿Dónde lo vas a publicar?</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {PLATFORMS.map(platform => (
                                    <Button
                                      key={platform}
                                      type="button"
                                      variant={newPlan.platform === platform ? "default" : "outline"}
                                      onClick={() => setNewPlan(prev => ({ ...prev, platform }))}
                                      className="text-base py-4"
                                    >
                                      {platform === 'TikTok' && '🎵'} 
                                      {platform === 'Instagram' && '📸'} 
                                      {platform === 'YouTube' && '📺'} 
                                      {platform === 'LinkedIn' && '💼'} 
                                      {platform === 'Facebook' && '👥'} 
                                      {platform === 'Twitter' && '🐦'} 
                                      {platform}
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              {/* Tipo - Botones grandes */}
                              <div>
                                <label className="text-base font-medium mb-3 block">🎭 ¿Qué tipo de contenido?</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {CONTENT_TYPES.map(type => (
                                    <Button
                                      key={type}
                                      type="button"
                                      variant={newPlan.type === type ? "default" : "outline"}
                                      onClick={() => setNewPlan(prev => ({ ...prev, type }))}
                                      className="text-sm py-3"
                                    >
                                      {type === 'Educativo' && '🎓'} 
                                      {type === 'Testimonial' && '⭐'} 
                                      {type === 'Controversial' && '🔥'} 
                                      {type === 'Predictivo' && '🔮'} 
                                      {type === 'Behind-Scenes' && '🎬'} 
                                      {type === 'Tutorial' && '📚'} 
                                      {type}
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              {/* Tema - Lista predefinida */}
                              <div>
                                <label className="text-base font-medium mb-3 block">💡 ¿De qué tema?</label>
                                <Select value={newPlan.topic} onValueChange={(value) => setNewPlan(prev => ({ ...prev, topic: value }))}>
                                  <SelectTrigger className="w-full text-base py-6">
                                    <SelectValue placeholder="🎯 Elige un tema..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {TOPICS_PREDEFINIDOS.map(topic => (
                                      <SelectItem key={topic} value={topic} className="text-base py-3">
                                        💭 {topic}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}

                          {/* Prioridad - Botones grandes y coloridos */}
                          <div>
                            <label className="text-base font-medium mb-3 block">⚡ ¿Qué tan importante es?</label>
                            <div className="grid grid-cols-3 gap-2">
                              <Button
                                type="button"
                                variant={newPlan.priority === 'low' ? "default" : "outline"}
                                onClick={() => setNewPlan(prev => ({ ...prev, priority: 'low' }))}
                                className="text-base py-4 bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                              >
                                🟢 Tranquilo
                              </Button>
                              <Button
                                type="button"
                                variant={newPlan.priority === 'medium' ? "default" : "outline"}
                                onClick={() => setNewPlan(prev => ({ ...prev, priority: 'medium' }))}
                                className="text-base py-4 bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                              >
                                🟡 Normal
                              </Button>
                              <Button
                                type="button"
                                variant={newPlan.priority === 'high' ? "default" : "outline"}
                                onClick={() => setNewPlan(prev => ({ ...prev, priority: 'high' }))}
                                className="text-base py-4 bg-red-100 border-red-300 text-red-800 hover:bg-red-200"
                              >
                                🔴 Urgente
                              </Button>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={handleAddPlan} 
                            className="w-full text-xl py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            disabled={useExistingContent ? !selectedContentId : (!newPlan.platform || !newPlan.topic)}
                          >
                            ✨ ¡Agregar al Calendario!
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div 
                      className="space-y-3 min-h-[120px] border-3 border-dashed border-blue-300 rounded-xl p-4 bg-white/50"
                      onDrop={(e) => handleDrop(e, selectedDate)}
                      onDragOver={handleDragOver}
                    >
                      {getPlansForDate(selectedDate).map((plan) => (
                        <div
                          key={plan.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, plan.id)}
                          className={`p-4 rounded-xl border-2 cursor-move hover:shadow-lg transition-all transform hover:scale-105 ${getPriorityColor(plan.priority)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-sm font-medium">
                              📱 {plan.platform}
                            </Badge>
                            <div className="flex items-center gap-2">
                              {plan.contentId && (
                                <ExternalLink className="w-4 h-4 text-blue-500" />
                              )}
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(plan.status)}`}></div>
                            </div>
                          </div>
                          <p className="font-medium text-sm">🎭 {plan.type}</p>
                          <p className="text-sm text-gray-700 line-clamp-2">💭 {plan.topic}</p>
                          {plan.hook && (
                            <p className="text-sm text-blue-600 mt-2 line-clamp-1">
                              📝 {plan.hook}
                            </p>
                          )}
                        </div>
                      ))}
                      
                      {getPlansForDate(selectedDate).length === 0 && (
                        <div className="text-center text-gray-500 py-12">
                          <Clock className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                          <p className="text-lg font-medium">🎯 ¡Arrastra contenido aquí!</p>
                          <p className="text-base">o haz clic en "Agregar Contenido"</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Resumen mejorado */}
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
