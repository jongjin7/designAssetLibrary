import { create } from 'zustand';
import { Asset } from '@nova/types/asset';
import { Folder } from '@nova/types/folder';
import { assetRepository } from '@nova/lib/dataService';

export interface LibraryFilters {
  keyword: string;
  colors: string[];
  tags: string[];
  period: string;
}

interface AssetStore {
  assets: Asset[];
  loading: boolean;
  refreshAssets: () => Promise<void>;
  addAsset: (asset: Partial<Asset>, file?: Blob) => Promise<Asset | undefined>;
  deleteAsset: (id: string) => Promise<void>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  getInboxCount: () => number;
  getFolderCount: (folderId: string, allFolders: Folder[]) => number;
  isMoving: boolean;
  moveAssets: (ids: string[], folderId: string | null) => Promise<void>;

  // Folder State
  folders: Folder[];
  fetchFolders: () => Promise<void>;
  createFolder: (name: string, parentId?: string | null) => Promise<Folder>;
  deleteFolder: (id: string) => Promise<void>;
  
  // UI State
  filter: string;
  setFilter: (f: string | ((prev: string) => string)) => void;
  folderId: string | null;
  setFolderId: (id: string | null | ((prev: string | null) => string | null)) => void;
  searchText: string;
  setSearchText: (text: string | ((prev: string) => string)) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isSearchVisible: boolean;
  setIsSearchVisible: (visible: boolean | ((prev: boolean) => boolean)) => void;

  // Advanced Filters
  activeFilters: LibraryFilters;
  setActiveFilters: (filters: LibraryFilters | ((prev: LibraryFilters) => LibraryFilters)) => void;
  handleFilterReset: () => void;
}

import { mockFolders } from '../data/mockAssets';

export const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [],
  folders: [],
  loading: true,
  isMoving: false,
  filter: 'all',
  folderId: null,
  searchText: '',
  isFilterOpen: false,
  isSearchVisible: false,
  activeFilters: {
    keyword: '',
    colors: [],
    tags: [],
    period: '',
  },
  
  setFilter: (filter) => set((state) => ({ 
    filter: typeof filter === 'function' ? filter(state.filter) : filter 
  })),
  setFolderId: (folderId) => set((state) => ({ 
    folderId: typeof folderId === 'function' ? folderId(state.folderId) : folderId 
  })),
  setSearchText: (searchText) => set((state) => ({ 
    searchText: typeof searchText === 'function' ? searchText(state.searchText) : searchText 
  })),
  setIsFilterOpen: (isFilterOpen) => set((state) => ({ 
    isFilterOpen: typeof isFilterOpen === 'function' ? isFilterOpen(state.isFilterOpen) : isFilterOpen 
  })),
  setIsSearchVisible: (isSearchVisible) => set((state) => ({ 
    isSearchVisible: typeof isSearchVisible === 'function' ? isSearchVisible(state.isSearchVisible) : isSearchVisible 
  })),

  setActiveFilters: (activeFilters) => set((state) => ({ 
    activeFilters: typeof activeFilters === 'function' ? activeFilters(state.activeFilters) : activeFilters 
  })),

  handleFilterReset: () => set({
    searchText: '',
    activeFilters: {
      keyword: '',
      colors: [],
      tags: [],
      period: '',
    }
  }),

  fetchFolders: async () => {
    // Fill folders from mock if not yet loaded
    if (get().folders.length === 0) {
      set({ folders: mockFolders as Folder[] });
    }
  },

  createFolder: async (name, parentId = null) => {
    const newFolder: Folder = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      parentId,
      isSmartFolder: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(state => ({ folders: [...state.folders, newFolder] }));
    return newFolder;
  },

  deleteFolder: async (id) => {
    set(state => ({ folders: state.folders.filter(f => f.id !== id) }));
  },
  
  refreshAssets: async () => {
    try {
      await get().fetchFolders(); // Make sure folders are loaded
      const data = await assetRepository.getAssets();
      set({ assets: data, loading: false });
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      set({ loading: false });
    }
  },

  addAsset: async (asset, file) => {
    try {
      const newAsset = await assetRepository.saveAsset(asset, file);
      await get().refreshAssets();
      return newAsset;
    } catch (error) {
       console.error('Failed to add asset:', error);
       throw error;
    }
  },

  deleteAsset: async (id) => {
    await assetRepository.deleteAsset(id);
    await get().refreshAssets();
  },

  updateAsset: async (id, updates) => {
    await assetRepository.updateAsset(id, updates);
    await get().refreshAssets();
  },

  toggleFavorite: async (id) => {
    await assetRepository.toggleFavorite(id);
    await get().refreshAssets();
  },

  getInboxCount: () => {
    return get().assets.filter(a => !a.folderId).length;
  },

  getFolderCount: (folderId, allFolders) => {
    const assets = get().assets;
    const getChildIds = (id: string): string[] => {
      const children = allFolders.filter(f => f.parentId === id);
      return [id, ...children.flatMap(c => getChildIds(c.id))];
    };
    const targetFolderIds = getChildIds(folderId);
    return assets.filter(a => a.folderId && targetFolderIds.includes(a.folderId)).length;
  },

  moveAssets: async (ids, folderId) => {
    set({ isMoving: true });
    try {
      await Promise.all(ids.map(id => assetRepository.updateAsset(id, { folderId })));
      await get().refreshAssets();
    } catch (error) {
       console.error('Failed to move assets:', error);
    } finally {
      set({ isMoving: false });
    }
  }
}));
