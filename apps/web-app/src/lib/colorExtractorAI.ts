import * as tf from '@tensorflow/tfjs';

/**
 * AI-powered color extraction using K-Means clustering with TensorFlow.js
 * This provides more meaningful color representions than simple frequency analysis.
 */

export async function extractColorsAI(imageUrl: string, count: number = 5): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = async () => {
      try {
        // 1. Process image to Tensor
        const pixels = tf.browser.fromPixels(img);
        const resizedPixels = tf.image.resizeBilinear(pixels, [100, 100]);
        const data = resizedPixels.reshape([-1, 3]).toFloat() as tf.Tensor2D;

        // 2. Perform K-Means clustering
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
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image for AI extraction'));
  });
}

/**
 * Basic K-Means implementation using TensorFlow.js tensors
 */
async function kMeans(data: tf.Tensor2D, k: number, maxIterations: number = 10): Promise<tf.Tensor2D> {
  // Randomly initialize centroids from existing data points
  const numItems = data.shape[0];
  const randomIndices = tf.util.createShuffledIndices(numItems).slice(0, k);
  let centroids = tf.gather(data, Array.from(randomIndices)) as tf.Tensor2D;

  for (let i = 0; i < maxIterations; i++) {
    // 1. Assign points to nearest centroid
    // Calculate squared distance between each point and each centroid
    // (A-B)^2 = A^2 + B^2 - 2AB
    const dataSq = data.square().sum(1).expandDims(1);
    const centroidsSq = centroids.square().sum(1).expandDims(0);
    const twoAB = data.matMul(centroids.transpose());
    const distances = dataSq.add(centroidsSq).sub(twoAB.mul(2));
    
    const assignments = distances.argMin(1);

    // 2. Update centroids to be the mean of assigned points
    const newCentroidsList: tf.Tensor1D[] = [];
    for (let j = 0; j < k; j++) {
      const mask = assignments.equal(j);
      const pointsInCluster = await tf.booleanMaskAsync(data, mask);
      
      if (pointsInCluster.shape[0] > 0) {
        newCentroidsList.push(pointsInCluster.mean(0) as tf.Tensor1D);
      } else {
        // If a cluster is empty, keep current centroid or pick a new random one
        newCentroidsList.push(centroids.slice([j, 0], [1, 3]).flatten());
      }
      mask.dispose();
      pointsInCluster.dispose();
    }

    const nextCentroids = tf.stack(newCentroidsList) as tf.Tensor2D;
    
    // Check for convergence (simple check)
    const diff = centroids.sub(nextCentroids).abs().sum();
    const diffVal = (await diff.data())[0];
    
    centroids.dispose();
    dataSq.dispose();
    centroidsSq.dispose();
    twoAB.dispose();
    distances.dispose();
    assignments.dispose();
    diff.dispose();

    centroids = nextCentroids;

    if (diffVal < 1) break;
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
