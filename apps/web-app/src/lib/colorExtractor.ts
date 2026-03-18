/**
 * Image color extraction utility
 * Extracts prominent colors from an image using the Canvas API.
 */

export async function extractColors(imageUrl: string, count: number = 5): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    // Fallback timer to prevent hanging
    const timeout = setTimeout(() => {
      resolve(['#6366F1', '#06B6D4', '#F8FAFC']); // Project defaults
    }, 3000);

    img.onload = () => {
      clearTimeout(timeout);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve(['#6366F1', '#06B6D4', '#F8FAFC']);
        return;
      }

      // Small sample size for performance
      const size = 64;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      try {
        const imageData = ctx.getImageData(0, 0, size, size).data;
        const colorCounts: Record<string, number> = {};

        // Sample pixels with higher density but skipping some for speed
        for (let i = 0; i < imageData.length; i += 16) { // every 4th pixel
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          // Skip transparent or too dark/light pixels
          if (a < 128) continue;
          
          // Slight grouping to avoid noise but keep fidelity
          // Group by 4 instead of 10 for more accurate capture
          const gr = Math.floor(r / 4) * 4;
          const gg = Math.floor(g / 4) * 4;
          const gb = Math.floor(b / 4) * 4;

          const hex = `#${gr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${gb.toString(16).padStart(2, '0')}`.toUpperCase();
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        // Sort by frequency
        let sorted = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([hex]) => hex);

        // Filter out redundant near-white/near-black if we have other options
        if (sorted.length > count) {
          const filtered = sorted.filter(c => c !== '#000000' && c !== '#FFFFFF' && c !== '#FBFBFB' && c !== '#040404');
          if (filtered.length >= count) sorted = filtered;
        }

        const result = sorted.slice(0, count);
        
        if (result.length === 0) {
          resolve(['#6366F1', '#06B6D4', '#F8FAFC']);
        } else {
          resolve(result);
        }
      } catch (e) {
        console.error('Color extraction processing error:', e);
        resolve(['#6366F1', '#06B6D4', '#F8FAFC']);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(['#6366F1', '#06B6D4', '#F8FAFC']);
    };

    img.src = imageUrl;
  });
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
