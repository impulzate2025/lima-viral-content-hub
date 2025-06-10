
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useContentStore } from '@/stores/content-store';
import { ContentPlan, NewPlanForm } from './types';
import { AddContentDialog } from './AddContentDialog';
import { ContentPlanCard } from './ContentPlanCard';
import { CalendarSummary } from './CalendarSummary';

export function InteractiveCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [contentPlans, setContentPlans] = useState<ContentPlan[]>([]);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [useExistingContent, setUseExistingContent] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string>('');
  const [newPlan, setNewPlan] = useState<NewPlanForm>({
    platform: '',
    type: '',
    topic: '',
    priority: 'medium'
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

            <div className="space-y-6">
              {selectedDate && (
                <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-center">
                      📅 {format(selectedDate, 'EEEE d MMMM', { locale: es })}
                    </CardTitle>
                    <AddContentDialog
                      isOpen={isAddingContent}
                      onOpenChange={setIsAddingContent}
                      contents={contents}
                      useExistingContent={useExistingContent}
                      setUseExistingContent={setUseExistingContent}
                      selectedContentId={selectedContentId}
                      setSelectedContentId={setSelectedContentId}
                      newPlan={newPlan}
                      setNewPlan={setNewPlan}
                      onAddPlan={handleAddPlan}
                    />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div 
                      className="space-y-3 min-h-[120px] border-3 border-dashed border-blue-300 rounded-xl p-4 bg-white/50"
                      onDrop={(e) => handleDrop(e, selectedDate)}
                      onDragOver={handleDragOver}
                    >
                      {getPlansForDate(selectedDate).map((plan) => (
                        <ContentPlanCard
                          key={plan.id}
                          plan={plan}
                          onDragStart={handleDragStart}
                        />
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

              <CalendarSummary contentPlans={contentPlans} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
