'use client';

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="desktop-shell">
      <div className="desktop-shell__container">
        {children}
      </div>
    </div>
  );
}
