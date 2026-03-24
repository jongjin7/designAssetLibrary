import { useState, useEffect } from 'react';

export function useIsDesktop(breakpoint = 760) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsDesktop = () => {
      // Force desktop view if running in Electron environment
      const isElectron = (window as any).electron !== undefined;
      const isPlatformDesktop = window.location.search.includes('platform=desktop');
      setIsDesktop(isElectron || isPlatformDesktop || window.innerWidth >= breakpoint);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, [breakpoint]);

  return isDesktop;
}
