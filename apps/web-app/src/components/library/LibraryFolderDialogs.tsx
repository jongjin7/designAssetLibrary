import React from 'react';
import {
  NVDialog,
  NVDialogContent,
  NVDialogHeader,
  NVDialogTitle,
  NVDialogDescription,
  NVDialogFooter,
  NVButton,
} from '@nova/ui';
import { cn } from '@nova/lib/utils';

interface LibraryFolderDialogsProps {
  // Delete
  pendingDeleteFolderId: string | null;
  onPendingDeleteFolderIdChange: (id: string | null) => void;
  onConfirmDelete: (id: string) => void;
  
  isMobile?: boolean;
}

export const LibraryFolderDialogs: React.FC<LibraryFolderDialogsProps> = ({
  pendingDeleteFolderId,
  onPendingDeleteFolderIdChange,
  onConfirmDelete,
  isMobile = false
}) => {  const commonContentClass = cn(isMobile && "w-[calc(100%-40px)] rounded-2xl max-w-sm");

  return (
    <>
      {/* Folder Delete Dialog */}
      <NVDialog open={pendingDeleteFolderId !== null} onOpenChange={(open) => { if (!open) onPendingDeleteFolderIdChange(null); }}>
        <NVDialogContent className={isMobile ? commonContentClass : "max-w-md"}>
          <NVDialogHeader className={cn(isMobile && "px-5 pt-6 pb-2")}>
            <NVDialogTitle className={cn(isMobile && "text-lg")}>폴더 삭제</NVDialogTitle>
            <NVDialogDescription className={cn(isMobile && "text-xs")}>
              정말 이 폴더를 삭제하시겠습니까? 내부의 에셋은 삭제되지 않고 '인박스(Inbox)'로 이동됩니다.
            </NVDialogDescription>
          </NVDialogHeader>
          <NVDialogFooter className={cn(isMobile && "flex-row gap-2 px-5 py-6")}>
            <NVButton variant="ghost" className={cn(isMobile && "flex-1 h-11 rounded-xl")} onClick={() => onPendingDeleteFolderIdChange(null)}>
              취소
            </NVButton>
            <NVButton variant="primary" className={cn("bg-rose-500 hover:bg-rose-600 border-none", isMobile && "flex-1 h-11 rounded-xl")} onClick={() => {
              if (pendingDeleteFolderId) onConfirmDelete(pendingDeleteFolderId);
            }}>
              삭제
            </NVButton>
          </NVDialogFooter>
        </NVDialogContent>
      </NVDialog>

    </>
  );
};
