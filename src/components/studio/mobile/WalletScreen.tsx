"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  Search,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Send,
  Download,
  ScanLine,
  Star,
} from "lucide-react";
import { StatusBar } from "./StatusBar";
import { MiniChart } from "./MiniChart";

export function WalletScreen() {
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
        {[
          { Icon: CreditCard, id: "buy" },
          { Icon: Send, id: "send" },
          { Icon: Download, id: "receive" },
          { Icon: ScanLine, id: "scan" },
        ].map(({ Icon, id }) => (
          <button
            key={id}
            className="flex-1 flex items-center justify-center py-3.5 rounded-2xl"
            style={{ backgroundColor: `${theme.colors.primary}15` }}
          >
            <Icon size={18} style={{ color: theme.colors.primary }} />
          </button>
        ))
        }
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
