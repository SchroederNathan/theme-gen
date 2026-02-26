import { useTheme } from "@/context/ThemeContext";
import { hexToRgb, rgbToHsl } from "@/lib/colorUtils";
import { themes } from "@/lib/themes";
import { Check, Copy, X } from "lucide-react";
import { useReducer, useEffect } from "react";
import {
  exportModalReducer,
  initialExportModalState,
} from "./theme-customizer-reducers";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { theme, themeName } = useTheme();
  const [state, dispatch] = useReducer(exportModalReducer, {
    ...initialExportModalState,
    showExportModal: isOpen,
  });

  // Sync external isOpen state with internal state
  useEffect(() => {
    if (isOpen && !state.showExportModal) {
      dispatch({ type: 'OPEN_EXPORT_MODAL' });
    } else if (!isOpen && state.showExportModal) {
      dispatch({ type: 'CLOSE_EXPORT_MODAL' });
    }
  }, [isOpen, state.showExportModal]);

  // Trigger enter animation when modal opens
  useEffect(() => {
    if (state.showExportModal && !state.isModalClosing) {
      dispatch({ type: 'SET_MODAL_ENTERING', payload: false });
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_MODAL_ENTERING', payload: true });
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [state.showExportModal, state.isModalClosing]);

  const handleCloseModal = () => {
    dispatch({ type: 'START_MODAL_CLOSING' });
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const formatColor = (
    hexColor: string,
    format: "hex" | "rgb" | "hsl",
  ): string => {
    switch (format) {
      case "hex":
        return hexColor;
      case "rgb":
        const rgb = hexToRgb(hexColor);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case "hsl":
        const hsl = rgbToHsl(hexToRgb(hexColor));
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      default:
        return hexColor;
    }
  };

  const getColorsForMode = (mode: "light" | "dark"): Record<string, string> => {
    if (mode === themeName) return theme.colors as Record<string, string>;
    const saved = JSON.parse(localStorage.getItem("customThemes") || "{}");
    if (saved[mode]) return saved[mode].colors;
    return themes[mode].colors as Record<string, string>;
  };

  const fmt = (colors: Record<string, string>) => {
    const out: Record<string, string> = {};
    Object.entries(colors).forEach(([key, value]) => {
      out[key] = formatColor(value, state.colorFormat);
    });
    return out;
  };

  const generateExportCode = () => {
    const light = fmt(getColorsForMode("light"));
    const dark = fmt(getColorsForMode("dark"));

    const cssVars = (colors: Record<string, string>, indent = "  ") =>
      Object.entries(colors)
        .map(([k, v]) => `${indent}--color-${k}: ${v};`)
        .join("\n");

    const twObj = (colors: Record<string, string>, indent: string) =>
      Object.entries(colors)
        .map(([k, v]) => `${indent}${k}: '${v}',`)
        .join("\n");

    const scssVars = (colors: Record<string, string>, prefix: string) =>
      Object.entries(colors)
        .map(([k, v]) => `$${prefix}${k}: ${v};`)
        .join("\n");

    const scssMap = (colors: Record<string, string>, indent = "  ") =>
      Object.entries(colors)
        .map(([k, v]) => `${indent}"${k}": ${v},`)
        .join("\n");

    switch (state.exportFormat) {
      case "css": {
        if (state.exportMode === "light") {
          return `:root {\n${cssVars(light)}\n}`;
        }
        if (state.exportMode === "dark") {
          return `:root {\n${cssVars(dark)}\n}`;
        }
        return `:root {\n${cssVars(light)}\n}\n\n.dark {\n${cssVars(dark)}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${cssVars(dark, "    ")}\n  }\n}`;
      }

      case "tailwind": {
        if (state.tailwindVersion === "3") {
          if (state.exportMode === "light") {
            return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${twObj(light, "        ")}\n      }\n    }\n  }\n}`;
          }
          if (state.exportMode === "dark") {
            return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${twObj(dark, "        ")}\n      }\n    }\n  }\n}`;
          }
          return `// tailwind.config.js\nmodule.exports = {\n  darkMode: 'class',\n  theme: {\n    extend: {\n      colors: {\n${twObj(light, "        ")}\n      }\n    }\n  }\n}\n\n/* Add to your global CSS: */\n:root {\n${cssVars(light)}\n}\n\n.dark {\n${cssVars(dark)}\n}`;
        }
        if (state.exportMode === "light") {
          return `@import "tailwindcss";\n\n@theme {\n${cssVars(light)}\n}`;
        }
        if (state.exportMode === "dark") {
          return `@import "tailwindcss";\n\n@theme {\n${cssVars(dark)}\n}`;
        }
        return `@import "tailwindcss";\n\n@theme {\n${cssVars(light)}\n}\n\n@variant dark {\n  @theme {\n${cssVars(dark, "    ")}\n  }\n}`;
      }

      case "scss": {
        if (state.exportMode === "light") {
          return `${scssVars(light, "color-")}\n\n$colors: (\n${scssMap(light)}\n);`;
        }
        if (state.exportMode === "dark") {
          return `${scssVars(dark, "color-")}\n\n$colors: (\n${scssMap(dark)}\n);`;
        }
        return `// Light theme\n${scssVars(light, "light-")}\n\n$light-colors: (\n${scssMap(light)}\n);\n\n// Dark theme\n${scssVars(dark, "dark-")}\n\n$dark-colors: (\n${scssMap(dark)}\n);`;
      }

      case "swiftui": {
        const hexInit = `\n// Color hex initializer\nextension Color {\n    init(hex: String) {\n        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)\n        var int: UInt64 = 0\n        Scanner(string: hex).scanHexInt64(&int)\n        let a, r, g, b: UInt64\n        switch hex.count {\n        case 6:\n            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)\n        default:\n            (a, r, g, b) = (255, 0, 0, 0)\n        }\n        self.init(\n            .sRGB,\n            red: Double(r) / 255,\n            green: Double(g) / 255,\n            blue: Double(b) / 255,\n            opacity: Double(a) / 255\n        )\n    }\n}`;

        const swiftColor = (hex: string): string => {
          if (state.colorFormat === "rgb" || state.colorFormat === "hsl") {
            const rgb = hexToRgb(hex);
            return `Color(red: ${(rgb.r / 255).toFixed(3)}, green: ${(rgb.g / 255).toFixed(3)}, blue: ${(rgb.b / 255).toFixed(3)})`;
          }
          return `Color(hex: "${hex}")`;
        };

        const swiftProps = (colors: Record<string, string>, indent = "    ") =>
          Object.entries(colors)
            .map(([k, v]) => `${indent}static let ${k} = ${swiftColor(v)}`)
            .join("\n");

        const swiftStructProps = (colors: Record<string, string>) =>
          Object.keys(colors)
            .map((k) => `    let ${k}: Color`)
            .join("\n");

        const swiftStructInit = (colors: Record<string, string>, indent = "        ") =>
          Object.entries(colors)
            .map(([k, v]) => `${indent}${k}: ${swiftColor(v)}`)
            .join(",\n");

        const needsHexInit = state.colorFormat === "hex";

        if (state.exportMode === "light") {
          return `import SwiftUI\n\nextension Color {\n${swiftProps(light)}\n}${needsHexInit ? hexInit : ""}`;
        }
        if (state.exportMode === "dark") {
          return `import SwiftUI\n\nextension Color {\n${swiftProps(dark)}\n}${needsHexInit ? hexInit : ""}`;
        }
        return `import SwiftUI\n\nstruct AppColors {\n${swiftStructProps(light)}\n}\n\nextension AppColors {\n    static let light = AppColors(\n${swiftStructInit(light)}\n    )\n\n    static let dark = AppColors(\n${swiftStructInit(dark)}\n    )\n}${needsHexInit ? "\n" + hexInit : ""}`;
      }

      case "reactnative": {
        const rnObj = (colors: Record<string, string>, indent = "  ") =>
          Object.entries(colors)
            .map(([k, v]) => `${indent}${k}: '${v}',`)
            .join("\n");

        if (state.exportMode === "light") {
          return `// theme.ts\nexport const colors = {\n${rnObj(light)}\n} as const;\n\nexport type ColorName = keyof typeof colors;`;
        }
        if (state.exportMode === "dark") {
          return `// theme.ts\nexport const colors = {\n${rnObj(dark)}\n} as const;\n\nexport type ColorName = keyof typeof colors;`;
        }
        return `// theme.ts\nexport const lightColors = {\n${rnObj(light)}\n} as const;\n\nexport const darkColors = {\n${rnObj(dark)}\n} as const;\n\nexport type ColorName = keyof typeof lightColors;\n\n// Usage:\n// import { useColorScheme } from 'react-native';\n// const colors = useColorScheme() === 'dark' ? darkColors : lightColors;`;
      }

      default:
        return "";
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateExportCode());
      dispatch({ type: 'SET_COPIED', payload: true });
      setTimeout(() => dispatch({ type: 'SET_COPIED', payload: false }), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (!state.showExportModal) return null;

  return (
    <div
      className="relative z-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`fixed inset-0 bg-gray-500/75 transition-opacity duration-300 ease-out ${
          state.isModalClosing
            ? "opacity-0 ease-in duration-200"
            : state.isModalEntering
              ? "opacity-100"
              : "opacity-0"
        }`}
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={`relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 ease-out max-w-2xl w-full mx-4 max-h-[80vh] ${
              state.isModalClosing
                ? "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 ease-in duration-200"
                : state.isModalEntering
                  ? "opacity-100 translate-y-0 sm:scale-100"
                  : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            }`}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-neutral-900"
              >
                Export Theme
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-md hover:bg-neutral-100 transition-colors"
              >
                <X size={20} className="text-neutral-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg mb-6 overflow-x-auto">
                {(["css", "tailwind", "scss", "swiftui", "reactnative"] as const).map((format) => {
                  const labels: Record<string, string> = {
                    css: "CSS",
                    tailwind: "Tailwind",
                    scss: "SCSS",
                    swiftui: "SwiftUI",
                    reactnative: "React Native",
                  };
                  return (
                    <button
                      key={format}
                      onClick={() => dispatch({ type: 'SET_EXPORT_FORMAT', payload: format })}
                      className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                        state.exportFormat === format
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {labels[format]}
                    </button>
                  );
                })}
              </div>

              {state.exportFormat === "tailwind" && (
                <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg mb-4 w-fit">
                  {(["4", "3"] as const).map((ver) => (
                    <button
                      key={ver}
                      onClick={() => dispatch({ type: 'SET_TAILWIND_VERSION', payload: ver })}
                      className={`py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
                        state.tailwindVersion === ver
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {ver === "4" ? "v4.2" : "v3.4"}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm font-medium text-neutral-700">
                  Mode:
                </span>
                {(["light", "dark", "both"] as const).map((mode) => (
                  <label
                    key={mode}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="exportMode"
                      value={mode}
                      checked={state.exportMode === mode}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_EXPORT_MODE',
                          payload: e.target.value as "light" | "dark" | "both"
                        })
                      }
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-neutral-700 capitalize">
                      {mode}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex space-x-4 mb-6">
                <span className="text-sm font-medium text-neutral-700">
                  Color Format:
                </span>
                {(["hex", "rgb", "hsl"] as const).map((format) => (
                  <label
                    key={format}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="colorFormat"
                      value={format}
                      checked={state.colorFormat === format}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_COLOR_FORMAT',
                          payload: e.target.value as "hex" | "rgb" | "hsl"
                        })
                      }
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-neutral-700 uppercase">
                      {format}
                    </span>
                  </label>
                ))}
              </div>

              <div className="relative">
                <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-auto max-h-96 text-sm text-left">
                  <code>{generateExportCode()}</code>
                </pre>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-3 right-3 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                  title="Copy to clipboard"
                >
                  {state.copied ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} className="text-neutral-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}