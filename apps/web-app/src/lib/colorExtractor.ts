import * as tf from '@tensorflow/tfjs';

/**
 * AI-powered color extraction using K-Means clustering with TensorFlow.js
 * Optimized for performance: GPU-vectorized math, reduced resolution, and fewer iterations.
 */
export async function extractColors(imageUrl: string, count: number = 5): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = async () => {
      try {
        // 1. Process image to Tensor - Optimized resolution 40x40
        const pixels = tf.browser.fromPixels(img);
        const resizedPixels = tf.image.resizeBilinear(pixels, [40, 40]);
        const data = resizedPixels.reshape([-1, 3]).toFloat() as tf.Tensor2D;

        // 2. Perform K-Means clustering (Optimized for speed)
        const centroids = await kMeans(data, count);
        
        // 3. Convert results back to Hex colors
        const colors = await getHexFromCentroids(centroids);

        // Cleanup
        pixels.dispose();
        resizedPixels.dispose();
        data.dispose();
        centroids.dispose();

        resolve(colors);
      } catch (err) {
        console.error('TensorFlow color extraction failed:', err);
        // Fallback to defaults on error
        resolve(['#6366F1', '#06B6D4', '#F8FAFC']);
      }
    };

    img.onerror = () => resolve(['#6366F1', '#06B6D4', '#F8FAFC']);
  });
}

/**
 * Optimized K-Means implementation using TensorFlow.js tensors
 * Performance improvements:
 * - Replaced booleanMaskAsync with pure tensor math (mean calculation via oneHot)
 * - Added tf.tidy to minimize memory overhead
 * - Reduced max iterations for faster convergence
 */
async function kMeans(data: tf.Tensor2D, k: number, maxIterations: number = 5): Promise<tf.Tensor2D> {
  const numItems = data.shape[0];
  const randomIndices = tf.util.createShuffledIndices(numItems).slice(0, k);
  let centroids = tf.gather(data, Array.from(randomIndices)) as tf.Tensor2D;

  for (let i = 0; i < maxIterations; i++) {
    const nextCentroids = tf.tidy(() => {
      // 1. Assign points to nearest centroid using vectorized distance calculation
      const dataSq = data.square().sum(1).expandDims(1);
      const centroidsSq = centroids.square().sum(1).expandDims(0);
      const twoAB = data.matMul(centroids.transpose());
      const distances = dataSq.add(centroidsSq).sub(twoAB.mul(2));
      
      const assignments = distances.argMin(1);
      
      // 2. Efficiently update centroids without moving data out of GPU
      const oneHotAssignments = tf.oneHot(assignments, k).toFloat();
      const clusterSums = oneHotAssignments.transpose().matMul(data);
      const clusterCounts = oneHotAssignments.sum(0).expandDims(1).add(1e-5); 
      
      return clusterSums.div(clusterCounts) as tf.Tensor2D;
    });

    const diff = tf.tidy(() => centroids.sub(nextCentroids).abs().sum().dataSync()[0]);
    
    centroids.dispose();
    centroids = nextCentroids;

    if (diff < 1) break;
  }

  return centroids;
}

async function getHexFromCentroids(centroids: tf.Tensor2D): Promise<string[]> {
  const data = await centroids.data();
  const colors: string[] = [];
  
  for (let i = 0; i < data.length; i += 3) {
    const r = Math.round(Math.max(0, Math.min(255, data[i])));
    const g = Math.round(Math.max(0, Math.min(255, data[i+1])));
    const b = Math.round(Math.max(0, Math.min(255, data[i+2])));
    
    colors.push(rgbToHex(r, g, b));
  }
  
  return colors;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
