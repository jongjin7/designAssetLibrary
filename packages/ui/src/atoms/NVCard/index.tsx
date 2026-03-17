import React from 'react';

interface NVCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const NVCard: React.FC<NVCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true 
}) => {
  const hoverStyles = hoverEffect ? 'hover:scale-[1.02] hover:bg-white/[0.07] transition-all duration-300' : '';

  return (
    <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};
