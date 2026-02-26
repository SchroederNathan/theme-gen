"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  Wifi,
  Battery,
  Signal,
  Search,
  Home,
  Bell,
  User,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  PieChart,
  Send,
  Plus,
  MoreHorizontal,
} from "lucide-react";

function StatusBar({ light }: { light?: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-5 py-1.5 text-[10px] font-semibold relative z-10"
      style={{ color: light ? "rgba(255,255,255,0.9)" : "var(--color-text)" }}
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

  const holdings = [
    { symbol: "AAPL", name: "Apple Inc.", price: "$189.84", change: "+2.34%", up: true },
    { symbol: "TSLA", name: "Tesla Inc.", price: "$248.42", change: "-1.12%", up: false },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: "$875.28", change: "+4.67%", up: true },
    { symbol: "MSFT", name: "Microsoft", price: "$378.91", change: "+0.89%", up: true },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      {/* Gradient header — fades into background */}
      <div className="relative">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 50%, ${theme.colors.background} 100%)`,
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <StatusBar light />
          <div className="px-4 pt-1 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/60 font-medium">Total Balance</p>
                <p className="text-2xl font-bold text-white mt-0.5">$48,291.57</p>
              </div>
              <button aria-label="Notifications" className="relative">
                <Bell size={18} className="text-white/80" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.error }} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <ArrowUpRight size={12} className="text-white/90" aria-hidden="true" />
              <span className="text-[11px] text-white/90 font-medium">+$1,243.80 (2.64%) today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center justify-around px-4 py-3 border-b" style={{ borderColor: theme.colors.border }}>
        {[
          { icon: Plus, label: "Buy" },
          { icon: Send, label: "Send" },
          { icon: CreditCard, label: "Deposit" },
          { icon: MoreHorizontal, label: "More" },
        ].map(({ icon: Icon, label }) => (
          <button key={label} className="flex flex-col items-center gap-1.5" aria-label={label}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.colors.secondary }}
            >
              <Icon size={16} aria-hidden="true" style={{ color: theme.colors.primary }} />
            </div>
            <span className="text-[9px] font-medium" style={{ color: theme.colors.muted }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Watchlist */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <p className="text-xs font-semibold" style={{ color: theme.colors.text }}>Watchlist</p>
          <button aria-label="Search stocks">
            <Search size={14} aria-hidden="true" style={{ color: theme.colors.muted }} />
          </button>
        </div>
        {holdings.map((stock) => (
          <article
            key={stock.symbol}
            className="flex items-center gap-3 px-4 py-2.5 border-b"
            style={{ borderColor: theme.colors.border }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ backgroundColor: theme.colors.secondary, color: theme.colors.text }}
            >
              {stock.symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: theme.colors.text }}>{stock.symbol}</p>
              <p className="text-[10px] truncate" style={{ color: theme.colors.muted }}>{stock.name}</p>
            </div>
            <MiniChart up={stock.up} color={stock.up ? theme.colors.success : theme.colors.error} />
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-semibold" style={{ color: theme.colors.text, fontVariantNumeric: "tabular-nums" }}>
                {stock.price}
              </p>
              <p
                className="text-[10px] font-medium"
                style={{ color: stock.up ? theme.colors.success : theme.colors.error, fontVariantNumeric: "tabular-nums" }}
              >
                {stock.change}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom nav */}
      <nav className="flex items-center justify-around py-2 border-t" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
        {[
          { icon: Home, label: "Home", active: true },
          { icon: PieChart, label: "Portfolio", active: false },
          { icon: TrendingUp, label: "Markets", active: false },
          { icon: User, label: "Account", active: false },
        ].map(({ icon: Icon, label, active }) => (
          <button key={label} className="flex flex-col items-center gap-0.5" aria-label={label}>
            <Icon size={18} style={{ color: active ? theme.colors.primary : theme.colors.muted }} aria-hidden="true" />
            <span
              className={`text-[8px] ${active ? "font-medium" : ""}`}
              style={{ color: active ? theme.colors.primary : theme.colors.muted }}
            >
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function MobileMarketScreen() {
  const { theme } = useTheme();

  const indices = [
    { name: "S&P 500", value: "5,218.19", change: "+0.87%", up: true },
    { name: "NASDAQ", value: "16,340.87", change: "+1.14%", up: true },
    { name: "DOW", value: "38,503.69", change: "-0.22%", up: false },
  ];

  const movers = [
    { symbol: "SMCI", change: "+12.4%", up: true },
    { symbol: "AMD", change: "+5.8%", up: true },
    { symbol: "RIVN", change: "-8.3%", up: false },
    { symbol: "PLTR", change: "+3.2%", up: true },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      {/* Gradient header — fades into background */}
      <div className="relative">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 50%, ${theme.colors.background} 100%)`,
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <StatusBar light />
          <div className="px-4 pt-1 pb-4">
            <h1 className="text-lg font-bold text-white">Markets</h1>
          </div>
        </div>
      </div>

      {/* Indices */}
      <div className="flex gap-2 px-4 py-3 overflow-hidden">
        {indices.map((idx) => (
          <div
            key={idx.name}
            className="flex-1 p-2.5 rounded-xl min-w-0"
            style={{ backgroundColor: theme.colors.secondary }}
          >
            <p className="text-[9px] font-medium truncate" style={{ color: theme.colors.muted }}>{idx.name}</p>
            <p className="text-[11px] font-bold mt-0.5" style={{ color: theme.colors.text, fontVariantNumeric: "tabular-nums" }}>
              {idx.value}
            </p>
            <div className="flex items-center gap-0.5 mt-0.5">
              {idx.up ? (
                <ArrowUpRight size={10} aria-hidden="true" style={{ color: theme.colors.success }} />
              ) : (
                <ArrowDownRight size={10} aria-hidden="true" style={{ color: theme.colors.error }} />
              )}
              <span
                className="text-[9px] font-semibold"
                style={{ color: idx.up ? theme.colors.success : theme.colors.error, fontVariantNumeric: "tabular-nums" }}
              >
                {idx.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Top movers */}
      <div className="px-4 pt-1 pb-2">
        <p className="text-xs font-semibold" style={{ color: theme.colors.text }}>Top Movers</p>
      </div>
      <div className="flex gap-2 px-4 pb-3 overflow-hidden">
        {movers.map((m) => (
          <div
            key={m.symbol}
            className="flex-1 p-2 rounded-lg text-center min-w-0"
            style={{
              backgroundColor: m.up ? theme.colors.success + "12" : theme.colors.error + "12",
            }}
          >
            <p className="text-[10px] font-bold" style={{ color: theme.colors.text }}>{m.symbol}</p>
            <p
              className="text-[9px] font-semibold mt-0.5"
              style={{ color: m.up ? theme.colors.success : theme.colors.error, fontVariantNumeric: "tabular-nums" }}
            >
              {m.change}
            </p>
          </div>
        ))}
      </div>

      {/* News */}
      <div className="flex-1 overflow-hidden border-t" style={{ borderColor: theme.colors.border }}>
        <div className="px-4 pt-3 pb-2">
          <p className="text-xs font-semibold" style={{ color: theme.colors.text }}>News</p>
        </div>
        {[
          { title: "Fed Signals Potential Rate Cut in September Meeting", source: "Reuters", time: "32m" },
          { title: "NVIDIA Surpasses $2T Market Cap on AI Demand", source: "Bloomberg", time: "1h" },
          { title: "Tech Earnings Season Kicks Off Strong", source: "CNBC", time: "3h" },
        ].map((news, i) => (
          <article
            key={i}
            className="flex items-start gap-3 px-4 py-2 border-b"
            style={{ borderColor: theme.colors.border }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium leading-snug line-clamp-2" style={{ color: theme.colors.text }}>
                {news.title}
              </p>
              <p className="text-[9px] mt-1" style={{ color: theme.colors.muted }}>
                {news.source} · {news.time}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex-shrink-0"
              style={{ backgroundColor: theme.colors.secondary }}
              aria-hidden="true"
            />
          </article>
        ))}
      </div>

      {/* Bottom nav */}
      <nav className="flex items-center justify-around py-2 border-t" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
        {[
          { icon: Home, label: "Home", active: false },
          { icon: PieChart, label: "Portfolio", active: false },
          { icon: TrendingUp, label: "Markets", active: true },
          { icon: User, label: "Account", active: false },
        ].map(({ icon: Icon, label, active }) => (
          <button key={label} className="flex flex-col items-center gap-0.5" aria-label={label}>
            <Icon size={18} style={{ color: active ? theme.colors.primary : theme.colors.muted }} aria-hidden="true" />
            <span
              className={`text-[8px] ${active ? "font-medium" : ""}`}
              style={{ color: active ? theme.colors.primary : theme.colors.muted }}
            >
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-medium text-muted mb-4 uppercase tracking-widest">{label}</p>
      <div className="relative" style={{ width: 272, height: 556 }}>
        {/* Frame */}
        <div className="absolute inset-0 rounded-[40px] bg-neutral-950 shadow-2xl ring-1 ring-white/10" />
        {/* Screen */}
        <div className="absolute inset-[6px] rounded-[34px] overflow-hidden">
          {children}
        </div>
        {/* Dynamic Island */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-20 h-[22px] bg-neutral-950 rounded-full z-10" />
        {/* Home indicator */}
        <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-24 h-[4px] bg-neutral-700 rounded-full z-10" />
      </div>
    </div>
  );
}

export default function MobilePreview() {
  return (
    <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start lg:justify-center lg:gap-20">
      <PhoneFrame label="Portfolio">
        <MobilePortfolioScreen />
      </PhoneFrame>
      <PhoneFrame label="Markets">
        <MobileMarketScreen />
      </PhoneFrame>
    </div>
  );
}
