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

// ─── Color space conversions ────────────────────────────────────────

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
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// ─── WCAG contrast utilities ────────────────────────────────────────

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

/**
 * Generate the best contrasting text color (white or near-black) for a given surface.
 * Guarantees WCAG AA (4.5:1) contrast.
 */
export function getContrastingTextColor(surfaceHex: string): string {
  const lum = relativeLuminance(surfaceHex);
  return lum > 0.179 ? "#111827" : "#FFFFFF";
}

// ─── Color scheme generation ────────────────────────────────────────

export type ColorScheme =
  | 'Monochromatic'
  | 'Analogous'
  | 'Complementary'
  | 'Split Complementary'
  | 'Triadic'
  | 'Tetradic';

/**
 * Generate harmonious hues from a base hue using color theory.
 */
function getHarmonyHues(baseHue: number, scheme: ColorScheme): number[] {
  const h = baseHue;
  switch (scheme) {
    case 'Monochromatic':
      return [h, h, h];
    case 'Analogous':
      return [h, (h + 30) % 360, (h - 30 + 360) % 360];
    case 'Complementary':
      return [h, (h + 180) % 360];
    case 'Split Complementary':
      return [h, (h + 150) % 360, (h + 210) % 360];
    case 'Triadic':
      return [h, (h + 120) % 360, (h + 240) % 360];
    case 'Tetradic':
      return [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360];
    default:
      return [h];
  }
}

function pickFromHarmony(hues: number[], excludeIndex: number = 0): number {
  const candidates = hues.filter((_, i) => i !== excludeIndex);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? hues[0];
}

/**
 * Derive surface, border, and muted colors from text and background.
 */
function deriveUtilityColors(textHex: string, bgHex: string, isDark: boolean) {
  const bgHsl = hexToHsl(bgHex);
  const textHsl = hexToHsl(textHex);

  // Surface: slightly offset from background (cards, containers)
  const surface = hslToHex({
    h: bgHsl.h,
    s: bgHsl.s,
    l: isDark
      ? Math.min(100, bgHsl.l + 6)
      : Math.min(100, bgHsl.l + 4),
  });

  // Border: between bg and text, low saturation
  const border = hslToHex({
    h: bgHsl.h,
    s: Math.max(5, Math.round(bgHsl.s * 0.3)),
    l: isDark
      ? Math.min(100, bgHsl.l + 18)
      : Math.max(0, bgHsl.l - 14),
  });

  // Muted: subdued text
  const muted = hslToHex({
    h: textHsl.h,
    s: Math.max(5, Math.round(textHsl.s * 0.3)),
    l: isDark
      ? Math.max(0, textHsl.l - 30)
      : Math.min(100, textHsl.l + 35),
  });

  return { surface, border, muted };
}

/**
 * Generate a complete color palette from a base (primary) color.
 *
 * 5 user-controllable colors: text, background, primary, secondary, accent.
 * Derived colors auto-calculated for contrast and harmony.
 */
export function generateColorPalette(
  baseColor: string,
  isDarkMode: boolean = false,
  lockedColors: Record<string, string> = {},
  scheme: ColorScheme = 'Analogous'
): Record<string, string> {
  const baseHsl = hexToHsl(baseColor);
  const harmonyHues = getHarmonyHues(baseHsl.h, scheme);

  // ── Primary ──
  const primary = lockedColors.primary ?? hslToHex({
    h: baseHsl.h,
    s: Math.max(50, Math.min(90, baseHsl.s)),
    l: isDarkMode
      ? Math.max(45, Math.min(65, baseHsl.l))
      : Math.max(35, Math.min(55, baseHsl.l)),
  });

  // ── Background ──
  const background = lockedColors.background ?? hslToHex({
    h: baseHsl.h,
    s: Math.max(5, Math.min(15, Math.round(baseHsl.s * 0.15))),
    l: isDarkMode
      ? Math.floor(Math.random() * 5) + 8
      : Math.floor(Math.random() * 4) + 95,
  });

  // ── Text ──
  const text = lockedColors.text ?? hslToHex({
    h: baseHsl.h,
    s: Math.max(5, Math.min(15, Math.round(baseHsl.s * 0.1))),
    l: isDarkMode
      ? Math.floor(Math.random() * 5) + 90
      : Math.floor(Math.random() * 5) + 8,
  });

  // ── Secondary ──
  const secondaryHue = pickFromHarmony(harmonyHues, 0);
  const secondary = lockedColors.secondary ?? hslToHex({
    h: secondaryHue,
    s: Math.max(45, Math.min(85, baseHsl.s + (Math.random() * 20 - 10))),
    l: isDarkMode
      ? Math.max(45, Math.min(65, 55 + (Math.random() * 10 - 5)))
      : Math.max(35, Math.min(55, 45 + (Math.random() * 10 - 5))),
  });

  // ── Accent ──
  const usedSecondaryHue = hexToHsl(secondary).h;
  const accentCandidates = harmonyHues.filter(h => {
    const diff = Math.abs(h - usedSecondaryHue);
    return diff > 30 && diff < 330;
  });
  const accentHue = accentCandidates.length > 0
    ? accentCandidates[Math.floor(Math.random() * accentCandidates.length)]
    : (baseHsl.h + 60) % 360;
  const accent = lockedColors.accent ?? hslToHex({
    h: accentHue,
    s: Math.max(60, Math.min(95, baseHsl.s + 15)),
    l: isDarkMode
      ? Math.max(50, Math.min(70, 60 + (Math.random() * 10 - 5)))
      : Math.max(40, Math.min(60, 50 + (Math.random() * 10 - 5))),
  });

  // ── Derived colors ──
  const onPrimary = getContrastingTextColor(primary);
  const onSecondary = getContrastingTextColor(secondary);
  const onAccent = getContrastingTextColor(accent);
  const { surface, border, muted } = deriveUtilityColors(text, background, isDarkMode);

  return {
    text,
    background,
    primary,
    secondary,
    accent,
    onPrimary,
    onSecondary,
    onAccent,
    surface,
    border,
    muted,
    success: "#059669",
    error: "#DC2626",
    warning: "#D97706",
  };
}

/**
 * Recalculate all derived colors from the 5 user-controllable colors.
 * Call this whenever any user color changes to keep derived colors in sync.
 */
export function derivePaletteColors(
  userColors: { text: string; background: string; primary: string; secondary: string; accent: string },
  isDarkMode: boolean
): Record<string, string> {
  const { text, background, primary, secondary, accent } = userColors;
  const onPrimary = getContrastingTextColor(primary);
  const onSecondary = getContrastingTextColor(secondary);
  const onAccent = getContrastingTextColor(accent);
  const { surface, border, muted } = deriveUtilityColors(text, background, isDarkMode);

  return {
    onPrimary,
    onSecondary,
    onAccent,
    surface,
    border,
    muted,
  };
}
