import React from 'react';
import { NVGlassPanel } from '../../atoms/NVGlassPanel';
import { NVButton } from '../../atoms/NVButton';
import { NVTypography } from '../../atoms/NVTypography';
import { NVNotice } from '../../atoms/NVNotice';
import { Sparkles } from 'lucide-react';
import { NVLoginCardHeader } from './parts/NVLoginCardHeader';
import { NVLoginSocialButton } from './parts/NVLoginSocialButton';
import { NVLoginCardFooter } from './parts/NVLoginCardFooter';

export interface NVLoginCardProps {
  /** OAuth 로그인 핸들러들 */
  onGoogleLogin?: () => void;
  onKakaoLogin?: () => void;
  onNaverLogin?: () => void;
  onFacebookLogin?: () => void;
  onGithubLogin?: () => void;
  /** 게스트 로그인 핸들러 */
  onGuestLogin?: () => void;
  /** 에러 메시지 */
  error?: string;
  /** 로딩 상태 여부 */
  loading?: boolean;
  /** Supabase 초기화 여부 (버튼 활성화 제어용) */
  isInitialized?: boolean;
}

export const NVLoginCard: React.FC<NVLoginCardProps> = ({
  onGoogleLogin,
  onKakaoLogin,
  onNaverLogin,
  onFacebookLogin,
  onGithubLogin,
  onGuestLogin,
  error,
  loading = false,
  isInitialized = true,
}) => {
  const disabled = loading || !isInitialized;

  return (
    <NVGlassPanel 
      blur="lg" 
      className="rounded-2xl border-white/5 bg-white/[0.03] shadow-2xl shadow-black/60 w-[380px] p-6 mobile:w-full mobile:h-full mobile:flex mobile:flex-col mobile:justify-center"
    >
      <div className="space-y-4">
        <NVLoginCardHeader />

        <div >
          <div className="space-y-3 py-4 px-4 brightness-80 hover:brightness-100 transition-all duration-300">
            {/* 주요 소셜 로그인 (Primary) */}
            {onGoogleLogin && <NVLoginSocialButton provider="google" onClick={onGoogleLogin} disabled={disabled} />}
            {onKakaoLogin && <NVLoginSocialButton provider="kakao" onClick={onKakaoLogin} disabled={disabled} />}
            {onNaverLogin && <NVLoginSocialButton provider="naver" onClick={onNaverLogin} disabled={disabled} />}

            {/* 보조 소셜 로그인 (Secondary) - 핸들러가 있을 때만 표시 */}
            {(onFacebookLogin || onGithubLogin) && (
              <div className="space-y-4">
                <div className="relative py-4 flex items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-slate-600 text-[10px] uppercase tracking-widest font-semibold text-center leading-none">
                    또는
                  </span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {onFacebookLogin && (
                    <NVLoginSocialButton provider="facebook" onClick={onFacebookLogin} disabled={disabled} isSecondary />
                  )}
                  {onGithubLogin && (
                    <NVLoginSocialButton provider="github" onClick={onGithubLogin} disabled={disabled} isSecondary />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 게스트 액션 */}
          <div className="pt-2 px-4">
            <NVButton
              variant="ghost"
              onClick={onGuestLogin}
              size="md"
              className="w-full "
              disabled={loading}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles size={14} />
                <span className="text-xs">게스트로 둘러보기</span>
              </div>
            </NVButton>
          </div>
        </div>

        {/* 에러 피드백 */}
        {error && (
          <NVNotice variant="error" className="rounded-xl py-2 mt-4 text-xs font-medium">
            {error}
          </NVNotice>
        )}

        <NVLoginCardFooter />
      </div>
    </NVGlassPanel>
  );
};
