import React from 'react';

interface NVButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'vivid' | 'danger' | 'ghost' | 'glass' | 'glass-primary' | 'glass-neutral' | 'glass-danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const NVButton: React.FC<NVButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none tracking-tight [&_svg]:text-inherit select-none cursor-pointer';
  
  const roundedStyles = {
    xs: 'rounded-md',
    sm: 'rounded-lg',
    md: 'rounded-lg',
    lg: 'rounded-xl'
  };
  
  const variants = {
    // Premium Indigo Gradient
    primary: 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(79,70,229,0.6)] hover:-translate-y-0.5',
    
    // Sleek Surface / Dark Secondary
    secondary: 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/20',
    
    // Cyan Vivid Gradient
    vivid: 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-[0_8px_20px_-6px_rgba(6,182,212,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(6,182,212,0.6)] hover:-translate-y-0.5',
    
    // Danger / Rose Alert — Robust for dark mode
    danger: 'bg-rose-500/10 border border-rose-500/25 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.15)] hover:shadow-[0_8px_20px_rgba(244,63,94,0.4)] hover:-translate-y-0.5',
    
    // Minimal Ghost
    ghost: 'bg-transparent text-slate-500 hover:text-slate-50 hover:bg-white/5',
    
    // Glassmorphism Premium (Neutral)
    glass: 'bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20',

    // --- On-Glass Specific Variants ---
    
    // Glass Primary: Vivid accent on glass
    'glass-primary': 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 shadow-[0_4px_12px_rgba(99,102,241,0.15)]',
    
    // Glass Neutral: Subtle integration with glass bar
    'glass-neutral': 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20',
    
    // Glass Danger: Destructive yet aesthetic on glass
    'glass-danger': 'bg-rose-500/5 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.1)]'
  }; 

  const sizes = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-2.5'
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${roundedStyles[size]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
