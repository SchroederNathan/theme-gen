import namedColors from "../../color-names.json";
import nearestColor from "nearest-color";
import chroma from "chroma-js";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export const colors = (
  namedColors as Array<{ name: string; hex: string }>
).reduce(
  (o: Record<string, string>, { name, hex }: { name: string; hex: string }) =>
    Object.assign(o, { [name]: hex }),
  {}
);

export const getColorName = nearestColor.from(colors);

export const getIconColor = (color: string): string =>
  chroma(color).luminance() < 0.05 ? "#ddd" : "#222";

export const getTextColor = (color: string): string => {
  const hsl = hexToHsl(color);
  const luminance = chroma(color).luminance();

  // For dark backgrounds, use a light color with the same hue
  if (luminance < 0.45) {
    // Keep the same hue but make it light and slightly desaturated
    return hslToHex({
      h: hsl.h,
      s: Math.min(30, hsl.s), // Reduce saturation for better readability
      l: 90 // Light but not pure white
    });
  } else {
    // For light backgrounds, use a dark color with the same hue
    return hslToHex({
      h: hsl.h,
      s: Math.min(30, hsl.s), // Reduce saturation for better readability
      l: 15 // Dark but not pure black
    });
  }
};

export interface WCAGContrastResult {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
}

function channelToLinear(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color: string): number {
  const { r, g, b } = hexToRgb(color);
  const rLin = channelToLinear(r);
  const gLin = channelToLinear(g);
  const bLin = channelToLinear(b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

export function getContrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function getWCAGContrastResult(
  foreground: string,
  background: string
): WCAGContrastResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}

export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function rgbToHex(rgb: RGB): string {
  return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b)
    .toString(16)
    .slice(1)}`;
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

export function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  let s = 0;
  const v = max;

  if (d !== 0) {
    if (max === r) {
      h = ((g - b) / d) % 6;
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  s = max === 0 ? 0 : d / max;
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

export function hsvToRgb(hsv: HSV): RGB {
  const h = hsv.h;
  const s = hsv.s / 100;
  const v = hsv.v / 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

type ColorScheme =
  | "Monochromatic"
  | "Analogous"
  | "Complementary"
  | "Split Complementary"
  | "Triadic"
  | "Tetradic";

function pickAccessibleTextColor(background: string, targetContrast: number = 4.5): string {
  const whiteContrast = getContrastRatio("#FFFFFF", background);
  const blackContrast = getContrastRatio("#111827", background);

  if (whiteContrast >= targetContrast || blackContrast >= targetContrast) {
    return whiteContrast >= blackContrast ? "#FFFFFF" : "#111827";
  }

  return chroma.contrast("#FFFFFF", background) > chroma.contrast("#111827", background)
    ? "#FFFFFF"
    : "#111827";
}

function nudgeForContrast(color: string, against: string, minimumRatio: number): string {
  let candidate = chroma(color);
  const againstLuminance = chroma(against).luminance();

  for (let index = 0; index < 18; index += 1) {
    if (chroma.contrast(candidate, against) >= minimumRatio) {
      return candidate.hex();
    }

    candidate = againstLuminance > 0.45 ? candidate.darken(0.35) : candidate.brighten(0.35);
  }

  return candidate.hex();
}

function deriveBaseHue(baseColor: string, lockedColors: Record<string, string>): number {
  const colorToUse = lockedColors.primary || lockedColors.accent || baseColor;
  return hexToHsl(colorToUse).h;
}

export function generateColorPalette(
  baseColor: string,
  isDarkMode: boolean = false,
  lockedColors: Record<string, string> = {},
  scheme: ColorScheme = "Analogous"
): Record<string, string> {
  void scheme;
  const baseHue = deriveBaseHue(baseColor, lockedColors);
  const background = lockedColors.background || chroma.hsl(baseHue, isDarkMode ? 0.2 : 0.28, isDarkMode ? 0.1 : 0.965).hex();
  const container = lockedColors.container || chroma(background).set("hsl.l", isDarkMode ? 0.16 : 0.925).hex();

  let primary = lockedColors.primary || chroma.hsl((baseHue + 18) % 360, 0.7, isDarkMode ? 0.6 : 0.43).hex();
  let accent = lockedColors.accent || chroma.hsl((baseHue + 168) % 360, 0.68, isDarkMode ? 0.62 : 0.44).hex();

  primary = nudgeForContrast(primary, background, 3);
  accent = nudgeForContrast(accent, background, 3);

  const onBackground = lockedColors.onBackground || pickAccessibleTextColor(background, 7);
  const onContainer = lockedColors.onContainer || pickAccessibleTextColor(container, 7);
  const onPrimary = lockedColors.onPrimary || pickAccessibleTextColor(primary, 4.5);
  const onAccent = lockedColors.onAccent || pickAccessibleTextColor(accent, 4.5);

  const border = lockedColors.border || chroma.mix(onBackground, background, 0.82, "rgb").hex();
  const muted = lockedColors.muted || chroma.mix(onBackground, background, 0.58, "rgb").hex();

  return {
    background,
    onBackground,
    container,
    onContainer,
    primary,
    onPrimary,
    accent,
    onAccent,
    border,
    muted,
  };
}
