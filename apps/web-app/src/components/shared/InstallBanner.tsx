import { Download, X, Share } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
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
  if (platform === 'ios-safari' && !isInstallable) {
    return (
      <NVCard className={`install-banner flex items-center !p-4 !rounded-xl ${className || ''}`.trim()} hoverEffect={false}>
        <div className="install-banner__icon">
          <Share size={18} />
        </div>
        <div className="install-banner__text ml-3 flex-1">
          <p className="install-banner__title font-bold text-sm">홈 화면에 추가하기</p>
          <p className="install-banner__sub text-xs opacity-60">공유(□↑) → &apos;홈 화면에 추가&apos; 선택</p>
        </div>
        {showClose && (
          <button className="install-banner__close p-1 ml-2 opacity-40 hover:opacity-100" onClick={() => setDismissed(true)} aria-label="닫기">
            <X size={16} />
          </button>
        )}
      </NVCard>
    );
  }

  // iOS Chrome 또는 기타 iOS 브라우저: 배너 없음
  if (platform === 'ios-other') return null;

  // Android / Desktop: isInstallable이면 배너 표시 (새로고침 후에도 유지)
  if (!isInstallable) return null;

  const handleInstall = async () => {
    const result = await install();
    if (result === 'unavailable') {
      setInstallMsg('주소창의 설치 아이콘(⊕)을 클릭하거나 페이지를 새로고침해 주세요.');
    }
  };

  return (
    <NVCard className={`install-banner flex items-center !p-4 !rounded-xl ${className || ''}`.trim()} hoverEffect={false}>
      <div className="install-banner__icon">
        <Download size={18} />
      </div>
      <div className="install-banner__text ml-3 flex-1">
        <p className="install-banner__title font-bold text-sm">NOVA 앱 설치</p>
        <p className="install-banner__sub text-xs opacity-60">
          {installMsg || (isPromptReady ? '홈 화면에 추가하여 빠르게 실행' : '설치 준비 중...')}
        </p>
      </div>
      <button className="install-banner__btn bg-nv-primary/20 text-nv-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-nv-primary hover:text-white transition-colors" onClick={handleInstall}>
        설치
      </button>
      {showClose && (
        <button className="install-banner__close p-1 ml-2 opacity-40 hover:opacity-100" onClick={() => setDismissed(true)} aria-label="닫기">
          <X size={16} />
        </button>
      )}
    </NVCard>
  );
}
