import { create } from 'zustand';
import { Asset } from '@nova/types/asset';
import { Folder } from '@nova/types/folder';
import { assetRepository } from '@nova/lib/dataService';

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
}

export const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [],
  loading: true,
  isMoving: false,
  
  refreshAssets: async () => {
    try {
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
