import React from 'react';
import { cn } from '../../lib/utils';

export interface NVFieldProps {
  /** 필드 레이블 텍스트 */
  label?: string;
  /** 레이블과 연결할 폼 요소의 ID */
  htmlFor?: string;
  /** 필드 내부에 들어갈 폼 컨트롤 (Input, Select 등) */
  children: React.ReactNode;
  /** 수평 레이아웃 여부 (Label + Input, Select 등) */
  row?: boolean;
  /** 수평 레이아웃일 때 레이블의 너비 (예: '120px', '30%') */
  labelWidth?: string | number;
  /** 필드 전체 컨테이너 클래스 */
  className?: string;
  /** 레이블 전용 클래스 */
  labelClassName?: string;
  /** 필드의 전체적인 크기 (레이블 크기와 간격이 동기화됨) */
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * 폼 필드 구성을 위한 레이아웃 컴포넌트입니다.
 * 레이블과 폼 컨트롤을 결합하고 일관된 간격과 크기를 제공합니다.
 */
export const NVField: React.FC<NVFieldProps> = ({
  label,
  htmlFor,
  children,
  row = false,
  labelWidth,
  className = '',
  labelClassName = '',
  size = 'md'
}) => {
  const sizeConfigs = {
    xs: {
      vertical: 'space-y-1.5',
      horizontal: 'gap-x-3',
      label: 'text-xs'
    },
    sm: {
      vertical: 'space-y-2',
      horizontal: 'gap-x-4',
      label: 'text-sm'
    },
    md: {
      vertical: 'space-y-3',
      horizontal: 'gap-x-5',
      label: 'text-md'
    },
    lg: {
      vertical: 'space-y-4',
      horizontal: 'gap-x-6',
      label: 'text-xl'
    }
  };

  const config = sizeConfigs[size];

  return (
    <div className={cn(
      "flex",
      row ? "flex-row items-center" : "flex-col",
      row ? config.horizontal : config.vertical,
      className
    )}>
      {label && (
        <label 
          htmlFor={htmlFor}
          className={cn(
            "uppercase tracking-widest pl-1 block leading-tight shrink-0",
            config.label,
            labelClassName
          )}
          style={row && labelWidth ? { width: labelWidth } : undefined}
        >
          {label}
        </label>
      )}
      <div className={cn(row ? "flex-1" : "")}>
        {children}
      </div>
    </div>
  );
};
