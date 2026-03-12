import { useState, useEffect } from 'react';
import { Folder } from '../types/folder';
import { mockFolders } from '../data/mockAssets';

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setFolders(mockFolders as Folder[]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const createFolder = async (name: string, parentId: string | null = null) => {
    const newFolder: Folder = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      parentId,
      isSmartFolder: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const deleteFolder = async (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
  };

  return {
    folders,
    loading,
    createFolder,
    deleteFolder,
  };
}
