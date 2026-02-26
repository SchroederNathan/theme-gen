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
  Camera,
  Plus,
} from "lucide-react";

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 py-1.5 text-[10px] font-semibold" style={{ color: "var(--color-text)" }}>
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <Signal size={10} />
        <Wifi size={10} />
        <Battery size={12} />
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
      <StatusBar />

      {/* App header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: theme.colors.border }}>
        <h1 className="text-lg font-bold" style={{ color: theme.colors.text }}>Feed</h1>
        <div className="flex items-center gap-3">
          <Search size={18} style={{ color: theme.colors.muted }} />
          <Bell size={18} style={{ color: theme.colors.muted }} />
        </div>
      </div>

      {/* Stories row */}
      <div className="flex gap-3 px-4 py-3 border-b overflow-hidden" style={{ borderColor: theme.colors.border }}>
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed" style={{ borderColor: theme.colors.muted }}>
            <Plus size={16} style={{ color: theme.colors.muted }} />
          </div>
          <span className="text-[9px]" style={{ color: theme.colors.muted }}>Your story</span>
        </div>
        {["JD", "MK", "TP", "LW"].map((initials, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-offset-1"
              style={{
                backgroundColor: i % 2 === 0 ? theme.colors.primary : theme.colors.accent,
                color: i % 2 === 0 ? theme.colors.onPrimary : theme.colors.onAccent,
                ["--tw-ring-color" as string]: i % 2 === 0 ? theme.colors.primary : theme.colors.accent,
                ["--tw-ring-offset-color" as string]: theme.colors.background,
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
          <div key={i} className="px-4 py-3 border-b" style={{ borderColor: theme.colors.border }}>
            <div className="flex gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  backgroundColor: i === 0 ? theme.colors.primary : theme.colors.accent,
                  color: i === 0 ? theme.colors.onPrimary : theme.colors.onAccent,
                }}
              >
                {item.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold" style={{ color: theme.colors.text }}>{item.user}</span>
                  <span className="text-[10px]" style={{ color: theme.colors.muted }}>{item.handle} · {item.time}</span>
                </div>
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: theme.colors.text }}>{item.text}</p>
                <div className="flex items-center gap-5 mt-2">
                  <button className="flex items-center gap-1 text-[10px]" style={{ color: theme.colors.muted }}>
                    <Heart size={12} /> {item.likes}
                  </button>
                  <button className="flex items-center gap-1 text-[10px]" style={{ color: theme.colors.muted }}>
                    <MessageCircle size={12} /> {item.comments}
                  </button>
                  <button className="flex items-center gap-1 text-[10px]" style={{ color: theme.colors.muted }}>
                    <Share2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around py-2 border-t" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
        <button className="flex flex-col items-center gap-0.5">
          <Home size={18} style={{ color: theme.colors.primary }} />
          <span className="text-[8px] font-medium" style={{ color: theme.colors.primary }}>Home</span>
        </button>
        <button className="flex flex-col items-center gap-0.5">
          <Search size={18} style={{ color: theme.colors.muted }} />
          <span className="text-[8px]" style={{ color: theme.colors.muted }}>Explore</span>
        </button>
        <button className="flex flex-col items-center gap-0.5">
          <Camera size={18} style={{ color: theme.colors.muted }} />
          <span className="text-[8px]" style={{ color: theme.colors.muted }}>Create</span>
        </button>
        <button className="flex flex-col items-center gap-0.5">
          <Bell size={18} style={{ color: theme.colors.muted }} />
          <span className="text-[8px]" style={{ color: theme.colors.muted }}>Alerts</span>
        </button>
        <button className="flex flex-col items-center gap-0.5">
          <User size={18} style={{ color: theme.colors.muted }} />
          <span className="text-[8px]" style={{ color: theme.colors.muted }}>Profile</span>
        </button>
      </div>
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
      <StatusBar />

      {/* Nav bar */}
      <div className="px-4 py-3" style={{ backgroundColor: theme.colors.background }}>
        <h1 className="text-lg font-bold" style={{ color: theme.colors.text }}>Settings</h1>
      </div>

      {/* Profile card */}
      <div className="mx-4 mt-3 p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: theme.colors.background }}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.onPrimary }}
        >
          SC
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: theme.colors.text }}>Sarah Chen</p>
          <p className="text-[11px]" style={{ color: theme.colors.muted }}>Premium Member</p>
        </div>
        <ChevronRight size={16} style={{ color: theme.colors.muted }} />
      </div>

      {/* Settings groups */}
      <div className="flex-1 overflow-hidden mt-2">
        {settingsGroups.map((group, gi) => (
          <div key={gi} className="mt-3">
            <p className="px-4 text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: theme.colors.muted }}>
              {group.title}
            </p>
            <div className="mx-4 rounded-xl overflow-hidden" style={{ backgroundColor: theme.colors.background }}>
              {group.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5"
                  style={{
                    borderTop: i > 0 ? `1px solid ${theme.colors.border}` : undefined,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: theme.colors.primary + "18" }}
                  >
                    <item.icon size={14} style={{ color: theme.colors.primary }} />
                  </div>
                  <span className="flex-1 text-xs" style={{ color: theme.colors.text }}>{item.label}</span>
                  <span className="text-[10px]" style={{ color: theme.colors.muted }}>{item.detail}</span>
                  <ChevronRight size={14} style={{ color: theme.colors.muted }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sign out button */}
      <div className="px-4 pb-3">
        <button
          className="w-full py-2 rounded-xl text-xs font-semibold"
          style={{ backgroundColor: theme.colors.error + "15", color: theme.colors.error }}
        >
          Sign Out
        </button>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around py-2 border-t" style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.background }}>
        <button className="flex flex-col items-center gap-0.5">
          <Home size={18} style={{ color: theme.colors.muted }} />
          <span className="text-[8px]" style={{ color: theme.colors.muted }}>Home</span>
        </button>
        <button className="flex flex-col items-center gap-0.5">
          <Search size={18} style={{ color: theme.colors.muted }} />
          <span className="text-[8px]" style={{ color: theme.colors.muted }}>Explore</span>
        </button>
        <button className="flex flex-col items-center gap-0.5">
          <Settings size={18} style={{ color: theme.colors.primary }} />
          <span className="text-[8px] font-medium" style={{ color: theme.colors.primary }}>Settings</span>
        </button>
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 280, height: 572 }}>
      {/* Outer frame */}
      <div className="absolute inset-0 rounded-[40px] bg-neutral-900 shadow-2xl" />
      {/* Screen */}
      <div className="absolute inset-[8px] rounded-[32px] overflow-hidden">
        {children}
      </div>
      {/* Notch */}
      <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-24 h-5 bg-neutral-900 rounded-b-2xl z-10" />
      {/* Home indicator */}
      <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 w-24 h-1 bg-neutral-700 rounded-full z-10" />
    </div>
  );
}

export default function MobilePreview() {
  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-12">
      <div>
        <p data-color="muted" className="text-center text-xs font-medium text-muted mb-3 uppercase tracking-wider">Social Feed</p>
        <PhoneFrame>
          <MobileHomeScreen />
        </PhoneFrame>
      </div>
      <div>
        <p data-color="muted" className="text-center text-xs font-medium text-muted mb-3 uppercase tracking-wider">Settings</p>
        <PhoneFrame>
          <MobileSettingsScreen />
        </PhoneFrame>
      </div>
    </div>
  );
}
