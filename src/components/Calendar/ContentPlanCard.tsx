
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { ContentPlan } from './types';

interface ContentPlanCardProps {
  plan: ContentPlan;
  onDragStart: (e: React.DragEvent, planId: string) => void;
}

export function ContentPlanCard({ plan, onDragStart }: ContentPlanCardProps) {
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
    <div
      draggable
      onDragStart={(e) => onDragStart(e, plan.id)}
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
  );
}
