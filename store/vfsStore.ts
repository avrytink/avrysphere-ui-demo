import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FileType = 'file' | 'folder' | 'drive' | 'cloud' | 's3' | 'dropbox' | 'mega';

export interface VFSItem {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  size?: number;
  modified: number;
  content?: string;
  icon?: string;
  color?: string;
  provider?: 'local' | 's3' | 'dropbox' | 'mega';
}

interface VFSState {
  items: VFSItem[];
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
  addItem: (item: Omit<VFSItem, 'id' | 'modified'>) => string;
  removeItem: (id: string) => void;
  renameItem: (id: string, newName: string) => void;
  getItemPath: (id: string) => VFSItem[];
  getChildren: (parentId: string | null) => VFSItem[];
}

const INITIAL_ITEMS: VFSItem[] = [
  { id: 'root-home', name: 'Home', type: 'drive', parentId: null, modified: Date.now() },
  { id: 'root-desktop', name: 'Desktop', type: 'folder', parentId: 'root-home', modified: Date.now() },
  { id: 'root-docs', name: 'Documents', type: 'folder', parentId: 'root-home', modified: Date.now() },
  { id: 'root-pics', name: 'Pictures', type: 'folder', parentId: 'root-home', modified: Date.now() },
  { id: 'root-downloads', name: 'Downloads', type: 'folder', parentId: 'root-home', modified: Date.now() },
  { id: 'readme-txt', name: 'Welcome.txt', type: 'file', parentId: 'root-home', modified: Date.now(), content: 'Welcome to avryOS Files 2.0' },
  
  // Cloud Nodes
  { id: 'cloud-root', name: 'Cloud Storage', type: 'cloud', parentId: null, modified: Date.now() },
  { id: 's3-instance', name: 'Amazon S3', type: 's3', parentId: 'cloud-root', modified: Date.now(), provider: 's3' },
  { id: 'dbx-instance', name: 'Dropbox', type: 'dropbox', parentId: 'cloud-root', modified: Date.now(), provider: 'dropbox' },
];

export const useVFSStore = create<VFSState>()(
  persist(
    (set, get) => ({
      items: INITIAL_ITEMS,
      currentFolderId: 'root-home',

      setCurrentFolderId: (id) => set({ currentFolderId: id }),

      addItem: (item) => {
        const id = Math.random().toString(36).substring(7);
        const newItem: VFSItem = {
          ...item,
          id,
          modified: Date.now(),
        };
        set((state) => ({ items: [...state.items, newItem] }));
        return id;
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id && item.parentId !== id),
        }));
      },

      renameItem: (id, newName) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, name: newName, modified: Date.now() } : item
          ),
        }));
      },

      getItemPath: (id) => {
        const path: VFSItem[] = [];
        let current = get().items.find((i) => i.id === id);
        while (current) {
          path.unshift(current);
          current = get().items.find((i) => i.id === current?.parentId);
        }
        return path;
      },

      getChildren: (parentId) => {
        return get().items.filter((item) => item.parentId === parentId);
      },
    }),
    { name: 'avry-vfs-storage' }
  )
);