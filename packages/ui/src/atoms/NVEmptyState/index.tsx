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
      <div className="mb-6 relative">
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

export type { EmptyStateVariant };
