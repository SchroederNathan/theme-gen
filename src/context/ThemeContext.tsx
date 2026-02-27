"use client";

import { Theme, defaultTheme, themes } from "@/lib/themes";
import { mixOklch, pickOnColor } from "@/lib/colorUtils";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ThemeContextType = {
  theme: Theme;
  themeName: string;
  setTheme: (themeName: string, customColors?: Partial<Theme["colors"]>) => void;
  updateThemeProperty: (path: string[], value: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  pushHistory: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type NestedTheme = {
  [key: string]: string | NestedTheme;
};

const URL_COLOR_KEYS = ["text", "background", "primary", "container", "accent"] as const;

function parseColorsFromURL(): Partial<Theme["colors"]> | null {
  const params = new URLSearchParams(window.location.search);
  const colorsParam = params.get("colors");
  if (!colorsParam) return null;

  const hexValues = colorsParam.split("-");
  if (hexValues.length !== URL_COLOR_KEYS.length) return null;

  const isValidHex = (h: string) => /^[0-9a-fA-F]{6}$/.test(h);
  if (!hexValues.every(isValidHex)) return null;

  const colors: Partial<Theme["colors"]> = {};
  URL_COLOR_KEYS.forEach((key, i) => {
    (colors as Record<string, string>)[key] = `#${hexValues[i]}`;
  });

  const text = colors.text!;
  const bg = colors.background!;
  colors.border = mixOklch(text, bg, 0.82);
  colors.muted = mixOklch(text, bg, 0.55);

  if (colors.primary) colors.onPrimary = pickOnColor(colors.primary);
  if (colors.container) colors.onContainer = pickOnColor(colors.container);
  if (colors.accent) colors.onAccent = pickOnColor(colors.accent);

  return colors;
}

function syncURLParams(theme: Theme, themeName: string) {
  const compact = URL_COLOR_KEYS
    .map((key) => theme.colors[key].replace("#", ""))
    .join("-");

  const params = new URLSearchParams(window.location.search);
  params.set("colors", compact);
  params.set("mode", themeName);

  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", newURL);
}

function updateCSSVariables(newTheme: Theme) {
  const root = document.documentElement;
  Object.entries(newTheme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
}

const MAX_HISTORY = 15;

type HistoryEntry = { theme: Theme; themeName: string };

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState(defaultTheme);
  const [theme, setTheme] = useState<Theme>(themes[defaultTheme]);
  const themeNameRef = useRef(themeName);
  themeNameRef.current = themeName;

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [future, setFuture] = useState<HistoryEntry[]>([]);
  const isRestoringRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    const urlColors = parseColorsFromURL();
    if (urlColors) {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode") === "dark" ? "dark" : "light";
      const base = themes[mode];
      const hydrated: Theme = {
        ...base,
        colors: { ...base.colors, ...urlColors },
      };
      setThemeName(mode);
      setTheme(hydrated);
      updateCSSVariables(hydrated);
      initializedRef.current = true;
      return;
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
      setTheme(themes[savedTheme]);
      updateCSSVariables(themes[savedTheme]);
    } else {
      updateCSSVariables(themes[defaultTheme]);
    }
    initializedRef.current = true;
  }, []);

  // Sync CSS variables + localStorage + URL whenever theme changes
  useEffect(() => {
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
    }
    updateCSSVariables(theme);
    syncURLParams(theme, themeNameRef.current);
    const savedThemes = JSON.parse(
      localStorage.getItem("customThemes") || "{}"
    );
    savedThemes[themeNameRef.current] = theme;
    localStorage.setItem("customThemes", JSON.stringify(savedThemes));
  }, [theme]);

  const pushHistory = useCallback(() => {
    if (!initializedRef.current) return;
    setHistory((prev) => {
      const entry: HistoryEntry = { theme: { ...theme, colors: { ...theme.colors } }, themeName: themeNameRef.current };
      const next = [...prev, entry];
      if (next.length > MAX_HISTORY) next.shift();
      return next;
    });
    setFuture([]);
  }, [theme]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const entry = newHistory.pop()!;
      setFuture((f) => [...f, { theme: { ...theme, colors: { ...theme.colors } }, themeName: themeNameRef.current }]);
      isRestoringRef.current = true;
      setThemeName(entry.themeName);
      setTheme(entry.theme);
      updateCSSVariables(entry.theme);
      return newHistory;
    });
  }, [theme]);

  const redo = useCallback(() => {
    setFuture((prev) => {
      if (prev.length === 0) return prev;
      const newFuture = [...prev];
      const entry = newFuture.pop()!;
      setHistory((h) => [...h, { theme: { ...theme, colors: { ...theme.colors } }, themeName: themeNameRef.current }]);
      isRestoringRef.current = true;
      setThemeName(entry.themeName);
      setTheme(entry.theme);
      updateCSSVariables(entry.theme);
      return newFuture;
    });
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const handleThemeChange = (newThemeName: string, customColors?: Partial<Theme["colors"]>) => {
    if (themes[newThemeName]) {
      pushHistory();
      const base = themes[newThemeName];
      const newTheme = customColors
        ? { ...base, colors: { ...base.colors, ...customColors } }
        : base;
      setThemeName(newThemeName);
      setTheme(newTheme);
      localStorage.setItem("theme", newThemeName);
    }
  };

  const updateThemeProperty = (path: string[], value: string) => {
    setTheme((prev) => {
      const newTheme = { ...prev, colors: { ...prev.colors } };
      let current: NestedTheme = newTheme;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]] as NestedTheme;
      }

      current[path[path.length - 1]] = value;
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName,
        setTheme: handleThemeChange,
        updateThemeProperty,
        undo,
        redo,
        canUndo: history.length > 0,
        canRedo: future.length > 0,
        pushHistory,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
