'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * 브라우저 히스토리의 이전/다음 가능 여부를 실시간으로 추적하는 훅
 * window.history.state에 커스텀 인덱스(idx)를 삽입하여 위치를 파악합니다.
 */
export function useNavHistory() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const state = window.history.state || {};
    let currentIdx = state.idx;
    
    // 1. 인덱스가 없는 신규 페이지 진입인 경우
    if (currentIdx === undefined) {
      const lastIdx = Number(sessionStorage.getItem('trove_nav_last_idx') || '0');
      currentIdx = lastIdx + 1;
      
      // 히스토리에 인덱스 주입
      window.history.replaceState({ ...state, idx: currentIdx }, '');
      
      // 신규 진입 시에는 현재 인덱스가 곧 최대 인덱스가 됨 (앞으로가기 히스토리 소멸)
      sessionStorage.setItem('trove_nav_last_idx', currentIdx.toString());
      sessionStorage.setItem('trove_nav_max_idx', currentIdx.toString());
      
      setCanGoBack(currentIdx > 1);
      setCanGoForward(false);
    } else {
      // 2. 이미 인덱스가 있는 페이지 (뒤로/앞으로 이동 시)
      const maxIdx = Number(sessionStorage.getItem('trove_nav_max_idx') || '0');
      
      sessionStorage.setItem('trove_nav_last_idx', currentIdx.toString());
      setCanGoBack(currentIdx > 1);
      setCanGoForward(currentIdx < maxIdx);
    }

    // popstate 이벤트 리스너 (브라우저 자체의 앞/뒤 이동 대응)
    const handlePopState = () => {
       // url이 바뀌면서 useEffect가 재실행되므로 별도 로직은 불필요하지만,
       // 즉각적인 상태 반영이 필요할 때를 위해 리스너를 둘 수 있습니다.
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [url]);

  return {
    canGoBack,
    canGoForward,
  };
}
