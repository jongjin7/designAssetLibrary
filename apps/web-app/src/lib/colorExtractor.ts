/**
 * Image color extraction utility
 * Extracts prominent colors from an image using the Canvas API.
 */

export async function extractColors(imageUrl: string, count: number = 5): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Resize for performance
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size).data;
      const colors: Record<string, number> = {};

      // Sample pixels
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        // Ignore highly transparent pixels
        if (a < 128) continue;

        // Simplify colors to reduce count (group similar colors)
        const simplifiedR = Math.round(r / 10) * 10;
        const simplifiedG = Math.round(g / 10) * 10;
        const simplifiedB = Math.round(b / 10) * 10;

        const hex = rgbToHex(simplifiedR, simplifiedG, simplifiedB);
        colors[hex] = (colors[hex] || 0) + 1;
      }

      // Sort by frequency and take top ones
      const sortedColors = Object.entries(colors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([hex]) => hex);

      resolve(sortedColors);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for color extraction'));
    };
  });
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
