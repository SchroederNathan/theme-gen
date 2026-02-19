"use client";

import { Theme, defaultTheme, themes } from "@/lib/themes";
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
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
      setTheme(themes[savedTheme]);
      updateCSSVariables(themes[savedTheme]);
    } else {
      updateCSSVariables(themes[defaultTheme]);
    }
  }, []);

  // Sync CSS variables + localStorage whenever theme changes
  useEffect(() => {
    updateCSSVariables(theme);
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
