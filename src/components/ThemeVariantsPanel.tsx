"use client";

import { useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import { generateThemeVariants, ThemeVariant } from "@/lib/themeVariants";
import { getContrastRatio } from "@/lib/colorUtils";
import { X, Layers, Check, ArrowRight } from "lucide-react";

interface ThemeVariantsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PREVIEW_PAIRS: { fg: string; bg: string; label: string; min: number }[] = [
  { fg: "text", bg: "background", label: "Text / Bg", min: 7 },
  { fg: "primary", bg: "background", label: "Primary / Bg", min: 3 },
  { fg: "accent", bg: "background", label: "Accent / Bg", min: 3 },
];

function MiniPreview({ colors }: { colors: Record<string, string> }) {
  return (
    <div
      className="rounded-lg border border-neutral-200/60 overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Nav bar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-b"
        style={{ borderColor: colors.border }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="h-1.5 rounded-full flex-1"
          style={{ backgroundColor: colors.muted, opacity: 0.4 }}
        />
        <div
          className="h-1.5 w-8 rounded-full"
          style={{ backgroundColor: colors.accent }}
        />
      </div>

      {/* Content area */}
      <div className="p-3 space-y-2">
        {/* Heading */}
        <div
          className="h-2 w-3/4 rounded-sm"
          style={{ backgroundColor: colors.text }}
        />
        <div
          className="h-1.5 w-full rounded-sm"
          style={{ backgroundColor: colors.muted, opacity: 0.5 }}
        />
        <div
          className="h-1.5 w-5/6 rounded-sm"
          style={{ backgroundColor: colors.muted, opacity: 0.5 }}
        />

        {/* Card */}
        <div
          className="rounded-md p-2 mt-1"
          style={{ backgroundColor: colors.container }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 flex-1 rounded-sm"
              style={{ backgroundColor: colors.text, opacity: 0.7 }}
            />
            <div
              className="px-2 py-0.5 rounded text-[7px] font-bold"
              style={{
                backgroundColor: colors.accent,
                color: colors.onAccent,
              }}
            >
              Tag
            </div>
          </div>
        </div>

        {/* Button row */}
        <div className="flex gap-1.5 pt-0.5">
          <div
            className="px-2 py-1 rounded text-[7px] font-bold"
            style={{
              backgroundColor: colors.primary,
              color: colors.onPrimary,
            }}
          >
            Button
          </div>
          <div
            className="px-2 py-1 rounded text-[7px] font-bold border"
            style={{
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            Secondary
          </div>
        </div>
      </div>
    </div>
  );
}

function ContrastBadge({ ratio, min }: { ratio: number; min: number }) {
  const pass = ratio >= min;
  return (
    <span
      className={`text-[10px] font-semibold px-1 py-0.5 rounded ${
        pass
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {ratio.toFixed(1)}:1
    </span>
  );
}

function VariantCard({
  variant,
  onApply,
}: {
  variant: ThemeVariant;
  onApply: () => void;
}) {
  const contrastChecks = PREVIEW_PAIRS.map((pair) => ({
    ...pair,
    ratio: getContrastRatio(variant.colors[pair.fg], variant.colors[pair.bg]),
  }));
  const allPass = contrastChecks.every((c) => c.ratio >= c.min);

  return (
    <div className="flex flex-col gap-2.5">
      {/* Title + apply */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-800 flex items-center gap-1.5">
            {variant.name}
            {allPass && (
              <Check
                size={12}
                className="text-emerald-600"
                strokeWidth={3}
              />
            )}
          </h3>
          <p className="text-[11px] text-neutral-500">{variant.description}</p>
        </div>
        <button
          onClick={onApply}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors"
        >
          Apply
          <ArrowRight size={11} />
        </button>
      </div>

      {/* Mini preview */}
      <MiniPreview colors={variant.colors} />

      {/* Contrast scores */}
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {contrastChecks.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-1 text-[11px] text-neutral-600"
          >
            <span>{c.label}</span>
            <ContrastBadge ratio={c.ratio} min={c.min} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThemeVariantsPanel({
  isOpen,
  onClose,
}: ThemeVariantsPanelProps) {
  const { theme, themeName, pushHistory, updateThemeProperty } = useTheme();

  const variants = useMemo(() => {
    if (!isOpen) return [];
    return generateThemeVariants(
      theme.colors as Record<string, string>,
      themeName === "dark"
    );
  }, [isOpen, theme.colors, themeName]);

  if (!isOpen) return null;

  const applyVariant = (variant: ThemeVariant) => {
    pushHistory();
    Object.entries(variant.colors).forEach(([key, value]) => {
      updateThemeProperty(["colors", key], value);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-3xl bg-neutral-50 border border-neutral-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-neutral-700" />
            <h2 className="text-sm font-semibold text-neutral-800">
              Compare Variants
            </h2>
            <span className="px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-600 text-[10px] font-semibold">
              3
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Variants grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {variants.map((variant) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                onApply={() => applyVariant(variant)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
