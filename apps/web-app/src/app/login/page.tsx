'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from "@nova/providers/AuthProvider";
import { NVLogo, NVLoginCard, NVTypography } from '@nova/ui';
import { supabase, isSupabaseInitialized } from '@nova/lib/supabase';

export default function LoginPage() {
  const { signInAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseInitialized) {
      setError('Supabase가 설정되지 않았습니다. 게스트로 계속하세요.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    if (!isSupabaseInitialized) {
      setError('Supabase가 설정되지 않았습니다.');
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/library` },
    });
  };

  return (
    <div className="bg-[#050505] min-h-[100dvh] flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-[380px] relative z-10 transition-all duration-300">
        {/* 헤더 섹션: 표준 사이즈 준수 로고 */}
        <div className="flex flex-col items-center mb-10 opacity-0 animate-[fadeIn_300ms_ease-out_forwards]">
          <div className="text-center space-y-2">
            <NVLogo size="lg" />
            <NVTypography variant="secondary" className="text-slate-500">
              Premium Design Asset Library
            </NVTypography>
          </div>
        </div>

        {/* 디자인 시스템 표준 로그인 카드 컴포넌트 */}
        <div className="opacity-0 animate-[fadeIn_300ms_ease-out_100ms_forwards]">
          <NVLoginCard
            onGithubLogin={() => handleOAuthLogin('github')}
            onGuestLogin={signInAsGuest}
            loading={loading}
            error={error}
            isInitialized={isSupabaseInitialized}
          />
        </div>

        {/* 푸터 영역: 보조 정보 */}
        <div className="mt-8 text-center space-y-4 opacity-0 animate-[fadeIn_300ms_ease-out_200ms_forwards]">
          <NVTypography variant="caption" className="text-slate-600 leading-relaxed tracking-tight group">
            <span className="text-slate-500 uppercase">Premium Creative Studio</span> 라이선스 <br/>
            계속 진행 시 <span className="underline underline-offset-4 decoration-slate-800 hover:text-indigo-400 transition-colors cursor-pointer">이용약관</span> 동의로 간주됩니다.
          </NVTypography>
        </div>
      </div>
    </div>
  );
}
