"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  Search,
  Settings,
  ChevronRight,
  Flame,
} from "lucide-react";
import { StatusBar } from "./StatusBar";
import { MiniChart } from "./MiniChart";

export function ExploreScreen() {
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
          style={{ backgroundColor: theme.colors.container }}
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
          style={{ backgroundColor: theme.colors.container }}
        >
          <Search size={14} style={{ color: theme.colors.muted }} />
          <span className="text-[10px] font-medium" style={{ color: theme.colors.muted }}>Search</span>
        </div>
        <button
          className="px-5 py-2.5 rounded-full text-[11px] font-bold"
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.onPrimary }}
        >
          Trade
        </button>
      </div>
    </div>
  );
}
