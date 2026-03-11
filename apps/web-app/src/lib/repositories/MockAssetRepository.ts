import { Asset } from '../../types/asset';
import { AssetRepository } from './AssetRepository';
import { mockAssets } from '../../data/mockAssets';

// 메모리 내 데이터 유지를 위해 클래스 외부 또는 static으로 관리
let sharedAssets: Asset[] = [...mockAssets];

export class MockAssetRepository implements AssetRepository {
  async getAssets(): Promise<Asset[]> {
    // 네트워크 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...sharedAssets];
  }

  async getAssetById(id: string): Promise<Asset | null> {
    return sharedAssets.find(a => a.id === id) || null;
  }

  async saveAsset(asset: Partial<Asset>, file?: Blob): Promise<Asset> {
    const newAsset: Asset = {
      id: asset.id || Math.random().toString(36).substr(2, 9),
      fileName: asset.fileName || 'unnamed.webp',
      fileSize: asset.fileSize || '0 KB',
      mimeType: asset.mimeType || 'image/webp',
      thumbnailGradient: asset.thumbnailGradient || 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      thumbnail: asset.thumbnail, // thumbnail 필드 추가!
      palette: asset.palette || ['#6366F1', '#8B5CF6'],
      tags: asset.tags || ['captured'],
      createdAt: new Date().toISOString().split('T')[0],
      isFavorite: !!asset.isFavorite,
    };
    
    sharedAssets = [newAsset, ...sharedAssets];
    console.log('[Mock] Asset saved:', newAsset.id);
    return newAsset;
  }

  async deleteAsset(id: string): Promise<void> {
    sharedAssets = sharedAssets.filter(a => a.id !== id);
  }

  async toggleFavorite(id: string): Promise<void> {
    sharedAssets = sharedAssets.map(a => 
      a.id === id ? { ...a, isFavorite: !a.isFavorite } : a
    );
  }
}
