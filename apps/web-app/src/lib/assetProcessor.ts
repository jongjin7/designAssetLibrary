import { extractColors } from './colorExtractor';
import { Asset } from '../types/asset';

export async function processFileToAsset(file: File): Promise<Partial<Asset>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Failed to read file'));
        return;
      }

      // Format size
      const sizeBytes = file.size;
      let fileSize = '0 KB';
      if (sizeBytes >= 1024 * 1024) {
        fileSize = (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB';
      } else {
        fileSize = (sizeBytes / 1024).toFixed(0) + ' KB';
      }

      // Extract colors
      let palette = ['#6366F1', '#06B6D4', '#F8FAFC'];
      try {
        palette = await extractColors(dataUrl);
      } catch (err) {
        console.warn('Color extraction failed for dropped file:', err);
      }

      resolve({
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        fileSize: fileSize,
        mimeType: file.type,
        thumbnailGradient: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
        thumbnail: dataUrl,
        palette: palette,
        tags: ['uploaded', 'new'],
        createdAt: new Date().toISOString(),
        isFavorite: false,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
