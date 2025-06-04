
import { create } from 'zustand';
import { ContentItem, ContentFilter } from '@/types';
import { contentService } from '@/lib/database';

interface ContentStore {
  contents: ContentItem[];
  filteredContents: ContentItem[];
  currentFilter: ContentFilter;
  isLoading: boolean;
  selectedContent: ContentItem | null;
  
  // Actions
  loadContents: () => Promise<void>;
  addContent: (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContent: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  setFilter: (filter: ContentFilter) => void;
  clearFilters: () => void;
  setSelectedContent: (content: ContentItem | null) => void;
  applyFilter: () => void;
}

export const useContentStore = create<ContentStore>((set, get) => ({
  contents: [],
  filteredContents: [],
  currentFilter: {},
  isLoading: false,
  selectedContent: null,
  
  loadContents: async () => {
    console.log('🔍 useContentStore.loadContents() called');
    set({ isLoading: true });
    try {
      const contents = await contentService.getAll();
      console.log(`📊 Store loaded ${contents.length} contents`);
      set({ contents, filteredContents: contents });
      get().applyFilter(); // Aplicar filtros actuales a los nuevos datos
    } catch (error) {
      console.error('❌ Error loading contents:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  addContent: async (contentData) => {
    console.log('🔍 useContentStore.addContent() called');
    try {
      await contentService.create(contentData);
      await get().loadContents(); // Recargar todos los contenidos
    } catch (error) {
      console.error('❌ Error adding content:', error);
      throw error;
    }
  },
  
  updateContent: async (id, updates) => {
    console.log(`🔍 useContentStore.updateContent() called for id: ${id}`);
    try {
      await contentService.update(id, updates);
      await get().loadContents(); // Recargar todos los contenidos
    } catch (error) {
      console.error('❌ Error updating content:', error);
      throw error;
    }
  },
  
  deleteContent: async (id) => {
    console.log(`🔍 useContentStore.deleteContent() called for id: ${id}`);
    try {
      await contentService.delete(id);
      await get().loadContents(); // Recargar todos los contenidos
    } catch (error) {
      console.error('❌ Error deleting content:', error);
      throw error;
    }
  },
  
  setFilter: (filter) => {
    console.log('🔍 useContentStore.setFilter() called with:', filter);
    const newFilter = { ...get().currentFilter, ...filter };
    console.log('📊 New complete filter state:', newFilter);
    set({ currentFilter: newFilter });
    get().applyFilter();
  },
  
  clearFilters: () => {
    console.log('🔍 useContentStore.clearFilters() called');
    set({ currentFilter: {} });
    get().applyFilter();
  },
  
  setSelectedContent: (content) => {
    console.log('🔍 useContentStore.setSelectedContent() called');
    set({ selectedContent: content });
  },
  
  applyFilter: async () => {
    const { currentFilter, contents } = get();
    console.log('🔍 useContentStore.applyFilter() called with filter:', currentFilter);
    console.log(`📊 Applying filter to ${contents.length} total contents`);
    
    // Limpiar filtros con valores indefinidos o inválidos
    const cleanFilter: ContentFilter = {};
    
    if (currentFilter.platform && currentFilter.platform.trim() !== '') {
      cleanFilter.platform = currentFilter.platform;
    }
    
    if (currentFilter.type && currentFilter.type.trim() !== '') {
      cleanFilter.type = currentFilter.type;
    }
    
    if (currentFilter.duration && currentFilter.duration.trim() !== '') {
      cleanFilter.duration = currentFilter.duration;
    }
    
    if (currentFilter.status && currentFilter.status.trim() !== '') {
      cleanFilter.status = currentFilter.status;
    }
    
    if (currentFilter.hookType && currentFilter.hookType.trim() !== '') {
      cleanFilter.hookType = currentFilter.hookType;
    }
    
    if (currentFilter.minViralScore !== undefined && currentFilter.minViralScore !== null) {
      cleanFilter.minViralScore = currentFilter.minViralScore;
    }
    
    if (currentFilter.maxViralScore !== undefined && currentFilter.maxViralScore !== null) {
      cleanFilter.maxViralScore = currentFilter.maxViralScore;
    }
    
    if (currentFilter.search && typeof currentFilter.search === 'string' && currentFilter.search.trim() !== '') {
      cleanFilter.search = currentFilter.search.trim();
    }
    
    // Si no hay filtros activos, mostrar todos los contenidos
    const hasActiveFilters = Object.keys(cleanFilter).length > 0;
    
    if (!hasActiveFilters) {
      console.log('📊 No active filters, showing all contents');
      set({ filteredContents: contents });
      return;
    }
    
    try {
      const filteredContents = await contentService.getByFilter(cleanFilter);
      console.log(`📊 Filter applied, showing ${filteredContents.length} filtered contents`);
      set({ filteredContents });
    } catch (error) {
      console.error('❌ Error applying filter:', error);
      // En caso de error, mostrar todos los contenidos
      set({ filteredContents: contents });
    }
  }
}));
