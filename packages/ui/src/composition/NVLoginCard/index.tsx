import React from 'react';
import { NVGlassPanel } from '../../atoms/NVGlassPanel';
import { NVButton } from '../../atoms/NVButton';
import { NVTypography } from '../../atoms/NVTypography';
import { NVNotice } from '../../atoms/NVNotice';
import { Github, Sparkles } from 'lucide-react';

interface NVLoginCardProps {
  /** GitHub OAuth 로그인 핸들러 */
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

/**
 * 프로젝트 표준 디자인 가이드를 준수하는 로그인 박스 컴포넌트입니다.
 * 곡률(rounded-xl), 블러(lg), 폰트 및 버튼 규격이 고정되어 있습니다.
 */
export const NVLoginCard: React.FC<NVLoginCardProps> = ({
  onGithubLogin,
  onGuestLogin,
  error,
  loading = false,
  isInitialized = true,
}) => {
  return (
    <NVGlassPanel 
      blur="lg" 
      className="rounded-xl border-white/5 bg-white/[0.02] shadow-2xl shadow-black/40 w-full max-w-[380px]"
    >
      <div className="space-y-8 p-1">
        <div className="space-y-2">
          <NVTypography variant="header" className="text-white text-lg">로그인</NVTypography>
          <NVTypography variant="secondary" className="text-slate-500">
            작업을 시작하려면 계정을 확인하세요.
          </NVTypography>
        </div>

        <div className="space-y-8">
          <NVButton
            variant="primary"
            onClick={onGithubLogin}
            size="lg"
            className="w-full"
            disabled={loading || !isInitialized}
          >
            <span className="flex items-center justify-center gap-2">
              <Github size={18} />
              GitHub 로그인
            </span>
          </NVButton>

          <NVButton
            variant="glass"
            onClick={onGuestLogin}
            size="lg"
            className="w-full"
            disabled={loading}
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <NVTypography variant="label" className="text-slate-300">게스트로 체험하기</NVTypography>
            </span>
          </NVButton>
        </div>

        {error && (
          <NVNotice variant="error" className="rounded-xl py-2 mt-4 text-xs font-medium">
            {error}
          </NVNotice>
        )}

        <div className="pt-2 text-center border-t border-white/5 pt-6">
          <NVTypography variant="caption" className="text-slate-600 opacity-50">
            Sprint 1 • OAuth Authentication
          </NVTypography>
        </div>
      </div>
    </NVGlassPanel>
  );
};
