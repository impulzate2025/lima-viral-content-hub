
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { ExcelGuidePopup } from './ExcelGuidePopup';

export function ExcelHelpButton() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsGuideOpen(true)}
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
            >
              <HelpCircle className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Guía para subir archivos Excel</p>
          </TooltipContent>
        </Tooltip>

        <ExcelGuidePopup 
          isOpen={isGuideOpen} 
          onClose={() => setIsGuideOpen(false)} 
        />
      </div>
    </TooltipProvider>
  );
}
