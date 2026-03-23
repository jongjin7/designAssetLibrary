'use client';

import { useEffect } from 'react';

export function PWAHandler() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const isLocalhost = window.location.hostname === 'localhost';
      const isHttps = window.location.protocol === 'https:';
      const isDev = process.env.NODE_ENV === 'development';

      if (isDev) {
        // Force unregister stale service workers in development to prevent 404/Precaching errors
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then(() => {
               console.log('[PWA] Stale Service Worker Unregistered successfully in DEV mode');
            });
          }
        });
        return;
      }

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
