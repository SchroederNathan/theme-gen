"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  starterThemes,
  starterCategories,
  StarterThemeCategory,
  StarterTheme,
} from "@/lib/starterThemes";
import { Sparkles, ArrowRight, X, Sun, Moon } from "lucide-react";

interface StarterThemeGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

function ThemeCard({
  starter,
  onApply,
}: {
  starter: StarterTheme;
  onApply: (s: StarterTheme) => void;
}) {
  const { text, background, primary, container, accent } =
    starter.theme.colors;

  return (
    <button
      onClick={() => onApply(starter)}
      className="group text-left rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-neutral-300"
    >
      {/* Color preview strip */}
      <div className="relative h-28 overflow-hidden">
        {/* Background fill */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: background }}
        />
        {/* Mock UI elements */}
        <div className="absolute inset-0 p-3.5 flex flex-col gap-2">
          {/* Nav bar mock */}
          <div className="flex items-center justify-between">
            <div
              className="w-16 h-2 rounded-full"
              style={{ backgroundColor: text, opacity: 0.8 }}
            />
            <div className="flex gap-1.5">
              <div
                className="w-8 h-2 rounded-full"
                style={{ backgroundColor: text, opacity: 0.3 }}
              />
              <div
                className="w-8 h-2 rounded-full"
                style={{ backgroundColor: text, opacity: 0.3 }}
              />
            </div>
          </div>
          {/* Hero mock */}
          <div className="flex-1 flex gap-2.5 mt-1">
            <div className="flex-1 flex flex-col gap-1.5 justify-center">
              <div
                className="w-full h-2.5 rounded-full"
                style={{ backgroundColor: text, opacity: 0.7 }}
              />
              <div
                className="w-3/4 h-2.5 rounded-full"
                style={{ backgroundColor: text, opacity: 0.5 }}
              />
              <div
                className="w-16 h-5 rounded-md mt-1"
                style={{ backgroundColor: primary }}
              />
            </div>
            <div
              className="w-20 rounded-lg shrink-0"
              style={{ backgroundColor: container }}
            >
              <div className="p-2 flex flex-col gap-1">
                <div
                  className="w-full h-1.5 rounded-full"
                  style={{ backgroundColor: accent, opacity: 0.6 }}
                />
                <div
                  className="w-3/4 h-1.5 rounded-full"
                  style={{ backgroundColor: text, opacity: 0.2 }}
                />
                <div
                  className="w-full h-1.5 rounded-full"
                  style={{ backgroundColor: text, opacity: 0.2 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-3.5 py-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-neutral-800">
            {starter.name}
          </h3>
          <div className="flex items-center gap-1.5">
            {starter.mode === "dark" ? (
              <Moon size={11} className="text-neutral-400" />
            ) : (
              <Sun size={11} className="text-neutral-400" />
            )}
            <span className="text-[10px] text-neutral-400 capitalize">
              {starter.mode}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-neutral-500 leading-relaxed mb-2.5">
          {starter.description}
        </p>
        {/* Color swatches */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[background, primary, container, accent, text].map((c, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-neutral-200"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <span className="text-[11px] text-neutral-400 font-medium group-hover:text-neutral-600 transition-colors flex items-center gap-1">
            Apply
            <ArrowRight
              size={11}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </span>
        </div>
      </div>
    </button>
  );
}

export function StarterThemeGallery({
  isOpen,
  onClose,
}: StarterThemeGalleryProps) {
  const { pushHistory, setTheme: setThemeContext } = useTheme();
  const [activeCategory, setActiveCategory] =
    useState<StarterThemeCategory | null>(null);

  if (!isOpen) return null;

  const filtered = activeCategory
    ? starterThemes.filter((s) => s.category === activeCategory)
    : starterThemes;

  const handleApply = (starter: StarterTheme) => {
    pushHistory();
    setThemeContext(starter.mode, starter.theme.colors);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-neutral-50 border border-neutral-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-neutral-700" />
            <h2 className="text-sm font-semibold text-neutral-800">
              Starter Themes
            </h2>
            <span className="px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-600 text-[10px] font-semibold">
              {starterThemes.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Category chips */}
        <div className="px-5 py-3 border-b border-neutral-100 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeCategory === null
                ? "bg-neutral-800 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            All
          </button>
          {starterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-neutral-800 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Theme grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((starter) => (
              <ThemeCard
                key={starter.id}
                starter={starter}
                onApply={handleApply}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-neutral-500">
                No themes in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
