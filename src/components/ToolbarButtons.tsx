import {
  Bookmark,
  Check,
  ChevronUp,
  Copy,
  Download,
  FileDown,
  Link2,
  Moon,
  Redo2,
  Shuffle,
  Sparkles,
  Sun,
  Undo2,
} from "lucide-react";
import { useEffect, useReducer, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/lib/themes";
import { tooltipReducer, initialTooltipState } from "./theme-customizer-reducers";
import { HarmonyMode } from "@/lib/colorUtils";

interface ContrastAuditItem {
  id: string;
  label: string;
  ratio: number;
  pass: boolean;
  required: boolean;
}

interface ToolbarButtonsProps {
  isCompact: boolean;
  canUndo: boolean;
  canRedo: boolean;
  themeName: string;
  currentContrastAudit: ContrastAuditItem[];
  requiredContrastPassCount: number;
  requiredContrastAuditLength: number;
  harmonyMode: HarmonyMode;
  onHarmonyModeChange: (mode: HarmonyMode) => void;
  savedThemesCount: number;
  onUndo: () => void;
  onRedo: () => void;
  onSmartShuffle: () => void;
  onToggleTheme: () => void;
  onExportClick: () => void;
  onSavedThemesClick: () => void;
}

export function ToolbarButtons({
  isCompact,
  canUndo,
  canRedo,
  themeName,
  currentContrastAudit,
  requiredContrastPassCount,
  requiredContrastAuditLength,
  harmonyMode,
  onHarmonyModeChange,
  savedThemesCount,
  onUndo,
  onRedo,
  onSmartShuffle,
  onToggleTheme,
  onExportClick,
  onSavedThemesClick,
}: ToolbarButtonsProps) {
  const [tooltipState, dispatchTooltip] = useReducer(tooltipReducer, initialTooltipState);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!tooltipState.harmonyDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        dispatchTooltip({ type: 'CLOSE_HARMONY_DROPDOWN' });
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [tooltipState.harmonyDropdownOpen]);

  const harmonyOptions: { value: HarmonyMode; label: string; description: string }[] = [
    { value: "complementary",       label: "Complementary",       description: "Opposite hues (180°) — high contrast & vibrant" },
    { value: "analogous",           label: "Analogous",           description: "Adjacent hues (30°) — cohesive & harmonious" },
    { value: "triadic",             label: "Triadic",             description: "Equidistant hues (120°) — balanced & rich" },
    { value: "split-complementary", label: "Split-Complementary", description: "Near-opposite hues (150°) — softer contrast" },
    { value: "tetradic",            label: "Tetradic",            description: "Square hues (90°) — complex & bold" },
    { value: "monochromatic",       label: "Monochromatic",       description: "Single hue — minimal & refined" },
  ];

  return (
    <div
      className={`flex flex-row gap-1 items-center justify-center ${
        isCompact ? "h-12" : "h-full"
      }`}
    >
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center ${!canUndo ? "opacity-30 pointer-events-none" : ""}`}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={16} className="text-neutral-800" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center ${!canRedo ? "opacity-30 pointer-events-none" : ""}`}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 size={16} className="text-neutral-800" />
      </button>

      {/* Split-button: Shuffle + Harmony dropdown */}
      <div className="relative flex items-center h-full" ref={dropdownRef}>
        <div className="flex items-center h-full rounded-md">
          <button
            onClick={onSmartShuffle}
            className="p-2 h-full rounded-l-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center"
            onMouseEnter={() => {
              if (!tooltipState.harmonyDropdownOpen) {
                dispatchTooltip({ type: 'SHOW_RANDOMIZE_TOOLTIP', payload: true });
              }
            }}
            onMouseLeave={() => dispatchTooltip({ type: 'SHOW_RANDOMIZE_TOOLTIP', payload: false })}
          >
            <Shuffle size={16} className="text-neutral-800" />
          </button>
          <div className="w-px h-4 bg-neutral-200" />
          <button
            onClick={() => dispatchTooltip({ type: 'TOGGLE_HARMONY_DROPDOWN' })}
            className="px-1 h-full rounded-r-md hover:bg-neutral-200 transition-colors flex items-center justify-center"
          >
            <ChevronUp size={12} className="text-neutral-800" />
          </button>
        </div>

        {/* Tooltip — only when dropdown is closed */}
        {tooltipState.showRandomizeTooltip && !tooltipState.harmonyDropdownOpen && (
          <div
            role="tooltip"
            className="absolute bottom-4 z-100 inline-block px-3 py-2 text-sm font-medium text-neutral-800 border border-neutral-200 transition-opacity duration-300 bg-neutral-50 shadow-sm rounded-lg tooltip min-w-[144px] text-center"
            style={{
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: "8px",
            }}
          >
            <div className="flex items-center justify-center gap-2 font-semibold">
              Smart Shuffle
              <Sparkles size={16} className="text-neutral-800" />
            </div>
            <p className="mt-1 text-[11px] text-neutral-600">
              Accessibility checks: {requiredContrastPassCount}/
              {requiredContrastAuditLength} passing
            </p>
            <ul className="mt-2 space-y-1 text-left text-[11px] max-h-44 overflow-auto pr-1">
              {currentContrastAudit.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-2"
                >
                  <span
                    className={
                      item.pass ? "text-emerald-700" : "text-red-700"
                    }
                  >
                    {item.label}
                  </span>
                  <span className="font-semibold text-neutral-800">
                    {item.ratio.toFixed(1)}:1
                  </span>
                </li>
              ))}
            </ul>
            <div className="absolute -bottom-1 -z-10 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-neutral-50"></div>
          </div>
        )}

        {/* Harmony mode dropdown — opens upward */}
        {tooltipState.harmonyDropdownOpen && (
          <div
            className="absolute z-100 bg-neutral-50 border border-neutral-200 rounded-xl shadow-lg min-w-[260px]"
            style={{
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: "8px",
            }}
          >
            <div className="px-3 pt-3 pb-1">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Color Harmony
              </p>
            </div>
            <div className="pb-2">
              {harmonyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onHarmonyModeChange(option.value);
                    dispatchTooltip({ type: 'CLOSE_HARMONY_DROPDOWN' });
                  }}
                  className={`w-full px-3 py-2 text-left flex items-start justify-between gap-2 transition-colors ${
                    harmonyMode === option.value
                      ? "bg-neutral-100"
                      : "hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex-1">
                    <span className={`text-sm block ${harmonyMode === option.value ? "font-semibold text-neutral-900" : "font-medium text-neutral-700"}`}>
                      {option.label}
                    </span>
                    <span className="text-[11px] text-neutral-400 leading-tight">{option.description}</span>
                  </div>
                  {harmonyMode === option.value && (
                    <Check size={14} className="text-neutral-800 mt-0.5 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-neutral-50 border-r border-b border-neutral-200"></div>
          </div>
        )}
      </div>

      <div className="relative h-full">
        <button
          onClick={onToggleTheme}
          className="p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center"
          onMouseEnter={() => dispatchTooltip({ type: 'SHOW_THEME_TOOLTIP', payload: true })}
          onMouseLeave={() => dispatchTooltip({ type: 'SHOW_THEME_TOOLTIP', payload: false })}
        >
          {themeName === "light" ? (
            <Moon size={16} className="text-neutral-800" />
          ) : (
            <Sun size={16} className="text-neutral-800" />
          )}
        </button>
        {tooltipState.showThemeTooltip && (
          <div
            role="tooltip"
            className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-neutral-800 transition-opacity duration-300 bg-neutral-50 shadow-sm rounded-lg border border-neutral-200 tooltip min-w-[120px] text-center"
            style={{
              bottom: "99%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: "8px",
            }}
          >
            Toggle Theme
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-neutral-50"></div>
          </div>
        )}
      </div>
      <div className="relative h-full">
        <button
          onClick={onSavedThemesClick}
          className="relative p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center"
          title="Saved Themes"
        >
          <Bookmark size={16} className="text-neutral-800" />
          {savedThemesCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-neutral-800 text-white text-[8px] font-bold flex items-center justify-center leading-none">
              {savedThemesCount > 9 ? "9+" : savedThemesCount}
            </span>
          )}
        </button>
      </div>
      {/* Share button */}
      <ShareButton />

      {/* Quick CSS export (download) */}
      <CSSExportButton />

      <div className="relative h-full">
        <button
          onClick={onExportClick}
          className="p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center"
          onMouseEnter={() => dispatchTooltip({ type: 'SHOW_DOWNLOAD_TOOLTIP', payload: true })}
          onMouseLeave={() => dispatchTooltip({ type: 'SHOW_DOWNLOAD_TOOLTIP', payload: false })}
        >
          <Download size={16} className="text-neutral-800" />
        </button>
        {tooltipState.showDownloadTooltip && (
          <div
            role="tooltip"
            className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-neutral-800 transition-opacity duration-300 bg-neutral-50 shadow-sm rounded-lg border border-neutral-200 tooltip min-w-[120px] text-center"
            style={{
              bottom: "99%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: "8px",
            }}
          >
            Export Theme
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-neutral-50"></div>
          </div>
        )}
      </div>
    </div>
  );
}

// Self-contained Share button + popover
function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Populate URL when opening
  const handleOpen = () => {
    setShareUrl(window.location.href);
    setCopied(false);
    setOpen((prev) => !prev);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // fallback: select + execCommand
      inputRef.current?.select();
      document.execCommand("copy");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className={`relative h-full`} ref={popoverRef}>
      <button
        onClick={handleOpen}
        className={`p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center ${open ? "bg-neutral-100" : ""}`}
        title="Share theme"
      >
        <Link2 size={16} className="text-neutral-800" />
      </button>

      {open && (
        <div
          className="absolute z-50 bg-white border border-neutral-200 rounded-xl shadow-lg p-4"
          style={{
            bottom: "calc(100% + 8px)",
            right: 0,
            width: "320px",
          }}
        >
          <p className="text-sm font-semibold text-neutral-900 mb-1">Share this theme</p>
          <p className="text-xs text-neutral-500 mb-3">
            Anyone with this link will see your exact palette.
          </p>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              readOnly
              value={shareUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 min-w-0 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-300 truncate"
            />
            <button
              onClick={handleCopy}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                copied
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-neutral-900 text-white hover:bg-neutral-700"
              }`}
            >
              {copied ? (
                <>
                  <Check size={13} strokeWidth={2.5} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy
                </>
              )}
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-4 rotate-45 w-3 h-3 bg-white border-r border-b border-neutral-200" />
        </div>
      )}
    </div>
  );
}

// Self-contained CSS export button — downloads theme as .css file
function CSSExportButton() {
  const { theme, themeName } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  const getColorsForMode = (mode: "light" | "dark"): Record<string, string> => {
    if (mode === themeName) return theme.colors as Record<string, string>;
    const saved = JSON.parse(localStorage.getItem("customThemes") || "{}");
    if (saved[mode]) return saved[mode].colors;
    return themes[mode].colors as Record<string, string>;
  };

  const handleExport = () => {
    const light = getColorsForMode("light");
    const dark = getColorsForMode("dark");

    const cssVars = (colors: Record<string, string>, indent: string) =>
      Object.entries(colors)
        .map(([k, v]) => `${indent}--${k}: ${v};`)
        .join("\n");

    const css = `/* Generated by theme-gen */\n:root {\n${cssVars(light, "  ")}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${cssVars(dark, "    ")}\n  }\n}\n`;

    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theme-${Date.now()}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative h-full">
      <button
        onClick={handleExport}
        className="p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center"
        title="Export CSS"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FileDown size={16} className="text-neutral-800" />
      </button>
      {showTooltip && (
        <div
          role="tooltip"
          className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-neutral-800 transition-opacity duration-300 bg-neutral-50 shadow-sm rounded-lg border border-neutral-200 tooltip min-w-[120px] text-center"
          style={{
            bottom: "99%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
          }}
        >
          Export CSS
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-neutral-50"></div>
        </div>
      )}
    </div>
  );
}
