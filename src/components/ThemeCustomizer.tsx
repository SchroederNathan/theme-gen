"use client";

import { useTheme } from "@/context/ThemeContext";
import { generateColorPalette, getContrastingTextColor, hexToRgb, rgbToHsl, ColorScheme } from "@/lib/colorUtils";
import { Check, ChevronDown, Copy, Download, Lock, Moon, Shuffle, Sparkles, Sun, Unlock, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ColorPicker, ColorPickerVariant } from "./ColorPicker";

interface ColorButtonProps {
  color: string;
  label: string;
  property: string;
  onClick: (color: string, property: string, button: HTMLButtonElement) => void;
  isLocked: boolean;
  onLockToggle: (property: string) => void;
  isDarkTheme: boolean;
}

function ColorButton({
  color,
  label,
  property,
  onClick,
  isLocked,
  onLockToggle,
  isDarkTheme,
}: ColorButtonProps) {
  const textColor = getContrastingTextColor(color);

  return (
    <div className="relative group h-full">
      <button
        onClick={(e) => onClick(color, property, e.currentTarget)}
        className="w-28 h-full rounded-md flex items-center justify-center hover:cursor-pointer border-1 border-neutral-50 hover:border-neutral-200 transition-colors"
        style={{ backgroundColor: color }}
      >
        <p className="text-sm font-bold" style={{ color: textColor }}>
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

const colorSchemes = [
  { id: "Monochromatic", name: "Monochromatic" },
  { id: "Analogous", name: "Analogous" },
  { id: "Complementary", name: "Complementary" },
  { id: "Split Complementary", name: "Split Complementary" },
  { id: "Triadic", name: "Triadic" },
  { id: "Tetradic", name: "Tetradic" },
];

export function ThemeCustomizer() {
  const { theme, updateThemeProperty, themeName, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<HTMLButtonElement | null>(null);
  const [popoverLeft, setPopoverLeft] = useState<number>(0);
  const [lockedColors, setLockedColors] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [showRandomizeTooltip, setShowRandomizeTooltip] = useState(false);
  const [showThemeTooltip, setShowThemeTooltip] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(colorSchemes[1]);
  const [showSchemeMenu, setShowSchemeMenu] = useState(false);
  const schemeMenuRef = useRef<HTMLDivElement>(null);
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

  const handleColorChange = (newColor: string) => {
    if (selectedProperty) {
      updateThemeProperty(["colors", selectedProperty], newColor);
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

  // The 5 user-controllable color buttons
  const colorButtons = [
    { color: theme.colors.text, label: "Text", property: "text" },
    { color: theme.colors.background, label: "Background", property: "background" },
    { color: theme.colors.primary, label: "Primary", property: "primary" },
    { color: theme.colors.secondary, label: "Secondary", property: "secondary" },
    { color: theme.colors.accent, label: "Accent", property: "accent" },
  ];

  const randomizeColors = () => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");

    // Collect locked color values
    const lockedColorValues: Record<string, string> = {};
    colorButtons.forEach(({ property, color }) => {
      if (lockedColors.has(property)) {
        lockedColorValues[property] = color;
      }
    });

    const palette = generateColorPalette(
      randomColor,
      themeName === "dark",
      lockedColorValues,
      selectedScheme.id as ColorScheme
    );

    // Update all colors with the new palette
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

  // Close scheme menu on outside click
  useEffect(() => {
    if (!showSchemeMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
      if (!schemeMenuRef.current?.contains(e.target)) {
        setShowSchemeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSchemeMenu]);

  // Close export modal on outside click
  useEffect(() => {
    if (!showExportModal) return;
    const handleClick = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
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
      const timer = setTimeout(() => {
        setIsModalEntering(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [showExportModal, isModalClosing]);

  const handleExportClick = () => {
    if (showExportModal) {
      handleCloseModal();
    } else {
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
    }, 200);
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
}`;

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
}`;

      case 'scss':
        return `// Theme colors
${Object.entries(formattedColors).map(([key, value]) => `$color-${key}: ${value};`).join('\n')}

// Color map
$colors: (
${Object.entries(formattedColors).map(([key, value]) => `  "${key}": ${value},`).join('\n')}
);`;

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
      {/* Export Modal */}
      {showExportModal && (
        <div
          className="relative z-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
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
        <div className="flex flex-row gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-1 h-14 shadow-lg items-center">
          {colorButtons.map(({ color, label, property }) => (
            <ColorButton
              key={property}
              color={color}
              label={label}
              property={property}
              onClick={handleColorClick}
              isLocked={lockedColors.has(property)}
              onLockToggle={handleLockToggle}
              isDarkTheme={themeName === "dark"}
            />
          ))}
          <div className="relative flex items-center h-full">
            <button
              onClick={randomizeColors}
              className="h-full rounded-md ps-2 hover:bg-neutral-100 transition-colors aspect-square flex items-center justify-between"
              onMouseEnter={() => setShowRandomizeTooltip(true)}
              onMouseLeave={() => setShowRandomizeTooltip(false)}
            >
              <Shuffle size={16} className="text-neutral-800" />
              <ChevronDown
                className="text-neutral-500 h-full cursor-pointer w-4 rounded-e-md hover:bg-neutral-200 transition-colors"
                size={16}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSchemeMenu((v) => !v);
                }}
              />
            </button>
            {showSchemeMenu && (
              <div
                ref={schemeMenuRef}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 min-w-[180px]"
              >
                <div className="rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {colorSchemes.map((scheme) => (
                    <button
                      key={scheme.id}
                      className={`group relative w-full text-left cursor-pointer py-2 pr-9 pl-3 text-gray-900 select-none hover:bg-primary hover:text-onPrimary ${selectedScheme.id === scheme.id
                        ? "font-semibold"
                        : "font-normal"
                        }`}
                      onClick={() => {
                        setSelectedScheme(scheme);
                        setShowSchemeMenu(false);
                      }}
                    >
                      <span className="block truncate">{scheme.name}</span>
                      {selectedScheme.id === scheme.id && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary group-hover:text-onPrimary">
                          <Check />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                <div className="flex items-center gap-2">
                  Smart Shuffle
                  <Sparkles size={16} className="text-neutral-800" />
                </div>
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
