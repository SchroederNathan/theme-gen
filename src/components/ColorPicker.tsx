import {
  HSV,
  RGB,
  getColorName,
  hexToRgb,
  hsvToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from "@/lib/colorUtils";
import { Check, Copy, Pipette } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

export enum ColorPickerVariant {
  Predefined = "predefined",
  Free = "free",
}

export enum ColorFormat {
  HEX = "hex",
  RGB = "rgb",
  HSL = "hsl",
}

interface ColorPickerProps {
  color: string;
  onChange(color: string): void;
  format?: ColorFormat;
  variant: ColorPickerVariant;
}

// Helper: clamp
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export const ColorPicker = (props: ColorPickerProps) => {
  const {
    color,
    onChange,
    format = ColorFormat.HEX,
    variant,
  } = props;
  // Use HSV for all state and logic
  const [currentColor, setCurrentColor] = useState(color);
  const [hsv, setHsv] = useState<HSV>(rgbToHsv(hexToRgb(color)));
  const [rgb, setRgb] = useState<RGB>(hexToRgb(color));
  const [currentFormat, setCurrentFormat] = useState<ColorFormat>(format);
  const [isDraggingSV, setIsDraggingSV] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [eyeDropperSupported, setEyeDropperSupported] = useState(false);

  // Keep state in sync with props
  useEffect(() => {
    setCurrentColor(color);
    const newRgb = hexToRgb(color);
    setRgb(newRgb);
    setHsv(rgbToHsv(newRgb));
  }, [color]);

  useEffect(() => {
    setEyeDropperSupported(
      typeof window !== "undefined" && "EyeDropper" in window
    );
  }, []);

  // Update color from HSV
  const updateColorFromHSV = useCallback((newHsv: HSV) => {
    setHsv(newHsv);
    const newRgb = hsvToRgb(newHsv);
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb);
    setCurrentColor(newHex);
    onChange(newHex);
  }, [onChange]);

  // SV Square logic
  const handleSVPointer = useCallback((clientX: number, clientY: number) => {
    if (!svRef.current) return;
    const rect = svRef.current.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);
    const s = (x / rect.width) * 100;
    const v = 100 - (y / rect.height) * 100;
    updateColorFromHSV({ ...hsv, s, v });
  }, [hsv, updateColorFromHSV]);

  const handleSVMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingSV(true);
    handleSVPointer(e.clientX, e.clientY);
  };

  // Hue bar logic
  const handleHuePointer = useCallback((clientX: number) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const h = (x / rect.width) * 360;
    updateColorFromHSV({ ...hsv, h });
  }, [hsv, updateColorFromHSV]);

  const handleHueMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingHue(true);
    handleHuePointer(e.clientX);
  };

  // Mouse move listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSV) {
        handleSVPointer(e.clientX, e.clientY);
      } else if (isDraggingHue) {
        handleHuePointer(e.clientX);
      }
    };
    const handleMouseUp = () => {
      setIsDraggingSV(false);
      setIsDraggingHue(false);
    };
    if (isDraggingSV || isDraggingHue) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDraggingSV, isDraggingHue, hsv, handleSVPointer, handleHuePointer]);

  // SV square background: hue is fixed, S/V vary
  function getSVBackground(hue: number) {
    return `linear-gradient(to top, black, transparent), linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`;
  }

  // Copy to clipboard handler
  const handleCopy = async () => {
    let valueToCopy = currentColor;
    if (currentFormat === ColorFormat.RGB) {
      valueToCopy = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    } else if (currentFormat === ColorFormat.HSL) {
      const hsl = rgbToHsl(rgb);
      valueToCopy = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback or error
    }
  };

  // EyeDropper handler
  const handleEyeDropper = async () => {
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      // @ts-expect-error EyeDropper API is not fully typed
      const eyeDropper = new window.EyeDropper();
      try {
        const result = await eyeDropper.open();
        if (result.sRGBHex) {
          setCurrentColor(result.sRGBHex);
          const newRgb = hexToRgb(result.sRGBHex);
          setRgb(newRgb);
          setHsv(rgbToHsv(newRgb));
          onChange(result.sRGBHex);
        }
      } catch {
        // cancelled or error
      }
    }
  };

  return (
    <div className="w-64 space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 shadow-lg">
      {/* Format Selector */}
      {variant === ColorPickerVariant.Free && (
        <div className="flex gap-2 mb-2">
          {Object.values(ColorFormat).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setCurrentFormat(fmt)}
              className={`flex-1 rounded-md px-2 py-1 text-sm font-medium hover:cursor-pointer transition-colors ${
                currentFormat === fmt
                  ? "bg-neutral-800 text-neutral-50"
                  : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 "
              }`}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* SV Square */}
      <div
        ref={svRef}
        className={`relative w-full aspect-square rounded-lg overflow-hidden border border-neutral-200 ${
          isDraggingSV ? "cursor-none" : "cursor-crosshair"
        }`}
        style={{ background: getSVBackground(hsv.h) }}
        onMouseDown={handleSVMouseDown}
      >
        {/* SV Indicator */}
        <div
          className="absolute size-5 rounded-full border-2 border-white shadow pointer-events-none"
          style={{
            left: `calc(${hsv.s}% - 10px)`,
            top: `calc(${100 - hsv.v}% - 10px)`,
            backgroundColor: currentColor,
          }}
        />
      </div>

      {/* Hue Bar */}
      <div
        ref={hueRef}
        className="relative h-3 w-full mt-2 rounded-full cursor-pointer border border-neutral-200 "
        style={{
          background:
            "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)",
        }}
        onMouseDown={handleHueMouseDown}
      >
        {/* Hue Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 size-5 rounded-full border-2 border-white shadow pointer-events-none"
          style={{
            left: `calc(${((hsv.h % 360) / 360) * 100}% - 10px)`,
            backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
          }}
        />
      </div>

      {/* Color Inputs */}
      <div className="space-y-2 mt-2">
        {currentFormat === ColorFormat.HEX && (
          <div className="flex items-center gap-2">
            <span className="w-8 text-sm font-medium text-neutral-800">
              HEX
            </span>
            <input
              type="text"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              onBlur={() => {
                // Only update if valid hex
                if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(currentColor)) {
                  const newRgb = hexToRgb(currentColor);
                  setRgb(newRgb);
                  setHsv(rgbToHsv(newRgb));
                  onChange(currentColor);
                }
              }}
              className="w-full rounded-md border border-neutral-100  px-2 py-1 text-sm text-neutral-800  focus:outline-none focus:border-neutral-200  hover:border-neutral-200 transition-all"
              pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
            />
          </div>
        )}
        {currentFormat === ColorFormat.RGB && (
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => {
                const r = clamp(Number(e.target.value), 0, 255);
                const newRgb = { ...rgb, r };
                setRgb(newRgb);
                setCurrentColor(rgbToHex(newRgb));
                setHsv(rgbToHsv(newRgb));
                onChange(rgbToHex(newRgb));
              }}
              className="w-1/3 rounded-md border border-neutral-100 px-2 py-1 text-sm text-neutral-800 focus:outline-none focus:border-neutral-200 hover:border-neutral-200 transition-all"
            />
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => {
                const g = clamp(Number(e.target.value), 0, 255);
                const newRgb = { ...rgb, g };
                setRgb(newRgb);
                setCurrentColor(rgbToHex(newRgb));
                setHsv(rgbToHsv(newRgb));
                onChange(rgbToHex(newRgb));
              }}
              className="w-1/3 rounded-md border border-neutral-100 px-2 py-1 text-sm text-neutral-800 focus:outline-none focus:border-neutral-200 hover:border-neutral-200 transition-all"
            />
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => {
                const b = clamp(Number(e.target.value), 0, 255);
                const newRgb = { ...rgb, b };
                setRgb(newRgb);
                setCurrentColor(rgbToHex(newRgb));
                setHsv(rgbToHsv(newRgb));
                onChange(rgbToHex(newRgb));
              }}
              className="w-1/3 rounded-md border border-neutral-100 px-2 py-1 text-sm text-neutral-800 focus:outline-none focus:border-neutral-200 hover:border-neutral-200 transition-all"
            />
          </div>
        )}
        {currentFormat === ColorFormat.HSL && (
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="360"
              value={Math.round(hsv.h)}
              onChange={(e) => {
                const h = clamp(Number(e.target.value), 0, 360);
                updateColorFromHSV({ ...hsv, h });
              }}
              className="w-1/3 rounded-md border border-neutral-100 px-2 py-1 text-sm text-neutral-800 focus:outline-none focus:border-neutral-200 hover:border-neutral-200 transition-all"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round(hsv.s)}
              onChange={(e) => {
                const s = clamp(Number(e.target.value), 0, 100);
                updateColorFromHSV({ ...hsv, s });
              }}
              className="w-1/3 rounded-md border border-neutral-100 px-2 py-1 text-sm text-neutral-800 focus:outline-none focus:border-neutral-200 hover:border-neutral-200 transition-all"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round(hsv.v)}
              onChange={(e) => {
                const v = clamp(Number(e.target.value), 0, 100);
                updateColorFromHSV({ ...hsv, v });
              }}
              className="w-1/3 rounded-md border border-neutral-100 px-2 py-1 text-sm text-neutral-800 focus:outline-none focus:border-neutral-200 hover:border-neutral-200 transition-all"
            />
          </div>
        )}
        <div className="flex flex-row justify-end gap-2 items-center mt-2">
          <span className="text-xs text-neutral-600 mr-auto">
            {getColorName(currentColor)?.name || "Unknown"}
          </span>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md border border-neutral-100  focus:outline-none focus:border-neutral-200 hover:border-neutral-200 hover:cursor-pointer transition-all"
            onClick={handleCopy}
            title="Copy color"
            type="button"
          >
            {copied ? (
              <Check size={16} className="text-neutral-800" />
            ) : (
              <Copy size={16} />
            )}
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md border border-neutral-100  focus:outline-none focus:border-neutral-200 hover:border-neutral-200 hover:cursor-pointer transition-all disabled:opacity-50"
            onClick={handleEyeDropper}
            title={
              eyeDropperSupported
                ? "Pick color from screen"
                : "EyeDropper not supported"
            }
            type="button"
            disabled={!eyeDropperSupported}
          >
            <Pipette size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
