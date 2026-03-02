import { useTheme } from "@/context/ThemeContext";
import { hexToRgb, rgbToHsl } from "@/lib/colorUtils";
import {
  Check,
  Copy,
  Download,
  Link2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Tab = "css" | "tailwind" | "json";

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportPanel({ isOpen, onClose }: ExportPanelProps) {
  const { theme, themeName } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("css");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Animate in after mount
  useEffect(() => {
    if (isOpen) {
      // Force a frame so the browser paints the off-screen position first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      // Delay to avoid the opening click from immediately closing
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handler);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handler);
      };
    }
  }, [isOpen, onClose]);

  const colors = theme.colors as Record<string, string>;

  const formatHex = (hex: string) => hex;
  const formatRgb = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${r}, ${g}, ${b})`;
  };
  const formatHsl = (hex: string) => {
    const { h, s, l } = rgbToHsl(hexToRgb(hex));
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  // ── CSS Variables output ──────────────────────────────
  const generateCSS = useCallback(() => {
    const lines = Object.entries(colors)
      .map(([key, value]) => `  --${key}: ${formatHex(value)};`)
      .join("\n");
    return `:root {\n${lines}\n}`;
  }, [colors]);

  // ── Tailwind config output ────────────────────────────
  const generateTailwind = useCallback(() => {
    const entries = Object.entries(colors)
      .map(([key, value]) => `        ${key}: '${formatHex(value)}',`)
      .join("\n");
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${entries}
      }
    }
  }
}`;
  }, [colors]);

  // ── JSON output ───────────────────────────────────────
  const generateJSON = useCallback(() => {
    const payload = {
      name: theme.name,
      mode: themeName,
      colors: Object.fromEntries(
        Object.entries(colors).map(([key, value]) => [
          key,
          {
            hex: formatHex(value),
            rgb: formatRgb(value),
            hsl: formatHsl(value),
          },
        ]),
      ),
    };
    return JSON.stringify(payload, null, 2);
  }, [colors, theme.name, themeName]);

  const getCode = () => {
    switch (activeTab) {
      case "css":
        return generateCSS();
      case "tailwind":
        return generateTailwind();
      case "json":
        return generateJSON();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([generateJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theme-${themeName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  if (!isOpen) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "css", label: "CSS Variables" },
    { id: "tailwind", label: "Tailwind" },
    { id: "json", label: "JSON" },
  ];

  return (
    <div className="fixed inset-0 z-[60]" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`absolute top-0 right-0 h-full w-full max-w-lg bg-neutral-950 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <h2 className="text-base font-semibold text-neutral-100">
            Export Theme
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={shareURL}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-100 transition-colors"
              title="Copy shareable URL"
            >
              {shared ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <Link2 size={14} />
              )}
              {shared ? "Copied!" : "Share"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-neutral-800 transition-colors"
            >
              <X size={18} className="text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCopied(false);
              }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-neutral-100 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div className="flex-1 overflow-auto p-4">
          <div className="relative rounded-lg bg-neutral-900 border border-neutral-800">
            <div className="absolute top-2.5 right-2.5 flex gap-1.5">
              {activeTab === "json" && (
                <button
                  onClick={downloadJSON}
                  className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 transition-colors"
                  title="Download JSON"
                >
                  <Download size={14} className="text-neutral-300" />
                </button>
              )}
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <Copy size={14} className="text-neutral-300" />
                )}
              </button>
            </div>
            <pre className="p-4 pr-20 text-[13px] leading-relaxed text-neutral-300 overflow-auto max-h-[calc(100vh-220px)]">
              <code>{getCode()}</code>
            </pre>
          </div>
        </div>

        {/* Color swatches preview */}
        <div className="px-5 py-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 mb-2.5">Current palette</p>
          <div className="flex gap-1.5">
            {["text", "background", "primary", "secondary", "accent", "success", "error", "warning"].map(
              (key) =>
                colors[key] && (
                  <div key={key} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className="w-full aspect-square rounded-md border border-neutral-800"
                      style={{ backgroundColor: colors[key] }}
                      title={`${key}: ${colors[key]}`}
                    />
                    <span className="text-[9px] text-neutral-600 truncate w-full text-center">
                      {key}
                    </span>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
