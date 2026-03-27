import React, { useState } from "react";
import { NVCard } from "@nova/ui";
import { LucideIcon, User } from "lucide-react";

interface ProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
  avatarIcon?: LucideIcon;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  avatarUrl,
  avatarIcon: AvatarIcon = User,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <NVCard 
      className="relative flex items-center gap-8 p-4 mb-8 overflow-hidden !bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%)] backdrop-blur-[40px] border border-white/[0.08] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]" 
      hoverEffect={false}
    >
      <div className="relative z-[2] flex-shrink-0 w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#6f8fff] to-[#3058a0] flex items-center justify-center color-white overflow-hidden">
        {avatarUrl && !imageError ? (
          <img 
            src={avatarUrl} 
            alt={name} 
            className="w-full h-full object-cover" 
            onError={() => setImageError(true)}
          />
        ) : (
          <AvatarIcon size={64} className="text-white" />
        )}
      </div>
      <div className="flex-1 z-[2]">
        <h3 className="text-xl font-extrabold text-white mb-0.5 tracking-tight">{name}</h3>
        <p className="text-sm text-white/50 font-medium">{email}</p>
      </div>
    </NVCard>
  );
};
