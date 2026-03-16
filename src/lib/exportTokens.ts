/**
 * Design token export generators.
 *
 * Each function takes a flat color map (key → formatted color string)
 * and returns the full export string for that format.
 */

// ── CSS Custom Properties ────────────────────────────────────────────

export function generateCSSVars(
  colors: Record<string, string>,
  indent = "  ",
): string {
  return Object.entries(colors)
    .map(([k, v]) => `${indent}--color-${k}: ${v};`)
    .join("\n");
}

export function generateCSSExport(
  light: Record<string, string>,
  dark: Record<string, string>,
  mode: "light" | "dark" | "both",
): string {
  if (mode === "light") return `:root {\n${generateCSSVars(light)}\n}`;
  if (mode === "dark") return `:root {\n${generateCSSVars(dark)}\n}`;
  return `:root {\n${generateCSSVars(light)}\n}\n\n.dark {\n${generateCSSVars(dark)}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${generateCSSVars(dark, "    ")}\n  }\n}`;
}

// ── Tailwind Config ──────────────────────────────────────────────────

function twObj(colors: Record<string, string>, indent: string): string {
  return Object.entries(colors)
    .map(([k, v]) => `${indent}${k}: '${v}',`)
    .join("\n");
}

export function generateTailwindConfig(
  light: Record<string, string>,
  dark: Record<string, string>,
  mode: "light" | "dark" | "both",
  version: "3" | "4",
): string {
  if (version === "3") {
    if (mode === "light") {
      return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${twObj(light, "        ")}\n      }\n    }\n  }\n}`;
    }
    if (mode === "dark") {
      return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${twObj(dark, "        ")}\n      }\n    }\n  }\n}`;
    }
    return `// tailwind.config.js\nmodule.exports = {\n  darkMode: 'class',\n  theme: {\n    extend: {\n      colors: {\n${twObj(light, "        ")}\n      }\n    }\n  }\n}\n\n/* Add to your global CSS: */\n:root {\n${generateCSSVars(light)}\n}\n\n.dark {\n${generateCSSVars(dark)}\n}`;
  }
  // Tailwind v4
  if (mode === "light") {
    return `@import "tailwindcss";\n\n@theme {\n${generateCSSVars(light)}\n}`;
  }
  if (mode === "dark") {
    return `@import "tailwindcss";\n\n@theme {\n${generateCSSVars(dark)}\n}`;
  }
  return `@import "tailwindcss";\n\n@theme {\n${generateCSSVars(light)}\n}\n\n@variant dark {\n  @theme {\n${generateCSSVars(dark, "    ")}\n  }\n}`;
}

// ── SCSS ─────────────────────────────────────────────────────────────

function scssVars(colors: Record<string, string>, prefix: string): string {
  return Object.entries(colors)
    .map(([k, v]) => `$${prefix}${k}: ${v};`)
    .join("\n");
}

function scssMap(colors: Record<string, string>, indent = "  "): string {
  return Object.entries(colors)
    .map(([k, v]) => `${indent}"${k}": ${v},`)
    .join("\n");
}

export function generateSCSSExport(
  light: Record<string, string>,
  dark: Record<string, string>,
  mode: "light" | "dark" | "both",
): string {
  if (mode === "light") {
    return `${scssVars(light, "color-")}\n\n$colors: (\n${scssMap(light)}\n);`;
  }
  if (mode === "dark") {
    return `${scssVars(dark, "color-")}\n\n$colors: (\n${scssMap(dark)}\n);`;
  }
  return `// Light theme\n${scssVars(light, "light-")}\n\n$light-colors: (\n${scssMap(light)}\n);\n\n// Dark theme\n${scssVars(dark, "dark-")}\n\n$dark-colors: (\n${scssMap(dark)}\n);`;
}

// ── JSON Design Tokens ───────────────────────────────────────────────

function jsonTokenObj(colors: Record<string, string>): Record<string, { value: string; type: string }> {
  const tokens: Record<string, { value: string; type: string }> = {};
  for (const [key, value] of Object.entries(colors)) {
    tokens[key] = { value, type: "color" };
  }
  return tokens;
}

export function generateJSONTokens(
  light: Record<string, string>,
  dark: Record<string, string>,
  mode: "light" | "dark" | "both",
): string {
  if (mode === "light") {
    return JSON.stringify({ colors: jsonTokenObj(light) }, null, 2);
  }
  if (mode === "dark") {
    return JSON.stringify({ colors: jsonTokenObj(dark) }, null, 2);
  }
  return JSON.stringify(
    {
      light: { colors: jsonTokenObj(light) },
      dark: { colors: jsonTokenObj(dark) },
    },
    null,
    2,
  );
}

// ── SwiftUI ──────────────────────────────────────────────────────────

export interface SwiftUIOptions {
  colorFormat: "hex" | "rgb" | "hsl" | "oklch";
  hexToRgb: (hex: string) => { r: number; g: number; b: number };
}

function swiftColor(hex: string, opts: SwiftUIOptions): string {
  if (opts.colorFormat === "rgb" || opts.colorFormat === "hsl" || opts.colorFormat === "oklch") {
    const rgb = opts.hexToRgb(hex);
    return `Color(red: ${(rgb.r / 255).toFixed(3)}, green: ${(rgb.g / 255).toFixed(3)}, blue: ${(rgb.b / 255).toFixed(3)})`;
  }
  return `Color(hex: "${hex}")`;
}

const SWIFT_HEX_INIT = `\n// Color hex initializer\nextension Color {\n    init(hex: String) {\n        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)\n        var int: UInt64 = 0\n        Scanner(string: hex).scanHexInt64(&int)\n        let a, r, g, b: UInt64\n        switch hex.count {\n        case 6:\n            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)\n        default:\n            (a, r, g, b) = (255, 0, 0, 0)\n        }\n        self.init(\n            .sRGB,\n            red: Double(r) / 255,\n            green: Double(g) / 255,\n            blue: Double(b) / 255,\n            opacity: Double(a) / 255\n        )\n    }\n}`;

export function generateSwiftUIExport(
  lightRaw: Record<string, string>,
  darkRaw: Record<string, string>,
  mode: "light" | "dark" | "both",
  opts: SwiftUIOptions,
): string {
  const swiftProps = (colors: Record<string, string>, indent = "    ") =>
    Object.entries(colors)
      .map(([k, v]) => `${indent}static let ${k} = ${swiftColor(v, opts)}`)
      .join("\n");

  const swiftStructProps = (colors: Record<string, string>) =>
    Object.keys(colors)
      .map((k) => `    let ${k}: Color`)
      .join("\n");

  const swiftStructInit = (colors: Record<string, string>, indent = "        ") =>
    Object.entries(colors)
      .map(([k, v]) => `${indent}${k}: ${swiftColor(v, opts)}`)
      .join(",\n");

  const needsHexInit = opts.colorFormat === "hex";

  if (mode === "light") {
    return `import SwiftUI\n\nstruct Theme {\n${swiftProps(lightRaw)}\n}${needsHexInit ? SWIFT_HEX_INIT : ""}`;
  }
  if (mode === "dark") {
    return `import SwiftUI\n\nstruct Theme {\n${swiftProps(darkRaw)}\n}${needsHexInit ? SWIFT_HEX_INIT : ""}`;
  }
  return `import SwiftUI\n\nstruct AppColors {\n${swiftStructProps(lightRaw)}\n}\n\nextension AppColors {\n    static let light = AppColors(\n${swiftStructInit(lightRaw)}\n    )\n\n    static let dark = AppColors(\n${swiftStructInit(darkRaw)}\n    )\n}${needsHexInit ? "\n" + SWIFT_HEX_INIT : ""}`;
}

// ── React Native ─────────────────────────────────────────────────────

export function generateReactNativeExport(
  light: Record<string, string>,
  dark: Record<string, string>,
  mode: "light" | "dark" | "both",
): string {
  const rnObj = (colors: Record<string, string>, indent = "  ") =>
    Object.entries(colors)
      .map(([k, v]) => `${indent}${k}: '${v}',`)
      .join("\n");

  if (mode === "light") {
    return `// theme.ts\nexport const colors = {\n${rnObj(light)}\n} as const;\n\nexport type ColorName = keyof typeof colors;`;
  }
  if (mode === "dark") {
    return `// theme.ts\nexport const colors = {\n${rnObj(dark)}\n} as const;\n\nexport type ColorName = keyof typeof colors;`;
  }
  return `// theme.ts\nexport const lightColors = {\n${rnObj(light)}\n} as const;\n\nexport const darkColors = {\n${rnObj(dark)}\n} as const;\n\nexport type ColorName = keyof typeof lightColors;\n\n// Usage:\n// import { useColorScheme } from 'react-native';\n// const colors = useColorScheme() === 'dark' ? darkColors : lightColors;`;
}

// ── File extensions for download ─────────────────────────────────────

export const FORMAT_FILE_EXTENSIONS: Record<string, string> = {
  css: "css",
  tailwind: "css",
  scss: "scss",
  swiftui: "swift",
  reactnative: "ts",
  json: "json",
};
