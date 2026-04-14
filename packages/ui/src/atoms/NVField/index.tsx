import React from 'react';
import { cn } from '../../lib/utils';

export interface NVFieldProps {
  /** 필드 레이블 텍스트 */
  label?: string;
  /** 레이블과 연결할 폼 요소의 ID */
  htmlFor?: string;
  /** 필드 내부에 들어갈 폼 컨트롤 (Input, Select 등) */
  children: React.ReactNode;
  /** 필드 설명 텍스트 */
  description?: React.ReactNode;
  /** 에러 또는 알럿 메시지 */
  error?: React.ReactNode;
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
 * 레이블, 폼 컨트롤, 설명을 결합하고 일관된 간격과 크기를 제공합니다.
 */
export const NVField: React.FC<NVFieldProps> = ({
  label,
  htmlFor,
  children,
  description,
  error,
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
      label: 'text-xs',
      desc: 'text-[10px]'
    },
    sm: {
      vertical: 'space-y-1.75',
      horizontal: 'gap-x-4',
      label: 'text-sm',
      desc: 'text-xs'
    },
    md: {
      vertical: 'space-y-2',
      horizontal: 'gap-x-5',
      label: 'text-md',
      desc: 'text-sm'
    },
    lg: {
      vertical: 'space-y-3',
      horizontal: 'gap-x-6',
      label: 'text-xl',
      desc: 'text-md'
    }
  };

  const config = sizeConfigs[size];

  // 디스크립션 및 에러 렌더링 함수
  const renderMessages = () => (
    <>
      {description && (
        <p className={cn("text-slate-500 leading-relaxed pl-1", config.desc)}>
          {description}
        </p>
      )}
      {error && (
        <p className={cn("text-red-400 font-medium leading-relaxed pl-1", config.desc)}>
          {error}
        </p>
      )}
    </>
  );

  return (
    <div className={cn(
      "flex",
      row ? "flex-row items-baseline" : "flex-col",
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
      
      {row ? (
        <div className={cn("flex-1 flex flex-col", config.vertical)}>
          {children}
          {renderMessages()}
        </div>
      ) : (
        <>
          {children}
          {renderMessages()}
        </>
      )}
    </div>
  );
};

