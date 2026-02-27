"use client";

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import {
  ChevronDown,
  MoreHorizontal,
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  ChevronRight,
} from "lucide-react";
import { StatusBar } from "./StatusBar";

export function PlayerScreen() {
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
      <div className="flex items-center justify-between px-5 pb-3">
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
