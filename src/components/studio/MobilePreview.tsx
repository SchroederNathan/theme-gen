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
  MoreHorizontal,
  BarChart3,
} from "lucide-react";

function StatusBar({ light }: { light?: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-6 pt-2 pb-1 text-[10px] font-semibold relative z-10"
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

  const transactions = [
    { label: "AAPL · Buy", detail: "Today, 2:34 PM", amount: "-$189.84", positive: false },
    { label: "Dividend · MSFT", detail: "Today, 9:00 AM", amount: "+$12.50", positive: true },
    { label: "TSLA · Sell", detail: "Yesterday", amount: "+$248.42", positive: true },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      {/* Full gradient top area */}
      <div className="relative flex-shrink-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
            maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
        <StatusBar light />

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <User size={14} className="text-white" aria-hidden="true" />
          </div>
          <div
            className="flex-1 mx-3 h-8 rounded-full flex items-center gap-2 px-3"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <Search size={12} className="text-white/60" aria-hidden="true" />
            <span className="text-[10px] text-white/50">Search</span>
          </div>
          <button aria-label="Analytics">
            <BarChart3 size={18} className="text-white/80" />
          </button>
        </div>

        {/* Balance area */}
        <div className="text-center px-5 pt-4 pb-6">
          <p className="text-[10px] text-white/50 font-medium tracking-wide">Personal · All Accounts</p>
          <p className="text-[32px] font-bold text-white mt-1" style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
            $48,291<span className="text-[20px] text-white/70">.57</span>
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <ArrowUpRight size={12} className="text-white/80" aria-hidden="true" />
            <span className="text-[10px] text-white/70 font-medium">+$1,243.80 (2.64%) today</span>
          </div>
          <button
            className="mt-3 px-4 py-1.5 rounded-full text-[10px] font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
          >
            Accounts
          </button>
          {/* Dots */}
          <div className="flex items-center justify-center gap-1 mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center justify-around px-8 pb-6">
          {[
            { icon: Plus, label: "Add money" },
            { icon: Send, label: "Move" },
            { icon: CreditCard, label: "Details" },
            { icon: MoreHorizontal, label: "More" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="flex flex-col items-center gap-1.5" aria-label={label}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <Icon size={16} className="text-white" aria-hidden="true" />
              </div>
              <span className="text-[8px] text-white/60 font-medium">{label}</span>
            </button>
          ))}
        </div>
        </div>{/* close relative z-10 */}
      </div>

      {/* Transaction sheet */}
      <div
        className="flex-1 -mt-3 rounded-t-2xl overflow-hidden"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="pt-4 px-5">
          {transactions.map((tx, i) => (
            <article
              key={i}
              className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: i < transactions.length - 1 ? `1px solid ${theme.colors.border}` : undefined }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme.colors.secondary }}
              >
                <TrendingUp size={13} aria-hidden="true" style={{ color: theme.colors.primary }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold truncate" style={{ color: theme.colors.text }}>{tx.label}</p>
                <p className="text-[9px]" style={{ color: theme.colors.muted }}>{tx.detail}</p>
              </div>
              <p
                className="text-[11px] font-semibold flex-shrink-0"
                style={{
                  color: tx.positive ? theme.colors.success : theme.colors.text,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {tx.amount}
              </p>
            </article>
          ))}
          <button className="w-full text-center py-2.5">
            <span className="text-[10px] font-semibold" style={{ color: theme.colors.primary }}>See all</span>
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <nav
        className="flex items-center justify-around pt-2 pb-4 border-t"
        style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}
      >
        {[
          { icon: Home, label: "Home", active: true },
          { icon: PieChart, label: "Invest", active: false },
          { icon: Send, label: "Payments", active: false },
          { icon: CreditCard, label: "Cards", active: false },
          { icon: User, label: "Profile", active: false },
        ].map(({ icon: Icon, label, active }) => (
          <button key={label} className="flex flex-col items-center gap-0.5" aria-label={label}>
            <Icon size={16} style={{ color: active ? theme.colors.primary : theme.colors.muted }} aria-hidden="true" />
            <span
              className={`text-[7px] ${active ? "font-semibold" : ""}`}
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

  const holdings = [
    { symbol: "AAPL", name: "Apple Inc.", price: "$189.84", change: "+2.34%", up: true },
    { symbol: "TSLA", name: "Tesla Inc.", price: "$248.42", change: "-1.12%", up: false },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: "$875.28", change: "+4.67%", up: true },
    { symbol: "MSFT", name: "Microsoft", price: "$378.91", change: "+0.89%", up: true },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      {/* Gradient top */}
      <div className="relative flex-shrink-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
            maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
        <StatusBar light />
        <div className="px-5 pt-3 pb-5">
          <h1 className="text-[17px] font-bold text-white">Markets</h1>
          <p className="text-[10px] text-white/50 mt-0.5">Live prices</p>
        </div>

        {/* Index cards on gradient */}
        <div className="flex gap-2 px-5 pb-6">
          {[
            { name: "S&P 500", value: "5,218", change: "+0.87%", up: true },
            { name: "NASDAQ", value: "16,340", change: "+1.14%", up: true },
            { name: "DOW", value: "38,503", change: "-0.22%", up: false },
          ].map((idx) => (
            <div
              key={idx.name}
              className="flex-1 p-2.5 rounded-xl min-w-0"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <p className="text-[8px] font-medium truncate text-white/50">{idx.name}</p>
              <p className="text-[11px] font-bold text-white mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                {idx.value}
              </p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {idx.up ? (
                  <ArrowUpRight size={8} className="text-green-300" aria-hidden="true" />
                ) : (
                  <ArrowDownRight size={8} className="text-red-300" aria-hidden="true" />
                )}
                <span
                  className="text-[8px] font-semibold"
                  style={{ color: idx.up ? "#86efac" : "#fca5a5", fontVariantNumeric: "tabular-nums" }}
                >
                  {idx.change}
                </span>
              </div>
            </div>
          ))}
        </div>
        </div>{/* close relative z-10 */}
      </div>

      {/* Watchlist sheet */}
      <div
        className="flex-1 -mt-3 rounded-t-2xl overflow-hidden"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <p className="text-[12px] font-bold" style={{ color: theme.colors.text }}>Watchlist</p>
          <button aria-label="Search stocks">
            <Search size={14} aria-hidden="true" style={{ color: theme.colors.muted }} />
          </button>
        </div>
        {holdings.map((stock, i) => (
          <article
            key={stock.symbol}
            className="flex items-center gap-2.5 px-5 py-2"
            style={{ borderBottom: i < holdings.length - 1 ? `1px solid ${theme.colors.border}` : undefined }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ backgroundColor: theme.colors.secondary, color: theme.colors.text }}
            >
              {stock.symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold truncate" style={{ color: theme.colors.text }}>{stock.symbol}</p>
              <p className="text-[9px] truncate" style={{ color: theme.colors.muted }}>{stock.name}</p>
            </div>
            <MiniChart up={stock.up} color={stock.up ? theme.colors.success : theme.colors.error} />
            <div className="text-right flex-shrink-0">
              <p className="text-[11px] font-semibold" style={{ color: theme.colors.text, fontVariantNumeric: "tabular-nums" }}>
                {stock.price}
              </p>
              <p
                className="text-[9px] font-medium"
                style={{ color: stock.up ? theme.colors.success : theme.colors.error, fontVariantNumeric: "tabular-nums" }}
              >
                {stock.change}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom nav */}
      <nav
        className="flex items-center justify-around pt-2 pb-4 border-t"
        style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}
      >
        {[
          { icon: Home, label: "Home", active: false },
          { icon: PieChart, label: "Invest", active: false },
          { icon: TrendingUp, label: "Markets", active: true },
          { icon: CreditCard, label: "Cards", active: false },
          { icon: User, label: "Profile", active: false },
        ].map(({ icon: Icon, label, active }) => (
          <button key={label} className="flex flex-col items-center gap-0.5" aria-label={label}>
            <Icon size={16} style={{ color: active ? theme.colors.primary : theme.colors.muted }} aria-hidden="true" />
            <span
              className={`text-[7px] ${active ? "font-semibold" : ""}`}
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
      <div className="relative" style={{ width: 280, height: 572 }}>
        {/* Frame */}
        <div className="absolute inset-0 rounded-[44px] bg-neutral-950 shadow-2xl ring-1 ring-white/10" />
        {/* Screen */}
        <div className="absolute inset-[6px] rounded-[38px] overflow-hidden">
          {children}
        </div>
        {/* Dynamic Island */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[76px] h-[22px] bg-neutral-950 rounded-full z-10" />
        {/* Home indicator */}
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
