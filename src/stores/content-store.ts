
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
    set({ isLoading: true });
    try {
      const contents = await contentService.getAll();
      set({ contents, filteredContents: contents });
      get().applyFilter();
    } catch (error) {
      console.error('Error loading contents:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  addContent: async (contentData) => {
    try {
      await contentService.create(contentData);
      await get().loadContents();
    } catch (error) {
      console.error('Error adding content:', error);
      throw error;
    }
  },
  
  updateContent: async (id, updates) => {
    try {
      await contentService.update(id, updates);
      await get().loadContents();
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  },
  
  deleteContent: async (id) => {
    try {
      await contentService.delete(id);
      await get().loadContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  },
  
  setFilter: (filter) => {
    set({ currentFilter: { ...get().currentFilter, ...filter } });
    get().applyFilter();
  },
  
  setSelectedContent: (content) => {
    set({ selectedContent: content });
  },
  
  applyFilter: async () => {
    const { currentFilter, contents } = get();
    
    if (Object.keys(currentFilter).length === 0) {
      set({ filteredContents: contents });
      return;
    }
    
    try {
      const filteredContents = await contentService.getByFilter(currentFilter);
      set({ filteredContents });
    } catch (error) {
      console.error('Error applying filter:', error);
      set({ filteredContents: contents });
    }
  }
}));
