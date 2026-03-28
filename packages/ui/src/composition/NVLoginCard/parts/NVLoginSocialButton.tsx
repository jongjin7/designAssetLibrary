import React from 'react';
import { NVButton } from '../../../atoms/NVButton';
import { Facebook, Github } from 'lucide-react';
import { KakaoIcon, NaverIcon, GoogleIcon } from './icons';

export type ProviderType = 'google' | 'kakao' | 'naver' | 'facebook' | 'github';

interface NVLoginSocialButtonProps {
  provider: ProviderType;
  onClick?: () => void;
  disabled?: boolean;
  isSecondary?: boolean;
}

const PROVIDER_CONFIG = {
  google: {
    icon: <GoogleIcon />,
    label: 'Google 로그인',
    className: '!bg-white !text-[#3c4043] !border-[#dadce0] active:!bg-[#eeeeee] hover:!brightness-[0.96]',
  },
  kakao: {
    icon: <KakaoIcon />,
    label: '카카오 로그인',
    className: '!bg-[#FEE500] !text-[#191919] !border-none hover:!brightness-[1.1] hover:!saturate-[1.1]',
  },
  naver: {
    icon: <NaverIcon />,
    label: '네이버 로그인',
    className: '!bg-[#03C75A] !text-white !border-none hover:!brightness-[1.1] hover:!saturate-[1.1]',
  },
  facebook: {
    icon: <Facebook size={18} />,
    label: 'Facebook으로 계속',
    className: '!bg-[#1877F2] !border-none !text-white hover:!brightness-[1.1] hover:!saturate-[1.1]',
  },
  github: {
    icon: <Github size={18} />,
    label: 'GitHub로 계속',
    className: '!bg-[#24292F] !border-none !text-white hover:!brightness-[1.1] hover:!saturate-[1.1]',
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
      className={`w-full flex items-center justify-center gap-3 opacity-80 hover:opacity-100 transition-all duration-300 active:scale-[0.98] ${config.className} ${isSecondary ? '!py-2.5' : ''}`}
    >
      {config.icon}
      {!isSecondary && <span>{config.label}</span>}
    </NVButton>
  );
};
