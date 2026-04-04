import { isSupportedFile, filterSupportedFiles, chunkArray, SUPPORTED_EXTENSIONS } from '../fileValidation';

describe('fileValidation utility', () => {
  describe('isSupportedFile', () => {
    it('should return true for all supported extensions', () => {
      SUPPORTED_EXTENSIONS.forEach(ext => {
        expect(isSupportedFile(`test.${ext}`)).toBe(true);
        expect(isSupportedFile(`TEST.${ext.toUpperCase()}`)).toBe(true);
      });
    });

    it('should return false for unsupported extensions', () => {
      const unsupported = ['txt', 'exe', 'zip', 'mp4', 'docx'];
      unsupported.forEach(ext => {
        expect(isSupportedFile(`test.${ext}`)).toBe(false);
      });
    });

    it('should handle files without extensions', () => {
      expect(isSupportedFile('README')).toBe(false);
      expect(isSupportedFile('archive.')).toBe(false);
    });

    it('should handle files with multiple dots', () => {
      expect(isSupportedFile('my.cool.image.png')).toBe(true);
      expect(isSupportedFile('my.cool.text.txt')).toBe(false);
    });
  });

  describe('filterSupportedFiles', () => {
    it('should correctly filter a mix of files', () => {
      const mockFiles = [
        { name: 'logo.svg' },
        { name: 'document.pdf' },
        { name: 'script.js' },
        { name: 'photo.jpg' },
        { name: 'notes.txt' }
      ] as File[];

      const { validFiles, unsupportedCount } = filterSupportedFiles(mockFiles);

      expect(validFiles).toHaveLength(3);
      expect(validFiles.map(f => f.name)).toContain('logo.svg');
      expect(validFiles.map(f => f.name)).toContain('document.pdf');
      expect(validFiles.map(f => f.name)).toContain('photo.jpg');
      expect(unsupportedCount).toBe(2);
    });
  });

  describe('chunkArray', () => {
    it('should split array into equal sized chunks', () => {
      const input = [1, 2, 3, 4, 5, 6];
      const result = chunkArray(input, 2);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual([1, 2]);
      expect(result[2]).toEqual([5, 6]);
    });

    it('should handle trailing partial chunk', () => {
      const input = [1, 2, 3, 4, 5];
      const result = chunkArray(input, 2);
      expect(result).toHaveLength(3);
      expect(result[2]).toEqual([5]);
    });

    it('should return empty array for empty input', () => {
      expect(chunkArray([], 5)).toEqual([]);
    });
  });
});
