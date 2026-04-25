"use client";

import { createContext, useContext, useState } from "react";
import { Eye, ChevronDown } from "lucide-react";

export type CBMode =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia";

const CB_LABELS: Record<CBMode, string> = {
  none: "Normal vision",
  protanopia: "Protanopia (red-blind)",
  deuteranopia: "Deuteranopia (green-blind)",
  tritanopia: "Tritanopia (blue-blind)",
  achromatopsia: "Achromatopsia (no color)",
};

const CBContext = createContext<{ mode: CBMode; setMode: (m: CBMode) => void }>(
  { mode: "none", setMode: () => {} }
);

export function useColorBlindness() {
  return useContext(CBContext);
}

export function ColorBlindnessProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<CBMode>("none");
  return (
    <CBContext.Provider value={{ mode, setMode }}>
      {children}
    </CBContext.Provider>
  );
}

/** SVG color matrix filters — research-based approximations from
 *  Machado, Oliveira & Fernandes (2009). */
export function ColorBlindnessFilters() {
  return (
    <svg
      aria-hidden
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter id="cb-protanopia">
          <feColorMatrix
            type="matrix"
            values="0.567 0.433 0     0 0
                    0.558 0.442 0     0 0
                    0     0.242 0.758 0 0
                    0     0     0     1 0"
          />
        </filter>
        <filter id="cb-deuteranopia">
          <feColorMatrix
            type="matrix"
            values="0.625 0.375 0     0 0
                    0.7   0.3   0     0 0
                    0     0.3   0.7   0 0
                    0     0     0     1 0"
          />
        </filter>
        <filter id="cb-tritanopia">
          <feColorMatrix
            type="matrix"
            values="0.95  0.05  0     0 0
                    0     0.433 0.567 0 0
                    0     0.475 0.525 0 0
                    0     0     0     1 0"
          />
        </filter>
        <filter id="cb-achromatopsia">
          <feColorMatrix
            type="matrix"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function CBToggle() {
  const { mode, setMode } = useColorBlindness();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border transition-colors ${
          mode === "none"
            ? "bg-container border-border text-muted hover:text-text"
            : "bg-primary text-background border-primary"
        }`}
        title="Simulate color-blindness"
      >
        <Eye size={16} />
        <span className="text-sm font-medium">
          {mode === "none" ? "Vision" : CB_LABELS[mode].split(" ")[0]}
        </span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-container border border-border rounded-lg shadow-xl overflow-hidden">
          {(Object.keys(CB_LABELS) as CBMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                mode === m
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text hover:bg-background"
              }`}
            >
              {CB_LABELS[m]}
            </button>
          ))}
          <div className="px-3 py-2 text-[11px] text-muted border-t border-border bg-background/50">
            Approximations based on Machado et al. (2009). Use to spot
            inaccessible color pairings.
          </div>
        </div>
      )}
    </div>
  );
}

export function CBPreviewWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useColorBlindness();
  return (
    <div
      style={{
        filter: mode === "none" ? undefined : `url(#cb-${mode})`,
        transition: "filter 200ms ease",
      }}
    >
      {children}
    </div>
  );
}
