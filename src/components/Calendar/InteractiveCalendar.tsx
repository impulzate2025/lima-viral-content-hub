
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarDays, Plus, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ContentPlan {
  id: string;
  date: Date;
  platform: string;
  type: string;
  topic: string;
  status: 'planned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export function InteractiveCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [contentPlans, setContentPlans] = useState<ContentPlan[]>([
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
  ]);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [newPlan, setNewPlan] = useState({
    platform: '',
    type: '',
    topic: '',
    priority: 'medium' as const
  });

  const getPlansForDate = (date: Date) => {
    return contentPlans.filter(plan => 
      format(plan.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getDatesWithContent = () => {
    return contentPlans.map(plan => plan.date);
  };

  const handleAddPlan = () => {
    if (!selectedDate || !newPlan.platform || !newPlan.topic) return;

    const plan: ContentPlan = {
      id: Date.now().toString(),
      date: selectedDate,
      platform: newPlan.platform,
      type: newPlan.type,
      topic: newPlan.topic,
      status: 'planned',
      priority: newPlan.priority
    };

    setContentPlans(prev => [...prev, plan]);
    setNewPlan({ platform: '', type: '', topic: '', priority: 'medium' });
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
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Calendario de Contenido Interactivo
          </CardTitle>
          <CardDescription>
            Planifica, organiza y arrastra tu contenido en el calendario. Drag & drop para reprogramar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendario principal */}
            <div className="lg:col-span-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasContent: getDatesWithContent()
                }}
                modifiersStyles={{
                  hasContent: { backgroundColor: '#dbeafe', fontWeight: 'bold' }
                }}
                onDayClick={(date) => {
                  setSelectedDate(date);
                }}
              />
              
              {/* Leyenda */}
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 rounded"></div>
                  <span className="text-sm">Días con contenido</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm">Completado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm">En progreso</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span className="text-sm">Planificado</span>
                </div>
              </div>
            </div>

            {/* Panel lateral */}
            <div className="space-y-4">
              {selectedDate && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {format(selectedDate, 'EEEE d MMMM', { locale: es })}
                    </CardTitle>
                    <Dialog open={isAddingContent} onOpenChange={setIsAddingContent}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar Contenido
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nuevo Contenido</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Plataforma (TikTok, Instagram...)"
                            value={newPlan.platform}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, platform: e.target.value }))}
                          />
                          <Input
                            placeholder="Tipo (Educativo, Controversial...)"
                            value={newPlan.type}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, type: e.target.value }))}
                          />
                          <Input
                            placeholder="Tema del contenido"
                            value={newPlan.topic}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, topic: e.target.value }))}
                          />
                          <select
                            value={newPlan.priority}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, priority: e.target.value as any }))}
                            className="w-full p-2 border rounded"
                          >
                            <option value="low">Prioridad Baja</option>
                            <option value="medium">Prioridad Media</option>
                            <option value="high">Prioridad Alta</option>
                          </select>
                          <Button onClick={handleAddPlan} className="w-full">
                            Crear Contenido
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div 
                      className="space-y-2 min-h-[100px] border-2 border-dashed border-gray-200 rounded p-2"
                      onDrop={(e) => handleDrop(e, selectedDate)}
                      onDragOver={handleDragOver}
                    >
                      {getPlansForDate(selectedDate).map((plan) => (
                        <div
                          key={plan.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, plan.id)}
                          className={`p-3 rounded-lg border cursor-move hover:shadow-md transition-shadow ${getPriorityColor(plan.priority)}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-xs">
                              {plan.platform}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(plan.status)}`}></div>
                          </div>
                          <p className="text-sm font-medium">{plan.type}</p>
                          <p className="text-xs text-gray-600 line-clamp-2">{plan.topic}</p>
                        </div>
                      ))}
                      
                      {getPlansForDate(selectedDate).length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                          <Clock className="mx-auto h-8 w-8 mb-2" />
                          <p className="text-sm">Arrastra contenido aquí o agrega nuevo</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Resumen semanal */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Esta Semana
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Planificados</span>
                      <Badge variant="outline">
                        {contentPlans.filter(p => p.status === 'planned').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">En progreso</span>
                      <Badge variant="outline">
                        {contentPlans.filter(p => p.status === 'in_progress').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Completados</span>
                      <Badge variant="outline">
                        {contentPlans.filter(p => p.status === 'completed').length}
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
