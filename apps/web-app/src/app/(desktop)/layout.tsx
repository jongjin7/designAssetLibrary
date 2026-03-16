export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden lg:block min-h-screen bg-slate-950 text-slate-50">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
