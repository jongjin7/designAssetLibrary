/**
 * OPFS (Origin Private File System) Utility with IndexedDB Fallback
 * Provides high-performance local file storage for assets.
 * Falls back to IndexedDB on mobile browsers that don't support FileSystemWritableFileStream.
 */
export class OPFSService {
  private static instance: OPFSService;
  private root: FileSystemDirectoryHandle | null = null;
  private useIDB = false;
  private dbName = 'nova-storage';
  private storeName = 'assets';
  private urlCache = new Map<string, string>();

  private constructor() {
    // Detect if we should use IDB fallback
    if (typeof window !== 'undefined') {
      try {
        this.useIDB = !navigator.storage || !navigator.storage.getDirectory;
      } catch (e) { 
        this.useIDB = true;
      }
    }
  }

  public static getInstance(): OPFSService {
    if (!OPFSService.instance) {
      OPFSService.instance = new OPFSService();
    }
    return OPFSService.instance;
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private dbPromise: Promise<IDBDatabase> | null = null;

  /**
   * Initialize IndexedDB with enhanced error handling and connection caching
   */
  private async getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;
    
    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.dbName, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName);
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          this.dbPromise = null;
          console.error('[Storage] IDB Open Error:', request.error);
          reject(request.error);
        };
        request.onblocked = () => {
          this.dbPromise = null;
          console.warn('[Storage] IDB Blocked (close other tabs)');
          reject(new Error('IDB Blocked'));
        };
      } catch (e) {
        this.dbPromise = null;
        reject(e);
      }
    });

    return this.dbPromise;
  }

  /**
   * Initialize the root directory handle
   */
  private async getRoot(): Promise<FileSystemDirectoryHandle | null> {
    if (this.useIDB) return null;
    if (!this.root && typeof navigator !== 'undefined' && navigator.storage?.getDirectory) {
      try {
        this.root = await navigator.storage.getDirectory();
      } catch (e) {
        console.warn('[Storage] OPFS Access Denied, falling back to IDB:', e);
        this.useIDB = true;
        return null;
      }
    }
    return this.root;
  }

  /**
   * Get a URL for a file with in-memory caching
   */
  public async getFileUrl(path: string): Promise<string> {
    if (!path) return '';

    // If it's already a usable URL, return as is
    if (path.startsWith('blob:') || path.startsWith('data:') || path.startsWith('http')) {
      return path;
    }

    // Check memory cache first
    if (this.urlCache.has(path)) {
      return this.urlCache.get(path)!;
    }

    try {
      const blob = await this.getFile(path);
      const url = URL.createObjectURL(blob);
      this.urlCache.set(path, url);
      return url;
    } catch (e) {
      console.error('[Storage] getFileUrl failed for:', path, e);
      throw e;
    }
  }

  /**
   * Get a file from OPFS or IndexedDB as a Blob (Hybrid Lookup)
   */
  public async getFile(path: string): Promise<Blob> {
    // 1. Try OPFS first if available
    try {
      const root = await this.getRoot();
      if (root) {
        let currentDir = root;
        const parts = path.split('/');
        const fileName = parts.pop()!;
        
        for (const part of parts) {
          currentDir = await currentDir.getDirectoryHandle(part);
        }

        const fileHandle = await currentDir.getFileHandle(fileName);
        const file = await fileHandle.getFile();
        if (file) return file;
      }
    } catch (e) {
      console.debug('[Storage] OPFS lookup failed, trying IDB:', e);
    }

    // 2. Try IndexedDB Fallback
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(path);
      request.onsuccess = async () => {
        let result = request.result;
        if (result) {
          // Restore Blob from fallback types
          if (typeof result === 'string' && result.startsWith('data:')) {
            try {
              const res = await fetch(result);
              result = await res.blob();
            } catch(e) { console.debug('[Storage] Data URL to Blob failed:', e); }
          } else if (result instanceof ArrayBuffer) {
            const ext = path.split('.').pop()?.toLowerCase() ?? '';
            const MIME_MAP: Record<string, string> = {
              png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
              svg: 'image/svg+xml', gif: 'image/gif', webp: 'image/webp',
              avif: 'image/avif', pdf: 'application/pdf',
            };
            result = new Blob([result], { type: MIME_MAP[ext] ?? 'application/octet-stream' });
          }
          resolve(result as Blob);
        } else {
          reject(new Error('NotFound'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a file to IndexedDB (iOS WebKit bug workaround: stores as Base64 Data URL)
   */
  private async saveToIDB(path: string, content: Blob | BufferSource): Promise<void> {
    const db = await this.getDB();

    // Fix iOS WebKit bug: Store as Base64 Data URL instead of Blob/Buffer
    // This universally bypasses all memory pointer/DOMException issues in IDB
    let idbContent: string | BufferSource = content instanceof Blob
      ? await this.blobToBase64(content).catch(e => {
          console.error('[Storage] Base64 conversion failed:', e);
          throw e;
        })
      : content;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(idbContent, path);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a file to OPFS or IndexedDB
   */
  public async saveFile(path: string, content: Blob | BufferSource): Promise<void> {
    // Invalidate cache for this path
    if (this.urlCache.has(path)) {
      URL.revokeObjectURL(this.urlCache.get(path)!);
      this.urlCache.delete(path);
    }

    if (this.useIDB) {
      return this.saveToIDB(path, content);
    }

    try {
      const root = await this.getRoot();

      if (!root) {
        return this.saveToIDB(path, content);
      }

      const parts = path.split('/');
      const fileName = parts.pop()!;

      let currentDir = root;
      for (const part of parts) {
        currentDir = await currentDir.getDirectoryHandle(part, { create: true });
      }

      const fileHandle = await currentDir.getFileHandle(fileName, { create: true });

      if (!fileHandle.createWritable) {
        throw new Error('createWritable unsupported');
      }

      const writable = await fileHandle.createWritable();
      await writable.write(content as any);
      await writable.close();
    } catch (e) {
      console.error('[Storage] CRITICAL: OPFS save failed, falling back to IDB:', e);
      this.useIDB = true;
      return this.saveToIDB(path, content);
    }
  }

  /**
   * Delete a file or directory
   */
  public async remove(path: string): Promise<void> {
    this.urlCache.delete(path);
    const root = await this.getRoot();
    
    if (this.useIDB || !root) {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(path);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    // Try OPFS removal
    try {
      const parts = path.split('/');
      const nameToRemove = parts.pop()!;
      
      let currentDir = root;
      for (const part of parts) {
        currentDir = await currentDir.getDirectoryHandle(part);
      }

      await currentDir.removeEntry(nameToRemove, { recursive: true });
    } catch (e) {
      // Ignore if not in OPFS
    }
  }

  /**
   * Revoke all cached blob URLs to free memory
   */
  public clearCache(): void {
    for (const url of this.urlCache.values()) {
      URL.revokeObjectURL(url);
    }
    this.urlCache.clear();
  }

  /**
   * Check if a file exists
   */
  public async exists(path: string): Promise<boolean> {
    try {
      await this.getFile(path);
      return true;
    } catch {
      return false;
    }
  }
}

export const opfsStorage = OPFSService.getInstance();
