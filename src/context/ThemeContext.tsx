"use client";

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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState(defaultTheme);
  const [theme, setTheme] = useState<Theme>(themes[defaultTheme]);

  const updateCSSVariables = (newTheme: Theme) => {
    const root = document.documentElement;

    // Update color variables
    Object.entries(newTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Update typography variables
    //     root.style.setProperty("--font-family", newTheme.typography.fontFamily);
    //     Object.entries(newTheme.typography.fontSize).forEach(([key, value]) => {
    //       root.style.setProperty(`--font-size-${key}`, value);
    //     });

    //     // Update spacing variables
    //     Object.entries(newTheme.spacing).forEach(([key, value]) => {
    //       root.style.setProperty(`--spacing-${key}`, value);
    //     });

    //     // Update border radius variables
    //     Object.entries(newTheme.borderRadius).forEach(([key, value]) => {
    //       root.style.setProperty(`--radius-${key}`, value);
    //     });
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
    const newTheme = { ...theme };
    let current: NestedTheme = newTheme;

    // Navigate to the nested property
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]] as NestedTheme;
    }

    // Update the value
    current[path[path.length - 1]] = value;

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
