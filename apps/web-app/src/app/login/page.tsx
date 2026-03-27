'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@nova/providers/AuthProvider";
import { NVLogo, NVLoginCard, NVTypography } from '@nova/ui';
import { supabase, isSupabaseInitialized } from '@nova/lib/supabase';
import type { Provider } from '@supabase/supabase-js';

const POPUP_WIDTH = 520;
const POPUP_HEIGHT = 640;

export default function LoginPage() {
  const { signInAsGuest } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  // 팝업에서 보내는 메시지 수신
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'OAUTH_SUCCESS') {
        stopPolling();
        popupRef.current?.close();
        router.push('/library');
      } else if (event.data?.type === 'OAUTH_ERROR') {
        stopPolling();
        popupRef.current?.close();
        setError(event.data.error || '로그인 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      stopPolling();
    };
  }, [router]);

  const openPopup = (url: string) => {
    const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2;
    const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2;
    const popup = window.open(
      url,
      'oauth_popup',
      `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},toolbar=no,menubar=no`
    );
    if (!popup) {
      setError('팝업이 차단되었습니다. 브라우저 팝업 차단을 해제해주세요.');
      setLoading(false);
      return;
    }
    popupRef.current = popup;

    // 팝업이 메시지 없이 닫히면 (사용자가 직접 닫거나 실패) 로딩 해제
    pollRef.current = setInterval(() => {
      if (popup.closed) {
        stopPolling();
        setLoading(false);
      }
    }, 500);
  };

  // Google, Kakao: Supabase 네이티브 OAuth
  const handleOAuthLogin = async (provider: Extract<Provider, 'google' | 'kakao'>) => {
    if (!isSupabaseInitialized) {
      setError('로그인 서비스가 준비 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setLoading(true);
    setError(null);

    const scopes: Partial<Record<typeof provider, string>> = {
      kakao: 'profile_nickname profile_image account_email',
    };

    try {
      const { data, error: loginError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
          scopes: scopes[provider],
        },
      });
      if (loginError) throw loginError;
      if (data.url) openPopup(data.url);
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // Naver: Supabase 미지원 → 직접 OAuth 구현
  const handleNaverLogin = () => {
    if (!process.env.NEXT_PUBLIC_NAVER_CLIENT_ID) {
      setError('네이버 로그인이 준비 중입니다.');
      return;
    }
    setLoading(true);
    setError(null);
    const state = crypto.randomUUID();
    sessionStorage.setItem('naver_oauth_state', state);
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      redirect_uri: `${window.location.origin}/api/auth/naver/callback`,
      state,
    });
    openPopup(`https://nid.naver.com/oauth2.0/authorize?${params}`);
  };

  return (
    <div className="bg-[#020202] min-h-[100dvh] flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30 overflow-hidden relative">
      {/* 프리미엄 배경 효과 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-[400px] relative z-10 transition-all duration-500">
        {/* 헤더 섹션: 브랜드 아이덴티티 */}
        <div className="flex flex-col items-center mb-12 opacity-0 animate-[fadeIn_600ms_ease-out_forwards]">
          <div className="text-center space-y-4">
            <NVLogo size="lg" className="scale-110 drop-shadow-2xl" />
            <div className="space-y-1">
              <NVTypography variant="label" className="text-slate-400 font-medium tracking-[0.2em] uppercase text-[10px]">
                Premium Design Asset Library
              </NVTypography>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-800 to-transparent mx-auto"></div>
            </div>
          </div>
        </div>

        {/* 유니버설 로그인 카드 */}
        <div className="opacity-0 animate-[fadeIn_800ms_ease-out_200ms_forwards]">
          <NVLoginCard
            onGoogleLogin={() => handleOAuthLogin('google')}
            onKakaoLogin={() => handleOAuthLogin('kakao')}
            onNaverLogin={handleNaverLogin}
            onGuestLogin={signInAsGuest}
            loading={loading}
            error={error}
            isInitialized={isSupabaseInitialized}
          />
        </div>

        {/* 푸터 영역: 법적 고지 및 상태 */}
        <div className="mt-12 text-center space-y-4 opacity-0 animate-[fadeIn_600ms_ease-out_400ms_forwards]">
          <NVTypography variant="caption" className="text-slate-600 leading-relaxed tracking-tight">
            계속 진행함으로써 NOVA의 <span className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer border-b border-slate-800">서비스 이용약관</span> 및 <br/>
            <span className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer border-b border-slate-800">개인정보 처리방침</span>에 동의하게 됩니다.
          </NVTypography>
        </div>
      </div>
    </div>
  );
}
