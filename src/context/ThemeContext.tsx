"use client";

import { derivePaletteColors } from "@/lib/colorUtils";
import { Theme, defaultTheme, themes } from "@/lib/themes";
import React, { createContext, useContext, useEffect, useState } from "react";

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

const USER_COLOR_KEYS = ["text", "background", "primary", "secondary", "accent"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState(defaultTheme);
  const [theme, setTheme] = useState<Theme>(themes[defaultTheme]);

  const updateCSSVariables = (newTheme: Theme) => {
    const root = document.documentElement;
    Object.entries(newTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
      setTheme(themes[savedTheme]);
      updateCSSVariables(themes[savedTheme]);
    } else {
      updateCSSVariables(themes[defaultTheme]);
    }
  }, []);

  const handleThemeChange = (newThemeName: string) => {
    if (themes[newThemeName]) {
      setThemeName(newThemeName);
      setTheme(themes[newThemeName]);
      localStorage.setItem("theme", newThemeName);
      updateCSSVariables(themes[newThemeName]);
    }
  };

  const updateThemeProperty = (path: string[], value: string) => {
    const newTheme = { ...theme, colors: { ...theme.colors } };
    let current: NestedTheme = newTheme;

    // Navigate to the nested property
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]] as NestedTheme;
    }

    // Update the value
    current[path[path.length - 1]] = value;

    // If a user-controllable color changed, recalculate derived colors
    const changedKey = path[path.length - 1];
    if (path[0] === "colors" && USER_COLOR_KEYS.includes(changedKey)) {
      const isDark = themeName === "dark";
      const derived = derivePaletteColors(
        {
          text: newTheme.colors.text,
          background: newTheme.colors.background,
          primary: newTheme.colors.primary,
          secondary: newTheme.colors.secondary,
          accent: newTheme.colors.accent,
        },
        isDark
      );
      Object.entries(derived).forEach(([key, val]) => {
        (newTheme.colors as Record<string, string>)[key] = val;
      });
    }

    // Update state and CSS variables
    setTheme(newTheme);
    updateCSSVariables(newTheme);

    // Save to localStorage
    const savedThemes = JSON.parse(
      localStorage.getItem("customThemes") || "{}"
    );
    savedThemes[themeName] = newTheme;
    localStorage.setItem("customThemes", JSON.stringify(savedThemes));
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
