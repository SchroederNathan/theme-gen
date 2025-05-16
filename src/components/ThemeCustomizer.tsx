"use client";

import { useTheme } from "@/context/ThemeContext";
import { getTextColor } from "@/lib/colorUtils";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { ColorPicker, ColorPickerVariant } from "./ColorPicker";

interface ColorButtonProps {
  color: string;
  label: string;
  property: string;
  onClick: (color: string, property: string, button: HTMLButtonElement) => void;
}

function ColorButton({ color, label, property, onClick }: ColorButtonProps) {
  return (
    <button
      onClick={(e) => onClick(color, property, e.currentTarget)}
      className="w-32 rounded-md flex items-center justify-center hover:cursor-pointer border-1 border-neutral-50 hover:border-neutral-200 transition-colors"
      style={{ backgroundColor: color }}
    >
      <p className="text-lg font-bold" style={{ color: getTextColor(color) }}>
        {label}
      </p>
    </button>
  );
}

export function ThemeCustomizer() {
  const { theme, updateThemeProperty } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<HTMLButtonElement | null>(null);
  const [popoverLeft, setPopoverLeft] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleColorClick = (
    color: string,
    property: string,
    button: HTMLButtonElement
  ) => {
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

  // Center the popover above the button
  useLayoutEffect(() => {
    if (isOpen && activeButton && popoverRef.current) {
      const buttonRect = activeButton.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      // Calculate left relative to the container
      const left =
        buttonRect.left - (containerRect?.left || 0) +
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

  const colorButtons = [
    {
      color: theme.colors.background,
      label: "Background",
      property: "background",
    },
    { color: theme.colors.primary, label: "Primary", property: "primary" },
    {
      color: theme.colors.secondary,
      label: "Secondary",
      property: "secondary",
    },
    { color: theme.colors.surface, label: "Surface", property: "surface" },
    { color: theme.colors.border, label: "Border", property: "border" },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex flex-row gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-1 h-16 shadow-lg">
        {colorButtons.map(({ color, label, property }) => (
          <ColorButton
            key={property}
            color={color}
            label={label}
            property={property}
            onClick={handleColorClick}
          />
        ))}
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
  );
}
