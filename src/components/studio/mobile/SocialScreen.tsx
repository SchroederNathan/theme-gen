"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  Home,
  Search,
  PlusSquare,
  User,
  Heart,
  MessageCircle,
  Bookmark,
  Bell,
  Camera,
} from "lucide-react";
import { StatusBar } from "./StatusBar";

function BottomNav() {
  const { theme } = useTheme();
  const tabs = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Search", active: false },
    { icon: PlusSquare, label: "Create", active: false },
    { icon: User, label: "Profile", active: false },
  ];

  return (
    <nav
      className="flex items-center justify-around px-2 pt-2 pb-4 border-t"
      style={{
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
      }}
    >
      {tabs.map(({ icon: Icon, label, active }) => (
        <button
          key={label}
          className="flex flex-col items-center gap-0.5 px-3"
          aria-label={label}
        >
          <Icon
            size={20}
            style={{
              color: active ? theme.colors.primary : theme.colors.muted,
              strokeWidth: active ? 2.5 : 1.8,
            }}
          />
        </button>
      ))}
    </nav>
  );
}

function StoryAvatar({
  initials,
  color,
  isAdd,
}: {
  initials: string;
  color: string;
  isAdd?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-[11px] font-bold"
        style={{
          backgroundColor: isAdd ? theme.colors.container : `${color}22`,
          color: isAdd ? theme.colors.muted : color,
          boxShadow: isAdd
            ? `0 0 0 1.5px ${theme.colors.border}`
            : `0 0 0 2px ${theme.colors.background}, 0 0 0 3.5px ${color}`,
        }}
      >
        {isAdd ? <Camera size={14} style={{ color: theme.colors.muted }} /> : initials}
      </div>
    </div>
  );
}

function PostCard({
  initials,
  name,
  handle,
  body,
  color,
  likes,
  comments,
  isImage,
}: {
  initials: string;
  name: string;
  handle: string;
  body: string;
  color: string;
  likes: number;
  comments: number;
  isImage?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <article
      className="mx-4 mb-3 rounded-2xl overflow-hidden"
      style={{ backgroundColor: theme.colors.container, border: `1px solid ${theme.colors.border}` }}
    >
      {/* Card header */}
      <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
          style={{ backgroundColor: `${color}22`, color }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold truncate" style={{ color: theme.colors.text }}>
            {name}
          </p>
          <p className="text-[9px]" style={{ color: theme.colors.muted }}>
            {handle}
          </p>
        </div>
        <button>
          <Bell size={13} style={{ color: theme.colors.muted }} />
        </button>
      </div>

      {/* Image placeholder or text */}
      {isImage ? (
        <div
          className="mx-3 mb-2.5 h-[90px] rounded-xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${color}33 0%, ${theme.colors.accent}22 100%)`,
          }}
        >
          <Camera size={22} style={{ color: `${color}99` }} />
        </div>
      ) : (
        <p
          className="px-3 pb-2.5 text-[10px] leading-relaxed"
          style={{ color: theme.colors.text }}
        >
          {body}
        </p>
      )}

      {/* Actions */}
      <div
        className="flex items-center gap-3 px-3 py-2 border-t"
        style={{ borderColor: theme.colors.border }}
      >
        <button className="flex items-center gap-1">
          <Heart size={13} fill={theme.colors.primary} style={{ color: theme.colors.primary }} />
          <span className="text-[9px] font-semibold" style={{ color: theme.colors.muted }}>
            {likes}
          </span>
        </button>
        <button className="flex items-center gap-1">
          <MessageCircle size={13} style={{ color: theme.colors.muted }} />
          <span className="text-[9px] font-semibold" style={{ color: theme.colors.muted }}>
            {comments}
          </span>
        </button>
        <div className="flex-1" />
        <button>
          <Bookmark size={13} style={{ color: theme.colors.muted }} />
        </button>
      </div>
    </article>
  );
}

export function SocialScreen() {
  const { theme } = useTheme();

  const stories = [
    { initials: "NK", color: theme.colors.primary },
    { initials: "AB", color: theme.colors.accent },
    { initials: "SC", color: theme.colors.success },
    { initials: "MR", color: theme.colors.warning },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
    >
      <StatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-1 pb-2">
        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-bold tracking-tight" style={{ color: theme.colors.text }}>
            Feed
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button aria-label="Search">
            <Search size={18} style={{ color: theme.colors.muted }} />
          </button>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{ backgroundColor: theme.colors.primary, color: theme.colors.onPrimary }}
          >
            N
          </div>
        </div>
      </div>

      {/* Stories / Avatars */}
      <div className="flex items-center gap-3 px-4 pb-3 overflow-hidden">
        <StoryAvatar initials="+" color={theme.colors.primary} isAdd />
        {stories.map((s) => (
          <StoryAvatar key={s.initials} initials={s.initials} color={s.color} />
        ))}
      </div>

      {/* Input / Compose bar */}
      <div className="flex items-center gap-2.5 mx-4 mb-3">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-full"
          style={{
            backgroundColor: theme.colors.container,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <span className="text-[10px]" style={{ color: theme.colors.muted }}>
            What&apos;s on your mind?
          </span>
        </div>
        <button
          className="px-3 py-2 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.onPrimary }}
        >
          Post
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-hidden">
        <PostCard
          initials="AB"
          name="Alex B."
          handle="@alexb · 2h"
          body="Just shipped the new design system — dark mode, semantic tokens, and a full component library. So satisfying to see it all come together 🎨"
          color={theme.colors.accent}
          likes={142}
          comments={18}
        />
        <PostCard
          initials="SC"
          name="Sam C."
          handle="@samc · 5h"
          body="Golden hour hits different 🌅"
          color={theme.colors.success}
          likes={87}
          comments={6}
          isImage
        />

        {/* Secondary CTA button */}
        <div className="mx-4 mt-1">
          <button
            className="w-full py-2 rounded-full text-[10px] font-semibold"
            style={{
              backgroundColor: theme.colors.container,
              color: theme.colors.primary,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            Load more posts
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
