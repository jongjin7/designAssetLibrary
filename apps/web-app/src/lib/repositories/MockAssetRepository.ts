import { Asset } from '../../types/asset';
import { AssetRepository } from './AssetRepository';
import { mockAssets } from '../../data/mockAssets';
import { OPFSService } from '../storage/opfs';

const STORAGE_KEY = 'nova_mock_assets';

// Helper to convert Data URL to Blob
function dataURLToBlob(dataurl: string): Blob | null {
  try {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error('Failed to convert Data URL to Blob:', e);
    return null;
  }
}

export class MockAssetRepository implements AssetRepository {
  private opfs = OPFSService.getInstance();
  private initialized = false;
  private assets: Asset[] = [];
  private initializationPromise: Promise<void> | null = null; // Add initialization promise lock

  private async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      if (this.initialized) return;
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // 저장된 데이터가 실제 Asset 배열인지 가볍게 확인
          if (Array.isArray(parsed)) {
            this.assets = parsed;
          } else {
            this.assets = [...mockAssets];
          }
        } catch (e) {
          console.error('Failed to parse stored assets:', e);
          this.assets = [...mockAssets];
        }
      } else {
        this.assets = [...mockAssets];
      }
      
      this.initialized = true;
      console.log('[Mock/OPFS] Initialized with', this.assets.length, 'assets');
    })();

    return this.initializationPromise;
  }

  async getAssets(): Promise<Asset[]> {
    await this.initialize();
    
    const items = await Promise.all(this.assets.map(async (asset) => {
      if (asset.thumbnail?.startsWith('assets/')) {
        try {
          const url = await this.opfs.getFileUrl(asset.thumbnail);
          return { ...asset, thumbnail: url };
        } catch (e) {
          console.warn(`[Mock/OPFS] Failed to load image from OPFS: ${asset.thumbnail}`, e);
          return asset;
        }
      }
      return asset;
    }));

    return items;
  }

  async getAssetById(id: string): Promise<Asset | null> {
    await this.initialize();
    const asset = this.assets.find(a => a.id === id) || null;
    if (asset?.thumbnail?.startsWith('assets/')) {
      try {
        const url = await this.opfs.getFileUrl(asset.thumbnail);
        return { ...asset, thumbnail: url };
      } catch (e) {
        return asset;
      }
    }
    return asset;
  }

  async saveAsset(asset: Partial<Asset>, file?: Blob): Promise<Asset> {
    await this.initialize();

    const id = asset.id || Math.random().toString(36).substr(2, 9);
    // Ensure we have an extension
    let fileName = asset.fileName || `capture-${id}`;
    if (!fileName.includes('.')) {
      fileName = `${fileName}.${asset.extension || 'webp'}`;
    }
    
    const opfsPath = `assets/${fileName}`;

    try {
      if (file) {
        await this.opfs.saveFile(opfsPath, file);
        console.log(`[Mock/Storage] File saved to ${opfsPath} (Size: ${file.size} bytes)`);
      } else if (asset.thumbnail && asset.thumbnail.startsWith('data:')) {
        const blob = dataURLToBlob(asset.thumbnail);
        if (blob) {
          await this.opfs.saveFile(opfsPath, blob);
          console.log(`[Mock/Storage] File saved from Data URL to ${opfsPath}`);
        }
      }
    } catch (e) {
      console.error(`[Mock/Storage] CRITICAL: Failed to save file to ${opfsPath}:`, e);
    }

    const newAsset: Asset = {
      id,
      fileName: fileName.split('.').slice(0, -1).join('.') || fileName,
      extension: fileName.split('.').pop() || 'webp',
      fileSize: asset.fileSize || '0 KB',
      mimeType: asset.mimeType || 'image/webp',
      thumbnailGradient: asset.thumbnailGradient || 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      thumbnail: opfsPath,
      palette: asset.palette || ['#6366F1', '#8B5CF6'],
      tags: asset.tags || ['captured'],
      createdAt: asset.createdAt || new Date().toISOString().split('T')[0],
      isFavorite: !!asset.isFavorite,
    };
    
    this.assets = [newAsset, ...this.assets];
    this.persist();
    
    // Return with a usable Blob URL if it's an local path
    if (newAsset.thumbnail.startsWith('assets/')) {
      try {
        const url = await this.opfs.getFileUrl(newAsset.thumbnail);
        return { ...newAsset, thumbnail: url };
      } catch (e) {
        console.error(`[Mock/Storage] Failed to generate preview URL for ${newAsset.thumbnail}:`, e);
        return newAsset;
      }
    }
    return newAsset;
  }

  async deleteAsset(id: string): Promise<void> {
    await this.initialize();
    const asset = this.assets.find(a => a.id === id);
    if (asset?.thumbnail?.startsWith('assets/')) {
      await this.opfs.remove(asset.thumbnail).catch(() => {});
    }
    
    this.assets = this.assets.filter(a => a.id !== id);
    this.persist();
  }

  async toggleFavorite(id: string): Promise<void> {
    await this.initialize();
    this.assets = this.assets.map(a => 
      a.id === id ? { ...a, isFavorite: !a.isFavorite } : a
    );
    this.persist();
  }

  async updateAsset(id: string, updates: Partial<Asset>): Promise<void> {
    await this.initialize();
    this.assets = this.assets.map(a => 
      a.id === id ? { ...a, ...updates } : a
    );
    this.persist();
    console.log('[Mock/OPFS] Asset updated:', id, updates);
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.assets));
    } catch (e: any) {
      if (e.name === 'QuotaExceededError') {
        console.error('[Mock/Storage] LocalStorage FULL! Cannot save more asset metadata.');
      } else {
        console.error('[Mock/Storage] Failed to persist assets:', e);
      }
    }
  }
}
