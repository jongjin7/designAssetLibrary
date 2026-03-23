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

  private constructor() {
    // Detect if we should use IDB fallback
    if (typeof window !== 'undefined') {
      this.useIDB = !navigator.storage || !navigator.storage.getDirectory;
    }
  }

  public static getInstance(): OPFSService {
    if (!OPFSService.instance) {
      OPFSService.instance = new OPFSService();
    }
    return OPFSService.instance;
  }

  /**
   * Initialize IndexedDB
   */
  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Initialize the root directory handle
   */
  private async getRoot(): Promise<FileSystemDirectoryHandle | null> {
    if (this.useIDB) return null;
    if (!this.root) {
      try {
        this.root = await navigator.storage.getDirectory();
      } catch (e) {
        console.warn('[Storage] OPFS not supported, falling back to IndexedDB');
        this.useIDB = true;
        return null;
      }
    }
    return this.root;
  }

  /**
   * Save a file to OPFS or IndexedDB
   */
  public async saveFile(path: string, content: Blob | BufferSource): Promise<void> {
    const root = await this.getRoot();
    
    if (this.useIDB || !root) {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(content, path);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    try {
      const parts = path.split('/');
      const fileName = parts.pop()!;
      
      let currentDir = root;
      for (const part of parts) {
        currentDir = await currentDir.getDirectoryHandle(part, { create: true });
      }

      const fileHandle = await currentDir.getFileHandle(fileName, { create: true });
      
      // On some mobile browsers, createWritable is missing even if getDirectory exists
      if (!fileHandle.createWritable) {
        throw new Error('createWritable not supported');
      }

      const writable = await fileHandle.createWritable();
      await writable.write(content as any);
      await writable.close();
    } catch (e) {
      console.warn('[Storage] OPFS Write failed, switching to IndexedDB for this session:', e);
      this.useIDB = true;
      return this.saveFile(path, content);
    }
  }

  /**
   * Get a file from OPFS or IndexedDB as a Blob
   */
  public async getFile(path: string): Promise<Blob> {
    const root = await this.getRoot();
    
    if (this.useIDB || !root) {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(path);
        request.onsuccess = () => {
          if (request.result) resolve(request.result);
          else reject(new Error('File not found in IDB: ' + path));
        };
        request.onerror = () => reject(request.error);
      });
    }

    const parts = path.split('/');
    const fileName = parts.pop()!;
    
    let currentDir = root;
    for (const part of parts) {
      currentDir = await currentDir.getDirectoryHandle(part);
    }

    const fileHandle = await currentDir.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return file;
  }

  /**
   * Get a URL for a file
   */
  public async getFileUrl(path: string): Promise<string> {
    try {
      const blob = await this.getFile(path);
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error('[Storage] getFileUrl failed for:', path, e);
      throw e;
    }
  }

  /**
   * Delete a file or directory
   */
  public async remove(path: string): Promise<void> {
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

    const parts = path.split('/');
    const nameToRemove = parts.pop()!;
    
    let currentDir = root;
    for (const part of parts) {
      currentDir = await currentDir.getDirectoryHandle(part);
    }

    await currentDir.removeEntry(nameToRemove, { recursive: true });
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
