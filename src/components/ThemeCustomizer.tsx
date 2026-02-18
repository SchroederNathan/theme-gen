"use client";

import { useTheme } from "@/context/ThemeContext";
import { generateColorPalette, getContrastRatio, getTextColor, getWCAGContrastResult, hexToRgb, rgbToHsl, WCAGContrastResult } from "@/lib/colorUtils";
import { AlertTriangle, Check, Copy, Download, Lock, Moon, Shuffle, Sparkles, Sun, Unlock, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ColorPicker, ColorPickerVariant } from "./ColorPicker";

interface ColorButtonProps {
  color: string;
  label: string;
  property: string;
  onClick: (color: string, property: string, button: HTMLButtonElement) => void;
  isLocked: boolean;
  onLockToggle: (property: string) => void;
  contrastResult: WCAGContrastResult;
  isDarkTheme: boolean;
}

function ColorButton({
  color,
  label,
  property,
  onClick,
  isLocked,
  onLockToggle,
  contrastResult,
  isDarkTheme,
}: ColorButtonProps) {
  return (
    <div className="relative group h-full">
      {(() => {
        const badgeStage = getWCAGBadgeStage(contrastResult);
        return (
          <div
            className={`absolute -top-2 -left-2 z-10 p-1 rounded-full border shadow-sm flex items-center justify-center ${
              isDarkTheme
                ? "bg-neutral-900 border-neutral-700 text-neutral-200"
                : "bg-neutral-50 border-neutral-200 text-neutral-700"
            }`}
            title={
              badgeStage === "success"
                ? `WCAG AAA normal text pass (${contrastResult.ratio}:1)`
                : badgeStage === "warning"
                  ? `WCAG AA normal text pass, AAA normal fail (${contrastResult.ratio}:1)`
                  : `WCAG AA normal text fail (${contrastResult.ratio}:1)`
            }
          >
            {badgeStage === "success" ? (
              <Check size={9} strokeWidth={3.25} className="text-current" />
            ) : badgeStage === "warning" ? (
              <AlertTriangle size={9} strokeWidth={3.25} className="text-current" />
            ) : (
              <X size={9} strokeWidth={3.25} className="text-current" />
            )}
          </div>
        );
      })()}
      <button
        onClick={(e) => onClick(color, property, e.currentTarget)}
        className="w-32 h-full rounded-md flex items-center justify-center hover:cursor-pointer border-1 border-neutral-50 hover:border-neutral-200 transition-colors"
        style={{ backgroundColor: color }}
      >
        <p className="text-lg font-bold" style={{ color: getTextColor(color) }}>
          {label}
        </p>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLockToggle(property);
        }}
        className={`absolute -top-2 -right-2 p-1 rounded-full border opacity-0 group-hover:opacity-100 transition-opacity ${
          isDarkTheme
            ? "bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
        }`}
        title={isLocked ? "Unlock color" : "Lock color"}
      >
        {isLocked ? <Lock size={9} strokeWidth={3.25} className="text-current" /> : <Unlock size={9} strokeWidth={3.25} className="text-current" />}
      </button>
    </div>
  );
}

type WCAGBadgeStage = "success" | "warning" | "danger";

function getWCAGBadgeStage(result: WCAGContrastResult): WCAGBadgeStage {
  if (result.aaaNormal) return "success";
  if (result.aaNormal) return "warning";
  return "danger";
}

export function ThemeCustomizer() {
  const { theme, updateThemeProperty, themeName, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<HTMLButtonElement | null>(
    null
  );
  const [popoverLeft, setPopoverLeft] = useState<number>(0);
  const [lockedColors, setLockedColors] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [showRandomizeTooltip, setShowRandomizeTooltip] = useState(false);
  const [showThemeTooltip, setShowThemeTooltip] = useState(false);
  const [showDownloadTooltip, setShowDownloadTooltip] = useState(false);

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'scss'>('css');
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [copied, setCopied] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isModalEntering, setIsModalEntering] = useState(false);

  const handleColorClick = (
    color: string,
    property: string,
    button: HTMLButtonElement
  ) => {
    if (lockedColors.has(property)) return;

    const isSameButton =
      isOpen &&
      selectedProperty === property &&
      activeButton === button;

    if (isSameButton) {
      setIsOpen(false);
      setSelectedColor(null);
      setSelectedProperty(null);
      setActiveButton(null);
      return;
    }

    setSelectedColor(color);
    setSelectedProperty(property);
    setActiveButton(button);
    setIsOpen(true);
  };

  const linkedOnColorByRole: Record<string, string> = {
    background: "onBackground",
    primary: "onPrimary",
    accent: "onAccent",
    container: "onContainer",
  };

  const handleColorChange = (newColor: string) => {
    if (!selectedProperty) return;

    updateThemeProperty(["colors", selectedProperty], newColor);

    const onProperty = linkedOnColorByRole[selectedProperty];
    if (onProperty && !lockedColors.has(onProperty)) {
      const whiteContrast = getContrastRatio("#FFFFFF", newColor);
      const darkContrast = getContrastRatio("#111827", newColor);
      const readableOnColor = whiteContrast >= darkContrast ? "#FFFFFF" : "#111827";
      updateThemeProperty(["colors", onProperty], readableOnColor);
    }
  };

  const handleLockToggle = (property: string) => {
    setLockedColors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(property)) {
        newSet.delete(property);
      } else {
        newSet.add(property);
      }
      return newSet;
    });
  };

  const contrastAuditDefinitions = [
    { id: "onBackground/background", label: "Body text on Background", foreground: "onBackground", background: "background", min: 4.5, required: true },
    { id: "onContainer/container", label: "Text on Container", foreground: "onContainer", background: "container", min: 4.5, required: true },
    { id: "onPrimary/primary", label: "Text on Primary", foreground: "onPrimary", background: "primary", min: 4.5, required: true },
    { id: "onAccent/accent", label: "Text on Accent", foreground: "onAccent", background: "accent", min: 4.5, required: true },
    { id: "onBackground/container", label: "Body text on Container", foreground: "onBackground", background: "container", min: 4.5, required: true },
    { id: "primary/background", label: "Primary against Background", foreground: "primary", background: "background", min: 3, required: true },
    { id: "accent/background", label: "Accent against Background", foreground: "accent", background: "background", min: 3, required: true },
    { id: "container/background", label: "Container against Background", foreground: "container", background: "background", min: 1.5, required: true },
    { id: "onContainer/background", label: "Container text on Background", foreground: "onContainer", background: "background", min: 4.5, required: false },
  ] as const;

  const getContrastAudit = (palette: Record<string, string>) => {
    return contrastAuditDefinitions.map((definition) => {
      const ratio = getContrastRatio(palette[definition.foreground], palette[definition.background]);
      return {
        ...definition,
        ratio,
        pass: ratio >= definition.min,
      };
    });
  };

  const isPaletteAccessible = (palette: Record<string, string>) => {
    return getContrastAudit(palette)
      .filter((item) => item.required)
      .every((item) => item.pass);
  };

  const smartShuffle = () => {
    const lockedColorValues: Record<string, string> = {};

    Object.entries(theme.colors).forEach(([property, color]) => {
      if (lockedColors.has(property)) {
        lockedColorValues[property] = color;
      }
    });

    let palette = generateColorPalette(
      `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
      themeName === "dark",
      lockedColorValues,
      "Analogous"
    );

    for (let index = 0; index < 24 && !isPaletteAccessible(palette); index += 1) {
      palette = generateColorPalette(
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`,
        themeName === "dark",
        lockedColorValues,
        "Analogous"
      );
    }

    Object.entries(palette).forEach(([property, color]) => {
      if (!lockedColors.has(property)) {
        updateThemeProperty(["colors", property], color);
      }
    });
  };

  const toggleTheme = () => {
    setTheme(themeName === "light" ? "dark" : "light");
  };

  // Center the popover above the button
  useLayoutEffect(() => {
    if (isOpen && activeButton && popoverRef.current) {
      const buttonRect = activeButton.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      // Calculate left relative to the container
      const left =
        buttonRect.left -
        (containerRect?.left || 0) +
        buttonRect.width / 2 -
        popoverRect.width / 2;
      setPopoverLeft(left);
    }
  }, [isOpen, activeButton]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close export modal on outside click
  useEffect(() => {
    if (!showExportModal) return;
    const handleClick = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
      // Check if click is on the modal backdrop (not the modal content)
      if ((e.target as HTMLElement).closest('.bg-white.rounded-lg.shadow-xl')) return;
      handleCloseModal();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showExportModal]);

  // Trigger enter animation when modal opens
  useEffect(() => {
    if (showExportModal && !isModalClosing) {
      setIsModalEntering(false);
      // Small delay to ensure initial state renders before animation
      const timer = setTimeout(() => {
        setIsModalEntering(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [showExportModal, isModalClosing]);

  const colorButtons = [
    {
      color: theme.colors.background,
      label: "Background",
      property: "background",
      onColor: theme.colors.onBackground,
    },

    {
      color: theme.colors.primary,
      label: "Primary",
      property: "primary",
      onColor: theme.colors.onPrimary,
    },

    {
      color: theme.colors.accent,
      label: "Accent",
      property: "accent",
      onColor: theme.colors.onAccent,
    },
    {
      color: theme.colors.container,
      label: "Container",
      property: "container",
      onColor: theme.colors.onContainer,
    },
  ];

  const wcagByProperty = colorButtons.reduce<Record<string, WCAGContrastResult>>(
    (acc, button) => {
      acc[button.property] = getWCAGContrastResult(button.onColor, button.color);
      return acc;
    },
    {}
  );

  const currentContrastAudit = getContrastAudit(theme.colors as Record<string, string>);
  const requiredContrastAudit = currentContrastAudit.filter((item) => item.required);
  const requiredContrastPassCount = requiredContrastAudit.filter((item) => item.pass).length;

  const handleExportClick = () => {
    if (showExportModal) {
      // If modal is already open, close it
      handleCloseModal();
    } else {
      // If modal is closed, open it
      setShowExportModal(true);
      setIsModalClosing(false);
      setIsModalEntering(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setIsModalEntering(false);
    setTimeout(() => {
      setShowExportModal(false);
      setIsModalClosing(false);
    }, 200); // Match the leave animation duration
  };

  const formatColor = (hexColor: string, format: 'hex' | 'rgb' | 'hsl'): string => {
    switch (format) {
      case 'hex':
        return hexColor;
      case 'rgb':
        const rgb = hexToRgb(hexColor);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'hsl':
        const hsl = rgbToHsl(hexToRgb(hexColor));
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      default:
        return hexColor;
    }
  };

  const generateExportCode = () => {
    const colors = theme.colors;
    const formattedColors: Record<string, string> = {};

    Object.entries(colors).forEach(([key, value]) => {
      formattedColors[key] = formatColor(value, colorFormat);
    });

    switch (exportFormat) {
      case 'css':
        return `:root {
${Object.entries(formattedColors).map(([key, value]) => `  --color-${key}: ${value};`).join('\n')}
}

/* Usage examples */
.bg-primary { background-color: var(--color-primary); }
.text-primary { color: var(--color-primary); }
.bg-background { background-color: var(--color-background); }
.text-on-background { color: var(--color-onBackground); }`;

      case 'tailwind':
        return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${Object.entries(formattedColors).map(([key, value]) => `        ${key}: '${value}',`).join('\n')}
      }
    }
  }
}

/* Usage examples */
// bg-primary text-onPrimary
// bg-background text-onBackground
// bg-container text-onContainer`;

      case 'scss':
        return `// Theme colors
${Object.entries(formattedColors).map(([key, value]) => `$color-${key}: ${value};`).join('\n')}

// Color map
$colors: (
${Object.entries(formattedColors).map(([key, value]) => `  "${key}": ${value},`).join('\n')}
);

// Mixin for color usage
@mixin color($property, $color-name) {
  #{$property}: map-get($colors, $color-name);
}

/* Usage examples */
// @include color(background-color, primary);
// @include color(color, onPrimary);`;

      default:
        return '';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateExportCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <>
      {/* Export Modal - moved outside to cover entire screen */}
      {showExportModal && (
        <div
          className="relative z-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Background backdrop with fade animation */}
          <div
            className={`fixed inset-0 bg-gray-500/75 transition-opacity duration-300 ease-out ${isModalClosing
              ? 'opacity-0 ease-in duration-200'
              : isModalEntering
                ? 'opacity-100'
                : 'opacity-0'
              }`}
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              {/* Modal panel with scale/translate animation */}
              <div
                className={`relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 ease-out max-w-2xl w-full mx-4 max-h-[80vh] ${isModalClosing
                  ? 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 ease-in duration-200'
                  : isModalEntering
                    ? 'opacity-100 translate-y-0 sm:scale-100'
                    : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                  }`}
              >
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                  <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">Export Theme</h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-1 rounded-md hover:bg-neutral-100 transition-colors"
                  >
                    <X size={20} className="text-neutral-500" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Format Tabs */}
                  <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg mb-6">
                    {(['css', 'tailwind', 'scss'] as const).map((format) => (
                      <button
                        key={format}
                        onClick={() => setExportFormat(format)}
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${exportFormat === format
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                      >
                        {format === 'css' ? 'CSS' : format === 'tailwind' ? 'TailwindCSS' : 'SCSS'}
                      </button>
                    ))}
                  </div>

                  {/* Color Format Options */}
                  <div className="flex space-x-4 mb-6">
                    <span className="text-sm font-medium text-neutral-700">Color Format:</span>
                    {(['hex', 'rgb', 'hsl'] as const).map((format) => (
                      <label key={format} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="colorFormat"
                          value={format}
                          checked={colorFormat === format}
                          onChange={(e) => setColorFormat(e.target.value as 'hex' | 'rgb' | 'hsl')}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-neutral-700 uppercase">{format}</span>
                      </label>
                    ))}
                  </div>

                  {/* Code Block */}
                  <div className="relative">
                    <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-auto max-h-96 text-sm text-left">
                      <code>{generateExportCode()}</code>
                    </pre>
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-3 right-3 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
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
      )}

      <div
        ref={containerRef}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex flex-row gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-1 h-16 shadow-lg items-center">
          {colorButtons.map(({ color, label, property }) => (
            <ColorButton
              key={property}
              color={color}
              label={label}
              property={property}
              onClick={handleColorClick}
              isLocked={lockedColors.has(property)}
              onLockToggle={handleLockToggle}
              contrastResult={wcagByProperty[property]}
              isDarkTheme={themeName === "dark"}
            />
          ))}
          <div className="relative flex items-center h-full">
            <button
              onClick={smartShuffle}
              className="h-full rounded-md px-3 hover:bg-neutral-100 transition-colors flex items-center gap-2"
              onMouseEnter={() => setShowRandomizeTooltip(true)}
              onMouseLeave={() => setShowRandomizeTooltip(false)}
            >
              <Shuffle size={16} className="text-neutral-800" />
              <span className="text-sm font-medium text-neutral-800">Smart Shuffle</span>
            </button>
            {showRandomizeTooltip && (
              <div
                role="tooltip"
                className="absolute bottom-4 z-100 inline-block px-3 py-2 text-sm font-medium text-neutral-800 border border-neutral-200 transition-opacity duration-300 bg-neutral-50 shadow-sm rounded-lg tooltip min-w-[144px] text-center"
                style={{
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: "8px",
                }}
              >
                <div className="flex items-center justify-center gap-2 font-semibold">
                  Smart Shuffle
                  <Sparkles size={16} className="text-neutral-800" />
                </div>
                <p className="mt-1 text-[11px] text-neutral-600">Required checks: {requiredContrastPassCount}/{requiredContrastAudit.length} passing</p>
                <ul className="mt-2 space-y-1 text-left text-[11px] max-h-44 overflow-auto pr-1">
                  {currentContrastAudit.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-2">
                      <span className={item.pass ? "text-emerald-700" : "text-red-700"}>{item.label}</span>
                      <span className="font-semibold text-neutral-800">{item.ratio}:1</span>
                    </li>
                  ))}
                </ul>
                <div className="absolute -bottom-1 -z-10 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-neutral-50"></div>
              </div>
            )}
          </div>
          <div className="relative h-full">
            <button
              onClick={toggleTheme}
              className="p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center"
              onMouseEnter={() => setShowThemeTooltip(true)}
              onMouseLeave={() => setShowThemeTooltip(false)}
            >
              {themeName === "light" ? (
                <Moon size={16} className="text-neutral-800" />
              ) : (
                <Sun size={16} className="text-neutral-800" />
              )}
            </button>
            {showThemeTooltip && (
              <div
                role="tooltip"
                className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-neutral-800 transition-opacity duration-300 bg-neutral-50 shadow-sm rounded-lg border border-neutral-200 tooltip min-w-[120px] text-center"
                style={{
                  bottom: "99%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: "8px",
                }}
              >
                Toggle Theme
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-neutral-50"></div>
              </div>
            )}
          </div>
          <div className="relative h-full">
            <button
              onClick={handleExportClick}
              className="p-2 h-full rounded-md hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-center"
              onMouseEnter={() => setShowDownloadTooltip(true)}
              onMouseLeave={() => setShowDownloadTooltip(false)}
            >
              <Download size={16} className="text-neutral-800" />
            </button>
            {showDownloadTooltip && (
              <div
                role="tooltip"
                className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-neutral-800 transition-opacity duration-300 bg-neutral-50 shadow-sm rounded-lg border border-neutral-200 tooltip min-w-[120px] text-center"
                style={{
                  bottom: "99%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginBottom: "8px",
                }}
              >
                Export Theme
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-neutral-50"></div>
              </div>
            )}
          </div>
        </div>

        {isOpen && selectedColor && activeButton && (
          <div
            ref={popoverRef}
            className="absolute mb-4"
            style={{
              bottom: "100%",
              left: popoverLeft,
            }}
          >
            <div className="relative">
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rotate-45 size-4 bg-neutral-50 border-r border-b rounded-ee-xs border-neutral-200" />
              {selectedProperty && wcagByProperty[selectedProperty] && (
                <div className="mb-2 w-64 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-700 shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-neutral-800">WCAG Contrast Check</p>
                    <p className="font-semibold">
                      {wcagByProperty[selectedProperty].ratio}:1
                    </p>
                  </div>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-center gap-1.5">
                      {wcagByProperty[selectedProperty].aaNormal ? (
                        <Check size={11} strokeWidth={2.75} className="text-green-600" />
                      ) : (
                        <X size={11} strokeWidth={2.75} className="text-red-600" />
                      )}
                      <span>AA normal text: {wcagByProperty[selectedProperty].aaNormal ? "Pass" : "Fail"} (≥ 4.5:1)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      {wcagByProperty[selectedProperty].aaLarge ? (
                        <Check size={11} strokeWidth={2.75} className="text-green-600" />
                      ) : (
                        <X size={11} strokeWidth={2.75} className="text-red-600" />
                      )}
                      <span>AA large text: {wcagByProperty[selectedProperty].aaLarge ? "Pass" : "Fail"} (≥ 3:1)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      {wcagByProperty[selectedProperty].aaaNormal ? (
                        <Check size={11} strokeWidth={2.75} className="text-green-600" />
                      ) : (
                        <X size={11} strokeWidth={2.75} className="text-red-600" />
                      )}
                      <span>AAA normal text: {wcagByProperty[selectedProperty].aaaNormal ? "Pass" : "Fail"} (≥ 7:1)</span>
                    </li>
                  </ul>
                </div>
              )}
              <ColorPicker
                color={selectedColor}
                onChange={handleColorChange}
                variant={ColorPickerVariant.Free}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
