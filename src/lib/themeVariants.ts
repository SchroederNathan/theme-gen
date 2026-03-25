import chroma from "chroma-js";
import {
  mixOklch,
  pickOnColor,
  getContrastRatio,
  maxChromaInGamut,
} from "./colorUtils";

export interface ThemeVariant {
  id: string;
  name: string;
  description: string;
  colors: Record<string, string>;
}

const CORE_KEYS = ["text", "background", "primary", "container", "accent"] as const;
const STATE_KEYS = ["success", "error", "warning"] as const;

/**
 * Nudge lightness until the pair meets `minRatio`.
 * `direction` < 0 means darken `fg`, > 0 means lighten.
 */
function nudgeLightness(
  fg: string,
  bg: string,
  minRatio: number
): string {
  const [l, c, h] = chroma(fg).oklch();
  const bgLum = chroma(bg).luminance();
  const dir = bgLum > 0.5 ? -0.03 : 0.03;
  let cur = l;
  for (let i = 0; i < 25; i++) {
    const cand = chroma.oklch(Math.max(0, Math.min(1, cur)), c, h);
    if (getContrastRatio(cand.hex(), bg) >= minRatio) return cand.hex();
    cur += dir;
  }
  return chroma.oklch(Math.max(0, Math.min(1, cur)), c, h).hex();
}

/**
 * Transform a single color in OkLCH space.
 * chromaScale: multiplier for chroma (1 = unchanged)
 * lightnessShift: added to lightness (clamped 0-1)
 * lightnessAnchor: pull lightness toward this value (0-1), 0 = no pull
 */
function transformColor(
  hex: string,
  chromaScale: number,
  lightnessShift: number,
  lightnessAnchor?: number,
  anchorStrength = 0
): string {
  const [l, c, h] = chroma(hex).oklch();
  const hue = isNaN(h) ? 0 : h;

  let newL = l + lightnessShift;
  if (lightnessAnchor !== undefined && anchorStrength > 0) {
    newL = newL + (lightnessAnchor - newL) * anchorStrength;
  }
  newL = Math.max(0, Math.min(1, newL));

  const maxC = maxChromaInGamut(newL, hue);
  const newC = Math.min(c * chromaScale, maxC);

  return chroma.oklch(newL, newC, hue).hex();
}

function deriveUtilityColors(colors: Record<string, string>): Record<string, string> {
  const result = { ...colors };

  result.border = mixOklch(result.text, result.background, 0.82);
  result.muted = mixOklch(result.text, result.background, 0.55);
  result.ring = result.primary;

  result.onPrimary = pickOnColor(result.primary);
  result.onContainer = pickOnColor(result.container);
  result.onAccent = pickOnColor(result.accent);
  result.onSuccess = pickOnColor(result.success);
  result.onError = pickOnColor(result.error);
  result.onWarning = pickOnColor(result.warning);

  // Ensure minimum contrast
  result.text = nudgeLightness(result.text, result.background, 7);
  result.primary = nudgeLightness(result.primary, result.background, 3);
  result.accent = nudgeLightness(result.accent, result.background, 3);
  for (const key of STATE_KEYS) {
    result[key] = nudgeLightness(result[key], result.background, 3);
  }

  // Re-derive on-colors after nudging
  result.onPrimary = pickOnColor(result.primary);
  result.onAccent = pickOnColor(result.accent);
  result.onSuccess = pickOnColor(result.success);
  result.onError = pickOnColor(result.error);
  result.onWarning = pickOnColor(result.warning);

  return result;
}

/**
 * Generate 3 opinionated variants from the current palette.
 */
export function generateThemeVariants(
  currentColors: Record<string, string>,
  isDark: boolean
): ThemeVariant[] {
  // --- SAFER: pull chroma down, push lightness toward safe midpoints ---
  const safer: Record<string, string> = {};
  for (const key of CORE_KEYS) {
    if (key === "text" || key === "background") {
      // Slightly reduce chroma for neutrals
      safer[key] = transformColor(currentColors[key], 0.5, 0);
    } else if (key === "container") {
      safer[key] = transformColor(currentColors[key], 0.4, isDark ? 0.02 : -0.01);
    } else {
      // Primary/accent: reduce vibrancy, pull lightness toward mid
      safer[key] = transformColor(
        currentColors[key],
        0.65,
        0,
        isDark ? 0.7 : 0.45,
        0.25
      );
    }
  }
  for (const key of STATE_KEYS) {
    safer[key] = transformColor(currentColors[key], 0.6, 0, isDark ? 0.7 : 0.45, 0.2);
  }

  // --- BOLDER: max out chroma, widen lightness gap ---
  const bolder: Record<string, string> = {};
  for (const key of CORE_KEYS) {
    if (key === "text") {
      bolder[key] = transformColor(currentColors[key], 1.3, isDark ? 0.03 : -0.03);
    } else if (key === "background") {
      bolder[key] = transformColor(currentColors[key], 1.2, isDark ? -0.02 : 0.01);
    } else if (key === "container") {
      bolder[key] = transformColor(currentColors[key], 1.4, isDark ? -0.03 : 0.02);
    } else {
      // Primary/accent: push saturation up
      bolder[key] = transformColor(currentColors[key], 1.5, isDark ? 0.04 : -0.04);
    }
  }
  for (const key of STATE_KEYS) {
    bolder[key] = transformColor(currentColors[key], 1.5, isDark ? 0.04 : -0.04);
  }

  // --- MUTED: desaturate heavily, soften contrast ---
  const muted: Record<string, string> = {};
  for (const key of CORE_KEYS) {
    if (key === "text") {
      muted[key] = transformColor(currentColors[key], 0.3, isDark ? -0.04 : 0.06);
    } else if (key === "background") {
      muted[key] = transformColor(currentColors[key], 0.2, isDark ? 0.03 : -0.02);
    } else if (key === "container") {
      muted[key] = transformColor(currentColors[key], 0.25, isDark ? 0.03 : -0.01);
    } else {
      muted[key] = transformColor(
        currentColors[key],
        0.35,
        0,
        isDark ? 0.65 : 0.55,
        0.3
      );
    }
  }
  for (const key of STATE_KEYS) {
    muted[key] = transformColor(currentColors[key], 0.35, 0, isDark ? 0.65 : 0.55, 0.3);
  }

  return [
    {
      id: "safer",
      name: "Safer",
      description: "Lower contrast, softer saturation",
      colors: deriveUtilityColors(safer),
    },
    {
      id: "bolder",
      name: "Bolder",
      description: "Higher contrast, vivid saturation",
      colors: deriveUtilityColors(bolder),
    },
    {
      id: "muted",
      name: "Muted",
      description: "Desaturated, earthy, pastel tones",
      colors: deriveUtilityColors(muted),
    },
  ];
}
