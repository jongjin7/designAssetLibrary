import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NOVA | Design Asset Library",
  description: "Capture and organize design assets instantly.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NOVA",
  },
  icons: {
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

import { PWAHandler } from "../components/shared/PWAHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* beforeinstallprompt를 번들 로드 전에 최우선으로 캐치 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.__pwaPrompt = window.__pwaPrompt || null;
                if (!window.__pwaListenerAdded) {
                  window.addEventListener('beforeinstallprompt', function(e) {
                    console.log('[PWA] Global Capture: beforeinstallprompt received');
                    window.__pwaPrompt = e;
                    window.dispatchEvent(new Event('pwa-prompt-ready'));
                  });
                  window.addEventListener('appinstalled', function() {
                    console.log('[PWA] Global Capture: appinstalled');
                    window.__pwaPrompt = null;
                    window.dispatchEvent(new Event('pwa-prompt-ready'));
                  });
                  window.__pwaListenerAdded = true;
                }
              }
            `,
          }}
        />
        <PWAHandler />
        {children}
      </body>
    </html>
  );
}
