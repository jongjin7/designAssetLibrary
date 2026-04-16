import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Asset } from '../../types/asset';
import { Folder } from '../../types/folder';

// ── Schema ───────────────────────────────────────────────────────────────────

interface NovaDBSchema extends DBSchema {
  assets: {
    key: string;
    value: Asset;
  };
  folders: {
    key: string;
    value: Folder;
  };
}

// ── DB init ──────────────────────────────────────────────────────────────────

const DB_NAME = 'nova_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<NovaDBSchema>> | null = null;

function getDB(): Promise<IDBPDatabase<NovaDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<NovaDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('assets')) {
          db.createObjectStore('assets', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('folders')) {
          db.createObjectStore('folders', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// ── Type guards (migration 전용) ──────────────────────────────────────────────

function isAsset(value: unknown): value is Asset {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v['id'] === 'string' &&
    typeof v['fileName'] === 'string' &&
    typeof v['extension'] === 'string'
  );
}

function isFolder(value: unknown): value is Folder {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v['id'] === 'string' &&
    typeof v['name'] === 'string' &&
    (v['parentId'] === null || typeof v['parentId'] === 'string')
  );
}

// ── Assets ───────────────────────────────────────────────────────────────────

export async function idbGetAllAssets(): Promise<Asset[]> {
  const db = await getDB();
  return db.getAll('assets');
}

export async function idbPutAsset(asset: Asset): Promise<void> {
  const db = await getDB();
  await db.put('assets', asset);
}

export async function idbPutAllAssets(assets: Asset[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('assets', 'readwrite');
  await Promise.all([...assets.map(a => tx.store.put(a)), tx.done]);
}

export async function idbDeleteAsset(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('assets', id);
}

export async function idbClearAssets(): Promise<void> {
  const db = await getDB();
  await db.clear('assets');
}

// ── Folders ──────────────────────────────────────────────────────────────────

export async function idbGetAllFolders(): Promise<Folder[]> {
  const db = await getDB();
  return db.getAll('folders');
}

export async function idbPutFolder(folder: Folder): Promise<void> {
  const db = await getDB();
  await db.put('folders', folder);
}

export async function idbDeleteFolder(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('folders', id);
}

export async function idbClearFolders(): Promise<void> {
  const db = await getDB();
  await db.clear('folders');
}

// ── Migration: localStorage → IndexedDB ──────────────────────────────────────

const MIGRATED_KEY = 'nova_idb_migrated';

export async function migrateFromLocalStorage(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(MIGRATED_KEY)) return;

  // Migrate assets
  const rawAssets = localStorage.getItem('nova_mock_assets');
  if (rawAssets) {
    try {
      const parsed: unknown = JSON.parse(rawAssets);
      if (Array.isArray(parsed)) {
        const validAssets = parsed.filter(isAsset);
        if (validAssets.length > 0) {
          await idbPutAllAssets(validAssets);
          console.log(`[NovaDB] Migrated ${validAssets.length} assets from localStorage`);
        }
      }
    } catch (e) {
      console.error('[NovaDB] Asset migration failed:', e);
    }
  }

  // Migrate folders
  const rawFolders = localStorage.getItem('nova_folders');
  if (rawFolders) {
    try {
      const parsed: unknown = JSON.parse(rawFolders);
      if (Array.isArray(parsed)) {
        const validFolders = parsed.filter(isFolder);
        if (validFolders.length > 0) {
          const db = await getDB();
          const tx = db.transaction('folders', 'readwrite');
          await Promise.all([...validFolders.map(f => tx.store.put(f)), tx.done]);
          console.log(`[NovaDB] Migrated ${validFolders.length} folders from localStorage`);
        }
      }
    } catch (e) {
      console.error('[NovaDB] Folder migration failed:', e);
    }
  }

  // Mark migration done and clean up old keys
  localStorage.setItem(MIGRATED_KEY, '1');
  localStorage.removeItem('nova_mock_assets');
  localStorage.removeItem('nova_folders');
  console.log('[NovaDB] Migration complete, localStorage keys removed');
}
