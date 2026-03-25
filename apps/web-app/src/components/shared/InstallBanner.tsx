import { Download, X, Share } from 'lucide-react';
import { usePWA } from '@nova/hooks/usePWA';
import { useState, useEffect } from 'react';
import { NVCard } from '@nova/ui';

interface InstallBannerProps {
  showClose?: boolean;
  className?: string;
}

export function InstallBanner({ showClose = true, className }: InstallBannerProps) {
  const { isInstallable, isPromptReady, install } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [platform, setPlatform] = useState<'ios-safari' | 'ios-other' | 'other' | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installMsg, setInstallMsg] = useState('');

  useEffect(() => {
    // 설치된 앱(standalone)에서 실행 중이면 모든 배너 숨김
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    if (!isIOS) {
      setPlatform('other');
      return;
    }
    const isSafari = !/CriOS|FxiOS|OPiOS|mercury/.test(ua);
    setPlatform(isSafari ? 'ios-safari' : 'ios-other');
  }, []);

  // 설치된 앱이거나, 닫혔거나, 아직 플랫폼 감지 중이면 숨김
  if (isStandalone || dismissed || platform === null) return null;

  // iOS Safari: 홈 화면 추가 안내 배너
  // iOS Safari: 홈 화면 추가 안내 배너
  if (platform === 'ios-safari' && !isInstallable) {
    return (
      <NVCard 
        className={`fixed bottom-20 left-3 right-3 z-90 flex items-center gap-3 !p-3 !bg-slate-950/90 !border-indigo-500/40 !backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(99,102,241,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-300 ${className || ''}`.trim()} 
        hoverEffect={false}
      >
        <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-500">
          <Share size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-50">홈 화면에 추가하기</p>
          <p className="text-[11px] text-slate-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">공유(□↑) → &apos;홈 화면에 추가&apos; 선택</p>
        </div>
        {showClose && (
          <button className="flex-shrink-0 p-1.5 text-slate-500 hover:text-slate-300 transition-colors" onClick={() => setDismissed(true)} aria-label="닫기">
            <X size={16} />
          </button>
        )}
      </NVCard>
    );
  }

  // iOS Chrome 또는 기타 iOS 브라우저: 배너 없음
  if (platform === 'ios-other') return null;

  // Android / Desktop: isInstallable이면 배너 표시 (새로고침 후에도 유지)
  // 단, 인라인(static)으로 배치된 경우 데스크탑에서도 항상 노출되도록 허용
  if (!isInstallable && !className?.includes('static')) return null;

  const handleInstall = async () => {
    const result = await install();
    if (result === 'unavailable') {
      setInstallMsg('주소창의 설치 아이콘(⊕)을 클릭하거나 페이지를 새로고침해 주세요.');
    }
  };

  return (
    <NVCard 
      className={`fixed bottom-20 left-3 right-3 z-90 flex items-center gap-3 !p-3 !bg-slate-950/90 !border-indigo-500/40 !backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(99,102,241,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-300 ${className || ''}`.trim()} 
      hoverEffect={false}
    >
      <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-500">
        <Download size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-slate-50">Trove 앱 설치</p>
        <p className="text-[11px] text-slate-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
          {installMsg || (isPromptReady ? '홈 화면에 추가하여 빠르게 실행' : '설치 준비 중...')}
        </p>
      </div>
      <button 
        className="px-3.5 py-1.5 rounded-lg bg-indigo-500 text-white text-[13px] font-bold flex-shrink-0 active:scale-95 transition-all hover:bg-indigo-400 active:bg-indigo-600 shadow-lg shadow-indigo-500/20" 
        onClick={handleInstall}
      >
        설치
      </button>
      {showClose && (
        <button className="flex-shrink-0 p-1.5 text-slate-500 hover:text-slate-300 transition-colors" onClick={() => setDismissed(true)} aria-label="닫기">
          <X size={16} />
        </button>
      )}
    </NVCard>
  );
}

