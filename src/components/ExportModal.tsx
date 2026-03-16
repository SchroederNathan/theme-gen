import { useTheme } from "@/context/ThemeContext";
import { hexToRgb, rgbToHsl } from "@/lib/colorUtils";
import {
  generateCSSExport,
  generateTailwindConfig,
  generateSCSSExport,
  generateJSONTokens,
  generateSwiftUIExport,
  generateReactNativeExport,
  FORMAT_FILE_EXTENSIONS,
} from "@/lib/exportTokens";
import chroma from "chroma-js";
import { themes } from "@/lib/themes";
import { Check, Copy, Download, X } from "lucide-react";
import { useReducer, useEffect, useCallback } from "react";
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
      dispatch({ type: "OPEN_EXPORT_MODAL" });
    } else if (!isOpen && state.showExportModal) {
      dispatch({ type: "CLOSE_EXPORT_MODAL" });
    }
  }, [isOpen, state.showExportModal]);

  // Trigger enter animation when modal opens
  useEffect(() => {
    if (state.showExportModal && !state.isModalClosing) {
      dispatch({ type: "SET_MODAL_ENTERING", payload: false });
      const timer = setTimeout(() => {
        dispatch({ type: "SET_MODAL_ENTERING", payload: true });
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [state.showExportModal, state.isModalClosing]);

  const handleCloseModal = useCallback(() => {
    dispatch({ type: "START_MODAL_CLOSING" });
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!state.showExportModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.showExportModal, handleCloseModal]);

  const formatColor = (
    hexColor: string,
    format: "hex" | "rgb" | "hsl" | "oklch",
  ): string => {
    switch (format) {
      case "hex":
        return hexColor;
      case "rgb": {
        const rgb = hexToRgb(hexColor);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      }
      case "hsl": {
        const hsl = rgbToHsl(hexToRgb(hexColor));
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      }
      case "oklch":
        return chroma(hexColor).css("oklch");
      default:
        return hexColor;
    }
  };

  const getColorsForMode = (
    mode: "light" | "dark",
  ): Record<string, string> => {
    if (mode === themeName) return theme.colors as Record<string, string>;
    const saved = JSON.parse(localStorage.getItem("customThemes") || "{}");
    if (saved[mode]) return saved[mode].colors;
    return themes[mode].colors as Record<string, string>;
  };

  const fmt = (
    colors: Record<string, string>,
    overrideFormat?: typeof state.colorFormat,
  ) => {
    const format = overrideFormat ?? state.colorFormat;
    const out: Record<string, string> = {};
    Object.entries(colors).forEach(([key, value]) => {
      out[key] = formatColor(value, format);
    });
    return out;
  };

  const generateExportCode = () => {
    const light = fmt(getColorsForMode("light"));
    const dark = fmt(getColorsForMode("dark"));

    switch (state.exportFormat) {
      case "css":
        return generateCSSExport(light, dark, state.exportMode);

      case "tailwind":
        return generateTailwindConfig(
          light,
          dark,
          state.exportMode,
          state.tailwindVersion,
        );

      case "scss":
        return generateSCSSExport(light, dark, state.exportMode);

      case "json":
        return generateJSONTokens(light, dark, state.exportMode);

      case "swiftui":
        return generateSwiftUIExport(
          getColorsForMode("light"),
          getColorsForMode("dark"),
          state.exportMode,
          { colorFormat: state.colorFormat, hexToRgb },
        );

      case "reactnative": {
        const rnFallback = state.colorFormat === "oklch" ? "rgb" as const : undefined;
        const rnLight = rnFallback
          ? fmt(getColorsForMode("light"), rnFallback)
          : light;
        const rnDark = rnFallback
          ? fmt(getColorsForMode("dark"), rnFallback)
          : dark;
        return generateReactNativeExport(rnLight, rnDark, state.exportMode);
      }

      default:
        return "";
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateExportCode());
      dispatch({ type: "SET_COPIED", payload: true });
      setTimeout(
        () => dispatch({ type: "SET_COPIED", payload: false }),
        2000,
      );
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const downloadFile = () => {
    const code = generateExportCode();
    const ext = FORMAT_FILE_EXTENSIONS[state.exportFormat] ?? "txt";
    const filename = `theme-tokens.${ext}`;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!state.showExportModal) return null;

  const FORMAT_LABELS: Record<string, string> = {
    css: "CSS",
    tailwind: "Tailwind",
    scss: "SCSS",
    json: "JSON",
    swiftui: "SwiftUI",
    reactnative: "React Native",
  };

  return (
    <div
      className="relative z-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop — click to close */}
      <div
        className={`fixed inset-0 bg-gray-500/75 transition-opacity duration-300 ease-out ${
          state.isModalClosing
            ? "opacity-0 ease-in duration-200"
            : state.isModalEntering
              ? "opacity-100"
              : "opacity-0"
        }`}
        aria-hidden="true"
        onClick={handleCloseModal}
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
              {/* Format tabs */}
              <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg mb-6 overflow-x-auto">
                {(
                  [
                    "css",
                    "tailwind",
                    "scss",
                    "json",
                    "swiftui",
                    "reactnative",
                  ] as const
                ).map((format) => (
                  <button
                    key={format}
                    onClick={() =>
                      dispatch({
                        type: "SET_EXPORT_FORMAT",
                        payload: format,
                      })
                    }
                    className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      state.exportFormat === format
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    {FORMAT_LABELS[format]}
                  </button>
                ))}
              </div>

              {/* Tailwind version toggle */}
              {state.exportFormat === "tailwind" && (
                <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg mb-4 w-fit">
                  {(["4", "3"] as const).map((ver) => (
                    <button
                      key={ver}
                      onClick={() =>
                        dispatch({
                          type: "SET_TAILWIND_VERSION",
                          payload: ver,
                        })
                      }
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

              {/* Mode selector */}
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
                          type: "SET_EXPORT_MODE",
                          payload: e.target.value as
                            | "light"
                            | "dark"
                            | "both",
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

              {/* Color format selector */}
              <div className="flex space-x-4 mb-6">
                <span className="text-sm font-medium text-neutral-700">
                  Color Format:
                </span>
                {(["hex", "rgb", "hsl", "oklch"] as const).map((format) => (
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
                          type: "SET_COLOR_FORMAT",
                          payload: e.target.value as
                            | "hex"
                            | "rgb"
                            | "hsl"
                            | "oklch",
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

              {/* Code preview with Copy + Download */}
              <div className="relative">
                <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-auto max-h-96 text-sm text-left">
                  <code>{generateExportCode()}</code>
                </pre>
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    {state.copied ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-neutral-300" />
                    )}
                  </button>
                  <button
                    onClick={downloadFile}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                    title="Download file"
                  >
                    <Download size={16} className="text-neutral-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
