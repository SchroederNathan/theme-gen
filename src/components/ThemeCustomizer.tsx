"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  adaptColorsForMode,
  generateColorPalette,
  getContrastRatio,
  getTextColor,
  pickOnColor,
} from "@/lib/colorUtils";
import { Lock, Unlock, Check, X } from "lucide-react";
import chroma from "chroma-js";
import { useEffect, useLayoutEffect, useRef, useState, useReducer } from "react";
import { ExportModal } from "./ExportModal";
import { ColorPickerPopover } from "./ColorPickerPopover";
import { ToolbarButtons } from "./ToolbarButtons";
import {
  colorPickerReducer,
  initialColorPickerState,
} from "./theme-customizer-reducers";
import { ColorButtonData } from "./theme-customizer-types";

interface ColorButtonProps {
  color: string;
  label: string;
  property: string;
  onClick: (color: string, property: string, button: HTMLButtonElement) => void;
  isLocked: boolean;
  onLockToggle: (property: string) => void;
  ratio: number;
  target: number;
  isDarkTheme: boolean;
  isCompact: boolean;
}

type BadgeStage = "pass" | "warn" | "fail";

function getBadgeStage(ratio: number, target: number): BadgeStage {
  if (ratio >= target * 1.5) return "pass";
  if (ratio >= target) return "warn";
  return "fail";
}

function ColorButton({
  color,
  label,
  property,
  onClick,
  isLocked,
  onLockToggle,
  ratio,
  target,
  isDarkTheme,
  isCompact,
}: ColorButtonProps) {
  const stage = getBadgeStage(ratio, target);
  return (
    <div className={`relative group ${isCompact ? "h-12" : "h-full"}`}>
      <div
        className={`absolute -top-2 -left-2 z-10 p-1 rounded-full border shadow-sm flex items-center justify-center ${
          isDarkTheme
            ? "bg-neutral-900 border-neutral-700 text-neutral-200"
            : "bg-neutral-50 border-neutral-200 text-neutral-700"
        }`}
        title={
          stage === "fail"
            ? `Below ${target}:1 target (${ratio}:1)`
            : `Passes ${target}:1 target (${ratio}:1)`
        }
      >
        {stage === "pass" ? (
          <Check size={9} strokeWidth={3.25} className="text-current" />
        ) : stage === "warn" ? (
          <Check size={9} strokeWidth={3.25} className="text-current" />
        ) : (
          <X size={9} strokeWidth={3.25} className="text-current" />
        )}
      </div>
      <button
        onClick={(e) => onClick(color, property, e.currentTarget)}
        className={`${isCompact ? "w-full" : "w-32"} h-full rounded-md flex items-center justify-center hover:cursor-pointer border-1 border-neutral-50 hover:border-neutral-200 transition-colors`}
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
        className={`absolute -top-2 -right-2 p-1 rounded-full border transition-opacity ${
          isLocked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        } ${
          isDarkTheme
            ? "bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
        }`}
        title={isLocked ? "Unlock color" : "Lock color"}
      >
        {isLocked ? (
          <Lock size={9} strokeWidth={3.25} className="text-current" />
        ) : (
          <Unlock size={9} strokeWidth={3.25} className="text-current" />
        )}
      </button>
    </div>
  );
}

const contrastAuditDefinitions = [
  {
    id: "text/background",
    label: "Text on Background",
    foreground: "text",
    background: "background",
    min: 7,
    required: true,
  },
  {
    id: "primary/background",
    label: "Primary on Background",
    foreground: "primary",
    background: "background",
    min: 3,
    required: true,
  },
  {
    id: "text/secondary",
    label: "Text on Secondary",
    foreground: "text",
    background: "secondary",
    min: 4.5,
    required: true,
  },
  {
    id: "accent/secondary",
    label: "Accent on Secondary",
    foreground: "accent",
    background: "secondary",
    min: 3,
    required: true,
  },
  {
    id: "accent/background",
    label: "Accent on Background",
    foreground: "accent",
    background: "background",
    min: 3,
    required: true,
  },
] as const;

function getContrastAudit(palette: Record<string, string>) {
  return contrastAuditDefinitions.map((definition) => {
    const ratio = getContrastRatio(
      palette[definition.foreground],
      palette[definition.background],
    );
    return {
      ...definition,
      ratio,
      pass: ratio >= definition.min,
    };
  });
}

function isPaletteAccessible(palette: Record<string, string>) {
  return getContrastAudit(palette)
    .filter((item) => item.required)
    .every((item) => item.pass);
}

export function ThemeCustomizer() {
  const { theme, updateThemeProperty, themeName, setTheme, undo, redo, canUndo, canRedo, pushHistory } = useTheme();

  const [colorPickerState, dispatchColorPicker] = useReducer(colorPickerReducer, initialColorPickerState);

  const [lockedColors, setLockedColors] = useState<Set<string>>(new Set());
  const [isCompact, setIsCompact] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const horizontalWidthRef = useRef(0);

  const handleColorClick = (
    color: string,
    property: string,
    button: HTMLButtonElement,
  ) => {
    if (lockedColors.has(property)) return;

    const isSameButton =
      colorPickerState.isOpen && colorPickerState.selectedProperty === property && colorPickerState.activeButton === button;

    if (isSameButton) {
      dispatchColorPicker({ type: 'CLOSE_COLOR_PICKER' });
      return;
    }

    pushHistory();
    dispatchColorPicker({
      type: 'OPEN_COLOR_PICKER',
      payload: { color, property, button }
    });
  };

  const handleColorChange = (newColor: string) => {
    if (!colorPickerState.selectedProperty) return;

    const selectedProperty = colorPickerState.selectedProperty;

    updateThemeProperty(["colors", selectedProperty], newColor);
    dispatchColorPicker({ type: 'SET_COLOR', payload: newColor });

    const currentText =
      selectedProperty === "text" ? newColor : theme.colors.text;
    const currentBg =
      selectedProperty === "background" ? newColor : theme.colors.background;

    if (!lockedColors.has("border")) {
      const newBorder = chroma.mix(currentText, currentBg, 0.82, "rgb").hex();
      updateThemeProperty(["colors", "border"], newBorder);
    }
    if (!lockedColors.has("muted")) {
      const newMuted = chroma.mix(currentText, currentBg, 0.55, "rgb").hex();
      updateThemeProperty(["colors", "muted"], newMuted);
    }

    const onColorMap: Record<string, string> = {
      primary: "onPrimary",
      secondary: "onSecondary",
      accent: "onAccent",
    };
    if (onColorMap[selectedProperty]) {
      updateThemeProperty(
        ["colors", onColorMap[selectedProperty]],
        pickOnColor(newColor),
      );
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

  const smartShuffle = () => {
    pushHistory();
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
    );

    for (
      let index = 0;
      index < 24 && !isPaletteAccessible(palette);
      index += 1
    ) {
      palette = generateColorPalette(
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`,
        themeName === "dark",
        lockedColorValues,
      );
    }

    Object.entries(palette).forEach(([property, color]) => {
      if (!lockedColors.has(property)) {
        updateThemeProperty(["colors", property], color);
      }
    });
  };

  const toggleTheme = () => {
    const targetIsDark = themeName !== "dark";
    const targetMode = targetIsDark ? "dark" : "light";
    const adapted = adaptColorsForMode(
      theme.colors as Record<string, string>,
      targetIsDark,
      lockedColors
    );
    setTheme(targetMode, adapted as Partial<typeof theme.colors>);
  };

  // Center the popover above the button
  useLayoutEffect(() => {
    if (colorPickerState.isOpen && colorPickerState.activeButton && popoverRef.current) {
      const buttonRect = colorPickerState.activeButton.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      const left =
        buttonRect.left -
        (containerRect?.left || 0) +
        buttonRect.width / 2 -
        popoverRect.width / 2;
      dispatchColorPicker({ type: 'SET_POPOVER_POSITION', payload: left });
    }
  }, [colorPickerState.isOpen, colorPickerState.activeButton]);

  // Detect toolbar overflow and toggle compact mode
  useLayoutEffect(() => {
    if (!isCompact && containerRef.current) {
      const toolbar = containerRef.current.firstElementChild as HTMLElement;
      if (toolbar) {
        horizontalWidthRef.current = toolbar.scrollWidth;
        if (toolbar.scrollWidth > window.innerWidth - 16) {
          setIsCompact(true);
        }
      }
    }
  }, [isCompact]);

  useEffect(() => {
    const handleResize = () => {
      if (isCompact && horizontalWidthRef.current > 0) {
        if (window.innerWidth >= horizontalWidthRef.current + 32) {
          setIsCompact(false);
        }
      } else if (!isCompact && containerRef.current) {
        const toolbar = containerRef.current.firstElementChild as HTMLElement;
        if (toolbar && toolbar.scrollWidth > window.innerWidth - 16) {
          horizontalWidthRef.current = toolbar.scrollWidth;
          setIsCompact(true);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCompact]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        dispatchColorPicker({ type: 'CLOSE_COLOR_PICKER' });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colorButtons: ColorButtonData[] = [
    {
      color: theme.colors.text,
      label: "Text",
      property: "text",
      fg: "text",
      bg: "background",
      target: 7,
    },
    {
      color: theme.colors.background,
      label: "Background",
      property: "background",
      fg: "text",
      bg: "background",
      target: 7,
    },
    {
      color: theme.colors.primary,
      label: "Primary",
      property: "primary",
      fg: "primary",
      bg: "background",
      target: 3,
    },
    {
      color: theme.colors.secondary,
      label: "Secondary",
      property: "secondary",
      fg: "text",
      bg: "secondary",
      target: 4.5,
    },
    {
      color: theme.colors.accent,
      label: "Accent",
      property: "accent",
      fg: "accent",
      bg: "secondary",
      target: 3,
    },
  ];

  const ratioByProperty = colorButtons.reduce<Record<string, number>>(
    (acc, button) => {
      const fg = theme.colors[button.fg];
      const bg = theme.colors[button.bg];
      acc[button.property] = getContrastRatio(fg, bg);
      return acc;
    },
    {},
  );

  const currentContrastAudit = getContrastAudit(
    theme.colors as Record<string, string>,
  );
  const requiredContrastAudit = currentContrastAudit.filter(
    (item) => item.required,
  );
  const requiredContrastPassCount = requiredContrastAudit.filter(
    (item) => item.pass,
  ).length;

  return (
    <>
      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />

      <div
        ref={containerRef}
        className={`fixed z-50 ${
          isCompact
            ? "bottom-0 left-0 right-0"
            : "bottom-4 left-1/2 -translate-x-1/2"
        }`}
      >
        <div
          className={`flex border border-neutral-200 bg-neutral-50 shadow-lg ${
            isCompact
              ? "flex-col gap-2 rounded-t-lg p-2 items-stretch"
              : "flex-row gap-4 rounded-lg p-1 h-16 items-center"
          }`}
        >
          <div
            className={`flex ${
              isCompact
                ? "flex-col gap-2 w-full"
                : "flex-row gap-4 w-auto h-full"
            }`}
          >
            {colorButtons.map(({ color, label, property, target }) => (
              <ColorButton
                key={property}
                color={color}
                label={label}
                property={property}
                onClick={handleColorClick}
                isLocked={lockedColors.has(property)}
                onLockToggle={handleLockToggle}
                ratio={ratioByProperty[property]}
                target={target}
                isDarkTheme={themeName === "dark"}
                isCompact={isCompact}
              />
            ))}
          </div>

          <ToolbarButtons
            isCompact={isCompact}
            canUndo={canUndo}
            canRedo={canRedo}
            themeName={themeName}
            currentContrastAudit={currentContrastAudit}
            requiredContrastPassCount={requiredContrastPassCount}
            requiredContrastAuditLength={requiredContrastAudit.length}
            onUndo={undo}
            onRedo={redo}
            onSmartShuffle={smartShuffle}
            onToggleTheme={toggleTheme}
            onExportClick={() => setShowExportModal(!showExportModal)}
          />
        </div>

        <ColorPickerPopover
          ref={popoverRef}
          isOpen={colorPickerState.isOpen}
          selectedColor={colorPickerState.selectedColor}
          selectedProperty={colorPickerState.selectedProperty}
          colorButtons={colorButtons}
          ratioByProperty={ratioByProperty}
          popoverLeft={colorPickerState.popoverLeft}
          onColorChange={handleColorChange}
        />
      </div>
    </>
  );
}
