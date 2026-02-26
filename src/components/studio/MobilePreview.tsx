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
  Settings,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  Star,
  MapPin,
  Plus,
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

function MobileHomeScreen() {
  const { theme } = useTheme();

  const feedItems = [
    {
      user: "Sarah Chen",
      handle: "@sarachen",
      time: "2h",
      text: "Just shipped the new dashboard redesign! The team really pulled through on this one 🚀",
      likes: 42,
      comments: 8,
      avatar: "SC",
    },
    {
      user: "Alex Rivera",
      handle: "@alexr",
      time: "5h",
      text: "Hot take: dark mode should be the default for every app.",
      likes: 128,
      comments: 34,
      avatar: "AR",
    },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      {/* Gradient header area */}
      <div
        className="relative"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
        }}
      >
        <StatusBar light />
        <div className="flex items-center justify-between px-4 pt-1 pb-4">
          <h1 className="text-lg font-bold text-white">Feed</h1>
          <div className="flex items-center gap-3">
            <button aria-label="Search">
              <Search size={18} className="text-white/80" />
            </button>
            <button aria-label="Notifications">
              <div className="relative">
                <Bell size={18} className="text-white/80" />
                <span
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.colors.error }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stories row */}
      <div className="flex gap-3 px-4 py-3 border-b overflow-hidden" style={{ borderColor: theme.colors.border }}>
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-dashed"
            style={{ borderColor: theme.colors.muted }}
          >
            <Plus size={14} aria-hidden="true" style={{ color: theme.colors.muted }} />
          </div>
          <span className="text-[9px]" style={{ color: theme.colors.muted }}>You</span>
        </div>
        {["JD", "MK", "TP", "LW"].map((initials, i) => (
          <div key={initials} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                backgroundColor: i % 2 === 0 ? theme.colors.primary : theme.colors.accent,
                color: i % 2 === 0 ? theme.colors.onPrimary : theme.colors.onAccent,
                boxShadow: `0 0 0 2px ${theme.colors.background}, 0 0 0 4px ${i % 2 === 0 ? theme.colors.primary : theme.colors.accent}`,
              }}
            >
              {initials}
            </div>
            <span className="text-[9px]" style={{ color: theme.colors.muted }}>Story</span>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-hidden">
        {feedItems.map((item, i) => (
          <article key={i} className="px-4 py-3 border-b" style={{ borderColor: theme.colors.border }}>
            <div className="flex gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{
                  backgroundColor: i === 0 ? theme.colors.primary : theme.colors.accent,
                  color: i === 0 ? theme.colors.onPrimary : theme.colors.onAccent,
                }}
              >
                {item.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-semibold truncate" style={{ color: theme.colors.text }}>
                    {item.user}
                  </span>
                  <span className="text-[10px] flex-shrink-0" style={{ color: theme.colors.muted }}>
                    {item.handle} · {item.time}
                  </span>
                </div>
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: theme.colors.text }}>
                  {item.text}
                </p>
                <div className="flex items-center gap-5 mt-2">
                  <button className="flex items-center gap-1 text-[10px]" style={{ color: theme.colors.muted }} aria-label={`Like, ${item.likes} likes`}>
                    <Heart size={12} aria-hidden="true" /> {item.likes}
                  </button>
                  <button className="flex items-center gap-1 text-[10px]" style={{ color: theme.colors.muted }} aria-label={`Comment, ${item.comments} comments`}>
                    <MessageCircle size={12} aria-hidden="true" /> {item.comments}
                  </button>
                  <button className="flex items-center gap-1 text-[10px]" style={{ color: theme.colors.muted }} aria-label="Share">
                    <Share2 size={12} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom nav */}
      <nav className="flex items-center justify-around py-2 border-t" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
        {[
          { icon: Home, label: "Home", active: true },
          { icon: Search, label: "Explore", active: false },
          { icon: Bell, label: "Alerts", active: false },
          { icon: User, label: "Profile", active: false },
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

function MobileSettingsScreen() {
  const { theme } = useTheme();

  const settingsGroups = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", detail: "Sarah Chen" },
        { icon: Bell, label: "Notifications", detail: "On" },
        { icon: MapPin, label: "Location", detail: "Windsor, ON" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Star, label: "Appearance", detail: "Auto" },
        { icon: Settings, label: "Privacy", detail: "" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: theme.colors.secondary, color: theme.colors.text }}>
      {/* Gradient header */}
      <div
        className="relative"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
        }}
      >
        <StatusBar light />
        <div className="px-4 pt-1 pb-5">
          <h1 className="text-lg font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Profile card — overlaps the gradient */}
      <div
        className="mx-4 -mt-2 p-3 rounded-xl flex items-center gap-3 shadow-sm relative z-10"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.onPrimary }}
        >
          SC
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: theme.colors.text }}>Sarah Chen</p>
          <p className="text-[11px]" style={{ color: theme.colors.muted }}>Premium Member</p>
        </div>
        <ChevronRight size={16} aria-hidden="true" style={{ color: theme.colors.muted }} />
      </div>

      {/* Settings groups */}
      <div className="flex-1 overflow-hidden mt-3">
        {settingsGroups.map((group) => (
          <div key={group.title} className="mt-2">
            <p className="px-4 text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: theme.colors.muted }}>
              {group.title}
            </p>
            <div className="mx-4 rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: theme.colors.background }}>
              {group.items.map((item, i) => (
                <button
                  key={item.label}
                  className="flex items-center gap-3 px-3 py-2.5 w-full text-left"
                  style={{
                    borderTop: i > 0 ? `1px solid ${theme.colors.border}` : undefined,
                  }}
                  aria-label={`${item.label}${item.detail ? `, ${item.detail}` : ""}`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: theme.colors.primary + "18" }}
                  >
                    <item.icon size={14} aria-hidden="true" style={{ color: theme.colors.primary }} />
                  </div>
                  <span className="flex-1 text-xs truncate" style={{ color: theme.colors.text }}>{item.label}</span>
                  {item.detail && (
                    <span className="text-[10px] flex-shrink-0" style={{ color: theme.colors.muted }}>{item.detail}</span>
                  )}
                  <ChevronRight size={14} aria-hidden="true" style={{ color: theme.colors.muted }} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <div className="px-4 pb-3">
        <button
          className="w-full py-2.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: theme.colors.error + "15", color: theme.colors.error }}
        >
          Sign Out
        </button>
      </div>

      {/* Bottom nav */}
      <nav className="flex items-center justify-around py-2 border-t" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
        {[
          { icon: Home, label: "Home", active: false },
          { icon: Search, label: "Explore", active: false },
          { icon: Settings, label: "Settings", active: true },
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
        {/* Shadow glow */}
        <div
          className="absolute -inset-4 rounded-[52px] blur-2xl opacity-20 motion-safe:animate-pulse"
          style={{ background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))` }}
        />
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
      <PhoneFrame label="Social Feed">
        <MobileHomeScreen />
      </PhoneFrame>
      <PhoneFrame label="Settings">
        <MobileSettingsScreen />
      </PhoneFrame>
    </div>
  );
}
