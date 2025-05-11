"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function ThemeCustomizer() {
  const { theme, updateThemeProperty } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const colorInputs = Object.entries(theme.colors).map(([key, value]) => (
    <div key={key} className="flex items-center gap-2">
      <label className="text-sm font-medium text-text">{key}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => updateThemeProperty(["colors", key], e.target.value)}
        className="h-8 w-8 rounded border border-border"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => updateThemeProperty(["colors", key], e.target.value)}
        className="w-24 rounded border border-border bg-background px-2 py-1 text-text"
      />
    </div>
  ));

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-primary w-10 h-10 text-white shadow-lg hover:bg-primary/90"
      >
        🎨
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 rounded-lg border border-border bg-background p-4 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-text">
            Theme Customizer
          </h3>
          <div className="space-y-4">
            <div className="flex flex-row items-center gap-2">
              <label className="text-sm font-medium text-text">Dark mode</label>
              <ThemeSwitcher />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-text">Colors</h4>
              {colorInputs}
            </div>

            {/* <div className="space-y-2">
              <h4 className="text-sm font-medium text-text">Typography</h4>
              {Object.entries(theme.typography.fontSize).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="text-sm font-medium text-text">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateThemeProperty(['typography', 'fontSize', key], e.target.value)}
                    className="w-24 rounded border border-border bg-background px-2 py-1 text-text"
                  />
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-text">Spacing</h4>
              {Object.entries(theme.spacing).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="text-sm font-medium text-text">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateThemeProperty(['spacing', key], e.target.value)}
                    className="w-24 rounded border border-border bg-background px-2 py-1 text-text"
                  />
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-text">Border Radius</h4>
              {Object.entries(theme.borderRadius).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="text-sm font-medium text-text">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateThemeProperty(['borderRadius', key], e.target.value)}
                    className="w-24 rounded border border-border bg-background px-2 py-1 text-text"
                  />
                </div>
              ))}
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
