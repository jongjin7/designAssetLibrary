import React from 'react';
import { NVButton } from '../../../atoms/NVButton';
import { Chrome, Facebook, Github } from 'lucide-react';
import { KakaoIcon, NaverIcon } from './icons';

export type ProviderType = 'google' | 'kakao' | 'naver' | 'facebook' | 'github';

interface NVLoginSocialButtonProps {
  provider: ProviderType;
  onClick?: () => void;
  disabled?: boolean;
  isSecondary?: boolean;
}

const PROVIDER_CONFIG = {
  google: {
    icon: <Chrome size={18} />,
    label: 'Google 계정으로 계속',
    className: 'bg-white text-black hover:bg-slate-100 border-none',
  },
  kakao: {
    icon: <KakaoIcon />,
    label: '카카오톡으로 계속',
    className: 'bg-[#FEE500] text-black hover:bg-[#F7E600] border-none',
  },
  naver: {
    icon: <NaverIcon />,
    label: '네이버로 계속',
    className: 'bg-[#03C75A] text-white hover:bg-[#02b351] border-none',
  },
  facebook: {
    icon: <Facebook size={18} />,
    label: 'Facebook으로 계속',
    className: 'bg-[#1877F2] border-none text-white',
  },
  github: {
    icon: <Github size={18} />,
    label: 'GitHub로 계속',
    className: 'bg-[#24292F] border-none text-white',
  },
};

export const NVLoginSocialButton: React.FC<NVLoginSocialButtonProps> = ({
  provider,
  onClick,
  disabled,
  isSecondary = false,
}) => {
  const config = PROVIDER_CONFIG[provider];
  
  return (
    <NVButton
      variant={isSecondary ? "secondary" : "glass"}
      onClick={onClick}
      size="lg"
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${config.className} ${isSecondary ? '!py-2.5' : ''}`}
    >
      {config.icon}
      {!isSecondary && <span>{config.label}</span>}
    </NVButton>
  );
};
