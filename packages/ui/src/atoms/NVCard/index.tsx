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
      ? 'bg-white/70 backdrop-blur-md border border-black/8 shadow-black/5 text-slate-900'
      : 'bg-white/5 backdrop-blur-md border border-white/10 text-white';

  const hoverStyles = hoverEffect
    ? theme === 'light'
      ? 'hover:scale-[1.02] hover:bg-white/80 transition-all duration-300'
      : 'hover:scale-[1.02] hover:bg-white/[0.07] transition-all duration-300'
    : '';

  return (
    <div className={`${themeStyles} rounded-2xl p-6 shadow-xl ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};
