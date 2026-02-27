"use client";

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import {
  Wifi,
  Battery,
  Signal,
  Search,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Send,
  Download,
  ScanLine,
  Star,
  ChevronRight,
  Flame,
  ChevronDown,
  MoreHorizontal,
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
} from "lucide-react";

function StatusBar() {
  const { theme } = useTheme();
  return (
    <div
      className="flex items-center justify-between px-6 pt-2 pb-1 text-[10px] font-semibold"
      style={{ color: theme.colors.text }}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <Signal size={10} />
        <Wifi size={10} />
        <Battery size={12} />
      </div>
    </div>
  );
}

function MiniChart({ up, color }: { up: boolean; color: string }) {
  const d = up
    ? "M0 12 L3 10 L6 11 L9 8 L12 9 L15 6 L18 5 L21 4 L24 2"
    : "M0 3 L3 5 L6 3 L9 6 L12 8 L15 7 L18 10 L21 11 L24 13";
  return (
    <svg width={28} height={14} viewBox="0 0 28 14" fill="none" aria-hidden="true">
      <path d={d} stroke={color} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MobileWalletScreen() {
  const { theme } = useTheme();

  const tokens = [
    { symbol: "ETH", name: "Ethereum", price: "$3,718.71", change: "+4.66%", up: true },
    { symbol: "USDC", name: "USD Coin", price: "$1.00", change: "-0.01%", up: false },
    { symbol: "SOL", name: "Solana", price: "$148.32", change: "+6.57%", up: true },
    { symbol: "MATIC", name: "Polygon", price: "$0.724", change: "+7.43%", up: true },
  ];

  const tokenColors = [
    theme.colors.primary,
    theme.colors.accent,
    theme.colors.success,
    theme.colors.warning,
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <StatusBar />

      {/* Profile + settings */}
      <div className="flex items-center justify-between px-5 pt-1">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold"
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.onPrimary }}
        >
          A
        </div>
        <button aria-label="Settings">
          <Settings size={18} style={{ color: theme.colors.muted }} />
        </button>
      </div>

      {/* Username + balance */}
      <div className="px-5 pt-2">
        <div className="flex items-center gap-2">
          <p className="text-[12px] font-bold">schroedernathan</p>
          <span
            className="text-[8px] px-1.5 py-0.5 rounded"
            style={{ backgroundColor: theme.colors.secondary, color: theme.colors.muted }}
          >
            0x7094...2242
          </span>
        </div>
        <p
          className="text-[30px] font-bold mt-1"
          style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}
        >
          $4,829<span style={{ color: theme.colors.muted }}>.15</span>
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <ArrowUpRight size={10} style={{ color: theme.colors.success }} />
          <span className="text-[10px] font-medium" style={{ color: theme.colors.success }}>3.42%</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2.5 px-5 pt-3 pb-3">
        {[CreditCard, Send, Download, ScanLine].map((Icon, i) => (
          <button
            key={i}
            className="flex-1 flex items-center justify-center py-3.5 rounded-2xl"
            style={{ backgroundColor: `${theme.colors.primary}15` }}
          >
            <Icon size={18} style={{ color: theme.colors.primary }} />
          </button>
        ))}
      </div>

      {/* Welcome banner */}
      <div className="mx-5 mb-3 p-3 rounded-2xl" style={{ backgroundColor: theme.colors.secondary }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${theme.colors.accent}18` }}
          >
            <Star size={14} style={{ color: theme.colors.accent }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold">Welcome to ThemeGen</p>
              <span className="text-[9px]" style={{ color: theme.colors.muted }}>Swipe</span>
            </div>
            <p className="text-[9px] mt-0.5 leading-relaxed" style={{ color: theme.colors.muted }}>
              Preview your palette across real UI components.
            </p>
          </div>
        </div>
      </div>

      {/* Token list */}
      <div className="flex-1 overflow-hidden">
        <p className="text-[13px] font-bold px-5 mb-2">Explore tokens</p>
        {tokens.map((token, i) => (
          <article key={token.symbol} className="flex items-center gap-2.5 px-5 py-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
              style={{ backgroundColor: `${tokenColors[i]}15`, color: tokenColors[i] }}
            >
              {token.symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold">{token.name}</p>
              <p className="text-[9px]" style={{ color: theme.colors.muted }}>{token.symbol}</p>
            </div>
            <MiniChart up={token.up} color={token.up ? `${theme.colors.success}88` : `${theme.colors.error}88`} />
            <div className="text-right flex-shrink-0 ml-1">
              <p className="text-[11px] font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
                {token.price}
              </p>
              <div className="flex items-center justify-end gap-0.5">
                {token.up ? (
                  <ArrowUpRight size={8} style={{ color: theme.colors.success }} />
                ) : (
                  <ArrowDownRight size={8} style={{ color: theme.colors.error }} />
                )}
                <span
                  className="text-[9px] font-medium"
                  style={{
                    color: token.up ? theme.colors.success : theme.colors.error,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {token.change}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center gap-2 px-4 pb-5 pt-2">
        <div
          className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-full"
          style={{ backgroundColor: theme.colors.secondary }}
        >
          <Search size={14} style={{ color: theme.colors.muted }} />
          <span className="text-[10px] font-medium" style={{ color: theme.colors.muted }}>Search</span>
        </div>
        <button
          className="px-5 py-2.5 rounded-full text-[11px] font-bold"
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.onPrimary }}
        >
          Swap
        </button>
      </div>
    </div>
  );
}

function MobileExploreScreen() {
  const { theme } = useTheme();

  const trending = [
    { symbol: "PEPE", change: "+24.5%", up: true },
    { symbol: "ARB", change: "+12.3%", up: true },
    { symbol: "DOGE", change: "-3.2%", up: false },
  ];

  const trendingColors = [
    theme.colors.success,
    theme.colors.accent,
    theme.colors.primary,
  ];

  const tokens = [
    { symbol: "BTC", name: "Bitcoin", price: "$67,432", change: "+1.82%", up: true, rank: 1 },
    { symbol: "ETH", name: "Ethereum", price: "$3,718", change: "+4.66%", up: true, rank: 2 },
    { symbol: "SOL", name: "Solana", price: "$148.32", change: "+6.57%", up: true, rank: 3 },
    { symbol: "BNB", name: "BNB Chain", price: "$612.48", change: "-0.34%", up: false, rank: 4 },
    { symbol: "AVAX", name: "Avalanche", price: "$38.92", change: "+3.21%", up: true, rank: 5 },
  ];

  const tokenColors = [
    theme.colors.warning,
    theme.colors.primary,
    theme.colors.success,
    theme.colors.accent,
    theme.colors.error,
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <StatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-1 pb-2">
        <h1 className="text-[17px] font-bold">Explore</h1>
        <button aria-label="Settings">
          <Settings size={18} style={{ color: theme.colors.muted }} />
        </button>
      </div>

      {/* Search bar */}
      <div className="px-5 pb-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: theme.colors.secondary }}
        >
          <Search size={13} style={{ color: theme.colors.muted }} />
          <span className="text-[10px]" style={{ color: theme.colors.muted }}>Search tokens</span>
        </div>
      </div>

      {/* Trending */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Flame size={12} style={{ color: theme.colors.primary }} />
          <p className="text-[11px] font-bold">Trending</p>
        </div>
        <div className="flex gap-2">
          {trending.map((t, i) => (
            <div
              key={t.symbol}
              className="flex-1 p-2.5 rounded-xl"
              style={{ backgroundColor: `${trendingColors[i]}0a` }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold mb-1.5"
                style={{ backgroundColor: `${trendingColors[i]}15`, color: trendingColors[i] }}
              >
                {t.symbol.slice(0, 2)}
              </div>
              <p className="text-[10px] font-bold">{t.symbol}</p>
              <p
                className="text-[9px] font-semibold mt-0.5"
                style={{ color: t.up ? theme.colors.success : theme.colors.error }}
              >
                {t.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top tokens */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 mb-2">
          <p className="text-[13px] font-bold">Top tokens</p>
          <button className="flex items-center gap-0.5">
            <span className="text-[9px] font-semibold" style={{ color: theme.colors.primary }}>See all</span>
            <ChevronRight size={10} style={{ color: theme.colors.primary }} />
          </button>
        </div>
        {tokens.map((token, i) => (
          <article key={token.symbol} className="flex items-center gap-2 px-5 py-1.5">
            <span
              className="text-[8px] font-medium w-3 text-right"
              style={{ color: theme.colors.muted }}
            >
              {token.rank}
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
              style={{ backgroundColor: `${tokenColors[i]}12`, color: tokenColors[i] }}
            >
              {token.symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold">{token.name}</p>
              <p className="text-[9px]" style={{ color: theme.colors.muted }}>{token.symbol}</p>
            </div>
            <MiniChart up={token.up} color={token.up ? `${theme.colors.success}88` : `${theme.colors.error}88`} />
            <div className="text-right flex-shrink-0 ml-1">
              <p className="text-[10px] font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
                {token.price}
              </p>
              <p
                className="text-[9px] font-medium"
                style={{
                  color: token.up ? theme.colors.success : theme.colors.error,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {token.change}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center gap-2 px-4 pb-5 pt-2">
        <div
          className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-full"
          style={{ backgroundColor: theme.colors.secondary }}
        >
          <Search size={14} style={{ color: theme.colors.muted }} />
          <span className="text-[10px] font-medium" style={{ color: theme.colors.muted }}>Search</span>
        </div>
        <button
          className="px-5 py-2.5 rounded-full text-[11px] font-bold"
          style={{ backgroundColor: theme.colors.accent, color: theme.colors.onAccent }}
        >
          Trade
        </button>
      </div>
    </div>
  );
}

function MobilePlayerScreen() {
  const { theme } = useTheme();

  const queue = [
    { title: "Breathe (In The Air)", artist: "Pink Floyd", image: "/mobile/breathe-song-cover.png" },
    { title: "Are You Looking Up", artist: "Mk.Gee", image: "/mobile/mkgee-song-cover.png" },
    { title: "Golden Hour", artist: "JVKE", image: "/mobile/song-cover.png" },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <StatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-1">
        <button aria-label="Minimize">
          <ChevronDown size={18} style={{ color: theme.colors.muted }} />
        </button>
        <p className="text-[11px] font-bold">Now Playing</p>
        <button aria-label="More options">
          <MoreHorizontal size={18} style={{ color: theme.colors.muted }} />
        </button>
      </div>

      {/* Album art */}
      <div className="px-5 pt-2 pb-3">
        <div className="relative aspect-square rounded-md overflow-hidden shadow-lg">
          <Image
            src="/mobile/mary-song-cover.png"
            alt="Album cover"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Song info */}
      <div className="flex items-center justify-between px-5 pb-1">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold truncate">Mary</p>
          <p className="text-[11px] " style={{ color: theme.colors.muted }}>Black Country, New Road</p>
        </div>
        <button aria-label="Like">
          <Heart size={16} fill={theme.colors.primary} style={{ color: theme.colors.primary }} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-2">
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: theme.colors.secondary }}>
          <div className="h-full rounded-full" style={{ width: "35%", backgroundColor: theme.colors.primary }} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px]" style={{ color: theme.colors.muted, fontVariantNumeric: "tabular-nums" }}>1:24</span>
          <span className="text-[9px]" style={{ color: theme.colors.muted, fontVariantNumeric: "tabular-nums" }}>3:48</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-8 pb-3">
        <button aria-label="Shuffle">
          <Shuffle size={16} style={{ color: theme.colors.muted }} />
        </button>
        <button aria-label="Previous">
          <SkipBack size={20} fill={theme.colors.text} style={{ color: theme.colors.text }} />
        </button>
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.colors.primary }}
          aria-label="Play"
        >
          <Play size={20} fill={theme.colors.onPrimary} style={{ color: theme.colors.onPrimary, marginLeft: 2 }} />
        </button>
        <button aria-label="Next">
          <SkipForward size={20} fill={theme.colors.text} style={{ color: theme.colors.text }} />
        </button>
        <button aria-label="Repeat">
          <Repeat size={16} style={{ color: theme.colors.primary }} />
        </button>
      </div>

      {/* Up next */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-5 mb-2">
          <p className="text-[13px] font-bold">Up Next</p>
          <button className="flex items-center gap-0.5">
            <span className="text-[9px] font-semibold" style={{ color: theme.colors.primary }}>Queue</span>
            <ChevronRight size={10} style={{ color: theme.colors.primary }} />
          </button>
        </div>
        {queue.map((song) => (
          <article key={song.title} className="flex items-center gap-2.5 px-5 py-1.5">
            <div className="relative w-9 h-9 rounded-sm overflow-hidden flex-shrink-0">
              <Image
                src={song.image}
                alt={song.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold truncate">{song.title}</p>
              <p className="text-[9px]" style={{ color: theme.colors.muted }}>{song.artist}</p>
            </div>
            <button aria-label="More">
              <MoreHorizontal size={14} style={{ color: theme.colors.muted }} />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
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

export default function MobilePreview() {
  return (
    <div className="flex flex-col items-center gap-16 lg:flex-row lg:flex-wrap lg:items-start lg:justify-center lg:gap-12">
      <PhoneFrame label="Wallet">
        <MobileWalletScreen />
      </PhoneFrame>
      <PhoneFrame label="Explore">
        <MobileExploreScreen />
      </PhoneFrame>
      <PhoneFrame label="Player">
        <MobilePlayerScreen />
      </PhoneFrame>
    </div>
  );
}
