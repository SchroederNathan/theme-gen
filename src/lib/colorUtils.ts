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
  | 'Monochromatic'
  | 'Analogous'
  | 'Complementary'
  | 'Split Complementary'
  | 'Triadic'
  | 'Tetradic';

function getColorHarmony(baseHsl: HSL, isDarkMode: boolean, scheme: ColorScheme = 'Analogous'): HSL[] {
  let harmonies: HSL[] = [];
  switch (scheme) {
    case 'Monochromatic':
      harmonies = [
        { h: baseHsl.h, s: baseHsl.s, l: baseHsl.l },
        { h: baseHsl.h, s: Math.max(20, baseHsl.s - 20), l: Math.min(90, baseHsl.l + 20) },
        { h: baseHsl.h, s: Math.min(100, baseHsl.s + 20), l: Math.max(10, baseHsl.l - 20) },
        { h: baseHsl.h, s: baseHsl.s, l: Math.max(10, baseHsl.l - 10) },
        { h: baseHsl.h, s: baseHsl.s, l: Math.min(90, baseHsl.l + 10) },
      ];
      break;
    case 'Analogous':
      harmonies = [
        { h: (baseHsl.h + 30) % 360, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h - 30 + 360) % 360, s: baseHsl.s, l: baseHsl.l },
        { h: baseHsl.h, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h + 60) % 360, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h - 60 + 360) % 360, s: baseHsl.s, l: baseHsl.l },
      ];
      break;
    case 'Complementary':
      harmonies = [
        { h: baseHsl.h, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h + 180) % 360, s: baseHsl.s, l: baseHsl.l },
        { h: baseHsl.h, s: Math.max(20, baseHsl.s - 20), l: Math.min(90, baseHsl.l + 20) },
        { h: (baseHsl.h + 180) % 360, s: Math.max(20, baseHsl.s - 20), l: Math.min(90, baseHsl.l + 20) },
      ];
      break;
    case 'Split Complementary':
      harmonies = [
        { h: baseHsl.h, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h + 150) % 360, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h - 150 + 360) % 360, s: baseHsl.s, l: baseHsl.l },
      ];
      break;
    case 'Triadic':
      harmonies = [
        { h: baseHsl.h, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h + 120) % 360, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h + 240) % 360, s: baseHsl.s, l: baseHsl.l },
      ];
      break;
    case 'Tetradic':
      harmonies = [
        { h: baseHsl.h, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h + 90) % 360, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h + 180) % 360, s: baseHsl.s, l: baseHsl.l },
        { h: (baseHsl.h + 270) % 360, s: baseHsl.s, l: baseHsl.l },
      ];
      break;
    default:
      harmonies = [baseHsl];
  }

  // Add more variation to saturation and lightness while maintaining the color family
  return harmonies.map(color => ({
    ...color,
    s: Math.max(20, Math.min(100, color.s + (Math.random() * 40 - 20))),
    l: isDarkMode
      ? Math.max(20, Math.min(80, color.l + (Math.random() * 40 - 20)))
      : Math.max(60, Math.min(95, color.l + (Math.random() * 20 - 10)))
  }));
}

function findBestColorMatch(targetHsl: HSL, options: HSL[], usedColors: HSL[] = []): HSL {
  // Filter out colors that are too similar to already used colors
  const filteredOptions = options.filter(option => {
    return !usedColors.some(used => {
      const hueDiff = Math.abs(option.h - used.h);
      const satDiff = Math.abs(option.s - used.s);
      const lightDiff = Math.abs(option.l - used.l);
      // Allow more variation in hue, saturation, and lightness
      return hueDiff < 20 && satDiff < 15 && lightDiff < 15;
    });
  });

  // If no options remain after filtering, return a color with more variation
  if (filteredOptions.length === 0) {
    return options.reduce((best, current) => {
      const currentDiff = Math.abs(current.h - targetHsl.h) + 
                         Math.abs(current.s - targetHsl.s) + 
                         Math.abs(current.l - targetHsl.l);
      const bestDiff = Math.abs(best.h - targetHsl.h) + 
                      Math.abs(best.s - targetHsl.s) + 
                      Math.abs(best.l - targetHsl.l);
      return currentDiff > bestDiff ? current : best;
    });
  }

  // Find the color that's most different from the target while maintaining harmony
  return filteredOptions.reduce((best, current) => {
    const currentDiff = Math.abs(current.h - targetHsl.h) + 
                       Math.abs(current.s - targetHsl.s) + 
                       Math.abs(current.l - targetHsl.l);
    const bestDiff = Math.abs(best.h - targetHsl.h) + 
                    Math.abs(best.s - targetHsl.s) + 
                    Math.abs(best.l - targetHsl.l);
    return currentDiff > bestDiff ? current : best;
  });
}

function getContrastRatioInternal(color1: string, color2: string): number {
  const l1 = chroma(color1).luminance();
  const l2 = chroma(color2).luminance();
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function ensureContrast(color: string, background: string, minContrast: number = 4.5): string {
  const hsl = hexToHsl(color);
  const bgLuminance = chroma(background).luminance();
  const currentContrast = getContrastRatioInternal(color, background);
  
  if (currentContrast >= minContrast) {
    return color;
  }

  // If background is dark, make the color lighter
  if (bgLuminance < 0.5) {
    return hslToHex({
      h: hsl.h,
      s: Math.min(100, hsl.s + 20), // Increase saturation for better visibility
      l: Math.min(95, hsl.l + 30) // Make it lighter
    });
  } else {
    // If background is light, make the color darker
    return hslToHex({
      h: hsl.h,
      s: Math.min(100, hsl.s + 20), // Increase saturation for better visibility
      l: Math.max(20, hsl.l - 30) // Make it darker
    });
  }
}

export function generateColorPalette(
  baseColor: string,
  isDarkMode: boolean = false,
  lockedColors: Record<string, string> = {},
  scheme: ColorScheme = 'Analogous'
): Record<string, string> {
  // Convert all locked colors to HSL
  const lockedHsl: Record<string, HSL> = {};
  Object.entries(lockedColors).forEach(([key, value]) => {
    lockedHsl[key] = hexToHsl(value);
  });

  // If we have locked colors, use them to influence the palette
  let baseHsl: HSL;
  if (Object.keys(lockedHsl).length > 0) {
    // Priority order for base color: background > border > primary > other locked colors
    if (lockedHsl.background) {
      baseHsl = {
        h: lockedHsl.background.h,
        s: Math.min(100, lockedHsl.background.s + 20),
        l: isDarkMode ? 50 : 50
      };
    } else if (lockedHsl.border) {
      baseHsl = {
        h: lockedHsl.border.h,
        s: Math.min(100, lockedHsl.border.s + 20),
        l: isDarkMode ? 50 : 50
      };
    } else if (lockedHsl.primary) {
      baseHsl = lockedHsl.primary;
    } else {
      baseHsl = Object.values(lockedHsl)[0];
    }
  } else {
    baseHsl = hexToHsl(baseColor);
  }

  // Generate harmonious color options
  const harmonyOptions = getColorHarmony(baseHsl, isDarkMode, scheme);
  
  // Start building the palette
  const palette: Record<string, string> = {};
  const usedColors: HSL[] = [];

  // Handle each color role
  const roles = ['primary', 'background', 'container', 'accent', 'border'];
  roles.forEach(role => {
    if (lockedColors[role]) {
      // Use the locked color
      palette[role] = lockedColors[role];
      usedColors.push(lockedHsl[role]);
    } else if (role === 'container' && palette.background) {
      // Generate container color variations based on background
      const backgroundHsl = hexToHsl(palette.background);
      const containerOptions = generateContainerOptions(backgroundHsl);
      // Find the best container color that hasn't been used yet
      const bestContainer = findBestColorMatch(backgroundHsl, containerOptions, usedColors);
      palette[role] = hslToHex(bestContainer);
      usedColors.push(bestContainer);
    } else {
      // Find the best color from harmony options for this role
      const bestMatch = findBestColorMatch(baseHsl, harmonyOptions, usedColors);
      const adjustedColor = adjustColorForRole(bestMatch, role, isDarkMode);
      palette[role] = hslToHex(adjustedColor);
      usedColors.push(bestMatch);
    }
  });

  // Ensure primary color has good contrast with background
  if (palette.background && palette.primary) {
    palette.primary = ensureContrast(palette.primary, palette.background);
  }

  // Generate "on" colors for text contrast
  const onColors = {
    onPrimary: getTextColor(palette.primary),
    onBackground: getTextColor(palette.background),
    onContainer: getTextColor(palette.container),
    onAccent: getTextColor(palette.accent),
  };

  return {
    ...palette,
    ...onColors
  };
}

function generateContainerOptions(backgroundHsl: HSL): HSL[] {
  const options: HSL[] = [];
  const baseHue = backgroundHsl.h;
  const baseSat = backgroundHsl.s;
  const baseLight = backgroundHsl.l;

  // Generate variations with different saturation and lightness combinations
  const satVariations = [-15, -10, -5];
  const lightVariations = [-8, -5, -3];

  satVariations.forEach(satChange => {
    lightVariations.forEach(lightChange => {
      options.push({
        h: baseHue,
        s: Math.max(20, Math.min(100, baseSat + satChange)),
        l: Math.max(10, Math.min(90, baseLight + lightChange))
      });
    });
  });

  return options;
}

function adjustColorForRole(hsl: HSL, role: string, isDarkMode: boolean): HSL {
  const adjustments: Record<string, { s: number; l: number }> = {
    background: {
      s: -30,
      l: isDarkMode ? -50 : 85 // Increased lightness for light mode
    },
    container: {
      s: -20,
      l: isDarkMode ? -30 : 75 // Increased lightness for light mode
    },
    accent: {
      s: 20,
      l: isDarkMode ? 10 : -10
    },
    border: {
      s: -60,
      l: isDarkMode ? -40 : 40 // Increased lightness for light mode
    }
  };

  const adjustment = adjustments[role] || { s: 0, l: 0 };
  return {
    h: hsl.h, // Keep the same hue to maintain color family
    s: Math.max(20, Math.min(100, hsl.s + adjustment.s + (Math.random() * 20 - 10))),
    l: Math.max(10, Math.min(90, hsl.l + adjustment.l + (Math.random() * 20 - 10)))
  };
}

