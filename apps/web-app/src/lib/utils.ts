export function cn(...inputs: (string | boolean | undefined | null | { [key: string]: any })[]) {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      // Basic recursive support if needed, but simple arrays for now
      classes.push(...input.filter(Boolean));
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

export function checkIsDesktopApp() {
  if (typeof window === 'undefined') return false;
  
  // Robust Electron detection
  const isElectron = 
    (window as any).electron !== undefined || 
    navigator.userAgent.indexOf('Electron') >= 0 ||
    (window as any).process?.versions?.electron !== undefined;
    
  const isPlatformParam = window.location.search.includes('platform=desktop');
  
  return isElectron || isPlatformParam;
}
