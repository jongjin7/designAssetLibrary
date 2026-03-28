import React from 'react';
import { ILLUSTRATIONS, EmptyStateVariant } from './illustrations';

export interface NVEmptyStateProps {
  /** 케이스별 사전 정의 일러스트 변형 */
  variant?: EmptyStateVariant;
  /** variant='custom'일 때 직접 전달하는 아이콘/일러스트 */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const NVEmptyState: React.FC<NVEmptyStateProps> = ({
  variant = 'custom',
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  const IllustrationComponent = variant !== 'custom' ? ILLUSTRATIONS[variant] : null;

  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center select-none ${className}`}
    >
      {/* Illustration */}
      <div className="relative">
        {IllustrationComponent ? (
          <IllustrationComponent />
        ) : icon ? (
          <div className="text-5xl text-slate-600">{icon}</div>
        ) : null}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-base font-bold text-slate-100 tracking-tight">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mb-6 text-sm text-slate-500 max-w-[260px] leading-relaxed">
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div>{action}</div>}
    </div>
  );
};

// ─── Registered Presets ───────────────────────────────────────────────────────

/** 라이브러리가 완전히 비어있는 상태 */
export const NVEmptyLibraryState: React.FC<Partial<NVEmptyStateProps>> = (props) => (
  <NVEmptyState
    variant="empty-library"
    title="라이브러리가 비어 있습니다"
    description="자산을 업로드하거나 화면을 캡처하여 나만의 디자인 라이브러리를 만들어 보세요."
    {...props}
  />
);

/** 검색 결과가 없는 상태 */
export const NVNoResultsState: React.FC<Partial<NVEmptyStateProps> & { query?: string }> = ({ query, ...props }) => (
  <NVEmptyState
    variant="no-results"
    title={query ? "검색 결과가 없습니다" : "자산이 존재하지 않습니다"}
    description={query 
      ? `"${query}"에 대한 검색 결과가 없습니다. 다른 검색어나 필터를 시도해 보세요.` 
      : "현재 필터 조건에 맞는 디자인 자산이 없습니다. 필터를 초기화해 보세요."
    }
    {...props}
  />
);

/** 즐겨찾기한 자산이 없는 상태 */
export const NVNoFavoritesState: React.FC<Partial<NVEmptyStateProps>> = (props) => (
  <NVEmptyState
    variant="no-favorites"
    title="즐겨찾기한 자산이 없습니다"
    description="중요한 디자인 자산의 별 아이콘을 클릭하여 즐겨찾기에 추가해 보세요."
    {...props}
  />
);

/** 최근 확인한 자산이 없는 상태 */
export const NVNoRecentState: React.FC<Partial<NVEmptyStateProps>> = (props) => (
  <NVEmptyState
    variant="no-recent"
    title="최근 자산이 없습니다"
    description="최근에 추가하거나 확인한 디자인 자산이 없습니다."
    {...props}
  />
);

/** 오프라인 상태 */
export const NVOfflineState: React.FC<Partial<NVEmptyStateProps>> = (props) => (
  <NVEmptyState
    variant="offline"
    title="인터넷 연결을 확인해 주세요"
    description="현재 오프라인 상태입니다. 네트워크 연결이 복구되면 다시 시도해 주세요."
    {...props}
  />
);

export type { EmptyStateVariant };
