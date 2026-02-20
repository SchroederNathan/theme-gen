"use client";

import { Theme, defaultTheme, themes } from "@/lib/themes";
import { pickOnColor } from "@/lib/colorUtils";
import chroma from "chroma-js";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type ThemeContextType = {
  theme: Theme;
  themeName: string;
  setTheme: (themeName: string) => void;
  updateThemeProperty: (path: string[], value: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type NestedTheme = {
  [key: string]: string | NestedTheme;
};

const URL_COLOR_KEYS = ["text", "background", "primary", "secondary", "accent"] as const;

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
  colors.border = chroma.mix(text, bg, 0.82, "rgb").hex();
  colors.muted = chroma.mix(text, bg, 0.55, "rgb").hex();

  if (colors.primary) colors.onPrimary = pickOnColor(colors.primary);
  if (colors.secondary) colors.onSecondary = pickOnColor(colors.secondary);
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState(defaultTheme);
  const [theme, setTheme] = useState<Theme>(themes[defaultTheme]);
  const themeNameRef = useRef(themeName);
  themeNameRef.current = themeName;

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
  }, []);

  // Sync CSS variables + localStorage + URL whenever theme changes
  useEffect(() => {
    updateCSSVariables(theme);
    syncURLParams(theme, themeNameRef.current);
    const savedThemes = JSON.parse(
      localStorage.getItem("customThemes") || "{}"
    );
    savedThemes[themeNameRef.current] = theme;
    localStorage.setItem("customThemes", JSON.stringify(savedThemes));
  }, [theme]);

  const handleThemeChange = (newThemeName: string) => {
    if (themes[newThemeName]) {
      setThemeName(newThemeName);
      setTheme(themes[newThemeName]);
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
