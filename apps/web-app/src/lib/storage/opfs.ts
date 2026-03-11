/**
 * OPFS (Origin Private File System) Utility
 * Provides high-performance local file storage for assets.
 */
export class OPFSService {
  private static instance: OPFSService;
  private root: FileSystemDirectoryHandle | null = null;

  private constructor() {}

  public static getInstance(): OPFSService {
    if (!OPFSService.instance) {
      OPFSService.instance = new OPFSService();
    }
    return OPFSService.instance;
  }

  /**
   * Initialize the root directory handle
   */
  private async getRoot(): Promise<FileSystemDirectoryHandle> {
    if (!this.root) {
      this.root = await navigator.storage.getDirectory();
    }
    return this.root;
  }

  /**
   * Save a file to OPFS
   */
  public async saveFile(path: string, content: Blob | BufferSource): Promise<void> {
    const root = await this.getRoot();
    const parts = path.split('/');
    const fileName = parts.pop()!;
    
    let currentDir = root;
    for (const part of parts) {
      currentDir = await currentDir.getDirectoryHandle(part, { create: true });
    }

    const fileHandle = await currentDir.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content as any);
    await writable.close();
  }

  /**
   * Get a file from OPFS as a Blob
   */
  public async getFile(path: string): Promise<Blob> {
    const root = await this.getRoot();
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
   * Get a URL for a file in OPFS
   */
  public async getFileUrl(path: string): Promise<string> {
    const blob = await this.getFile(path);
    return URL.createObjectURL(blob);
  }

  /**
   * Delete a file or directory from OPFS
   */
  public async remove(path: string): Promise<void> {
    const root = await this.getRoot();
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
