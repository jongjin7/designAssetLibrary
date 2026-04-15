import React from 'react';
import { Edit2, ArrowRightLeft, Trash2 } from 'lucide-react';
import { 
  NVSectionHeader, 
  NVFolderCard,
  NVMoreMenu,
  NVMenuItem,
  NVSeparator
} from '@nova/ui';
import { MoveAssetPopover } from './MoveAssetPopover';
import { cn } from '@nova/lib/utils';

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
                <NVMoreMenu isMobile={isMobile}>
                  <NVMenuItem 
                    icon={Edit2} 
                    label="이름 변경" 
                    onClick={() => onFolderRename(folder.id, folder.name)} 
                  />
                  <MoveAssetPopover 
                    onMove={(targetId) => onFolderMove(folder.id, targetId)}
                    trigger={
                      <NVMenuItem icon={ArrowRightLeft} label="위치 이동" />
                    }
                  />
                  <NVSeparator variant="subtle" className="my-1" />
                  <NVMenuItem 
                    icon={Trash2} 
                    label="폴더 삭제" 
                    variant="danger"
                    onClick={() => onFolderDelete(folder.id)} 
                  />
                </NVMoreMenu>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
