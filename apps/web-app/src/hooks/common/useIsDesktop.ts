import { useState, useEffect } from 'react';

let lastIsDesktop: boolean | null = null;

export function useIsDesktop(breakpoint = 760) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(lastIsDesktop);

  useEffect(() => {
    const checkIsDesktop = () => {
      const isElectron = (window as any).electron !== undefined;
      const isPlatformDesktop = window.location.search.includes('platform=desktop');
      const newValue = isElectron || isPlatformDesktop || window.innerWidth >= breakpoint;
      
      setIsDesktop(newValue);
      lastIsDesktop = newValue;
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, [breakpoint]);

  return isDesktop;
}
