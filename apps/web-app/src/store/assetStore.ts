import { Asset } from '../types/asset';
import { mockAssets } from '../data/mockAssets';

// In-memory singleton for mock purposes
let assets: Asset[] = [...mockAssets];

export const assetStore = {
  getAssets: () => assets,
  addAsset: (asset: Asset) => {
    assets = [asset, ...assets];
  },
  deleteAsset: (id: string) => {
    assets = assets.filter(asset => asset.id !== id);
  },
};
