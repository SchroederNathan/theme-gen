export function MiniChart({ up, color }: { up: boolean; color: string }) {
  const d = up
    ? "M0 12 L3 10 L6 11 L9 8 L12 9 L15 6 L18 5 L21 4 L24 2"
    : "M0 3 L3 5 L6 3 L9 6 L12 8 L15 7 L18 10 L21 11 L24 13";
  return (
    <svg width={28} height={14} viewBox="0 0 28 14" fill="none" aria-hidden="true">
      <path d={d} stroke={color} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
