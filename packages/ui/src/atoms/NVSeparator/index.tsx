import React from 'react';
import { cn } from '../../lib/utils';

interface NVSeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  /**
   * 구분선의 방향을 설정합니다.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * 구분선의 강조 수준을 설정합니다.
   */
  variant?: 'default' | 'subtle' | 'vivid';
}

/**
 * 콘텐츠 간의 구분을 위한 시맨틱한 라인 컴포넌트입니다.
 * 가로선은 hr 태그를 기본으로 사용합니다.
 */
export const NVSeparator: React.FC<NVSeparatorProps> = ({
  orientation = 'horizontal',
  variant = 'default',
  className,
  ...props
}) => {
  const variants = {
    default: "border-white/10",
    subtle: "border-white/[0.08]",
    vivid: "border-indigo-500/30"
  };

  return (
    <hr
      className={cn(
        "m-0 box-border border-solid border-0",
        orientation === 'horizontal' 
          ? "w-full h-0 border-t" 
          : "h-0 w-0 h-auto self-stretch border-l mx-1 min-h-[14px]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
