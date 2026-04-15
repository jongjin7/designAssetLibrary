import React from 'react';
import { 
  NVSectionHeader, 
  NVFolderCard,
  NVFolderPopover,
} from '@nova/ui';
import { cn } from '@nova/lib/utils';
import { useFolders } from '@nova/hooks';

interface LibraryFolderSectionProps {
  title: string;
  folders: any[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onFolderClick: (id: string) => void;
  onFolderRename: (id: string, name: string) => void;
  onFolderMove: (id: string, targetId: string | null) => void;
  onFolderDelete: (id: string) => void;
  isMobile?: boolean;
}

export const LibraryFolderSection: React.FC<LibraryFolderSectionProps> = ({
  title,
  folders,
  isExpanded,
  onToggleExpand,
  onFolderClick,
  onFolderRename,
  onFolderMove,
  onFolderDelete,
  isMobile = false
}) => {
  const { folders: allFolders } = useFolders();

  if (folders.length === 0) return null;

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-500">
      <NVSectionHeader 
        title={title} 
        count={folders.length} 
        className="mb-6 !p-0"
        hasDropdown={true}
        isExpanded={isExpanded}
        onDropdownClick={onToggleExpand}
      />
      
      {isExpanded && (
        <div className={cn(
          "grid gap-4 animate-in fade-in slide-in-from-top-2 duration-300",
          isMobile ? "grid-cols-2 gap-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12"
        )}>
          {folders.map(folder => (
            <NVFolderCard 
              key={folder.id}
              id={folder.id}
              name={folder.name}
              assetCount={folder.aggregatedAssetCount || 0}
              assetThumbnails={folder.aggregatedThumbnails || []}
              hasSubfolders={folder.hasSubfolders}
              isMobile={isMobile}
              onClick={(id) => onFolderClick(id)}
              moreMenu={
                <NVFolderPopover 
                  folder={folder}
                  allFolders={allFolders}
                  isSimpleMode={true}
                  onRename={(f, newName) => onFolderRename(f.id, newName)}
                  onMove={(f, targetId) => onFolderMove(f.id, targetId)}
                  onDelete={(f) => onFolderDelete(f.id)}
                  triggerClassName="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
