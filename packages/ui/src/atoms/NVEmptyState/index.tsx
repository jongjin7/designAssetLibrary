import React from 'react';

export interface NVEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const NVEmptyState: React.FC<NVEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center p-12 text-center
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {icon && <div className="mb-4 text-5xl">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold text-nv-text-primary">{title}</h3>
      {description && <p className="mb-6 text-sm text-nv-text-tertiary">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
