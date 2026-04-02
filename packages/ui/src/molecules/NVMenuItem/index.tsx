import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NVMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  label: string;
  description?: string;
  rightElement?: React.ReactNode;
  variant?: 'default' | 'vivid' | 'danger' | 'ghost';
  isActive?: boolean;
}

export const NVMenuItem: React.FC<NVMenuItemProps> = ({
  icon: Icon,
  label,
  description,
  rightElement,
  variant = 'default',
  isActive = false,
  className,
  ...props
}) => {
  const baseStyles = "flex items-center gap-3 w-full px-2.5 py-2 rounded-lg transition-all text-left group disabled:opacity-40 disabled:pointer-events-none";
  
  const variants = {
    default: "hover:bg-white/5 text-slate-400 hover:text-slate-200",
    vivid: "hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-400",
    danger: "hover:bg-rose-500/10 text-slate-400 hover:text-rose-400",
    ghost: "bg-transparent text-slate-500 hover:text-slate-200"
  };

  const activeStyles = isActive ? "bg-white/10 text-white" : "";

  return (
    <button
      className={cn(baseStyles, variants[variant], activeStyles, className)}
      {...props}
    >
      {Icon && (
        <Icon 
          size={14} 
          className={cn(
            "flex-shrink-0 transition-colors",
            variant === 'vivid' ? "text-indigo-500/70 group-hover:text-indigo-500" :
            variant === 'danger' ? "text-rose-500/70 group-hover:text-rose-500" :
            "text-slate-500 group-hover:text-slate-300"
          )}
        />
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <span className="text-[12px] font-medium leading-tight truncate">{label}</span>
        {description && (
          <span className="text-[10px] text-slate-500 group-hover:text-slate-400/70 truncate mt-0.5 whitespace-nowrap">
            {description}
          </span>
        )}
      </div>
      {rightElement && (
        <div className="flex-shrink-0">
          {rightElement}
        </div>
      )}
    </button>
  );
};
