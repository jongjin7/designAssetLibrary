import React from 'react';
import {
  NVDialog,
  NVDialogContent,
  NVDialogHeader,
  NVDialogTitle,
  NVDialogDescription,
  NVDialogFooter,
  NVDialogBody,
  NVButton,
} from '@nova/ui';
import { cn } from '@nova/lib/utils';

interface LibraryDeleteDialogsProps {
  // Bulk Delete
  isBulkDeleteDialogOpen: boolean;
  onBulkDeleteOpenChange: (open: boolean) => void;
  selectedCount: number;
  onConfirmBulkDelete: () => void;
  
  // Single Delete
  pendingDeleteAssetId: string | null;
  onPendingDeleteAssetIdChange: (id: string | null) => void;
  onConfirmSingleDelete: () => void;
  
  isMobile?: boolean;
}

export const LibraryDeleteDialogs: React.FC<LibraryDeleteDialogsProps> = ({
  isBulkDeleteDialogOpen,
  onBulkDeleteOpenChange,
  selectedCount,
  onConfirmBulkDelete,
  pendingDeleteAssetId,
  onPendingDeleteAssetIdChange,
  onConfirmSingleDelete,
  isMobile = false
}) => {
  const commonContentClass = cn(isMobile && "w-[calc(100%-40px)] rounded-2xl max-w-sm");

  return (
    <>
      {/* Bulk Delete Dialog */}
      <NVDialog open={isBulkDeleteDialogOpen} onOpenChange={onBulkDeleteOpenChange}>
        <NVDialogContent className={isMobile ? commonContentClass : "max-w-md"}>
          <NVDialogHeader className={cn(isMobile && "px-5 pt-6 pb-2")}>
            <NVDialogTitle className={cn(isMobile && "text-lg")}>에셋 삭제 확인</NVDialogTitle>
            <NVDialogDescription className={cn(isMobile && "text-xs")}>
              선택한 {selectedCount}개의 에셋을 라이브러리에서 완전히 삭제하시겠습니까? {!isMobile && "이 작업은 되돌릴 수 없습니다."}
            </NVDialogDescription>
          </NVDialogHeader>
          <NVDialogBody className={cn(isMobile && "px-5 pb-6")}>
            <div className={cn(
              "p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 mb-2",
              !isMobile && "p-4"
            )}>
              <p className={cn(
                "text-[10px] text-rose-400 font-medium leading-relaxed",
                !isMobile && "text-xs"
              )}>
                * 삭제된 에셋은 복구할 수 없으며, 연결된 모든 폴더 및 즐겨찾기 정보가 함께 제거됩니다.
              </p>
            </div>
          </NVDialogBody>
          <NVDialogFooter className={cn(isMobile && "flex-row gap-2 px-5 py-3")}>
            <NVButton variant="ghost" className={cn(isMobile && "flex-1 h-11 rounded-xl")} onClick={() => onBulkDeleteOpenChange(false)}>
              취소
            </NVButton>
            <NVButton variant="primary" className={cn("bg-rose-500 hover:bg-rose-600 border-none", isMobile && "flex-1 h-11 rounded-xl")} onClick={onConfirmBulkDelete}>
              삭제{ !isMobile && "하기" }
            </NVButton>
          </NVDialogFooter>
        </NVDialogContent>
      </NVDialog>

      {/* Single Delete Dialog */}
      <NVDialog open={pendingDeleteAssetId !== null} onOpenChange={(open) => { if (!open) onPendingDeleteAssetIdChange(null); }}>
        <NVDialogContent className={isMobile ? commonContentClass : "max-w-md"}>
          <NVDialogHeader className={cn(isMobile && "px-5 pt-6 pb-2")}>
            <NVDialogTitle className={cn(isMobile && "text-lg")}>에셋 삭제 확인</NVDialogTitle>
            <NVDialogDescription className={cn(isMobile && "text-xs")}>
              이 에셋을 라이브러리에서 완전히 삭제하시겠습니까? {!isMobile && "이 작업은 되돌릴 수 없습니다."}
            </NVDialogDescription>
          </NVDialogHeader>
          <NVDialogBody className={cn(isMobile && "px-5 pb-6")}>
            <div className={cn(
              "p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 mb-2",
              !isMobile && "p-4"
            )}>
              <p className={cn(
                "text-[10px] text-rose-400 font-medium leading-relaxed",
                !isMobile && "text-xs"
              )}>
                * 삭제된 에셋은 복구할 수 없으며, 연결된 모든 폴더 및 즐겨찾기 정보가 함께 제거됩니다.
              </p>
            </div>
          </NVDialogBody>
          <NVDialogFooter className={cn(isMobile && "flex-row gap-2 px-5 py-3")}>
            <NVButton variant="ghost" className={cn(isMobile && "flex-1 h-11 rounded-xl")} onClick={() => onPendingDeleteAssetIdChange(null)}>
              취소
            </NVButton>
            <NVButton variant="primary" className={cn("bg-rose-500 hover:bg-rose-600 border-none", isMobile && "flex-1 h-11 rounded-xl")} onClick={onConfirmSingleDelete}>
              삭제{ !isMobile && "하기" }
            </NVButton>
          </NVDialogFooter>
        </NVDialogContent>
      </NVDialog>
    </>
  );
};
