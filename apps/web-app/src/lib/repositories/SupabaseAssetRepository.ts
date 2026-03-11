import { supabase } from '../supabase';
import { Asset } from '../../types/asset';
import { AssetRepository, mapToAsset } from './AssetRepository';
import { opfsStorage } from '../storage/opfs';

export class SupabaseAssetRepository implements AssetRepository {
  async getAssets(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*, tags(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Note: In a real app, we'd handle the tag joining more carefully
    return (data || []).map(item => mapToAsset({
      ...item,
      tags: item.tags?.map((t: any) => t.name) || []
    }));
  }

  async getAssetById(id: string): Promise<Asset | null> {
    const { data, error } = await supabase
      .from('assets')
      .select('*, tags(*)')
      .eq('id', id)
      .single();

    if (error) return null;
    return mapToAsset({
      ...data,
      tags: data.tags?.map((t: any) => t.name) || []
    });
  }

  async saveAsset(asset: Partial<Asset>, file?: Blob): Promise<Asset> {
    // 1. If file provided, upload to Supabase Storage
    let filePath = '';
    if (file) {
      const fileName = `${Date.now()}-${asset.fileName}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('assets')
        .upload(fileName, file);
      
      if (storageError) throw storageError;
      filePath = storageData.path;

      // Also cache in OPFS for local-first speed
      await opfsStorage.saveFile(`cache/${fileName}`, file);
    }

    // 2. Save metadata to Database
    const { data, error } = await supabase
      .from('assets')
      .insert({
        file_name: asset.fileName,
        file_path: filePath,
        file_size_bytes: file?.size || 0,
        mime_type: asset.mimeType,
        palette: asset.palette,
        is_favorite: asset.isFavorite,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return mapToAsset(data);
  }

  async deleteAsset(id: string): Promise<void> {
    const { error } = await supabase.from('assets').delete().eq('id', id);
    if (error) throw error;
  }

  async toggleFavorite(id: string): Promise<void> {
    // Fetch current state
    const { data } = await supabase.from('assets').select('is_favorite').eq('id', id).single();
    if (data) {
      await supabase.from('assets').update({ is_favorite: !data.is_favorite }).eq('id', id);
    }
  }

  async updateAsset(id: string, updates: Partial<Asset>): Promise<void> {
    const dbUpdates: any = {};
    if (updates.fileName) dbUpdates.file_name = updates.fileName;
    if (updates.palette) dbUpdates.palette = updates.palette;
    if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;
    if (updates.tags) {
      // Tags update logic is complex in SQL, skipping for now or simplify
    }

    const { error } = await supabase.from('assets').update(dbUpdates).eq('id', id);
    if (error) throw error;
  }
}
