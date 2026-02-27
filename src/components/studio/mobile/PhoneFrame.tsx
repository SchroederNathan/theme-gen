export function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-medium text-muted mb-4 uppercase tracking-widest">{label}</p>
      <div className="relative" style={{ width: 280, height: 572 }}>
        <div className="absolute inset-0 rounded-[44px] bg-neutral-950 shadow-2xl ring-1 ring-white/10" />
        <div className="absolute inset-[6px] rounded-[38px] overflow-hidden">
          {children}
        </div>
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[76px] h-[22px] bg-neutral-950 rounded-full z-10" />
        <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-neutral-700 rounded-full z-10" />
      </div>
    </div>
  );
}
