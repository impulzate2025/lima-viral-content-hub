import { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader/MainHeader";
import { MainTabs } from "@/components/MainTabs/MainTabs";
import { ContentDialog } from "@/components/ContentDialog/ContentDialog";
import { AIGeneratorDialog } from "@/components/ContentDialog/AIGeneratorDialog"; // Importar AIGeneratorDialog
import { useContentStore } from "@/stores/content-store";
import { useContentActions } from "@/hooks/useContentActions";
import { ContentItem } from "@/types"; // Importar ContentItem
import { aiGenerator } from '@/lib/ai-generator'; // <<-- ¡AÑADIDA ESTA LÍNEA! IMPORTA LA INSTANCIA DE aiGenerator

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    contents,
    filteredContents,
    currentFilter,
    loadContents,
    setFilter
  } = useContentStore();

  const {
    dialogType,
    selectedContent,
    handleNewContent,
    handleEditContent,
    handleViewContent,
    handleSaveContent,
    handleDeleteContent,
    handleCopyContent,
    handleBulkDelete,
    handleImportExcel,
    handleImportContents,
    handleExportData,
    handleExportSelected,
    handleOpenAIGenerator, // Cambiado de handleGenerateAI a handleOpenAIGenerator
    handleGenerateAI,      // Nueva función para la lógica de IA
    handleLoadSampleData,
    closeDialog,
    isAILoading,           // Nuevo estado
    generatedHook,         // Nuevo estado
    setGeneratedHook,       // Nueva función
    setSelectedContent    // Añadir setSelectedContent
  } = useContentActions();

  // --- ESTE ES TU useEffect ORIGINAL para cargar contenidos. ¡Aquí agregamos la llamada a listAvailableModels()! ---
  useEffect(() => {
    console.log('🚀 Index component mounted, loading contents...');
    loadContents();
    
    // Aquí llamamos al método para listar los modelos de IA disponibles.
    // Esto se ejecutará una vez cuando el componente Index se monte.
    // La salida aparecerá en la consola del navegador.
    aiGenerator.listAvailableModels(); 
  }, [loadContents]); // `loadContents` es una dependencia para React, la mantenemos.

  // --- TU useEffect ORIGINAL para debug de cambios en el estado de contenidos ---
  useEffect(() => {
    console.log(`📊 Contents state updated: ${contents.length} total, ${filteredContents.length} filtered`);
  }, [contents, filteredContents]);

  // --- TU useEffect ORIGINAL para debug del estado del filtro actual ---
  useEffect(() => {
    console.log('📊 Current filter state:', currentFilter);
  }, [currentFilter]);

  return (
    <div className="min-h-screen bg-background">
      <MainHeader
        contentsCount={contents.length}
        onNewContent={handleNewContent}
        onImportExcel={handleImportExcel}
        onLoadSampleData={handleLoadSampleData}
      />

      <main className="container mx-auto px-4 py-6">
        <MainTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          filteredContents={filteredContents}
          totalContents={contents.length}
          currentFilter={currentFilter}
          onFilterChange={setFilter}
          onNewContent={handleNewContent}
          onImportExcel={handleImportExcel}
          onExportData={handleExportData}
          onGenerateAI={handleOpenAIGenerator} // Cambiado para abrir el diálogo
          onEdit={handleEditContent}
          onDelete={handleDeleteContent}
          onView={handleViewContent}
          onCopy={handleCopyContent}
          onBulkDelete={handleBulkDelete}
          onExportSelected={handleExportSelected}
        />
      </main>

      <ContentDialog
        dialogType={dialogType}
        selectedContent={selectedContent}
        onSave={handleSaveContent}
        onImport={handleImportContents}
        onClose={closeDialog}
        onEdit={handleEditContent}
        onCopy={handleCopyContent}
      />

      {dialogType === 'aiGenerator' && (
        <AIGeneratorDialog
          isOpen={dialogType === 'aiGenerator'}
          onClose={closeDialog}
          onGenerate={handleGenerateAI}
          onUseHook={(hook) => {
            // Cuando el usuario decide usar el hook generado:
            // 1. Actualizamos el 'selectedContent' que se pasará al editor.
            //    Si ya hay un 'selectedContent' (por ejemplo, si se estaba editando algo y se abrió el generador de IA),
            //    se mantiene el resto de la información y solo se actualiza el hook.
            //    Si no hay 'selectedContent' (se abrió el generador desde cero), se crea un objeto solo con el hook.
            setSelectedContent(prev => 
              prev 
                ? { ...prev, hook: hook } 
                : { 
                    hook: hook, 
                    // Podrías inicializar otros campos por defecto aquí si es necesario para 'handleNewContent'
                    // Por ejemplo, un array vacío para platformas, un status 'draft', etc.
                    // Esto dependerá de cómo `ContentEditor` y `handleSaveContent` esperan un nuevo `ContentItem`.
                    // Basado en ContentEditor, un objeto solo con 'hook' podría ser insuficiente si otros campos son obligatorios
                    // al guardar, incluso si el editor los muestra vacíos.
                    // Para ser más robusto, podrías inicializarlo más completamente:
                    platform: [],
                    type: '' as any, // O un valor por defecto de ContentType
                    duration: '' as any, // O un valor por defecto de Duration
                    script: '',
                    tags: [],
                    status: 'draft' as any,
                    viralScore: 50,
                    // Campos que faltaban para cumplir con ContentItem
                    id: `temp-id-${Date.now()}`, // ID temporal para el estado, se generará uno real al guardar
                    visualElements: '',
                    context: '',
                    cta: '',
                    aiTools: '',
                    createdAt: new Date(), // Fecha temporal
                    updatedAt: new Date(), // Fecha temporal
                    campaign: undefined // Opcional
                  }
            );
            // 2. Limpiamos el hook generado del estado del diálogo de IA.
            setGeneratedHook(null); 
            // 3. Cerramos el diálogo del generador de IA y abrimos el editor de contenido.
            //    handleNewContent() internamente setea selectedContent a null si no se le pasa argumento,
            //    pero como ya lo hemos seteado justo antes, el ContentEditor debería recoger el valor con el hook.
            //    Si handleNewContent resetea selectedContent, necesitaríamos pasar el nuevo objeto directamente.
            //    Revisando useContentActions, handleNewContent hace: setSelectedContent(null); setDialogType('editor');
            //    Así que necesitamos modificar cómo se pasa el hook al editor.
            //    Una mejor aproximación es que handleNewContent acepte un ContentItem parcial.
            //    O, más simple por ahora, que ContentEditor use el 'generatedHook' si está presente y 'selectedContent' es null.

            // Opción A: Modificar handleNewContent para aceptar un prefill (más complejo ahora)
            // Opción B: Pasar el hook de alguna manera al ContentEditor cuando se abre para un nuevo contenido.
            // La forma actual en Index.tsx es: setSelectedContent(...); handleNewContent();
            // En useContentActions, handleNewContent es: setSelectedContent(null); setDialogType('editor');
            // Esto significa que el selectedContent que seteamos en Index.tsx se sobreescribirá.

            // Solución: Modificar `handleNewContent` en `useContentActions` para que pueda tomar un `initialData`
            // O, más sencillo por ahora, usar el `selectedContent` que ya hemos preparado.
            // Vamos a asumir que `handleNewContent` usará el `selectedContent` si no es null.
            // No, handleNewContent explícitamente lo setea a null. 
            // Entonces, la lógica de `onUseHook` debe ser: 
            // 1. Preparar el objeto de contenido con el hook.
            // 2. Llamar a una función que abra el editor CON ese objeto.
            //    `handleEditContent` hace esto: setSelectedContent(content); setDialogType('editor');
            //    Podemos usar `handleEditContent` con un objeto parcial que simule un ContentItem.
            const newContentWithHook: Partial<ContentItem> = {
                hook: hook,
                // Valores por defecto para un nuevo item, para que el editor no falle
                platform: [],
                type: 'Educativo', // Valor por defecto
                duration: '30s',  // Valor por defecto
                script: '',
                tags: [],
                status: 'draft',
                viralScore: 50,
                visualElements: '',
                context: '',
                cta: '',
                aiTools: '',
                // id, createdAt, updatedAt se generarían al guardar
            };
            handleEditContent(newContentWithHook as ContentItem); // Usamos handleEditContent para pasar el objeto
            setGeneratedHook(null); // Limpiar el hook del generador de IA
            // No necesitamos llamar a closeDialog() aquí si handleEditContent ya cambia el dialogType
          }}
          isLoading={isAILoading}
          generatedHook={generatedHook}
        />
      )}
    </div>
  );
};

export default Index;