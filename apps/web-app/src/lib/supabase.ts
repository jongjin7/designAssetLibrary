import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only initialize if we have the variables and aren't forcing mock mode
const shouldInitialize = supabaseUrl && supabaseAnonKey && process.env.NEXT_PUBLIC_USE_MOCK !== 'true';

if (!shouldInitialize && process.env.NEXT_PUBLIC_USE_MOCK !== 'true') {
  console.warn(
    'Supabase environment variables are missing and mock mode is not explicitly enabled. Please check your .env.local file.'
  );
}

// Export a getter or the client (as any if not initialized to avoid breaking imports)
export const supabase = shouldInitialize 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : ({} as any as SupabaseClient);

export const isSupabaseInitialized = !!shouldInitialize;
