import { forwardRef } from "react";
import { Check, X } from "lucide-react";
import { ColorPicker, ColorPickerVariant } from "./ColorPicker";
import { ColorButtonData } from "./theme-customizer-types";

interface ColorPickerPopoverProps {
  isOpen: boolean;
  selectedColor: string | null;
  selectedProperty: string | null;
  colorButtons: ColorButtonData[];
  ratioByProperty: Record<string, number>;
  popoverLeft: number;
  onColorChange: (color: string) => void;
}

export const ColorPickerPopover = forwardRef<HTMLDivElement, ColorPickerPopoverProps>(
  function ColorPickerPopover(
    {
      isOpen,
      selectedColor,
      selectedProperty,
      colorButtons,
      ratioByProperty,
      popoverLeft,
      onColorChange,
    },
    ref
  ) {
    if (!isOpen || !selectedColor || !selectedProperty) return null;

    const btn = colorButtons.find((b) => b.property === selectedProperty);
    if (!btn) return null;

    const ratio = ratioByProperty[selectedProperty];
    const passes = ratio >= btn.target;

    return (
      <div
        ref={ref}
        className="absolute mb-4"
        style={{
          bottom: "100%",
          left: popoverLeft,
        }}
      >
        <div className="relative">
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rotate-45 size-4 bg-neutral-50 border-r border-b rounded-ee-xs border-neutral-200" />
          <div className="mb-2 w-64 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-700 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-neutral-800">Contrast Check</p>
              <p className="font-semibold">{ratio.toFixed(1)}:1</p>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {passes ? (
                <Check size={11} strokeWidth={2.75} className="text-green-600" />
              ) : (
                <X size={11} strokeWidth={2.75} className="text-red-600" />
              )}
              <span>
                Target {btn.target}:1 — {passes ? "Pass" : "Fail"}
              </span>
            </div>
            <p className="mt-1.5 text-[10px] text-neutral-500">
              {btn.fg} vs {btn.bg}
            </p>
          </div>
          <ColorPicker
            color={selectedColor}
            onChange={onColorChange}
            variant={ColorPickerVariant.Free}
          />
        </div>
      </div>
    );
  }
);
