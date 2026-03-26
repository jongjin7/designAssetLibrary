import "./globals.css";
import { PWAHandler } from "@nova/components/shared/PWAHandler";
import { NVToastProvider } from "@nova/ui";
import { AuthProvider } from "@nova/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <title>Trove | Design Asset Library</title>
        <meta name="description" content="Capture and organize design assets instantly." />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0b" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no, interactive-widget=resizes-visual" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Trove" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* beforeinstallprompt를 번들 로드 전에 최우선으로 캐치 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__pwaPrompt = window.__pwaPrompt || null;
              if (!window.__pwaListenerAdded) {
                window.addEventListener('beforeinstallprompt', function(e) {
                  window.__pwaPrompt = e;
                  window.dispatchEvent(new Event('pwa-prompt-ready'));
                });
                window.addEventListener('appinstalled', function() {
                  window.__pwaPrompt = null;
                  window.dispatchEvent(new Event('pwa-prompt-ready'));
                });
                window.__pwaListenerAdded = true;
              }
            `,
          }}
        />
      </head>
      <body>
        <NVToastProvider>
          <AuthProvider>
            <PWAHandler />
            {children}
          </AuthProvider>
        </NVToastProvider>
      </body>
    </html>
  );
}
