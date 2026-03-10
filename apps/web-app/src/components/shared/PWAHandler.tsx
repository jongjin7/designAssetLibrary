'use client';

import { useEffect } from 'react';

export function PWAHandler() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const isLocalhost = window.location.hostname === 'localhost';
      const isHttps = window.location.protocol === 'https:';

      if (isHttps || isLocalhost) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      }
    }
  }, []);

  return null;
}
