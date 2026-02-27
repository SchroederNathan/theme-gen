import namedColors from "../../color-names.json";
import nearestColor from "nearest-color";
import chroma from "chroma-js";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

const colors = (
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
  const [l, , h] = chroma(color).oklch();
  const hue = isNaN(h) ? 0 : h;
  if (l < 0.5) {
    return chroma.oklch(0.9, 0.02, hue).hex();
  } else {
    return chroma.oklch(0.15, 0.02, hue).hex();
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

function nudgeForContrastOklch(
  color: string,
  against: string,
  minimumRatio: number
): string {
  const [l, c, h] = chroma(color).oklch();
  const againstLuminance = chroma(against).luminance();
  const direction = againstLuminance > 0.5 ? -0.03 : 0.03;

  let currentL = l;
  for (let step = 0; step < 25; step += 1) {
    const candidate = chroma.oklch(
      Math.max(0, Math.min(1, currentL)),
      c,
      h
    );
    if (getContrastRatio(candidate.hex(), against) >= minimumRatio) {
      return candidate.hex();
    }
    currentL += direction;
  }

  return chroma.oklch(Math.max(0, Math.min(1, currentL)), c, h).hex();
}

export type HarmonyMode = "complementary" | "monochromatic";

function getAccentOffset(mode: HarmonyMode): number {
  return mode === "complementary" ? 180 : 0;
}

export function maxChromaInGamut(l: number, h: number): number {
  if (isNaN(h) || l <= 0 || l >= 1) return 0;
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (chroma.oklch(l, mid, h).clipped()) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return lo;
}

export function safeChroma(l: number, h: number, vibrancy: number): number {
  return maxChromaInGamut(l, h) * Math.max(0, Math.min(1, vibrancy));
}

export function mixOklch(c1: string, c2: string, ratio: number): string {
  return chroma.mix(c1, c2, ratio, "oklch").hex();
}

function remapHue(hue: number): number {
  const h = ((hue % 360) + 360) % 360;
  const center = 110;
  const halfWidth = 40;
  const maxDeflection = 25;
  const dist = Math.abs(h - center);
  if (dist >= halfWidth) return h;
  const t = 1 - dist / halfWidth;
  const deflection = maxDeflection * 0.5 * (1 + Math.cos(Math.PI * (1 - t)));
  return h < center ? h - deflection : h + deflection;
}

export function deriveBaseColorFromLocks(
  lockedColors: Record<string, string>,
  harmonyMode: HarmonyMode
): string | null {
  const jitter = (range: number) => (Math.random() - 0.5) * 2 * range;

  // Primary locked — use its hue directly
  if (lockedColors.primary) {
    const [, c, h] = chroma(lockedColors.primary).oklch();
    if (c > 0.01 && !isNaN(h)) {
      const hue = ((h + jitter(15)) % 360 + 360) % 360;
      return chroma.oklch(0.5, 0.15, hue).hex();
    }
  }

  // Accent locked — reverse-engineer primary hue via harmony offset
  if (lockedColors.accent) {
    const [, c, h] = chroma(lockedColors.accent).oklch();
    if (c > 0.01 && !isNaN(h)) {
      const offset = getAccentOffset(harmonyMode);
      const hue = ((h - offset + jitter(25)) % 360 + 360) % 360;
      return chroma.oklch(0.5, 0.15, hue).hex();
    }
  }

  // Background / text / container — extract hue tint if chromatic
  for (const key of ["background", "text", "container"] as const) {
    if (lockedColors[key]) {
      const [, c, h] = chroma(lockedColors[key]).oklch();
      if (c > 0.01 && !isNaN(h)) {
        const hue = ((h + jitter(25)) % 360 + 360) % 360;
        return chroma.oklch(0.5, 0.15, hue).hex();
      }
    }
  }

  return null;
}

export function generateColorPalette(
  baseColor: string,
  isDarkMode: boolean = false,
  lockedColors: Record<string, string> = {},
  harmonyMode: HarmonyMode = "complementary"
): Record<string, string> {
  console.log("generateColorPalette baseColor:", baseColor);
  const rawHue = chroma(baseColor).oklch()[2] || 0;

  const primaryHue = remapHue(rawHue);
  const accentOffset = getAccentOffset(harmonyMode);
  const accentHue = remapHue((primaryHue + accentOffset) % 360);

  const primaryL = isDarkMode ? 0.75 : 0.50;
  const accentL = isDarkMode ? 0.78 : 0.52;

  const text =
    lockedColors.text ||
    chroma
      .oklch(isDarkMode ? 0.93 : 0.18, safeChroma(isDarkMode ? 0.93 : 0.18, primaryHue, 0.15), primaryHue)
      .hex();

  const background =
    lockedColors.background ||
    chroma
      .oklch(isDarkMode ? 0.16 : 0.985, safeChroma(isDarkMode ? 0.16 : 0.985, primaryHue, 0.08), primaryHue)
      .hex();

  let primary =
    lockedColors.primary ||
    chroma
      .oklch(primaryL, safeChroma(primaryL, primaryHue, 0.85), primaryHue)
      .hex();

  const container =
    lockedColors.container ||
    chroma
      .oklch(isDarkMode ? 0.25 : 0.94, safeChroma(isDarkMode ? 0.25 : 0.94, primaryHue, 0.15), primaryHue)
      .hex();

  let accent =
    lockedColors.accent ||
    chroma
      .oklch(accentL, safeChroma(accentL, accentHue, 0.75), accentHue)
      .hex();

  primary = nudgeForContrastOklch(primary, background, 3);
  accent = nudgeForContrastOklch(accent, background, 3);

  const finalText = nudgeForContrastOklch(text, background, 7);

  const border =
    lockedColors.border || mixOklch(finalText, background, 0.82);

  const muted =
    lockedColors.muted || mixOklch(finalText, background, 0.55);

  // State colors — fixed hues, matched lightness to primary
  const successHue = 155;
  const errorHue = 25;
  const warningHue = 70;

  let success =
    lockedColors.success ||
    chroma.oklch(primaryL, safeChroma(primaryL, successHue, 0.75), successHue).hex();
  let error =
    lockedColors.error ||
    chroma.oklch(primaryL, safeChroma(primaryL, errorHue, 0.75), errorHue).hex();
  let warning =
    lockedColors.warning ||
    chroma.oklch(primaryL, safeChroma(primaryL, warningHue, 0.75), warningHue).hex();

  success = nudgeForContrastOklch(success, background, 3);
  error = nudgeForContrastOklch(error, background, 3);
  warning = nudgeForContrastOklch(warning, background, 3);

  const ring = lockedColors.ring || primary;

  return {
    text: finalText,
    background,
    primary,
    container,
    accent,
    success,
    error,
    warning,
    onPrimary: pickOnColor(primary),
    onContainer: pickOnColor(container),
    onAccent: pickOnColor(accent),
    onSuccess: pickOnColor(success),
    onError: pickOnColor(error),
    onWarning: pickOnColor(warning),
    border,
    muted,
    ring,
  };
}

export function pickOnColor(bg: string): string {
  const [, , h] = chroma(bg).oklch();
  const hue = isNaN(h) ? 0 : h;

  // Determine direction based on which extreme has better contrast
  const whiteContrast = getContrastRatio("#ffffff", bg);
  const blackContrast = getContrastRatio("#000000", bg);
  const goLight = whiteContrast >= blackContrast;

  // Start near the extreme with a visible hue tint, walk inward
  let l = goLight ? 0.97 : 0.06;
  const step = goLight ? -0.02 : 0.02;

  for (let i = 0; i < 30; i++) {
    const c = safeChroma(l, hue, 0.25);
    const candidate = chroma.oklch(l, c, hue).hex();
    if (getContrastRatio(candidate, bg) >= 4.5) return candidate;
    l += step;
  }

  // Fallback: pure white or black
  return goLight ? "#ffffff" : "#000000";
}

export function adaptColorsForMode(
  currentColors: Record<string, string>,
  targetIsDark: boolean,
  lockedColors: Set<string> = new Set()
): Record<string, string> {
  const vibrancyMap: Record<string, number> = {
    text: 0.15,
    background: 0.08,
    primary: 0.85,
    container: 0.15,
    accent: 0.75,
  };

  const targetL: Record<string, number> = {
    text:       targetIsDark ? 0.93  : 0.18,
    background: targetIsDark ? 0.16  : 0.985,
    primary:    targetIsDark ? 0.65  : 0.55,
    container:  targetIsDark ? 0.25  : 0.94,
    accent:     targetIsDark ? 0.68  : 0.58,
  };

  const adapted: Record<string, string> = {};

  for (const [role, l] of Object.entries(targetL)) {
    if (lockedColors.has(role)) {
      adapted[role] = currentColors[role];
    } else {
      const hue = chroma(currentColors[role]).oklch()[2] || 0;
      adapted[role] = chroma.oklch(l, safeChroma(l, hue, vibrancyMap[role]), hue).hex();
    }
  }

  // Contrast nudge primary and accent against background
  adapted.primary = nudgeForContrastOklch(adapted.primary, adapted.background, 3);
  adapted.accent = nudgeForContrastOklch(adapted.accent, adapted.background, 3);
  adapted.text = nudgeForContrastOklch(adapted.text, adapted.background, 7);

  // Derive border and muted via OKLCH mixing
  adapted.border = lockedColors.has("border")
    ? currentColors.border
    : mixOklch(adapted.text, adapted.background, 0.82);
  adapted.muted = lockedColors.has("muted")
    ? currentColors.muted
    : mixOklch(adapted.text, adapted.background, 0.55);

  // State colors — preserve hue, adjust L for target mode
  const primaryL = targetL.primary;
  const stateHues: Record<string, number> = {
    success: currentColors.success ? (chroma(currentColors.success).oklch()[2] || 155) : 155,
    error: currentColors.error ? (chroma(currentColors.error).oklch()[2] || 25) : 25,
    warning: currentColors.warning ? (chroma(currentColors.warning).oklch()[2] || 70) : 70,
  };

  for (const [role, hue] of Object.entries(stateHues)) {
    if (lockedColors.has(role)) {
      adapted[role] = currentColors[role];
    } else {
      adapted[role] = chroma.oklch(primaryL, safeChroma(primaryL, hue, 0.75), hue).hex();
      adapted[role] = nudgeForContrastOklch(adapted[role], adapted.background, 3);
    }
  }

  // Ring
  adapted.ring = lockedColors.has("ring")
    ? currentColors.ring
    : adapted.primary;

  // On-colors
  adapted.onPrimary = pickOnColor(adapted.primary);
  adapted.onContainer = pickOnColor(adapted.container);
  adapted.onAccent = pickOnColor(adapted.accent);
  adapted.onSuccess = pickOnColor(adapted.success);
  adapted.onError = pickOnColor(adapted.error);
  adapted.onWarning = pickOnColor(adapted.warning);

  return adapted;
}
