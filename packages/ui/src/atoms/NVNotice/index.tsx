import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle 
} from 'lucide-react';

export type NVNoticeVariant = 'info' | 'success' | 'warning' | 'error';

interface NVNoticeProps {
  variant?: NVNoticeVariant;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const NVNotice: React.FC<NVNoticeProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  className = '',
}) => {
  const variants = {
    info: {
      container: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
      icon: <Info size={16} className="text-indigo-400" />,
      title: 'text-indigo-200',
    },
    success: {
      container: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
      icon: <CheckCircle2 size={16} className="text-emerald-400" />,
      title: 'text-emerald-200',
    },
    warning: {
      container: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
      icon: <AlertTriangle size={16} className="text-amber-400" />,
      title: 'text-amber-200',
    },
    error: {
      container: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
      icon: <AlertCircle size={16} className="text-rose-400" />,
      title: 'text-rose-200',
    },
  };

  const currentVariant = variants[variant];
  const displayIcon = icon !== undefined ? icon : currentVariant.icon;

  return (
    <div 
      className={`p-4 border rounded-2xl flex items-start gap-3 ${currentVariant.container} ${className}`}
    >
      {displayIcon && (
        <div className="shrink-0 mt-0.5">
          {displayIcon}
        </div>
      )}
      <div className="flex-1 space-y-1">
        {title && (
          <h5 className={`text-xs font-bold leading-none ${currentVariant.title}`}>
            {title}
          </h5>
        )}
        <div className="text-[11px] font-medium leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
