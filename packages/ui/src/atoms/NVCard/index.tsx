import React from 'react';

interface NVCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  theme?: 'dark' | 'light';
}

export const NVCard: React.FC<NVCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  theme = 'dark',
}) => {
  const themeStyles =
    theme === 'light'
      ? 'bg-white/60 backdrop-blur-2xl border border-black/[0.05] shadow-lg shadow-black/5 text-slate-800'
      : 'bg-slate-950/60 backdrop-blur-2xl border border-white/10 shadow-xl shadow-black/20 text-slate-200';

  const hoverStyles = hoverEffect
    ? theme === 'light'
      ? 'hover:scale-[1.01] hover:bg-white/70 transition-all duration-300'
      : 'hover:scale-[1.01] hover:bg-slate-950/70 transition-all duration-300'
    : '';

  return (
    <div className={`${themeStyles} rounded-xl p-6 ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};
