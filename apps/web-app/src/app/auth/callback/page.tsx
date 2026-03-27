'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@nova/lib/supabase';

function notifyParent(type: 'OAUTH_SUCCESS' | 'OAUTH_ERROR', error?: string) {
  window.opener?.postMessage({ type, error }, window.location.origin);
  window.close();
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isPopup = !!(window.opener && !window.opener.closed);
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const errorParam = params.get('error');

    // OAuth 제공자가 error 파라미터와 함께 리다이렉트한 경우 (사용자 취소 등)
    if (errorParam) {
      const msg = errorParam === 'access_denied' ? '로그인을 취소했습니다.' : errorParam;
      isPopup ? notifyParent('OAUTH_ERROR', msg) : router.replace('/login');
      return;
    }

    if (code) {
      // Google / Kakao: authorization code → session 교환
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (isPopup) {
          error ? notifyParent('OAUTH_ERROR', error.message) : notifyParent('OAUTH_SUCCESS');
        } else {
          error ? setError(error.message) : router.replace('/library');
        }
      });
      return;
    }

    // Naver: magic link 처리 후 세션이 이미 설정됨 — 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isPopup) {
        session ? notifyParent('OAUTH_SUCCESS') : notifyParent('OAUTH_ERROR', '세션을 가져올 수 없습니다.');
      } else {
        session ? router.replace('/library') : router.replace('/login');
      }
    });
  }, [router]);

  if (error) {
    return (
      <div className="min-h-[100dvh] bg-[#020202] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          className="text-slate-400 text-xs underline"
          onClick={() => router.replace('/login')}
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#020202] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-xs">로그인 처리 중...</p>
      </div>
    </div>
  );
}
