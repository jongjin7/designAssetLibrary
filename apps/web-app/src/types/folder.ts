export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  isSmartFolder: boolean;
  smartLogic?: any;
  createdAt: string;
  updatedAt: string;
  autoTags?: string[]; // Defined in Sprint 2 spec
}
