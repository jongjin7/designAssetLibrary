'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@nova/lib/utils';
import { useAuth } from '@nova/providers/AuthProvider';
import { User } from 'lucide-react';

export const SidebarProfile = () => {
  const { profile } = useAuth();
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === '/profile';

  return (
    <button 
      className={cn(
        "w-full flex items-center gap-3 p-1.5 rounded-xl cursor-pointer transition-all border border-transparent select-none",
        isActive 
          ? 'bg-indigo-500/10 border-indigo-500/30' 
          : 'hover:bg-white/[0.05]',
      )}
      onClick={() => router.push('/profile')}
    >
      <div className={cn(
        "flex-shrink-0 w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center transition-all overflow-hidden",
        isActive && 'border-indigo-500/50 bg-indigo-500/20',
      )}>
        {profile?.avatarUrl && !imageError ? (
          <img 
            src={profile.avatarUrl} 
            alt="Profile" 
            className="w-full h-full object-cover" 
            onError={() => setImageError(true)}
          />
        ) : (
          <User size={18} className={cn(isActive ? 'text-indigo-400' : 'text-slate-400')} />
        )}
      </div>
      <div className="flex flex-col min-w-0 text-left">
        <span className={cn(
          "text-[12px] font-bold truncate",
          isActive ? 'text-indigo-400' : 'text-slate-200'
        )}>
          {profile?.name || '사용자'}
        </span>
        <span className="text-[10px] text-slate-500 truncate">
          {profile?.email || 'user@nova.design'}
        </span>
      </div>
    </button>
  );
};
