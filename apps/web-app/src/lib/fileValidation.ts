/**
 * Supported file extensions for NOVA
 */
export const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'otf', 'ttf'];

/**
 * Validates if a file type is supported by NOVA
 * @param fileName - Name of the file with extension
 * @returns boolean
 */
export function isSupportedFile(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return !!ext && SUPPORTED_EXTENSIONS.includes(ext);
}

/**
 * Filters an array of files, returning only supported ones
 * @param files - Array of File objects
 * @returns { validFiles: File[], unsupportedCount: number }
 */
export function filterSupportedFiles(files: File[]): { validFiles: File[], unsupportedCount: number } {
  const validFiles = files.filter(file => isSupportedFile(file.name));
  return {
    validFiles,
    unsupportedCount: files.length - validFiles.length
  };
}

/**
 * Splits an array into batches
 * @param array - Array to split
 * @param size - Batch size
 * @returns Array of batches
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
