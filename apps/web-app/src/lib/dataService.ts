import { AssetRepository } from './repositories/AssetRepository';
import { MockAssetRepository } from './repositories/MockAssetRepository';

// Flag to switch between Mock and Supabase
// Mock mode is enabled when NEXT_PUBLIC_USE_MOCK=true OR when Supabase URL is not set
const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === 'true' ||
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createRepository(): AssetRepository {
  if (USE_MOCK) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[NOVA] Data Layer: Mock 모드로 실행 중');
    }
    return new MockAssetRepository();
  }

  // Supabase는 실제로 필요할 때만 require (SSR import-time crash 방지)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[NOVA] Data Layer: Supabase 모드로 실행 중');
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SupabaseAssetRepository } = require('./repositories/SupabaseAssetRepository');
  return new SupabaseAssetRepository();
}

export const assetRepository: AssetRepository = createRepository();
