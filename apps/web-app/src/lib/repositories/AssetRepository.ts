import { Asset } from '../../types/asset';

export interface AssetRepository {
  getAssets(): Promise<Asset[]>;
  getAssetById(id: string): Promise<Asset | null>;
  saveAsset(asset: Partial<Asset>, file?: Blob): Promise<Asset>;
  deleteAsset(id: string): Promise<void>;
  toggleFavorite(id: string): Promise<void>;
}

/**
 * Common mapper to convert DB/Internal models to UI Asset model
 */
export const mapToAsset = (data: any): Asset => {
  return {
    id: data.id,
    fileName: data.file_name || data.fileName,
    fileSize: data.file_size || data.fileSize || '0 KB',
    mimeType: data.mime_type || data.mimeType || 'image/webp',
    thumbnailGradient: data.thumbnailGradient || 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    thumbnail: data.thumbnail_url || data.thumbnail,
    palette: data.palette || [],
    tags: data.tags || [],
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
    isFavorite: !!data.is_favorite || !!data.isFavorite,
  };
};
