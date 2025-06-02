
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentItem, Platform } from "@/types";
import { Edit, Trash2, Copy, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ContentTableProps {
  contents: ContentItem[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (content: ContentItem) => void;
  onDelete: (id: string) => void;
  onView: (content: ContentItem) => void;
  onCopy: (content: ContentItem) => void;
}

const PLATFORM_COLORS: Record<Platform, string> = {
  TikTok: 'bg-pink-100 text-pink-800',
  Instagram: 'bg-purple-100 text-purple-800', 
  YouTube: 'bg-red-100 text-red-800',
  LinkedIn: 'bg-blue-100 text-blue-800'
};

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  ready: 'bg-green-100 text-green-800',
  published: 'bg-blue-100 text-blue-800',
  archived: 'bg-orange-100 text-orange-800'
};

const STATUS_LABELS = {
  draft: 'Borrador',
  ready: 'Listo',
  published: 'Publicado',
  archived: 'Archivado'
};

export function ContentTable({ 
  contents, 
  selectedIds, 
  onSelectionChange, 
  onEdit, 
  onDelete, 
  onView,
  onCopy 
}: ContentTableProps) {
  const [sortField, setSortField] = useState<keyof ContentItem | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(contents.map(content => content.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleSort = (field: keyof ContentItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedContents = [...contents].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (aValue instanceof Date) aValue = aValue.getTime();
    if (bValue instanceof Date) bValue = bValue.getTime();
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === contents.length && contents.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('hook')}
            >
              Hook {sortField === 'hook' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Plataformas</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('type')}
            >
              Tipo {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('duration')}
            >
              Duración {sortField === 'duration' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('viralScore')}
            >
              Score {sortField === 'viralScore' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('status')}
            >
              Estado {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('updatedAt')}
            >
              Actualizado {sortField === 'updatedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContents.map((content) => (
            <TableRow key={content.id} className="hover:bg-muted/50">
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(content.id)}
                  onCheckedChange={(checked) => handleSelectOne(content.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="font-medium">{truncateText(content.hook, 60)}</div>
                {content.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {content.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {content.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{content.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {content.platform.map(platform => (
                    <Badge 
                      key={platform} 
                      variant="secondary"
                      className={`text-xs ${PLATFORM_COLORS[platform]}`}
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{content.type}</Badge>
              </TableCell>
              <TableCell>{content.duration}</TableCell>
              <TableCell>
                <Badge className={`${getViralScoreColor(content.viralScore)}`}>
                  {content.viralScore}/100
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={STATUS_COLORS[content.status]}>
                  {STATUS_LABELS[content.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(content.updatedAt, 'dd/MM/yyyy', { locale: es })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(content)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopy(content)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(content)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(content.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {contents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No hay contenidos que mostrar</p>
          <p className="text-sm">Crea tu primer contenido viral o importa desde Excel</p>
        </div>
      )}
    </div>
  );
}
