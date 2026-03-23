import { extractColors } from './colorExtractor';
import { Asset } from '../types/asset';

export async function processFileToAsset(
  file: File | Blob, 
  defaultTags: string[] = ['uploaded', 'new']
): Promise<Partial<Asset>> {
  const fullFileName = (file as File).name || `asset-${Date.now()}.webp`;
  const extension = fullFileName.includes('.') ? fullFileName.split('.').pop() || 'webp' : 'webp';
  const fileNameWithoutExt = fullFileName.includes('.') 
    ? fullFileName.split('.').slice(0, -1).join('.') 
    : fullFileName;

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
        console.warn('Color extraction failed for file:', err);
      }

      resolve({
        id: Math.random().toString(36).substr(2, 9),
        fileName: fileNameWithoutExt,
        extension: extension,
        fileSize: fileSize,
        mimeType: file.type,
        thumbnailGradient: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1] || palette[0]} 100%)`,
        thumbnail: dataUrl,
        palette: palette,
        tags: defaultTags,
        createdAt: new Date().toISOString(),
        isFavorite: false,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
