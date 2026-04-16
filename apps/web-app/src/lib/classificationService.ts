import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

let model: mobilenet.MobileNet | null = null;

/**
 * Pre-warm the model to speed up first analysis
 */
export async function warmUpModel() {
  if (model) return;
  try {
    console.log('[AI] Pre-warming MobileNet model...');
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
    console.log('[AI] MobileNet model is ready.');
  } catch (err) {
    console.error('[AI] Model warm-up failed:', err);
  }
}

/**
 * Helper to wrap promises with timeout
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn(`[AI] Operation timed out after ${timeoutMs}ms`);
      resolve(fallback);
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

/**
 * Classify an image using the MobileNet model (On-device AI).
 */
export async function classifyImage(imageUrl: string): Promise<string[]> {
  try {
    if (!model) {
      await warmUpModel();
    }
    if (!model) return [];

    // Create a temporary image element to load the source
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Set to handle unique tags
    const tagSet = new Set<string>();

    const predictions = await model.classify(img);
    
    // Sort by probability and take top candidates
    const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);

    sortedPredictions.forEach((p, index) => {
      // 1. Threshold logic: Top 3 items with at least 0.05 prob, OR any item > 0.10
      if ((index < 3 && p.probability > 0.05) || p.probability > 0.10) {
        const primaryName = p.className.split(',')[0];
        const normalized = primaryName.toLowerCase().replace(/\s+/g, '-').trim();
        if (normalized) tagSet.add(normalized);
      }
    });

    const tags = Array.from(tagSet);
    console.log('[AI] Objects detected:', tags);
    return tags;
  } catch (error) {
    console.error('[AI] Classification failed:', error);
    return [];
  }
}

/**
 * Analyze the atmosphere/mood of an image based on color properties.
 */
export async function analyzeMood(palette: string[]): Promise<string[]> {
  if (!palette || palette.length === 0) return [];

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbs = palette.map(hexToRgb);
  
  // Calculate average brightness and temperature
  let totalBrightness = 0;
  let totalTemp = 0; 
  let totalSatur = 0;
  
  rgbs.forEach(rgb => {
    // Standard Luminance calculation
    totalBrightness += (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    // Temperature: R-B bias
    totalTemp += (rgb.r - rgb.b);
    // Rough Saturation: Max(R,G,B) - Min(R,G,B)
    totalSatur += (Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b));
  });

  const avgBrightness = totalBrightness / rgbs.length;
  const avgTemp = totalTemp / rgbs.length;
  const avgSatur = totalSatur / rgbs.length;

  const moodTags: string[] = [];

  // 1. Brightness Moods
  if (avgBrightness > 160) moodTags.push('bright', 'airy');
  else if (avgBrightness < 80) moodTags.push('moody', 'dark');

  // 2. Temperature Moods
  if (avgTemp > 20) moodTags.push('warm', 'cozy');
  else if (avgTemp < -20) moodTags.push('cool', 'modern');

  // 3. Saturation Moods
  if (avgSatur > 100) moodTags.push('vibrant', 'energetic');
  else if (avgSatur < 30) moodTags.push('minimal', 'neutral');

  // 4. Color Palette Complexity
  if (palette.length <= 3) moodTags.push('clean');

  console.log('[AI] Mood analysis results:', moodTags);
  return moodTags;
}
