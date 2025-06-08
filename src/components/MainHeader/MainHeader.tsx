
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { PlusCircle, Upload, Database, MoreHorizontal, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface MainHeaderProps {
  contentsCount: number;
  onNewContent: () => void;
  onImportExcel: () => void;
  onLoadSampleData: () => void;
}

export function MainHeader({ 
  contentsCount, 
  onNewContent, 
  onImportExcel, 
  onLoadSampleData 
}: MainHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-background border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-foreground">ContentAI Pro</h1>
              <Badge variant="secondary" className="text-xs">
                {contentsCount} contenidos
              </Badge>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-sm"
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/validation')}
              className="text-sm"
            >
              Centro de Inteligencia
            </Button>
          </nav>

          <div className="flex items-center space-x-2">
            <Button onClick={onNewContent} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onImportExcel}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLoadSampleData}>
                  <Database className="mr-2 h-4 w-4" />
                  Datos de Ejemplo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/validation')}>
                  <Brain className="mr-2 h-4 w-4" />
                  Centro de Inteligencia
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
