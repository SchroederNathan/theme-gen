"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  Wifi,
  Battery,
  Signal,
  Search,
  Home,
  User,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  PieChart,
  Send,
  Plus,
  BarChart3,
  Bell,
  ChevronRight,
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
        <Signal size={10} aria-hidden="true" />
        <Wifi size={10} aria-hidden="true" />
        <Battery size={12} aria-hidden="true" />
      </div>
    </div>
  );
}

function MeshGradient({ id, primary, accent }: { id: string; primary: string; accent: string }) {
  return (
    <>
      {/* Radial gradient blobs anchored to top-left */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            `radial-gradient(ellipse 70% 55% at 10% 5%, ${primary} 0%, transparent 55%)`,
            `radial-gradient(ellipse 45% 60% at 0% 20%, ${accent}cc 0%, transparent 45%)`,
            `radial-gradient(ellipse 35% 30% at 35% 0%, ${accent}88 0%, transparent 40%)`,
            `radial-gradient(ellipse 25% 35% at 5% 45%, ${primary}66 0%, transparent 35%)`,
          ].join(", "),
          maskImage: "radial-gradient(ellipse 85% 65% at 0% 0%, black 15%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 65% at 0% 0%, black 15%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      {/* Noise texture — breaks up the smooth gradient into organic mesh */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.18, mixBlendMode: "overlay" }}
        aria-hidden="true"
      >
        <filter id={`mesh-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#mesh-${id})`} />
      </svg>
    </>
  );
}

function MiniChart({ up, color }: { up: boolean; color: string }) {
  const d = up
    ? "M0 14 L4 11 L8 12 L12 8 L16 9 L20 5 L24 3 L28 1"
    : "M0 2 L4 4 L8 3 L12 7 L16 9 L20 11 L24 12 L28 14";
  return (
    <svg width={28} height={16} viewBox="0 0 28 16" fill="none" aria-hidden="true">
      <path d={d} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MobilePortfolioScreen() {
  const { theme } = useTheme();

  const allocations = [
    { name: "Stocks", value: "$32.4k", pct: "67%", color: theme.colors.primary },
    { name: "Crypto", value: "$8.2k", pct: "17%", color: theme.colors.accent },
    { name: "Bonds", value: "$7.7k", pct: "16%", color: theme.colors.success },
  ];

  const transactions = [
    { label: "Apple Inc.", detail: "Buy · 2 shares", amount: "-$379.68", positive: false },
    { label: "Dividend", detail: "MSFT · Quarterly", amount: "+$12.50", positive: true },
    { label: "Tesla Inc.", detail: "Sell · 1 share", amount: "+$248.42", positive: true },
  ];

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <MeshGradient id="portfolio" primary={theme.colors.primary} accent={theme.colors.accent} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <StatusBar />

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-2 pb-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: theme.colors.primary, color: theme.colors.onPrimary }}
          >
            N
          </div>
          <button aria-label="Notifications">
            <Bell size={16} style={{ color: theme.colors.muted }} />
          </button>
        </div>

        {/* Balance */}
        <div className="px-5 pt-3 pb-2">
          <p className="text-[10px] font-medium" style={{ color: theme.colors.muted }}>Total Balance</p>
          <p
            className="text-[28px] font-bold mt-0.5"
            style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}
          >
            $48,291<span className="text-[18px]" style={{ color: theme.colors.muted }}>.57</span>
          </p>
          <div
            className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${theme.colors.success}15` }}
          >
            <ArrowUpRight size={10} style={{ color: theme.colors.success }} aria-hidden="true" />
            <span className="text-[9px] font-semibold" style={{ color: theme.colors.success }}>
              +$1,243.80 (2.64%)
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 px-5 py-3">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-semibold"
            style={{ backgroundColor: theme.colors.primary, color: theme.colors.onPrimary }}
          >
            <Plus size={12} /> Deposit
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-semibold border"
            style={{ borderColor: theme.colors.border, color: theme.colors.text }}
          >
            <Send size={12} /> Send
          </button>
        </div>

        {/* Allocation cards */}
        <div className="flex gap-2 px-5 py-2">
          {allocations.map((a) => (
            <div
              key={a.name}
              className="flex-1 p-2.5 rounded-xl min-w-0 border"
              style={{ borderColor: theme.colors.border }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                <span className="text-[8px] font-medium truncate" style={{ color: theme.colors.muted }}>{a.name}</span>
              </div>
              <p className="text-[12px] font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
                {a.value}
              </p>
              <p className="text-[8px] font-semibold mt-0.5" style={{ color: a.color }}>{a.pct}</p>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div className="flex-1 overflow-hidden mt-1">
          <div className="flex items-center justify-between px-5 mb-1.5">
            <p className="text-[11px] font-bold">Activity</p>
            <button className="flex items-center gap-0.5">
              <span className="text-[9px] font-semibold" style={{ color: theme.colors.primary }}>See all</span>
              <ChevronRight size={10} style={{ color: theme.colors.primary }} />
            </button>
          </div>
          <div className="px-5">
            {transactions.map((tx, i) => (
              <article
                key={i}
                className="flex items-center gap-2.5 py-2"
                style={{ borderBottom: i < transactions.length - 1 ? `1px solid ${theme.colors.border}` : undefined }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: tx.positive ? `${theme.colors.success}12` : `${theme.colors.primary}12`,
                  }}
                >
                  {tx.positive ? (
                    <ArrowUpRight size={14} style={{ color: theme.colors.success }} />
                  ) : (
                    <ArrowDownRight size={14} style={{ color: theme.colors.primary }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold truncate">{tx.label}</p>
                  <p className="text-[9px]" style={{ color: theme.colors.muted }}>{tx.detail}</p>
                </div>
                <p
                  className="text-[11px] font-bold flex-shrink-0"
                  style={{
                    color: tx.positive ? theme.colors.success : theme.colors.text,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {tx.amount}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <nav className="flex items-center justify-around pt-2 pb-4" style={{ borderTop: `1px solid ${theme.colors.border}` }}>
          {[
            { icon: Home, label: "Home", active: true },
            { icon: BarChart3, label: "Invest", active: false },
            { icon: Send, label: "Send", active: false },
            { icon: CreditCard, label: "Cards", active: false },
            { icon: User, label: "Profile", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button key={label} className="flex flex-col items-center gap-1 relative" aria-label={label}>
              {active && (
                <div
                  className="absolute -top-2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              <Icon size={16} style={{ color: active ? theme.colors.primary : theme.colors.muted }} aria-hidden="true" />
              <span
                className={`text-[7px] ${active ? "font-bold" : "font-medium"}`}
                style={{ color: active ? theme.colors.primary : theme.colors.muted }}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function MobileMarketScreen() {
  const { theme } = useTheme();

  const indices = [
    { name: "S&P 500", value: "5,218", change: "+0.87%", up: true },
    { name: "NASDAQ", value: "16,340", change: "+1.14%", up: true },
    { name: "DOW", value: "38,503", change: "-0.22%", up: false },
  ];

  const holdings = [
    { symbol: "AAPL", name: "Apple Inc.", price: "$189.84", change: "+2.34%", up: true },
    { symbol: "TSLA", name: "Tesla Inc.", price: "$248.42", change: "-1.12%", up: false },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: "$875.28", change: "+4.67%", up: true },
    { symbol: "MSFT", name: "Microsoft", price: "$378.91", change: "+0.89%", up: true },
  ];

  const symbolColors = [
    theme.colors.primary,
    theme.colors.error,
    theme.colors.success,
    theme.colors.accent,
  ];

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <MeshGradient id="markets" primary={theme.colors.primary} accent={theme.colors.accent} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <StatusBar />

        {/* Header */}
        <div className="px-5 pt-2 pb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-[17px] font-bold">Markets</h1>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.colors.secondary }}
            >
              <Search size={13} style={{ color: theme.colors.muted }} />
            </div>
          </div>
        </div>

        {/* Index cards */}
        <div className="flex gap-2 px-4 pb-3">
          {indices.map((idx) => (
            <div
              key={idx.name}
              className="flex-1 p-2.5 rounded-xl min-w-0 border"
              style={{ borderColor: theme.colors.border }}
            >
              <p className="text-[8px] font-medium truncate" style={{ color: theme.colors.muted }}>{idx.name}</p>
              <p
                className="text-[10px] font-bold mt-0.5"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {idx.value}
              </p>
              <div
                className="inline-flex items-center gap-0.5 mt-1 px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: idx.up ? `${theme.colors.success}12` : `${theme.colors.error}12` }}
              >
                {idx.up ? (
                  <ArrowUpRight size={7} style={{ color: theme.colors.success }} aria-hidden="true" />
                ) : (
                  <ArrowDownRight size={7} style={{ color: theme.colors.error }} aria-hidden="true" />
                )}
                <span
                  className="text-[7px] font-bold"
                  style={{ color: idx.up ? theme.colors.success : theme.colors.error, fontVariantNumeric: "tabular-nums" }}
                >
                  {idx.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Watchlist */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-1 pb-2">
            <p className="text-[11px] font-bold">Watchlist</p>
            <button className="flex items-center gap-0.5">
              <span className="text-[9px] font-semibold" style={{ color: theme.colors.accent }}>See all</span>
              <ChevronRight size={10} style={{ color: theme.colors.accent }} />
            </button>
          </div>
          {holdings.map((stock, i) => (
            <article
              key={stock.symbol}
              className="flex items-center gap-2.5 px-5 py-2"
              style={{ borderBottom: i < holdings.length - 1 ? `1px solid ${theme.colors.border}` : undefined }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                style={{
                  backgroundColor: `${symbolColors[i]}12`,
                  color: symbolColors[i],
                }}
              >
                {stock.symbol.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold truncate">{stock.symbol}</p>
                <p className="text-[9px] truncate" style={{ color: theme.colors.muted }}>{stock.name}</p>
              </div>
              <MiniChart up={stock.up} color={stock.up ? theme.colors.success : theme.colors.error} />
              <div className="text-right flex-shrink-0">
                <p className="text-[11px] font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {stock.price}
                </p>
                <p
                  className="text-[9px] font-semibold"
                  style={{ color: stock.up ? theme.colors.success : theme.colors.error, fontVariantNumeric: "tabular-nums" }}
                >
                  {stock.change}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Tab bar */}
        <nav className="flex items-center justify-around pt-2 pb-4" style={{ borderTop: `1px solid ${theme.colors.border}` }}>
          {[
            { icon: Home, label: "Home", active: false },
            { icon: PieChart, label: "Invest", active: false },
            { icon: TrendingUp, label: "Markets", active: true },
            { icon: CreditCard, label: "Cards", active: false },
            { icon: User, label: "Profile", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <button key={label} className="flex flex-col items-center gap-1 relative" aria-label={label}>
              {active && (
                <div
                  className="absolute -top-2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              <Icon size={16} style={{ color: active ? theme.colors.primary : theme.colors.muted }} aria-hidden="true" />
              <span
                className={`text-[7px] ${active ? "font-bold" : "font-medium"}`}
                style={{ color: active ? theme.colors.primary : theme.colors.muted }}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>
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
    <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start lg:justify-center lg:gap-16">
      <PhoneFrame label="Portfolio">
        <MobilePortfolioScreen />
      </PhoneFrame>
      <PhoneFrame label="Markets">
        <MobileMarketScreen />
      </PhoneFrame>
    </div>
  );
}
